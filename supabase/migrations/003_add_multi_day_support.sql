-- Add support for multi-day events
-- This allows garage sales to span multiple days

-- Add new columns for start and end dates
ALTER TABLE garage_sales
ADD COLUMN IF NOT EXISTS start_date DATE,
ADD COLUMN IF NOT EXISTS end_date DATE;

-- Copy existing date to start_date for backward compatibility
UPDATE garage_sales
SET start_date = date
WHERE start_date IS NULL;

-- Set end_date same as start_date for existing single-day events
UPDATE garage_sales
SET end_date = date
WHERE end_date IS NULL;

-- Add index for date range queries
CREATE INDEX IF NOT EXISTS idx_garage_sales_date_range ON garage_sales(start_date, end_date);

-- Add check constraint to ensure end_date is not before start_date
ALTER TABLE garage_sales
ADD CONSTRAINT check_date_range CHECK (end_date >= start_date);

-- Optional: Keep the old 'date' column for now for backward compatibility
-- We can remove it later after migrating all code
-- ALTER TABLE garage_sales DROP COLUMN date;
