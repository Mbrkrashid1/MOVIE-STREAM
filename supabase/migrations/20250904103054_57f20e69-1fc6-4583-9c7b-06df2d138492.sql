-- Create user roles enum
CREATE TYPE public.user_role AS ENUM ('creator', 'viewer', 'advertiser', 'admin');

-- Create creator profiles table for KYC and monetization
CREATE TABLE public.creator_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  kyc_status TEXT NOT NULL DEFAULT 'pending' CHECK (kyc_status IN ('pending', 'approved', 'rejected')),
  kyc_documents JSONB,
  monetization_enabled BOOLEAN DEFAULT false,
  channel_name TEXT,
  channel_description TEXT,
  subscriber_count INTEGER DEFAULT 0,
  total_views INTEGER DEFAULT 0,
  total_watch_time_minutes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create advertiser profiles table
CREATE TABLE public.advertiser_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  business_type TEXT,
  verification_status TEXT NOT NULL DEFAULT 'pending' CHECK (verification_status IN ('pending', 'approved', 'rejected')),
  total_spend DECIMAL(15,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add role column to profiles table
ALTER TABLE public.profiles ADD COLUMN user_role user_role DEFAULT 'viewer';

-- Create videos table for uploaded content
CREATE TABLE public.videos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  creator_id UUID NOT NULL REFERENCES creator_profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT NOT NULL,
  thumbnail_url TEXT,
  duration_seconds INTEGER,
  category TEXT NOT NULL,
  tags TEXT[],
  language TEXT DEFAULT 'hausa',
  view_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0,
  watch_time_minutes INTEGER DEFAULT 0,
  monetization_enabled BOOLEAN DEFAULT true,
  status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published', 'private', 'deleted')),
  upload_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create video analytics table
CREATE TABLE public.video_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  video_id UUID NOT NULL REFERENCES videos(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  views INTEGER DEFAULT 0,
  watch_time_minutes INTEGER DEFAULT 0,
  impressions INTEGER DEFAULT 0,
  ad_revenue_naira DECIMAL(10,2) DEFAULT 0,
  cpm_rate DECIMAL(8,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(video_id, date)
);

-- Create creator earnings table
CREATE TABLE public.creator_earnings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  creator_id UUID NOT NULL REFERENCES creator_profiles(id) ON DELETE CASCADE,
  video_id UUID REFERENCES videos(id) ON DELETE CASCADE,
  earning_type TEXT NOT NULL CHECK (earning_type IN ('ad_revenue', 'sponsorship', 'bonus')),
  amount_naira DECIMAL(10,2) NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  description TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'paid')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create payout requests table
CREATE TABLE public.payout_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  creator_id UUID NOT NULL REFERENCES creator_profiles(id) ON DELETE CASCADE,
  amount_naira DECIMAL(10,2) NOT NULL,
  payment_method TEXT NOT NULL CHECK (payment_method IN ('paystack', 'opay', 'flutterwave', 'bank_transfer')),
  payment_details JSONB NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  requested_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  processed_at TIMESTAMP WITH TIME ZONE,
  transaction_reference TEXT,
  admin_notes TEXT
);

-- Create platform settings table for CPM rates and commission
CREATE TABLE public.platform_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key TEXT NOT NULL UNIQUE,
  setting_value TEXT NOT NULL,
  description TEXT,
  updated_by UUID REFERENCES profiles(id),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert default platform settings
INSERT INTO public.platform_settings (setting_key, setting_value, description) VALUES
('default_cpm_rate', '50.00', 'Default CPM rate in Nigerian Naira'),
('platform_commission_rate', '30', 'Platform commission percentage (30%)'),
('minimum_payout_threshold', '5000.00', 'Minimum payout amount in Naira'),
('payout_cycle_days', '30', 'Payout cycle in days');

-- Enable RLS on all new tables
ALTER TABLE public.creator_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.advertiser_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.creator_earnings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payout_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Creator profiles
CREATE POLICY "Users can view their own creator profile" ON creator_profiles FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can update their own creator profile" ON creator_profiles FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Users can insert their own creator profile" ON creator_profiles FOR INSERT WITH CHECK (user_id = auth.uid());

-- Videos
CREATE POLICY "Creators can manage their own videos" ON videos FOR ALL USING (creator_id IN (SELECT id FROM creator_profiles WHERE user_id = auth.uid()));
CREATE POLICY "Everyone can view published videos" ON videos FOR SELECT USING (status = 'published');

-- Video analytics  
CREATE POLICY "Creators can view their video analytics" ON video_analytics FOR SELECT USING (video_id IN (SELECT id FROM videos WHERE creator_id IN (SELECT id FROM creator_profiles WHERE user_id = auth.uid())));

-- Creator earnings
CREATE POLICY "Creators can view their earnings" ON creator_earnings FOR SELECT USING (creator_id IN (SELECT id FROM creator_profiles WHERE user_id = auth.uid()));

-- Payout requests
CREATE POLICY "Creators can manage their payout requests" ON payout_requests FOR ALL USING (creator_id IN (SELECT id FROM creator_profiles WHERE user_id = auth.uid()));

-- Platform settings (admin only - will be handled by admin functions)
CREATE POLICY "Platform settings are readable by authenticated users" ON platform_settings FOR SELECT TO authenticated USING (true);

-- Create function to update video counts
CREATE OR REPLACE FUNCTION update_creator_stats()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql;

-- Create trigger for creator stats updates
CREATE TRIGGER update_creator_stats_trigger
  AFTER UPDATE OF view_count, watch_time_minutes ON videos
  FOR EACH ROW EXECUTE FUNCTION update_creator_stats();