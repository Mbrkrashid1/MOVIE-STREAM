
import React from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, Volume2, VolumeX, X } from "lucide-react";

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
  return (
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
            onChange={onSeek}
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
              onClick={onTogglePlay}
              className="text-white hover:bg-black/30"
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onToggleMute}
              className="text-white hover:bg-black/30"
            >
              {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoControls;
