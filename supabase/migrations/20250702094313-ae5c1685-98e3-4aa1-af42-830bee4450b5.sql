
-- Add missing columns to the ads table for call-to-action functionality
ALTER TABLE public.ads 
ADD COLUMN cta_text text,
ADD COLUMN cta_url text;
