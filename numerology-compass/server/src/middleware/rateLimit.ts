import { Response, NextFunction } from 'express';
import pool from '../db';
import { AuthRequest } from './auth';

interface RateLimitConfig {
  featureName: string;
  freeLimit: number;
  premiumLimit: number;
  period: 'daily' | 'weekly' | 'monthly';
}

/**
 * Rate limiting middleware based on subscription status
 * Tracks usage and enforces limits for free vs premium users
 */
export const rateLimit = (config: RateLimitConfig) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.userId;
      if (!userId) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      // Check subscription status
      const subscriptionResult = await pool.query(
        `SELECT 
          s.status,
          s.end_date,
          sp.name as plan_name
         FROM subscriptions s
         JOIN subscription_plans sp ON s.plan_id = sp.id
         WHERE s.user_id = $1 AND s.status = 'active'
         ORDER BY s.created_at DESC
         LIMIT 1`,
        [userId]
      );

      const isPremium = subscriptionResult.rows.length > 0 &&
                       subscriptionResult.rows[0].plan_name !== 'free' &&
                       subscriptionResult.rows[0].status === 'active' &&
                       (subscriptionResult.rows[0].end_date === null ||
                        new Date(subscriptionResult.rows[0].end_date) > new Date());

      const limit = isPremium ? config.premiumLimit : config.freeLimit;

      // Calculate period boundaries
      const now = new Date();
      let periodStart: Date;
      let periodEnd: Date;

      if (config.period === 'daily') {
        periodStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        periodEnd = new Date(periodStart);
        periodEnd.setDate(periodEnd.getDate() + 1);
      } else if (config.period === 'weekly') {
        const dayOfWeek = now.getDay();
        periodStart = new Date(now);
        periodStart.setDate(now.getDate() - dayOfWeek);
        periodStart.setHours(0, 0, 0, 0);
        periodEnd = new Date(periodStart);
        periodEnd.setDate(periodEnd.getDate() + 7);
      } else { // monthly
        periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
        periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1);
      }

      // Get or create usage record
      const usageResult = await pool.query(
        `SELECT usage_count, period_end
         FROM subscription_usage
         WHERE user_id = $1 AND feature_name = $2 AND period_start = $3
         LIMIT 1`,
        [userId, config.featureName, periodStart]
      );

      let currentUsage = 0;
      if (usageResult.rows.length > 0) {
        // Check if period has expired
        if (new Date(usageResult.rows[0].period_end) <= now) {
          // Reset for new period
          await pool.query(
            `UPDATE subscription_usage
             SET usage_count = 0, period_start = $1, period_end = $2, updated_at = CURRENT_TIMESTAMP
             WHERE user_id = $3 AND feature_name = $4`,
            [periodStart, periodEnd, userId, config.featureName]
          );
          currentUsage = 0;
        } else {
          currentUsage = usageResult.rows[0].usage_count;
        }
      } else {
        // Create new usage record
        await pool.query(
          `INSERT INTO subscription_usage (user_id, feature_name, usage_count, period_start, period_end)
           VALUES ($1, $2, 0, $3, $4)
           ON CONFLICT (user_id, feature_name, period_start) DO NOTHING`,
          [userId, config.featureName, periodStart, periodEnd]
        );
      }

      // Check if limit exceeded
      if (currentUsage >= limit) {
        return res.status(429).json({
          error: 'Rate limit exceeded',
          message: `You have reached the ${isPremium ? 'premium' : 'free'} limit for ${config.featureName}`,
          limit,
          currentUsage,
          period: config.period,
          upgradeRequired: !isPremium
        });
      }

      // Increment usage
      await pool.query(
        `UPDATE subscription_usage
         SET usage_count = usage_count + 1, updated_at = CURRENT_TIMESTAMP
         WHERE user_id = $1 AND feature_name = $2 AND period_start = $3`,
        [userId, config.featureName, periodStart]
      );

      // Add usage info to request
      req.rateLimitInfo = {
        limit,
        currentUsage: currentUsage + 1,
        remaining: limit - (currentUsage + 1),
        isPremium
      };

      next();
    } catch (error) {
      console.error('Rate limit error:', error);
      // On error, allow request but log it
      next();
    }
  };
};

// Helper middleware to check premium status
export const requirePremium = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const subscriptionResult = await pool.query(
      `SELECT 
        s.status,
        s.end_date,
        sp.name as plan_name
       FROM subscriptions s
       JOIN subscription_plans sp ON s.plan_id = sp.id
       WHERE s.user_id = $1 AND s.status = 'active'
       ORDER BY s.created_at DESC
       LIMIT 1`,
      [userId]
    );

    const isPremium = subscriptionResult.rows.length > 0 &&
                     subscriptionResult.rows[0].plan_name !== 'free' &&
                     subscriptionResult.rows[0].status === 'active' &&
                     (subscriptionResult.rows[0].end_date === null ||
                      new Date(subscriptionResult.rows[0].end_date) > new Date());

    if (!isPremium) {
      return res.status(403).json({
        error: 'Premium subscription required',
        message: 'This feature requires a premium subscription',
        upgradeRequired: true
      });
    }

    next();
  } catch (error) {
    console.error('Premium check error:', error);
    res.status(500).json({ error: 'Failed to check subscription status' });
  }
};

// Extend AuthRequest interface
declare module './auth' {
  interface AuthRequest {
    rateLimitInfo?: {
      limit: number;
      currentUsage: number;
      remaining: number;
      isPremium: boolean;
    };
  }
}

