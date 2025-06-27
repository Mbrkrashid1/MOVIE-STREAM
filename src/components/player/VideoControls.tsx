
import React from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, Volume2, VolumeX, X, SkipBack, SkipForward, Maximize, Settings } from "lucide-react";

interface VideoControlsProps {
  isPlaying: boolean;
  isMuted: boolean;
  currentTime: number;
  duration: number;
  onTogglePlay: () => void;
  onToggleMute: () => void;
  onSeek: (e: React.ChangeEvent<HTMLInputElement>) => void;
  formatTime: (time: number) => string;
  onClose?: () => void;
  loading?: boolean;
  videoError?: string | null;
}

export const VideoControls: React.FC<VideoControlsProps> = ({
  isPlaying,
  isMuted,
  currentTime,
  duration,
  onTogglePlay,
  onToggleMute,
  onSeek,
  formatTime,
  onClose,
  loading = false,
  videoError = null
}) => {
  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleSkip = (seconds: number) => {
    const video = document.querySelector('video');
    if (video && !videoError) {
      video.currentTime = Math.max(0, Math.min(video.currentTime + seconds, duration));
    }
  };

  // Don't show controls if there's a video error
  if (videoError) {
    return null;
  }

  return (
    <div className="absolute inset-0 flex flex-col justify-between bg-gradient-to-b from-black/40 via-transparent to-black/80 opacity-0 hover:opacity-100 transition-opacity duration-300 group touch-auto">
      {/* Top bar with close button and settings */}
      <div className="p-3 sm:p-4 flex justify-between items-start">
        <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {/* Quality selector placeholder */}
          <div className="bg-black/60 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
            HD
          </div>
          {/* Settings button */}
          <Button 
            variant="ghost" 
            size="icon"
            className="bg-black/60 text-white hover:bg-black/80 backdrop-blur-sm transition-all duration-200 h-8 w-8"
          >
            <Settings size={16} />
          </Button>
        </div>
        
        {onClose && (
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onClose}
            className="bg-black/60 text-white hover:bg-black/80 backdrop-blur-sm transition-all duration-200 h-8 w-8 sm:h-10 sm:w-10"
          >
            <X size={16} className="sm:hidden" />
            <X size={20} className="hidden sm:block" />
          </Button>
        )}
      </div>

      {/* Center play button for when paused - Enhanced for mobile */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {!isPlaying && !loading && (
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onTogglePlay}
            className="bg-black/70 text-white hover:bg-black/80 rounded-full h-16 w-16 sm:h-20 sm:w-20 pointer-events-auto transition-all duration-300 hover:scale-110 active:scale-95"
          >
            <Play size={24} className="sm:hidden" fill="white" />
            <Play size={32} className="hidden sm:block" fill="white" />
          </Button>
        )}
      </div>
      
      {/* Bottom controls - Enhanced for mobile */}
      <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
        {/* Progress bar - Enhanced touch target */}
        <div className="relative">
          <div className="flex items-center gap-2 sm:gap-3 text-white text-xs sm:text-sm mb-2">
            <span className="min-w-[35px] sm:min-w-[40px] text-xs sm:text-sm">{formatTime(currentTime)}</span>
            <div className="flex-1 relative py-2">
              <div className="h-1 bg-white/30 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary to-primary/80 transition-all duration-150"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              <input
                type="range"
                min="0"
                max={duration || 0}
                value={currentTime}
                onChange={onSeek}
                disabled={loading}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                style={{ 
                  WebkitAppearance: 'none',
                  height: '20px',
                  marginTop: '-10px'
                }}
              />
            </div>
            <span className="min-w-[35px] sm:min-w-[40px] text-right text-xs sm:text-sm">{formatTime(duration)}</span>
          </div>
        </div>
        
        {/* Control buttons - Mobile optimized */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1 sm:space-x-2">
            {/* Skip back */}
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => handleSkip(-10)}
              disabled={loading}
              className="text-white hover:bg-white/20 transition-all duration-200 h-8 w-8 sm:h-10 sm:w-10 active:scale-95 disabled:opacity-50"
            >
              <SkipBack size={16} className="sm:hidden" />
              <SkipBack size={20} className="hidden sm:block" />
            </Button>

            {/* Play/Pause */}
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onTogglePlay}
              disabled={loading}
              className="text-white hover:bg-white/20 transition-all duration-200 mx-1 sm:mx-2 h-10 w-10 sm:h-12 sm:w-12 active:scale-95 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : isPlaying ? (
                <>
                  <Pause size={20} className="sm:hidden" />
                  <Pause size={24} className="hidden sm:block" />
                </>
              ) : (
                <>
                  <Play size={20} className="sm:hidden" />
                  <Play size={24} className="hidden sm:block" />
                </>
              )}
            </Button>

            {/* Skip forward */}
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => handleSkip(10)}
              disabled={loading}
              className="text-white hover:bg-white/20 transition-all duration-200 h-8 w-8 sm:h-10 sm:w-10 active:scale-95 disabled:opacity-50"
            >
              <SkipForward size={16} className="sm:hidden" />
              <SkipForward size={20} className="hidden sm:block" />
            </Button>

            {/* Volume - Hidden on very small screens */}
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onToggleMute}
              disabled={loading}
              className="text-white hover:bg-white/20 transition-all duration-200 ml-2 sm:ml-4 h-8 w-8 sm:h-10 sm:w-10 hidden xs:flex active:scale-95 disabled:opacity-50"
            >
              {isMuted ? (
                <>
                  <VolumeX size={16} className="sm:hidden" />
                  <VolumeX size={20} className="hidden sm:block" />
                </>
              ) : (
                <>
                  <Volume2 size={16} className="sm:hidden" />
                  <Volume2 size={20} className="hidden sm:block" />
                </>
              )}
            </Button>
          </div>

          {/* Right side controls */}
          <div className="flex items-center space-x-1 sm:space-x-2">
            {/* Volume for very small screens */}
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onToggleMute}
              disabled={loading}
              className="text-white hover:bg-white/20 transition-all duration-200 h-8 w-8 xs:hidden active:scale-95 disabled:opacity-50"
            >
              {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon"
              disabled={loading}
              className="text-white hover:bg-white/20 transition-all duration-200 h-8 w-8 sm:h-10 sm:w-10 active:scale-95 disabled:opacity-50"
            >
              <Maximize size={16} className="sm:hidden" />
              <Maximize size={20} className="hidden sm:block" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoControls;
