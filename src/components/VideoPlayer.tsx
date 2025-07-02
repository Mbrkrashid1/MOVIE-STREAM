
import { useState, useEffect } from "react";
import { useVideoControls } from "./player/useVideoControls";
import { useAdHandling } from "./player/useAdHandling";
import { useFullscreen } from "./player/useFullscreen";
import { useOrientation } from "./player/useOrientation";
import { useViewTracking } from "./player/useViewTracking";
import VideoControls from "./player/VideoControls";
import AdOverlay from "./player/AdOverlay";
import { VideoPlayerContainer } from "./player/VideoPlayerContainer";
import { VideoErrorDisplay } from "./player/VideoErrorDisplay";
import { VideoLoadingOverlay } from "./player/VideoLoadingOverlay";
import { VideoInfoBar } from "./player/VideoInfoBar";
import { useToast } from "@/hooks/use-toast";

interface VideoPlayerProps {
  videoUrl: string;
  contentId: string;
  thumbnail?: string;
  backdrop?: string;
  onClose?: () => void;
  title?: string;
  description?: string;
  views?: number;
}

export function VideoPlayer({ 
  videoUrl, 
  contentId, 
  thumbnail, 
  backdrop,
  onClose, 
  title = "Video", 
  description = "",
  views = 0 
}: VideoPlayerProps) {
  const { toast } = useToast();
  const [videoError, setVideoError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

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

  const { isFullscreen, toggleFullscreen } = useFullscreen();
  const { isLandscape } = useOrientation();
  const { hasTrackedView, currentViews, trackView } = useViewTracking(contentId, views);

  // Fetch ads when component mounts
  useEffect(() => {
    if (contentId) {
      fetchAds();
    }
  }, [contentId]);

  // Track view after 30 seconds of playback
  useEffect(() => {
    trackView(isPlaying, currentTime, !!adPlaying);
  }, [isPlaying, currentTime, adPlaying]);

  // Enhanced video URL validation and error handling
  useEffect(() => {
    if (!videoUrl || videoUrl.trim() === '' || videoUrl === 'placeholder') {
      setVideoError("Video not available");
      return;
    }

    // Reset error and retry count when URL changes
    setVideoError(null);
    setRetryCount(0);
    setLoading(true);

    // Validate URL format
    try {
      const url = new URL(videoUrl);
      // Check if it's a valid video URL
      if (!url.protocol.startsWith('http')) {
        throw new Error('Invalid protocol');
      }
    } catch (error) {
      console.error('Invalid video URL:', videoUrl);
      setVideoError("Invalid video URL format");
      setLoading(false);
      return;
    }

    // Preload video to check if it's valid
    const testVideo = document.createElement('video');
    testVideo.preload = 'metadata';
    testVideo.muted = true;
    
    const handleTestLoad = () => {
      console.log('Video URL validated successfully');
      setVideoError(null);
      setLoading(false);
    };
    
    const handleTestError = () => {
      console.error('Video URL validation failed:', videoUrl);
      setVideoError("Video source is not accessible");
      setLoading(false);
    };
    
    testVideo.addEventListener('loadedmetadata', handleTestLoad);
    testVideo.addEventListener('error', handleTestError);
    testVideo.src = videoUrl;
    
    return () => {
      testVideo.removeEventListener('loadedmetadata', handleTestLoad);
      testVideo.removeEventListener('error', handleTestError);
      testVideo.src = '';
    };
  }, [videoUrl]);

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
    
    console.log('Video error occurred:', {
      errorCode: error?.code,
      errorMessage: error?.message,
      videoUrl,
      readyState: video.readyState,
      networkState: video.networkState,
      src: video.src,
      retryCount
    });
    
    if (error) {
      let errorMessage = "Video playback failed";
      
      switch (error.code) {
        case MediaError.MEDIA_ERR_ABORTED:
          errorMessage = "Video playback was aborted";
          break;
        case MediaError.MEDIA_ERR_NETWORK:
          errorMessage = "Network error - check your connection";
          break;
        case MediaError.MEDIA_ERR_DECODE:
          errorMessage = "Video format not supported or file corrupted";
          break;
        case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
          errorMessage = "Video source not supported";
          break;
        default:
          errorMessage = "Unknown video error occurred";
      }
      
      setVideoError(errorMessage);
      setLoading(false);
      
      // Only show toast for first error to avoid spam
      if (retryCount === 0) {
        toast({
          title: "Video Error",
          description: errorMessage,
          variant: "destructive"
        });
      }
    }
  };

  const handleCanPlay = () => {
    console.log('Video can play:', {
      duration: videoRef.current?.duration,
      readyState: videoRef.current?.readyState,
      videoWidth: videoRef.current?.videoWidth,
      videoHeight: videoRef.current?.videoHeight,
      src: videoRef.current?.src
    });
    setLoading(false);
    setVideoError(null);
  };

  const handleWaiting = () => {
    console.log('Video waiting for data');
    setLoading(true);
  };

  const handleCanPlayThrough = () => {
    console.log('Video can play through');
    setLoading(false);
  };

  const handleRetry = () => {
    console.log('Retrying video playback, attempt:', retryCount + 1);
    setRetryCount(prev => prev + 1);
    setVideoError(null);
    setLoading(true);
    
    if (videoRef.current) {
      // Reset video element
      videoRef.current.currentTime = 0;
      videoRef.current.load();
      
      // Try to play after a short delay
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.play().catch(err => {
            console.error('Retry play failed:', err);
            setVideoError("Unable to play video after retry");
            setLoading(false);
          });
        }
      }, 1000);
    }
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

  const showBackdrop = (!isPlaying || loading) && !adPlaying && !videoError;

  // Show error if video URL is invalid
  if (videoError && (!videoUrl || videoUrl === 'placeholder')) {
    return (
      <VideoPlayerContainer
        isFullscreen={isFullscreen}
        isLandscape={isLandscape}
        backdropImage={getBackdropImage()}
        showBackdrop={false}
      >
        <VideoErrorDisplay error="No video available" onRetry={handleRetry} />
      </VideoPlayerContainer>
    );
  }

  return (
    <VideoPlayerContainer
      isFullscreen={isFullscreen}
      isLandscape={isLandscape}
      backdropImage={getBackdropImage()}
      showBackdrop={showBackdrop}
    >
      {/* Video Container with responsive sizing */}
      <div className="relative flex-1 w-full h-full">
        {/* Video Error Display */}
        {videoError && (
          <VideoErrorDisplay error={videoError} onRetry={handleRetry} />
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
        
        {/* Main video with enhanced error handling */}
        {!adPlaying && !videoError && videoUrl && videoUrl !== 'placeholder' && (
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
              onLoadStart={() => console.log('Video load started')}
              onLoadedData={() => console.log('Video data loaded')}
              onSuspend={() => console.log('Video suspended')}
              onStalled={() => console.log('Video stalled')}
              onProgress={() => console.log('Video progress')}
              preload="metadata"
              playsInline
              controls={false}
              crossOrigin="anonymous"
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
        <VideoLoadingOverlay loading={loading && !adPlaying && !videoError} />
      </div>

      {/* Video Info Bar (MovieBox Style) - Hide in fullscreen/landscape */}
      <VideoInfoBar
        title={title}
        description={description}
        views={currentViews}
        duration={duration}
        hasTrackedView={hasTrackedView}
        formatTime={formatTime}
        isVisible={!adPlaying && !videoError && !isFullscreen && !isLandscape}
      />
    </VideoPlayerContainer>
  );
}

export default VideoPlayer;
