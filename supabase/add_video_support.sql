-- Add video URL support to garage_sales table
ALTER TABLE garage_sales
ADD COLUMN IF NOT EXISTS video_url TEXT;

-- Create index for video queries
CREATE INDEX IF NOT EXISTS garage_sales_video_idx ON garage_sales (video_url);

-- Update existing rows to have NULL video_url (if not already)
UPDATE garage_sales SET video_url = NULL WHERE video_url IS NULL;

-- Create storage bucket policy (run this in Supabase Dashboard > Storage)
-- Bucket name: garage-sale-videos
-- Make it public for reading
