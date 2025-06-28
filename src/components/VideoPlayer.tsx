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
  backdrop?: string; // New backdrop image prop
  onClose?: () => void;
  title?: string;
  description?: string;
  views?: number;
}

export function VideoPlayer({ 
  videoUrl, 
  contentId, 
  thumbnail, 
  backdrop, // Accept backdrop prop
  onClose, 
  title = "Video", 
  description = "",
  views = 0 
}: VideoPlayerProps) {
  const { toast } = useToast();
  const [hasTrackedView, setHasTrackedView] = useState(false);
  const [currentViews, setCurrentViews] = useState(views);
  const [videoError, setVideoError] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLandscape, setIsLandscape] = useState(false);

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

  // Handle orientation changes
  useEffect(() => {
    const handleOrientationChange = () => {
      const orientation = window.screen?.orientation?.angle || 0;
      setIsLandscape(orientation === 90 || orientation === -90 || orientation === 270);
    };

    handleOrientationChange();
    window.addEventListener('orientationchange', handleOrientationChange);
    window.addEventListener('resize', handleOrientationChange);

    return () => {
      window.removeEventListener('orientationchange', handleOrientationChange);
      window.removeEventListener('resize', handleOrientationChange);
    };
  }, []);

  // Handle fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []);

  // Fullscreen functions
  const enterFullscreen = async () => {
    const element = document.documentElement;
    try {
      if (element.requestFullscreen) {
        await element.requestFullscreen();
      } else if ((element as any).webkitRequestFullscreen) {
        await (element as any).webkitRequestFullscreen();
      } else if ((element as any).mozRequestFullScreen) {
        await (element as any).mozRequestFullScreen();
      } else if ((element as any).msRequestFullscreen) {
        await (element as any).msRequestFullscreen();
      }
    } catch (error) {
      console.error('Error entering fullscreen:', error);
    }
  };

  const exitFullscreen = async () => {
    try {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
      } else if ((document as any).webkitExitFullscreen) {
        await (document as any).webkitExitFullscreen();
      } else if ((document as any).mozCancelFullScreen) {
        await (document as any).mozCancelFullScreen();
      } else if ((document as any).msExitFullscreen) {
        await (document as any).msExitFullscreen();
      }
    } catch (error) {
      console.error('Error exiting fullscreen:', error);
    }
  };

  const toggleFullscreen = () => {
    if (isFullscreen) {
      exitFullscreen();
    } else {
      enterFullscreen();
    }
  };

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

  const handleVideoError = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    const video = e.currentTarget;
    const error = video.error;
    
    if (error) {
      let errorMessage = "Video playback failed";
      
      switch (error.code) {
        case MediaError.MEDIA_ERR_ABORTED:
          errorMessage = "Video playback was aborted";
          break;
        case MediaError.MEDIA_ERR_NETWORK:
          errorMessage = "Network error occurred while loading video";
          break;
        case MediaError.MEDIA_ERR_DECODE:
          errorMessage = "Video format is not supported or corrupted";
          break;
        case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
          errorMessage = "Video source is not supported";
          break;
        default:
          errorMessage = "Unknown video error occurred";
      }
      
      setVideoError(errorMessage);
      setLoading(false);
      
      toast({
        title: "Video Error",
        description: errorMessage,
        variant: "destructive"
      });
    }
  };

  const handleCanPlay = () => {
    setLoading(false);
    setVideoError(null);
  };

  const handleWaiting = () => {
    setLoading(true);
  };

  const handleCanPlayThrough = () => {
    setLoading(false);
  };

  // Determine container classes based on orientation and fullscreen
  const getContainerClasses = () => {
    if (isFullscreen || isLandscape) {
      return "fixed inset-0 z-50 bg-black";
    }
    return "relative w-full h-full bg-black flex flex-col";
  };

  // Enhanced backdrop image - prioritize backdrop over thumbnail
  const getBackdropImage = () => {
    return backdrop || thumbnail;
  };

  const getVideoClasses = () => {
    if (isFullscreen || isLandscape) {
      return "w-full h-full object-contain";
    }
    return "w-full h-full object-contain sm:object-cover md:object-contain";
  };

  return (
    <div className={getContainerClasses()}>
      {/* Enhanced backdrop with custom image support */}
      {getBackdropImage() && (
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-300"
          style={{ 
            backgroundImage: `url(${getBackdropImage()})`,
            opacity: (!isPlaying || loading) && !adPlaying && !videoError ? 1 : 0
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/80" />
        </div>
      )}

      {/* Video Container with responsive sizing */}
      <div className="relative flex-1 w-full h-full">
        {/* Backdrop image when video is not playing or loading */}
        {(!isPlaying || loading) && thumbnail && !adPlaying && !videoError && (
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${thumbnail})` }}
          >
            <div className="absolute inset-0 bg-black/40" />
          </div>
        )}

        {/* Video Error Display */}
        {videoError && (
          <div className="absolute inset-0 flex items-center justify-center bg-black text-white z-20">
            <div className="text-center p-8">
              <div className="mb-4 text-red-400">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Playback Error</h3>
              <p className="text-gray-300 mb-4">{videoError}</p>
              <button 
                onClick={() => {
                  setVideoError(null);
                  setLoading(true);
                  if (videoRef.current) {
                    videoRef.current.load();
                  }
                }}
                className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/80 transition-colors"
              >
                Retry Playback
              </button>
            </div>
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
            thumbnail={getBackdropImage()}
          />
        )}
        
        {/* Main video with responsive object-fit */}
        {!adPlaying && !videoError && (
          <>
            <video
              ref={videoRef}
              className={getVideoClasses()}
              src={videoUrl}
              poster={getBackdropImage()}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onEnded={handleVideoEnded}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onError={handleVideoError}
              onCanPlay={handleCanPlay}
              onWaiting={handleWaiting}
              onCanPlayThrough={handleCanPlayThrough}
              preload="metadata"
              playsInline
              controls={false}
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
              loading={loading}
              videoError={videoError}
              isFullscreen={isFullscreen}
              onToggleFullscreen={toggleFullscreen}
            />
          </>
        )}
        
        {/* Loading overlay */}
        {loading && !adPlaying && !videoError && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              <p className="text-white text-sm">Loading video...</p>
            </div>
          </div>
        )}
      </div>

      {/* Video Info Bar (MovieBox Style) - Hide in fullscreen/landscape */}
      {!adPlaying && !videoError && !isFullscreen && !isLandscape && (
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
