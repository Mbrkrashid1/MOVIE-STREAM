
import { useState, useEffect, useRef } from "react";
import { Play, Pause, Volume2, VolumeX, X, FastForward } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface VideoPlayerProps {
  videoUrl: string;
  contentId: string;
  thumbnail?: string;
  onClose?: () => void;
}

export function VideoPlayer({ videoUrl, contentId, thumbnail, onClose }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [loading, setLoading] = useState(true);
  const [adPlaying, setAdPlaying] = useState<any>(null);
  const [ads, setAds] = useState<any[]>([]);
  const [canSkip, setCanSkip] = useState(false);
  const [skipCounter, setSkipCounter] = useState(0);
  const { toast } = useToast();

  // Fetch ads associated with this content
  useEffect(() => {
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

    if (contentId) {
      fetchAds();
    }
  }, [contentId]);

  const playAd = (adPlacement: any) => {
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
    
    // Log ad impression
    logAdImpression(adPlaying.ad.id, true);
    
    // If this was a pre-roll ad, start the main content
    if (adPlaying.placement_type === 'pre-roll') {
      setAdPlaying(null);
      // Auto-play main content
      if (videoRef.current) {
        videoRef.current.play()
          .then(() => setIsPlaying(true))
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
          .then(() => setIsPlaying(true))
          .catch(err => console.error("Error playing video:", err));
      }
    }
  };

  const skipAd = () => {
    if (!canSkip || !adPlaying.ad.is_skippable) return;
    
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
        placement_type: adPlaying.placement_type,
        watched_seconds: Math.floor(watchedSeconds),
        completed
      });
    } catch (error) {
      console.error("Error logging ad impression:", error);
    }
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    
    const current = videoRef.current.currentTime;
    setCurrentTime(current);
    
    // Check for mid-roll ads
    if (!adPlaying && ads.length > 0) {
      const midRollAd = ads.find(ad => 
        ad.placement_type === 'mid-roll' && 
        Math.abs(ad.time_offset - current) < 1 // Within 1 second of the target time
      );
      
      if (midRollAd) {
        videoRef.current.pause();
        setIsPlaying(false);
        playAd(midRollAd);
      }
    }
  };

  const handleVideoEnded = () => {
    setIsPlaying(false);
    
    // Check if we have post-roll ads
    if (ads.length > 0) {
      const postRollAds = ads.filter(ad => ad.placement_type === 'post-roll');
      if (postRollAds.length > 0) {
        playAd(postRollAds[0]);
      }
    }
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play()
        .catch(err => {
          console.error("Error playing video:", err);
          toast({
            title: "Playback Error",
            description: "There was an error playing this video.",
            variant: "destructive"
          });
        });
    }
    
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    setDuration(videoRef.current.duration);
    setLoading(false);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };
  
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!videoRef.current) return;
    const newTime = parseFloat(e.target.value);
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  return (
    <div className="relative w-full h-full bg-black">
      {/* Ad overlay */}
      {adPlaying && (
        <div className="absolute inset-0 z-20 flex flex-col">
          <div className="absolute top-0 left-0 right-0 bg-black bg-opacity-70 p-2 text-white z-30 flex justify-between items-center">
            <div className="flex items-center">
              <span className="bg-yellow-600 text-black text-xs px-2 py-1 rounded mr-2">AD</span>
              <span className="text-sm">{adPlaying.ad.title}</span>
            </div>
            {adPlaying.ad.is_skippable && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={skipAd}
                disabled={!canSkip}
                className="text-xs"
              >
                {canSkip ? (
                  <>
                    <FastForward size={14} className="mr-1"/> Skip Ad
                  </>
                ) : (
                  `Skip in ${skipCounter}s`
                )}
              </Button>
            )}
          </div>
          
          <video
            ref={videoRef}
            className="w-full h-full object-contain"
            src={adPlaying.ad.video_url}
            poster={thumbnail}
            autoPlay
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onEnded={handleAdEnd}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />
        </div>
      )}
      
      {/* Main video */}
      {!adPlaying && (
        <>
          <video
            ref={videoRef}
            className="w-full h-full object-contain"
            src={videoUrl}
            poster={thumbnail}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onEnded={handleVideoEnded}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />
          
          {/* Controls overlay */}
          <div className="absolute inset-0 flex flex-col justify-between bg-gradient-to-b from-black/40 via-transparent to-black/60 opacity-0 hover:opacity-100 transition-opacity">
            {/* Top bar with close button */}
            <div className="p-4 flex justify-end">
              {onClose && (
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={onClose}
                  className="bg-black/50 text-white hover:bg-black/70"
                >
                  <X size={20} />
                </Button>
              )}
            </div>
            
            {/* Bottom bar with controls */}
            <div className="p-4">
              {/* Progress bar */}
              <div className="mb-2 flex items-center gap-2">
                <span className="text-xs text-white">{formatTime(currentTime)}</span>
                <input
                  type="range"
                  min="0"
                  max={duration || 0}
                  value={currentTime}
                  onChange={handleSeek}
                  className="w-full h-1 bg-gray-600 rounded-full appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #10B981 0%, #10B981 ${(currentTime / (duration || 1)) * 100}%, #374151 ${(currentTime / (duration || 1)) * 100}%, #374151 100%)`
                  }}
                />
                <span className="text-xs text-white">{formatTime(duration)}</span>
              </div>
              
              {/* Control buttons */}
              <div className="flex items-center justify-between">
                <div className="flex space-x-2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={togglePlay}
                    className="text-white hover:bg-black/30"
                    disabled={loading}
                  >
                    {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={toggleMute}
                    className="text-white hover:bg-black/30"
                  >
                    {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      
      {/* Loading overlay */}
      {loading && !adPlaying && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
}

export default VideoPlayer;
