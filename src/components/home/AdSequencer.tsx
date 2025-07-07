
import { useState, useEffect } from "react";
import YouTubeStyleVideoAd from "@/components/home/YouTubeStyleVideoAd";
import BannerAdSpace from "@/components/home/BannerAdSpace";

interface AdSequencerProps {
  videoAds: Array<{
    id: string;
    title: string;
    description?: string;
    video_url: string;
    thumbnail_url?: string;
    cta_text?: string;
    cta_url?: string;
    duration?: number;
  }>;
  bannerAds: Array<{
    id: string;
    title: string;
    description?: string;
    image_url: string;
    cta_text?: string;
    cta_url?: string;
    background_color?: string;
  }>;
  onAdComplete?: (adId: string) => void;
}

const AdSequencer = ({ videoAds, bannerAds, onAdComplete }: AdSequencerProps) => {
  const [currentSequence, setCurrentSequence] = useState<'video' | 'banner'>('video');
  const [sequenceTimer, setSequenceTimer] = useState<NodeJS.Timeout | null>(null);

  // Switch between video and banner ads every 30 seconds
  useEffect(() => {
    if (videoAds.length > 0 && bannerAds.length > 0) {
      const timer = setInterval(() => {
        setCurrentSequence(prev => prev === 'video' ? 'banner' : 'video');
      }, 30000);
      
      setSequenceTimer(timer);
      
      return () => {
        if (timer) clearInterval(timer);
      };
    }
  }, [videoAds.length, bannerAds.length]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (sequenceTimer) clearInterval(sequenceTimer);
    };
  }, [sequenceTimer]);

  // If we only have one type of ad, show that type
  if (videoAds.length === 0 && bannerAds.length > 0) {
    return (
      <div className="px-4 mb-6">
        <BannerAdSpace 
          ads={bannerAds}
          autoSlideInterval={8000}
          showNavigation={true}
        />
      </div>
    );
  }

  if (bannerAds.length === 0 && videoAds.length > 0) {
    return (
      <div className="px-4 mb-6">
        <YouTubeStyleVideoAd 
          ads={videoAds}
          onAdComplete={onAdComplete}
        />
      </div>
    );
  }

  // Show both types in sequence
  return (
    <div className="px-4 mb-6">
      {currentSequence === 'video' && videoAds.length > 0 && (
        <div className="transition-all duration-500">
          <YouTubeStyleVideoAd 
            ads={videoAds}
            onAdComplete={onAdComplete}
          />
        </div>
      )}
      
      {currentSequence === 'banner' && bannerAds.length > 0 && (
        <div className="transition-all duration-500">
          <BannerAdSpace 
            ads={bannerAds}
            autoSlideInterval={8000}
            showNavigation={true}
          />
        </div>
      )}
    </div>
  );
};

export default AdSequencer;
