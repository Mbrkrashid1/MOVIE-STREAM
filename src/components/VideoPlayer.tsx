
import { useState, useEffect } from "react";
import { useVideoControls } from "./player/useVideoControls";
import { useAdHandling } from "./player/useAdHandling";
import VideoControls from "./player/VideoControls";
import AdOverlay from "./player/AdOverlay";

interface VideoPlayerProps {
  videoUrl: string;
  contentId: string;
  thumbnail?: string;
  onClose?: () => void;
}

export function VideoPlayer({ videoUrl, contentId, thumbnail, onClose }: VideoPlayerProps) {
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

  // Fetch ads when component mounts
  useEffect(() => {
    if (contentId) {
      fetchAds();
    }
  }, [contentId]);

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
    <div className="relative w-full h-full bg-black">
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
          <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
}

export default VideoPlayer;
