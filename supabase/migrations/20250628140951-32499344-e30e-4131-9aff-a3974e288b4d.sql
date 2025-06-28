
-- Add backdrop_url column to the content table
ALTER TABLE public.content 
ADD COLUMN backdrop_url TEXT;

-- Add comment to describe the column
COMMENT ON COLUMN public.content.backdrop_url IS 'URL for high-quality backdrop image used in video player (recommended: 1920x1080 or higher)';

-- Create storage bucket for backdrop images if it doesn't exist
INSERT INTO storage.buckets (id, name, public) 
VALUES ('content', 'content', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for the content bucket
CREATE POLICY "Allow public read access to content bucket" ON storage.objects
FOR SELECT USING (bucket_id = 'content');

CREATE POLICY "Allow authenticated users to upload to content bucket" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'content' AND auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update content bucket" ON storage.objects
FOR UPDATE USING (bucket_id = 'content' AND auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete from content bucket" ON storage.objects
FOR DELETE USING (bucket_id = 'content' AND auth.role() = 'authenticated');
