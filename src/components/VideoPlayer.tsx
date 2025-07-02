
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
      networkState: video.networkState
    });
    
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
    console.log('Video can play:', {
      duration: videoRef.current?.duration,
      readyState: videoRef.current?.readyState,
      videoWidth: videoRef.current?.videoWidth,
      videoHeight: videoRef.current?.videoHeight
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
    console.log('Retrying video playback');
    setVideoError(null);
    setLoading(true);
    if (videoRef.current) {
      videoRef.current.load();
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
