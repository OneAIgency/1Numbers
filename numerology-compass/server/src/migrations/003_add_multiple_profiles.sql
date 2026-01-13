-- Migration: Add support for multiple profiles per user
-- This removes the unique constraint and adds is_active flag

-- Remove unique constraint on user_id
ALTER TABLE user_profiles DROP CONSTRAINT IF EXISTS user_profiles_user_id_key;

-- Add is_active column to track active profile
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT false;

-- Create index for faster lookups on is_active
CREATE INDEX IF NOT EXISTS idx_user_profiles_is_active ON user_profiles(user_id, is_active);

-- Set the first profile for each user as active (if any exist)
UPDATE user_profiles 
SET is_active = true 
WHERE id IN (
  SELECT DISTINCT ON (user_id) id 
  FROM user_profiles 
  ORDER BY user_id, created_at ASC
);

-- Add constraint: only one active profile per user
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_profiles_one_active 
ON user_profiles(user_id) 
WHERE is_active = true;

COMMENT ON COLUMN user_profiles.is_active IS 'Indicates if this profile is the currently active profile for the user';

