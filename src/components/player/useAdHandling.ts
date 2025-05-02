
import { useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export interface AdPlacement {
  placement_type: string;
  time_offset?: number;
  ad: {
    id: string;
    title: string;
    description?: string;
    video_url: string;
    is_skippable: boolean;
    skip_after_seconds: number;
    duration: number;
  };
}

export function useAdHandling(contentId: string, onClose?: () => void) {
  const [adPlaying, setAdPlaying] = useState<AdPlacement | null>(null);
  const [canSkip, setCanSkip] = useState(false);
  const [skipCounter, setSkipCounter] = useState(0);
  const [ads, setAds] = useState<AdPlacement[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();

  // Fetch ads associated with content
  const fetchAds = async () => {
    try {
      const { data, error } = await supabase
        .from('ad_placements')
        .select(`
          placement_type,
          time_offset,
          ad:ad_id (
            id, 
            title,
            description,
            video_url,
            is_skippable,
            skip_after_seconds,
            duration
          )
        `)
        .eq('content_id', contentId);

      if (error) throw error;
      console.log("Fetched ads:", data);
      
      if (data && data.length > 0) {
        // Organize ads by placement type
        setAds(data);
        
        // Check if we have pre-roll ads to play first
        const preRollAds = data.filter(ad => ad.placement_type === 'pre-roll');
        if (preRollAds.length > 0) {
          playAd(preRollAds[0]);
        }
      }
    } catch (error) {
      console.error("Error fetching ads:", error);
    }
  };

  const playAd = (adPlacement: AdPlacement) => {
    setAdPlaying(adPlacement);
    setCanSkip(false);
    if (adPlacement.ad.is_skippable) {
      setSkipCounter(adPlacement.ad.skip_after_seconds);
      
      // Start the skip counter
      const skipInterval = setInterval(() => {
        setSkipCounter(prev => {
          if (prev <= 1) {
            clearInterval(skipInterval);
            setCanSkip(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  const handleAdEnd = () => {
    console.log("Ad ended");
    
    if (!adPlaying) return;
    
    // Log ad impression
    logAdImpression(adPlaying.ad.id, true);
    
    // If this was a pre-roll ad, start the main content
    if (adPlaying.placement_type === 'pre-roll') {
      setAdPlaying(null);
      // Auto-play main content
      if (videoRef.current) {
        videoRef.current.play()
          .then(() => {})
          .catch(err => console.error("Error playing video:", err));
      }
    } 
    // If this was a post-roll ad, end the video experience
    else if (adPlaying.placement_type === 'post-roll') {
      setAdPlaying(null);
      if (onClose) onClose();
    }
    // If this was a mid-roll ad, resume the main content
    else {
      setAdPlaying(null);
      if (videoRef.current) {
        videoRef.current.play()
          .then(() => {})
          .catch(err => console.error("Error playing video:", err));
      }
    }
  };

  const skipAd = () => {
    if (!canSkip || !adPlaying?.ad.is_skippable) return;
    
    // Log ad impression with completed=false
    logAdImpression(adPlaying.ad.id, false);
    
    handleAdEnd();
  };

  const logAdImpression = async (adId: string, completed: boolean) => {
    try {
      const watchedSeconds = videoRef.current?.currentTime || 0;
      
      await supabase.from('ad_impressions').insert({
        ad_id: adId,
        content_id: contentId,
        placement_type: adPlaying?.placement_type,
        watched_seconds: Math.floor(watchedSeconds),
        completed
      });
    } catch (error) {
      console.error("Error logging ad impression:", error);
    }
  };

  const checkForMidRollAds = (currentTime: number) => {
    if (adPlaying || !ads.length) return false;
    
    const midRollAd = ads.find(ad => 
      ad.placement_type === 'mid-roll' && 
      Math.abs(ad.time_offset as number - currentTime) < 1 // Within 1 second of the target time
    );
    
    if (midRollAd) {
      if (videoRef.current) {
        videoRef.current.pause();
      }
      playAd(midRollAd);
      return true;
    }
    return false;
  };

  const checkForPostRollAds = () => {
    if (!ads.length) return;
    
    const postRollAds = ads.filter(ad => ad.placement_type === 'post-roll');
    if (postRollAds.length > 0) {
      playAd(postRollAds[0]);
    }
  };

  return {
    adPlaying,
    canSkip,
    skipCounter,
    ads,
    videoRef,
    fetchAds,
    playAd,
    handleAdEnd,
    skipAd,
    checkForMidRollAds,
    checkForPostRollAds
  };
}
