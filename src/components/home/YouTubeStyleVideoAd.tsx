
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, Volume2, VolumeX, ExternalLink, X } from "lucide-react";

interface YouTubeStyleVideoAdProps {
  ads: Array<{
    id: string;
    title: string;
    description?: string;
    video_url: string;
    thumbnail_url?: string;
    cta_text?: string;
    cta_url?: string;
  }>;
  onAdComplete?: (adId: string) => void;
}

const YouTubeStyleVideoAd = ({ ads, onAdComplete }: YouTubeStyleVideoAdProps) => {
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showControls, setShowControls] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const currentAd = ads[currentAdIndex];

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !currentAd?.video_url) return;

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      setProgress((video.currentTime / video.duration) * 100);
    };

    const handleDurationChange = () => {
      setDuration(video.duration);
    };

    const handleEnded = () => {
      handleAdComplete();
    };

    const handleCanPlay = () => {
      // Auto-play when ready
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
          })
          .catch(() => {
            setIsPlaying(false);
          });
      }
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('durationchange', handleDurationChange);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('canplay', handleCanPlay);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('durationchange', handleDurationChange);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('canplay', handleCanPlay);
    };
  }, [currentAdIndex, currentAd?.video_url]);

  const handleAdComplete = () => {
    if (currentAd) {
      onAdComplete?.(currentAd.id);
    }
    
    // Move to next ad or loop back to first
    const nextIndex = (currentAdIndex + 1) % ads.length;
    setCurrentAdIndex(nextIndex);
    setProgress(0);
    setCurrentTime(0);
  };

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current;
    if (!video) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const percentage = clickX / width;
    const newTime = percentage * duration;
    
    video.currentTime = newTime;
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleCTAClick = () => {
    if (currentAd.cta_url) {
      window.open(currentAd.cta_url, '_blank');
    }
  };

  const handleSkipAd = () => {
    setIsVisible(false);
  };

  if (!ads.length || !currentAd || !isVisible) return null;

  return (
    <div className="relative w-full max-w-md mx-auto mb-6 rounded-lg overflow-hidden shadow-lg bg-black border border-gray-800">
      {/* Ad Label */}
      <div className="absolute top-2 left-2 z-20 bg-yellow-500 text-black text-xs px-2 py-0.5 rounded font-bold">
        AD {currentAdIndex + 1}/{ads.length}
      </div>

      {/* Skip Button */}
      <button
        onClick={handleSkipAd}
        className="absolute top-2 right-2 z-20 bg-black/70 hover:bg-black/90 text-white rounded-full p-1 transition-colors"
      >
        <X size={16} />
      </button>

      {/* Video Container */}
      <div 
        className="relative group cursor-pointer"
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
      >
        <video
          ref={videoRef}
          className="w-full h-48 sm:h-56 object-cover"
          src={currentAd.video_url}
          poster={currentAd.thumbnail_url}
          muted={isMuted}
          playsInline
          preload="metadata"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />

        {/* Video Controls Overlay */}
        <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 transition-opacity duration-300 ${showControls || !isPlaying ? 'opacity-100' : 'opacity-0'}`}>
          {/* Play/Pause Button */}
          <div className="absolute inset-0 flex items-center justify-center">
            {!isPlaying && (
              <Button
                onClick={togglePlay}
                variant="ghost"
                size="icon"
                className="bg-primary/90 hover:bg-primary text-white rounded-full h-12 w-12 transition-all duration-300 hover:scale-110"
              >
                <Play size={20} fill="white" />
              </Button>
            )}
          </div>

          {/* Bottom Controls */}
          <div className="absolute bottom-0 left-0 right-0 p-3">
            {/* Progress Bar */}
            <div 
              className="w-full h-1 bg-gray-600 rounded-full mb-2 cursor-pointer"
              onClick={handleSeek}
            >
              <div 
                className="h-full bg-primary rounded-full transition-all duration-100"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Button
                  onClick={togglePlay}
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20 h-8 w-8"
                >
                  {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                </Button>
                
                <Button
                  onClick={toggleMute}
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20 h-8 w-8"
                >
                  {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                </Button>
                
                <span className="text-white text-xs">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ad Info Section */}
      <div className="p-4 bg-gray-900">
        <h3 className="text-white font-bold text-sm mb-1 line-clamp-1">{currentAd.title}</h3>
        {currentAd.description && (
          <p className="text-gray-300 text-xs mb-3 line-clamp-2">
            {currentAd.description}
          </p>
        )}
        
        <div className="flex items-center justify-between">
          {currentAd.cta_text && (
            <Button 
              onClick={handleCTAClick}
              size="sm"
              className="bg-primary hover:bg-primary/90 text-white font-medium px-4 py-1.5 text-xs"
            >
              <ExternalLink size={12} className="mr-1.5" />
              {currentAd.cta_text}
            </Button>
          )}
          
          {/* Ad Navigation Dots */}
          {ads.length > 1 && (
            <div className="flex space-x-1">
              {ads.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentAdIndex(index)}
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
                    index === currentAdIndex 
                      ? 'bg-primary scale-125' 
                      : 'bg-gray-500 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default YouTubeStyleVideoAd;
