
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, Volume2, VolumeX, ExternalLink, X, ChevronLeft, ChevronRight } from "lucide-react";

interface Ad {
  id: string;
  title: string;
  description?: string;
  thumbnail_url?: string;
  video_url: string;
  cta_text?: string;
  cta_url?: string;
  duration?: number;
}

interface AutoPlayAdSequencerProps {
  ads: Ad[];
  autoPlayDuration?: number; // Duration in seconds before moving to next ad
  onAdComplete?: (adId: string) => void;
}

const AutoPlayAdSequencer = ({ 
  ads, 
  autoPlayDuration = 5,
  onAdComplete 
}: AutoPlayAdSequencerProps) => {
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [showControls, setShowControls] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const currentAd = ads[currentAdIndex];

  // Auto-advance to next ad after specified duration
  useEffect(() => {
    if (!isPlaying || !currentAd) return;

    timerRef.current = setTimeout(() => {
      handleNextAd();
    }, autoPlayDuration * 1000);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [currentAdIndex, isPlaying, autoPlayDuration]);

  // Video event handlers
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
    };

    const handleEnded = () => {
      handleNextAd();
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    const handleError = (e: Event) => {
      console.error('Ad video error:', e);
      // Skip to next ad on error
      handleNextAd();
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('error', handleError);

    // Auto-play current ad
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        console.log('Autoplay was prevented');
        setIsPlaying(false);
      });
    }

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('error', handleError);
    };
  }, [currentAdIndex]);

  const handleNextAd = () => {
    if (onAdComplete) {
      onAdComplete(currentAd.id);
    }

    const nextIndex = (currentAdIndex + 1) % ads.length;
    setCurrentAdIndex(nextIndex);
    setCurrentTime(0);
  };

  const handlePreviousAd = () => {
    const prevIndex = (currentAdIndex - 1 + ads.length) % ads.length;
    setCurrentAdIndex(prevIndex);
    setCurrentTime(0);
  };

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.error('Play failed:', error);
        });
      }
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleCTAClick = () => {
    if (currentAd.cta_url) {
      window.open(currentAd.cta_url, '_blank');
    }
  };

  const handleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const progressPercentage = autoPlayDuration > 0 ? (currentTime / autoPlayDuration) * 100 : 0;

  if (!ads.length) return null;

  return (
    <div className={`fixed bottom-4 right-4 z-50 transition-all duration-300 ${
      isMinimized ? 'w-64 h-36' : 'w-80 h-48'
    } bg-gradient-to-br from-card/95 to-background/90 backdrop-blur-sm border border-primary/20 rounded-lg shadow-2xl overflow-hidden`}>
      {/* Header */}
      <div className="flex items-center justify-between p-2 bg-gradient-to-r from-yellow-400/20 to-orange-500/20 backdrop-blur-sm border-b border-yellow-400/30">
        <div className="flex items-center">
          <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs px-2 py-0.5 rounded-sm font-bold mr-2">
            AD
          </span>
          <span className="text-xs text-gray-300">
            {currentAdIndex + 1} of {ads.length}
          </span>
        </div>
        <div className="flex items-center space-x-1">
          <Button
            onClick={handleMinimize}
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-white h-6 w-6 p-0"
          >
            {isMinimized ? '⬆' : '⬇'}
          </Button>
          <Button
            onClick={() => setCurrentAdIndex((prev) => (prev + 1) % ads.length)}
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-white h-6 w-6 p-0"
          >
            <X size={12} />
          </Button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Video Container */}
          <div 
            className="relative group cursor-pointer"
            onMouseEnter={() => setShowControls(true)}
            onMouseLeave={() => setShowControls(false)}
            onClick={togglePlay}
          >
            <video
              ref={videoRef}
              className="w-full h-32 object-cover"
              src={currentAd.video_url}
              poster={currentAd.thumbnail_url}
              muted={isMuted}
              loop={false}
              playsInline
              preload="metadata"
            />

            {/* Controls Overlay */}
            <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-opacity duration-300 ${
              showControls || !isPlaying ? 'opacity-100' : 'opacity-0'
            }`}>
              {/* Play/Pause Button */}
              <div className="absolute inset-0 flex items-center justify-center">
                {!isPlaying && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="bg-primary/90 hover:bg-primary text-white rounded-full h-8 w-8"
                  >
                    <Play size={16} fill="white" />
                  </Button>
                )}
              </div>

              {/* Navigation Controls */}
              <div className="absolute top-2 left-2 right-2 flex justify-between">
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePreviousAd();
                  }}
                  variant="ghost"
                  size="icon"
                  className="bg-black/50 hover:bg-black/70 text-white rounded-full h-6 w-6"
                >
                  <ChevronLeft size={12} />
                </Button>
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNextAd();
                  }}
                  variant="ghost"
                  size="icon"
                  className="bg-black/50 hover:bg-black/70 text-white rounded-full h-6 w-6"
                >
                  <ChevronRight size={12} />
                </Button>
              </div>

              {/* Bottom Controls */}
              <div className="absolute bottom-0 left-0 right-0 p-2">
                <div className="flex items-center justify-between">
                  <div className="flex-1 mr-2">
                    <h4 className="text-white font-medium text-xs line-clamp-1">{currentAd.title}</h4>
                  </div>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleMute();
                    }}
                    variant="ghost"
                    size="icon"
                    className="bg-black/50 hover:bg-black/70 text-white rounded-full h-6 w-6"
                  >
                    {isMuted ? <VolumeX size={12} /> : <Volume2 size={12} />}
                  </Button>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-800">
              <div 
                className="h-full bg-primary transition-all duration-1000 ease-linear"
                style={{ width: `${Math.min(progressPercentage, 100)}%` }}
              />
            </div>
          </div>

          {/* CTA Section */}
          <div className="p-2 bg-gradient-to-r from-card/80 to-background/60">
            <div className="flex items-center justify-between">
              {currentAd.cta_text && (
                <Button 
                  onClick={handleCTAClick}
                  size="sm"
                  className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white text-xs px-3 py-1"
                >
                  <ExternalLink size={10} className="mr-1" />
                  {currentAd.cta_text}
                </Button>
              )}
              
              {/* Ad Dots */}
              <div className="flex space-x-1">
                {ads.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentAdIndex(index)}
                    className={`w-1 h-1 rounded-full transition-all duration-200 ${
                      index === currentAdIndex 
                        ? 'bg-primary w-2' 
                        : 'bg-gray-500 hover:bg-gray-400'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AutoPlayAdSequencer;
