
import { Play, Pause, Volume2, VolumeX, X, Maximize, Minimize } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
}

export default function VideoControls({
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
  videoError = null,
  isFullscreen = false,
  onToggleFullscreen
}: VideoControlsProps) {
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 flex flex-col justify-between opacity-0 hover:opacity-100 transition-opacity duration-300 z-10">
      {/* Top Controls */}
      <div className="flex justify-between items-center p-4">
        <div className="flex items-center space-x-2">
          {/* Removed orientation toggle */}
        </div>
        <div className="flex items-center space-x-2">
          {onToggleFullscreen && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleFullscreen}
              className="text-white hover:bg-black/20 backdrop-blur-sm"
            >
              {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
            </Button>
          )}
          {onClose && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-black/20 backdrop-blur-sm"
            >
              <X size={16} />
            </Button>
          )}
        </div>
      </div>

      {/* Center Play Button */}
      <div className="flex-1 flex items-center justify-center">
        {!loading && !videoError && (
          <Button
            variant="ghost"
            size="lg"
            onClick={onTogglePlay}
            className="text-white hover:bg-black/20 w-16 h-16 rounded-full backdrop-blur-sm"
          >
            {isPlaying ? <Pause size={32} /> : <Play size={32} />}
          </Button>
        )}
      </div>

      {/* Bottom Controls */}
      <div className="p-4 space-y-2 backdrop-blur-sm">
        {/* Progress Bar */}
        <div className="w-full">
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={onSeek}
            className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
            style={{
              background: `linear-gradient(to right, #ef4444 0%, #ef4444 ${progress}%, #4b5563 ${progress}%, #4b5563 100%)`
            }}
          />
        </div>

        {/* Time and Controls */}
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onTogglePlay}
              className="text-white hover:bg-black/20"
              disabled={loading || !!videoError}
            >
              {isPlaying ? <Pause size={16} /> : <Play size={16} />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleMute}
              className="text-white hover:bg-black/20"
            >
              {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </Button>
          </div>

          <div className="text-white text-sm font-medium">
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>
        </div>
      </div>
    </div>
  );
}
