
import React from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, Volume2, VolumeX, X, SkipBack, SkipForward, Maximize } from "lucide-react";

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
  onClose
}) => {
  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleSkip = (seconds: number) => {
    const video = document.querySelector('video');
    if (video) {
      video.currentTime = Math.max(0, Math.min(video.currentTime + seconds, duration));
    }
  };

  return (
    <div className="absolute inset-0 flex flex-col justify-between bg-gradient-to-b from-black/40 via-transparent to-black/80 opacity-0 hover:opacity-100 transition-opacity duration-300 group">
      {/* Top bar with close button */}
      <div className="p-4 flex justify-between items-start">
        <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {/* Quality selector placeholder */}
          <div className="bg-black/60 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
            HD
          </div>
        </div>
        
        {onClose && (
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onClose}
            className="bg-black/60 text-white hover:bg-black/80 backdrop-blur-sm transition-all duration-200"
          >
            <X size={20} />
          </Button>
        )}
      </div>

      {/* Center play button for when paused */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {!isPlaying && (
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onTogglePlay}
            className="bg-black/70 text-white hover:bg-black/80 rounded-full h-20 w-20 pointer-events-auto transition-all duration-300 hover:scale-110"
          >
            <Play size={32} fill="white" />
          </Button>
        )}
      </div>
      
      {/* Bottom controls */}
      <div className="p-4 space-y-3">
        {/* Progress bar */}
        <div className="relative">
          <div className="flex items-center gap-3 text-white text-sm mb-2">
            <span className="min-w-[40px]">{formatTime(currentTime)}</span>
            <div className="flex-1 relative">
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
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
            <span className="min-w-[40px] text-right">{formatTime(duration)}</span>
          </div>
        </div>
        
        {/* Control buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {/* Skip back */}
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => handleSkip(-10)}
              className="text-white hover:bg-white/20 transition-all duration-200"
            >
              <SkipBack size={20} />
            </Button>

            {/* Play/Pause */}
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onTogglePlay}
              className="text-white hover:bg-white/20 transition-all duration-200 mx-2"
            >
              {isPlaying ? <Pause size={24} /> : <Play size={24} />}
            </Button>

            {/* Skip forward */}
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => handleSkip(10)}
              className="text-white hover:bg-white/20 transition-all duration-200"
            >
              <SkipForward size={20} />
            </Button>

            {/* Volume */}
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onToggleMute}
              className="text-white hover:bg-white/20 transition-all duration-200 ml-4"
            >
              {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </Button>
          </div>

          {/* Right side controls */}
          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="icon"
              className="text-white hover:bg-white/20 transition-all duration-200"
            >
              <Maximize size={20} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoControls;
