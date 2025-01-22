-- Add trial management columns to organizations table
ALTER TABLE organizations
ADD COLUMN trial_start_date timestamptz,
ADD COLUMN stripe_customer_id text,
ADD COLUMN subscription_status text CHECK (subscription_status IN ('trialing', 'active', 'past_due', 'canceled', 'incomplete')),
ADD COLUMN trial_end_date timestamptz;

-- Create function to calculate trial end date
CREATE OR REPLACE FUNCTION calculate_trial_end_date(start_date timestamptz)
RETURNS timestamptz AS $$
BEGIN
  RETURN start_date + interval '7 days';
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Update trial_end_date based on trial_start_date
UPDATE organizations 
SET trial_end_date = calculate_trial_end_date(trial_start_date)
WHERE trial_start_date IS NOT NULL;

-- Create function to check trial status
CREATE OR REPLACE FUNCTION check_trial_status()
RETURNS trigger AS $$
BEGIN
  -- Set trial_start_date and trial_end_date for new organizations
  IF NEW.trial_start_date IS NULL THEN
    NEW.trial_start_date = CURRENT_TIMESTAMP;
    NEW.trial_end_date = calculate_trial_end_date(NEW.trial_start_date);
    NEW.subscription_status = 'trialing';
  END IF;

  -- Check if trial has expired
  IF NEW.trial_end_date < CURRENT_TIMESTAMP 
     AND NEW.stripe_customer_id IS NULL 
     AND NEW.subscription_status = 'trialing' THEN
    NEW.subscription_status = 'past_due';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for trial management
DROP TRIGGER IF EXISTS manage_trial_status ON organizations;
CREATE TRIGGER manage_trial_status
  BEFORE INSERT OR UPDATE ON organizations
  FOR EACH ROW
  EXECUTE FUNCTION check_trial_status();

-- Add indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_org_trial_status 
ON organizations(subscription_status, trial_start_date);

CREATE INDEX IF NOT EXISTS idx_org_stripe_customer 
ON organizations(stripe_customer_id);

-- Add subscription limits table for different tiers
CREATE TABLE IF NOT EXISTS subscription_limits (
  organization_id uuid REFERENCES organizations(id),
  max_channels int NOT NULL DEFAULT 1,
  max_feeds_per_channel int NOT NULL DEFAULT 5,
  max_notifications_per_day int NOT NULL DEFAULT 100,
  notification_frequency_minutes int NOT NULL DEFAULT 60,
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (organization_id)
);

-- Create function to update timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS trigger AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updating timestamp
DROP TRIGGER IF EXISTS update_subscription_limits_updated_at ON subscription_limits;
CREATE TRIGGER update_subscription_limits_updated_at
    BEFORE UPDATE ON subscription_limits
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create initial subscription limits for existing organizations
INSERT INTO subscription_limits (organization_id)
SELECT id FROM organizations
ON CONFLICT (organization_id) DO NOTHING;

-- Create view for organization subscription status
CREATE OR REPLACE VIEW organization_subscription_status AS
SELECT 
    o.id,
    o.trial_start_date,
    o.trial_end_date,
    o.subscription_status,
    o.stripe_customer_id,
    sl.max_channels,
    sl.max_feeds_per_channel,
    sl.max_notifications_per_day,
    sl.notification_frequency_minutes
FROM organizations o
LEFT JOIN subscription_limits sl ON o.id = sl.organization_id;

