-- Add device_id column to garage_sales table for rate limiting
ALTER TABLE garage_sales
ADD COLUMN IF NOT EXISTS device_id TEXT;

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_garage_sales_device_id ON garage_sales(device_id);
CREATE INDEX IF NOT EXISTS idx_garage_sales_device_created ON garage_sales(device_id, created_at);

-- Add reported flag for user-reported spam
ALTER TABLE garage_sales
ADD COLUMN IF NOT EXISTS reported_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS is_reported BOOLEAN DEFAULT FALSE;

-- Create index for filtering reported content
CREATE INDEX IF NOT EXISTS idx_garage_sales_reported ON garage_sales(is_reported) WHERE is_reported = TRUE;
