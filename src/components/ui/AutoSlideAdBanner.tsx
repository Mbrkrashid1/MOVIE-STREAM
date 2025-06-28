import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Play, X, ExternalLink, ChevronLeft, ChevronRight, Pause } from "lucide-react";
import VideoPlayer from "@/components/VideoPlayer";

interface Ad {
  id: string;
  title: string;
  description?: string;
  thumbnail_url?: string;
  video_url?: string;
  cta_text?: string;
  cta_url?: string;
  duration?: number;
}

interface AutoSlideAdBannerProps {
  ads: Ad[];
  autoSlideInterval?: number;
  showControls?: boolean;
}

const AutoSlideAdBanner = ({ 
  ads, 
  autoSlideInterval = 5000,
  showControls = true 
}: AutoSlideAdBannerProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-slide functionality
  useEffect(() => {
    if (!isAutoPlaying || ads.length <= 1 || isPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % ads.length);
    }, autoSlideInterval);

    return () => clearInterval(interval);
  }, [isAutoPlaying, ads.length, autoSlideInterval, isPlaying]);

  if (!ads || ads.length === 0) return null;

  const currentAd = ads[currentIndex];

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + ads.length) % ads.length);
    setIsAutoPlaying(false);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % ads.length);
    setIsAutoPlaying(false);
  };

  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  const handlePlayVideo = () => {
    setIsPlaying(true);
    setIsAutoPlaying(false);
  };

  const handleCloseVideo = () => {
    setIsPlaying(false);
  };

  const handleCTAClick = () => {
    if (currentAd.cta_url) {
      window.open(currentAd.cta_url, '_blank');
    }
  };

  const toggleAutoPlay = () => {
    setIsAutoPlaying(!isAutoPlaying);
  };

  return (
    <div className="relative mb-8 rounded-xl overflow-hidden shadow-2xl border border-primary/20 bg-gradient-to-br from-card/90 to-background/50 backdrop-blur-sm">
      {/* YouTube-style Ad Label */}
      <div className="flex items-center justify-between px-4 py-2 bg-gradient-to-r from-yellow-400/20 to-orange-500/20 backdrop-blur-sm border-b border-yellow-400/30">
        <div className="flex items-center">
          <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs px-3 py-1 rounded-sm font-bold mr-3 shadow-lg">
            AD
          </span>
          <span className="text-xs text-gray-300 font-medium">
            {currentIndex + 1} of {ads.length}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          {showControls && (
            <Button
              onClick={toggleAutoPlay}
              variant="ghost"
              size="sm"
              className="text-xs text-gray-400 hover:text-white"
            >
              {isAutoPlaying ? <Pause size={12} /> : <Play size={12} />}
              {isAutoPlaying ? 'Pause' : 'Auto'}
            </Button>
          )}
          <div className="text-xs text-gray-400">Sponsored</div>
        </div>
      </div>

      {/* Ad Content */}
      <div className="bg-gradient-to-br from-card/80 to-background/60 backdrop-blur-sm">
        {isPlaying && currentAd.video_url ? (
          <div className="relative w-full h-64">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleCloseVideo} 
              className="absolute top-3 right-3 z-10 bg-black/70 text-white hover:bg-black/90 rounded-full backdrop-blur-sm"
            >
              <X size={18} />
            </Button>
            <VideoPlayer 
              videoUrl={currentAd.video_url} 
              contentId={currentAd.id} 
              thumbnail={currentAd.thumbnail_url}
              onClose={handleCloseVideo}
            />
          </div>
        ) : (
          <>
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10"></div>
              <img 
                src={currentAd.thumbnail_url || "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5"} 
                alt={currentAd.title}
                className="w-full h-64 object-cover transition-all duration-500"
              />
              
              {/* Navigation Controls */}
              {ads.length > 1 && showControls && (
                <>
                  <button
                    onClick={handlePrevious}
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center transition-all duration-200"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={handleNext}
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center transition-all duration-200"
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}
              
              {/* Play Button */}
              {currentAd.video_url && (
                <div className="absolute inset-0 flex items-center justify-center z-20">
                  <Button 
                    onClick={handlePlayVideo}
                    variant="ghost" 
                    size="icon" 
                    className="rounded-full bg-primary/90 hover:bg-primary text-white h-16 w-16 transition-all duration-300 hover:scale-110 shadow-xl backdrop-blur-sm"
                  >
                    <Play size={28} fill="white" />
                  </Button>
                </div>
              )}
              
              {/* Content Overlay */}
              <div className="absolute bottom-0 left-0 right-0 z-20 p-6">
                <h3 className="text-xl font-bold text-white mb-2 drop-shadow-lg">{currentAd.title}</h3>
                {currentAd.description && (
                  <p className="text-sm text-gray-200 line-clamp-2 drop-shadow-md">
                    {currentAd.description}
                  </p>
                )}
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="p-6">
              <div className="flex flex-wrap gap-3 mb-4">
                {currentAd.video_url && (
                  <Button 
                    onClick={handlePlayVideo} 
                    className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white font-semibold px-6 py-2 rounded-lg shadow-lg transition-all duration-200 hover:scale-105"
                  >
                    <Play size={16} className="mr-2" fill="white" /> 
                    Watch Ad
                  </Button>
                )}
                
                {currentAd.cta_text && (
                  <Button 
                    onClick={handleCTAClick} 
                    variant="outline" 
                    className="border-2 border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/10 hover:border-yellow-400 font-semibold px-6 py-2 rounded-lg backdrop-blur-sm transition-all duration-200 hover:scale-105"
                  >
                    <ExternalLink size={16} className="mr-2" /> 
                    {currentAd.cta_text}
                  </Button>
                )}
              </div>

              {/* Pagination Dots */}
              {ads.length > 1 && (
                <div className="flex items-center justify-center space-x-2">
                  {ads.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => handleDotClick(index)}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        index === currentIndex 
                          ? 'bg-primary w-6' 
                          : 'bg-gray-600 hover:bg-gray-500'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Progress Bar */}
      {isAutoPlaying && ads.length > 1 && !isPlaying && (
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-800">
          <div 
            className="h-full bg-primary transition-all duration-100 ease-linear progress-bar"
            style={{
              animationDuration: `${autoSlideInterval}ms`
            }}
          />
        </div>
      )}

      <style>
        {`
          @keyframes progress {
            from { width: 0% }
            to { width: 100% }
          }
          .progress-bar {
            animation: progress linear infinite;
          }
        `}
      </style>
    </div>
  );
};

export default AutoSlideAdBanner;
