import { useState, useEffect } from "react";
import { useVideoControls } from "./player/useVideoControls";
import { useAdHandling } from "./player/useAdHandling";
import VideoControls from "./player/VideoControls";
import AdOverlay from "./player/AdOverlay";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface VideoPlayerProps {
  videoUrl: string;
  contentId: string;
  thumbnail?: string;
  onClose?: () => void;
  title?: string;
  description?: string;
  views?: number;
}

export function VideoPlayer({ 
  videoUrl, 
  contentId, 
  thumbnail, 
  onClose, 
  title = "Video", 
  description = "",
  views = 0 
}: VideoPlayerProps) {
  const { toast } = useToast();
  const [hasTrackedView, setHasTrackedView] = useState(false);
  const [currentViews, setCurrentViews] = useState(views);

  const {
    isPlaying,
    isMuted,
    currentTime,
    duration,
    loading,
    videoRef,
    setIsPlaying,
    togglePlay,
    toggleMute,
    handleLoadedMetadata,
    formatTime,
    handleSeek,
    handleTimeUpdate: baseHandleTimeUpdate,
    setLoading
  } = useVideoControls();

  const {
    adPlaying,
    canSkip,
    skipCounter,
    videoRef: adVideoRef,
    fetchAds,
    skipAd,
    handleAdEnd,
    checkForMidRollAds,
    checkForPostRollAds
  } = useAdHandling(contentId, onClose);

  // Track view count mutation
  const trackViewMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase
        .from('content')
        .update({ views: currentViews + 1 })
        .eq('id', contentId)
        .select('views')
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      if (data) {
        setCurrentViews(data.views || 0);
        console.log('View tracked successfully');
      }
    },
    onError: (error) => {
      console.error('Error tracking view:', error);
    }
  });

  // Fetch ads when component mounts
  useEffect(() => {
    if (contentId) {
      fetchAds();
    }
  }, [contentId]);

  // Track view after 30 seconds of playback
  useEffect(() => {
    if (isPlaying && currentTime > 30 && !hasTrackedView && !adPlaying) {
      setHasTrackedView(true);
      trackViewMutation.mutate();
    }
  }, [isPlaying, currentTime, hasTrackedView, adPlaying]);

  const handleTimeUpdate = () => {
    baseHandleTimeUpdate();
    
    // Check for mid-roll ads when no ad is playing
    if (!adPlaying) {
      checkForMidRollAds(videoRef.current?.currentTime || 0);
    }
  };

  const handleVideoEnded = () => {
    setIsPlaying(false);
    checkForPostRollAds();
  };

  return (
    <div className="relative w-full h-full bg-black flex flex-col">
      {/* Video Container with responsive sizing */}
      <div className="relative flex-1 w-full h-full">
        {/* Backdrop image when video is not playing or loading */}
        {(!isPlaying || loading) && thumbnail && !adPlaying && (
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${thumbnail})` }}
          >
            <div className="absolute inset-0 bg-black/40" />
          </div>
        )}

        {/* Ad overlay */}
        {adPlaying && (
          <AdOverlay
            adPlaying={adPlaying}
            videoRef={adVideoRef}
            onTimeUpdate={baseHandleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onEnded={handleAdEnd}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            canSkip={canSkip}
            skipCounter={skipCounter}
            onSkip={skipAd}
            thumbnail={thumbnail}
          />
        )}
        
        {/* Main video with responsive object-fit */}
        {!adPlaying && (
          <>
            <video
              ref={videoRef}
              className="w-full h-full object-contain sm:object-cover md:object-contain"
              src={videoUrl}
              poster={thumbnail}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onEnded={handleVideoEnded}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />
            
            {/* Enhanced Controls overlay */}
            <VideoControls
              isPlaying={isPlaying}
              isMuted={isMuted}
              currentTime={currentTime}
              duration={duration}
              onTogglePlay={togglePlay}
              onToggleMute={toggleMute}
              onSeek={handleSeek}
              formatTime={formatTime}
              onClose={onClose}
            />
          </>
        )}
        
        {/* Loading overlay */}
        {loading && !adPlaying && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              <p className="text-white text-sm">Loading video...</p>
            </div>
          </div>
        )}
      </div>

      {/* Video Info Bar (MovieBox Style) - Responsive */}
      {!adPlaying && (
        <div className="bg-gradient-to-t from-black/90 to-transparent p-3 sm:p-4 text-white">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
            <div className="flex-1 min-w-0">
              <h2 className="text-base sm:text-lg font-bold mb-1 line-clamp-1">{title}</h2>
              <div className="flex items-center flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm text-gray-300">
                <span className="flex items-center">
                  <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
                  {currentViews.toLocaleString()} views
                </span>
                <span className="hidden sm:inline">•</span>
                <span className="hidden sm:inline">{formatTime(duration)} duration</span>
                {description && (
                  <>
                    <span className="hidden md:inline">•</span>
                    <span className="hidden md:inline line-clamp-1 max-w-xs">{description}</span>
                  </>
                )}
              </div>
              {/* Mobile-specific info row */}
              <div className="sm:hidden mt-1 text-xs text-gray-400">
                {formatTime(duration)} • {description && <span className="line-clamp-1">{description}</span>}
              </div>
            </div>
            
            {/* View tracking indicator */}
            {hasTrackedView && (
              <div className="flex items-center text-xs text-green-400 shrink-0">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-1 animate-pulse"></div>
                <span className="hidden sm:inline">View tracked</span>
                <span className="sm:hidden">✓</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default VideoPlayer;
