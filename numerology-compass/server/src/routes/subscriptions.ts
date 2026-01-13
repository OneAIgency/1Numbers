import { Router, Response } from 'express';
import pool from '../db';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = Router();

// Get all available subscription plans
router.get('/plans', async (req, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT id, name, display_name, description, price_monthly, price_yearly, features, is_active
       FROM subscription_plans
       WHERE is_active = true
       ORDER BY price_monthly ASC`
    );

    res.json({
      success: true,
      plans: result.rows.map(plan => ({
        id: plan.id,
        name: plan.name,
        displayName: plan.display_name,
        description: plan.description,
        priceMonthly: parseFloat(plan.price_monthly),
        priceYearly: plan.price_yearly ? parseFloat(plan.price_yearly) : null,
        features: plan.features,
        isActive: plan.is_active
      }))
    });
  } catch (error) {
    console.error('Error fetching subscription plans:', error);
    res.status(500).json({ error: 'Failed to fetch subscription plans' });
  }
});

// Get current user's subscription status
router.get('/status', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;

    const result = await pool.query(
      `SELECT 
        s.id,
        s.status,
        s.billing_period,
        s.start_date,
        s.end_date,
        s.cancelled_at,
        sp.name as plan_name,
        sp.display_name as plan_display_name,
        sp.features
       FROM subscriptions s
       JOIN subscription_plans sp ON s.plan_id = sp.id
       WHERE s.user_id = $1
       ORDER BY s.created_at DESC
       LIMIT 1`,
      [userId]
    );

    if (result.rows.length === 0) {
      // User has no subscription, return free plan
      const freePlan = await pool.query(
        `SELECT id, name, display_name, features FROM subscription_plans WHERE name = 'free' LIMIT 1`
      );

      return res.json({
        success: true,
        subscription: null,
        plan: freePlan.rows[0] ? {
          name: freePlan.rows[0].name,
          displayName: freePlan.rows[0].display_name,
          features: freePlan.rows[0].features
        } : null,
        isPremium: false
      });
    }

    const subscription = result.rows[0];
    const isActive = subscription.status === 'active' && 
                     (subscription.end_date === null || new Date(subscription.end_date) > new Date());

    res.json({
      success: true,
      subscription: {
        id: subscription.id,
        status: subscription.status,
        billingPeriod: subscription.billing_period,
        startDate: subscription.start_date,
        endDate: subscription.end_date,
        cancelledAt: subscription.cancelled_at
      },
      plan: {
        name: subscription.plan_name,
        displayName: subscription.plan_display_name,
        features: subscription.features
      },
      isPremium: isActive && subscription.plan_name !== 'free'
    });
  } catch (error) {
    console.error('Error fetching subscription status:', error);
    res.status(500).json({ error: 'Failed to fetch subscription status' });
  }
});

// Create subscription
router.post('/create', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const { planId, billingPeriod = 'monthly' } = req.body;

    if (!planId) {
      return res.status(400).json({ error: 'Plan ID is required' });
    }

    // Get plan details
    const planResult = await pool.query(
      `SELECT id, name, price_monthly, price_yearly FROM subscription_plans WHERE id = $1 AND is_active = true`,
      [planId]
    );

    if (planResult.rows.length === 0) {
      return res.status(404).json({ error: 'Subscription plan not found' });
    }

    const plan = planResult.rows[0];

    // Calculate end date
    const startDate = new Date();
    const endDate = new Date();
    if (billingPeriod === 'monthly') {
      endDate.setMonth(endDate.getMonth() + 1);
    } else if (billingPeriod === 'yearly') {
      endDate.setFullYear(endDate.getFullYear() + 1);
    }

    // Cancel any existing active subscriptions
    await pool.query(
      `UPDATE subscriptions 
       SET status = 'cancelled', cancelled_at = CURRENT_TIMESTAMP
       WHERE user_id = $1 AND status = 'active'`,
      [userId]
    );

    // Create new subscription
    const result = await pool.query(
      `INSERT INTO subscriptions (
        user_id, plan_id, status, billing_period, start_date, end_date
      )
      VALUES ($1, $2, 'active', $3, $4, $5)
      RETURNING id, user_id, plan_id, status, billing_period, start_date, end_date, created_at`,
      [userId, planId, billingPeriod, startDate, endDate]
    );

    // Update user's current subscription reference
    await pool.query(
      `UPDATE users SET current_subscription_id = $1 WHERE id = $2`,
      [result.rows[0].id, userId]
    );

    res.status(201).json({
      success: true,
      subscription: {
        id: result.rows[0].id,
        planId: result.rows[0].plan_id,
        status: result.rows[0].status,
        billingPeriod: result.rows[0].billing_period,
        startDate: result.rows[0].start_date,
        endDate: result.rows[0].end_date
      }
    });
  } catch (error) {
    console.error('Error creating subscription:', error);
    res.status(500).json({ error: 'Failed to create subscription' });
  }
});

// Cancel subscription
router.post('/cancel', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;

    const result = await pool.query(
      `UPDATE subscriptions 
       SET status = 'cancelled', cancelled_at = CURRENT_TIMESTAMP
       WHERE user_id = $1 AND status = 'active'
       RETURNING id, status, cancelled_at`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'No active subscription found' });
    }

    res.json({
      success: true,
      message: 'Subscription cancelled successfully',
      subscription: {
        id: result.rows[0].id,
        status: result.rows[0].status,
        cancelledAt: result.rows[0].cancelled_at
      }
    });
  } catch (error) {
    console.error('Error cancelling subscription:', error);
    res.status(500).json({ error: 'Failed to cancel subscription' });
  }
});

// Check subscription status (helper endpoint)
router.get('/check', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const result = await pool.query('SELECT * FROM check_subscription_status($1)', [userId]);

    if (result.rows.length === 0) {
      return res.json({
        success: true,
        isPremium: false,
        planName: 'free',
        status: 'active'
      });
    }

    const status = result.rows[0];
    res.json({
      success: true,
      isPremium: status.is_premium,
      planName: status.plan_name,
      status: status.status,
      endDate: status.end_date
    });
  } catch (error) {
    console.error('Error checking subscription:', error);
    res.status(500).json({ error: 'Failed to check subscription' });
  }
});

export default router;

