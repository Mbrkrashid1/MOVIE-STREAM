-- Fix security issues

-- Add missing RLS policies for advertiser profiles
CREATE POLICY "Users can view their own advertiser profile" ON advertiser_profiles FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can update their own advertiser profile" ON advertiser_profiles FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Users can insert their own advertiser profile" ON advertiser_profiles FOR INSERT WITH CHECK (user_id = auth.uid());

-- Fix function search path
CREATE OR REPLACE FUNCTION update_creator_stats()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Update creator profile stats when videos change
  UPDATE creator_profiles 
  SET 
    total_views = (SELECT COALESCE(SUM(view_count), 0) FROM videos WHERE creator_id = NEW.creator_id),
    total_watch_time_minutes = (SELECT COALESCE(SUM(watch_time_minutes), 0) FROM videos WHERE creator_id = NEW.creator_id),
    updated_at = now()
  WHERE id = NEW.creator_id;
  
  RETURN NEW;
END;
$$;