-- Add audio_url column to messages table for voice message support
ALTER TABLE public.messages 
ADD COLUMN audio_url TEXT;