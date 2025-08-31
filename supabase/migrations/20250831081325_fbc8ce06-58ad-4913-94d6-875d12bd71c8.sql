
-- Add trial tracking columns to user_credits table
ALTER TABLE user_credits 
ADD COLUMN trial_start_date timestamp with time zone,
ADD COLUMN trial_end_date timestamp with time zone,
ADD COLUMN is_trial_user boolean DEFAULT false,
ADD COLUMN trial_credits_used integer DEFAULT 0;

-- Create index for better performance when querying trial users
CREATE INDEX idx_user_credits_trial ON user_credits(is_trial_user, trial_end_date);
