-- Migration: Create subscriptions system for premium features
-- This adds subscription management to users

-- Create subscription plans table
CREATE TABLE IF NOT EXISTS subscription_plans (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  display_name VARCHAR(100) NOT NULL,
  description TEXT,
  price_monthly DECIMAL(10, 2) NOT NULL DEFAULT 0,
  price_yearly DECIMAL(10, 2),
  features JSONB NOT NULL DEFAULT '[]'::jsonb,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  plan_id INTEGER NOT NULL REFERENCES subscription_plans(id),
  status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired', 'pending')),
  billing_period VARCHAR(10) NOT NULL CHECK (billing_period IN ('monthly', 'yearly')),
  start_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  end_date TIMESTAMP WITH TIME ZONE,
  cancelled_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create subscription usage tracking table
CREATE TABLE IF NOT EXISTS subscription_usage (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  feature_name VARCHAR(100) NOT NULL,
  usage_count INTEGER NOT NULL DEFAULT 0,
  period_start TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  period_end TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, feature_name, period_start)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_end_date ON subscriptions(end_date);
CREATE INDEX IF NOT EXISTS idx_subscription_usage_user_id ON subscription_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_subscription_usage_feature ON subscription_usage(feature_name);

-- Insert default subscription plans
INSERT INTO subscription_plans (name, display_name, description, price_monthly, price_yearly, features) VALUES
('free', 'Free', 'Basic numerology calculations and features', 0, 0, '["basic_calculations", "basic_compatibility", "daily_predictions", "journal_entries"]'::jsonb),
('premium', 'Premium', 'Advanced features and unlimited access', 9.99, 99.99, '["advanced_reports", "ai_consultant", "unlimited_profiles", "priority_support", "export_pdf", "custom_reports"]'::jsonb),
('pro', 'Professional', 'All features for professionals', 19.99, 199.99, '["professional_reports", "api_access", "white_label", "custom_branding", "advanced_analytics"]'::jsonb)
ON CONFLICT (name) DO NOTHING;

-- Add subscription_id column to users table (for quick lookup)
ALTER TABLE users ADD COLUMN IF NOT EXISTS current_subscription_id INTEGER REFERENCES subscriptions(id);

-- Create function to check subscription status
CREATE OR REPLACE FUNCTION check_subscription_status(user_id_param INTEGER)
RETURNS TABLE (
  is_premium BOOLEAN,
  plan_name VARCHAR(50),
  status VARCHAR(20),
  end_date TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    CASE WHEN s.status = 'active' AND (s.end_date IS NULL OR s.end_date > CURRENT_TIMESTAMP) THEN true ELSE false END as is_premium,
    sp.name as plan_name,
    s.status,
    s.end_date
  FROM subscriptions s
  JOIN subscription_plans sp ON s.plan_id = sp.id
  WHERE s.user_id = user_id_param
  ORDER BY s.created_at DESC
  LIMIT 1;
END;
$$ LANGUAGE plpgsql;

COMMENT ON TABLE subscriptions IS 'User subscription records';
COMMENT ON TABLE subscription_plans IS 'Available subscription plans';
COMMENT ON TABLE subscription_usage IS 'Track feature usage for rate limiting';

