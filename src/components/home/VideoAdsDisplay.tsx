
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Play, Download, X, Volume2, VolumeX, SkipForward } from "lucide-react";

interface VideoAd {
  id: string;
  title: string;
  description?: string;
  video_url: string;
  thumbnail_url?: string;
  cta_text?: string;
  cta_url?: string;
}

interface VideoAdsDisplayProps {
  ads: VideoAd[];
}

const VideoAdsDisplay = ({ ads }: VideoAdsDisplayProps) => {
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const videoRef = useRef<HTMLVideoElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  if (!ads.length || !isVisible) return null;

  const currentAd = ads[currentAdIndex];

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !currentAd?.video_url) return;

    const handleCanPlay = () => {
      // Auto-play when video is ready
      video.muted = true;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            startAutoAdvance();
          })
          .catch((error) => {
            console.log('Autoplay prevented:', error);
            setIsPlaying(false);
          });
      }
    };

    const handleEnded = () => {
      handleNextAd();
    };

    const handlePlay = () => {
      setIsPlaying(true);
      startAutoAdvance();
    };
    
    const handlePause = () => {
      setIsPlaying(false);
      stopAutoAdvance();
    };

    const handleError = () => {
      console.error('Video ad error, skipping to next');
      handleNextAd();
    };

    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('error', handleError);

    return () => {
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('error', handleError);
      stopAutoAdvance();
    };
  }, [currentAdIndex, currentAd?.video_url]);

  const startAutoAdvance = () => {
    stopAutoAdvance();
    setTimeLeft(10);
    setProgress(0);

    // Progress and countdown timer
    progressIntervalRef.current = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 1;
        setTimeLeft(10 - newProgress);
        
        if (newProgress >= 10) {
          handleNextAd();
          return 0;
        }
        return newProgress;
      });
    }, 1000);
  };

  const stopAutoAdvance = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  };

  const handleNextAd = () => {
    stopAutoAdvance();
    setProgress(0);
    setTimeLeft(10);
    const nextIndex = (currentAdIndex + 1) % ads.length;
    setCurrentAdIndex(nextIndex);
  };

  const handleClose = () => {
    stopAutoAdvance();
    setIsVisible(false);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !isMuted;
    setIsMuted(!isMuted);
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

  const progressPercentage = (progress / 10) * 100;

  return (
    <div className="relative mb-6 w-full max-w-6xl mx-auto">
      {/* Main Featured Ad */}
      <div className="relative rounded-xl overflow-hidden bg-gray-900/50 backdrop-blur-sm border border-gray-800/50">
        <div className="relative aspect-[16/9] sm:aspect-[2.5/1]">
          <video
            ref={videoRef}
            className="w-full h-full object-cover cursor-pointer"
            src={currentAd.video_url}
            poster={currentAd.thumbnail_url || "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5"}
            muted={isMuted}
            playsInline
            autoPlay
            onClick={togglePlay}
          />
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          
          {/* Auto-advance Progress Bar */}
          {isPlaying && (
            <div className="absolute top-4 left-4 right-4 z-20">
              <div className="bg-black/50 rounded-full p-2 backdrop-blur-sm">
                <div className="flex items-center justify-between text-white text-sm mb-2">
                  <span>Next ad in {timeLeft}s</span>
                  <Button
                    onClick={handleNextAd}
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/20 p-1 h-auto"
                  >
                    <SkipForward size={16} />
                  </Button>
                </div>
                <div className="w-full bg-gray-600 rounded-full h-1">
                  <div 
                    className="bg-primary h-1 rounded-full transition-all duration-1000 ease-linear"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </div>
            </div>
          )}
          
          {/* Play/Pause Overlay */}
          {!isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Button
                onClick={togglePlay}
                variant="ghost"
                size="icon"
                className="bg-primary/90 hover:bg-primary text-white rounded-full h-16 w-16 transition-all duration-300 hover:scale-110"
              >
                <Play size={24} fill="white" />
              </Button>
            </div>
          )}
          
          {/* Content */}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="flex items-end justify-between">
              <div className="flex-1 max-w-2xl">
                <h3 className="text-2xl font-bold text-white mb-2">{currentAd.title}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-300 mb-3">
                  <span className="bg-yellow-500 text-black px-2 py-0.5 rounded text-xs font-bold">
                    SPONSORED
                  </span>
                  <span>|</span>
                  <span>Ad {currentAdIndex + 1} of {ads.length}</span>
                </div>
                
                <div className="flex items-center gap-3 flex-wrap">
                  <Button className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-lg font-semibold">
                    <Play size={16} className="mr-2" fill="white" />
                    Watch Now
                  </Button>
                  
                  <Button variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20 px-4 py-2 rounded-lg">
                    <Download size={16} className="mr-2" />
                    Download
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  onClick={toggleMute}
                  variant="ghost"
                  size="icon"
                  className="text-white/70 hover:text-white hover:bg-white/10 rounded-full"
                >
                  {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                </Button>
                
                <Button
                  onClick={handleClose}
                  variant="ghost"
                  size="icon"
                  className="text-white/70 hover:text-white hover:bg-white/10 rounded-full"
                >
                  <X size={20} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Ads Preview */}
      {ads.length > 1 && (
        <div className="flex gap-3 mt-4 overflow-x-auto scrollbar-none pb-2">
          {ads.map((ad, index) => (
            <div
              key={ad.id}
              className={`min-w-[200px] w-[200px] relative rounded-lg overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-300 ${
                index === currentAdIndex ? 'ring-2 ring-primary bg-primary/10' : 'bg-gray-900/30'
              }`}
              onClick={() => setCurrentAdIndex(index)}
            >
              <div className="aspect-[16/10]">
                <img
                  src={ad.thumbnail_url || "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5"}
                  alt={ad.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-primary/90 rounded-full p-2">
                    <Play size={14} fill="white" className="text-white" />
                  </div>
                </div>
              </div>
              <div className="p-3">
                <h4 className="text-white text-sm font-medium line-clamp-1">{ad.title}</h4>
                <p className="text-gray-400 text-xs">Sponsored</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Ad Navigation Dots */}
      {ads.length > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {ads.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentAdIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                index === currentAdIndex 
                  ? 'bg-primary scale-125' 
                  : 'bg-gray-500 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default VideoAdsDisplay;
