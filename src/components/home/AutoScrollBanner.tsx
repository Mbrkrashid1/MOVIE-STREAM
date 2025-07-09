
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";

interface Banner {
  id: string;
  title: string;
  description?: string;
  image_url: string;
  cta_text?: string;
  cta_url?: string;
  background_color?: string;
}

interface AutoScrollBannerProps {
  banners: Banner[];
  autoScrollInterval?: number;
}

const AutoScrollBanner = ({ banners, autoScrollInterval = 5000 }: AutoScrollBannerProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  if (!banners.length) return null;

  const currentBanner = banners[currentIndex];

  useEffect(() => {
    if (!isHovered) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % banners.length);
      }, autoScrollInterval);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [banners.length, autoScrollInterval, isHovered]);

  const goToNext = () => {
    setCurrentIndex(prev => (prev + 1) % banners.length);
  };

  const goToPrevious = () => {
    setCurrentIndex(prev => (prev - 1 + banners.length) % banners.length);
  };

  const handleCTAClick = () => {
    if (currentBanner.cta_url) {
      window.open(currentBanner.cta_url, '_blank');
    }
  };

  return (
    <div 
      className="relative w-full h-48 rounded-xl overflow-hidden shadow-lg mb-6"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-all duration-500"
        style={{ 
          backgroundImage: `url(${currentBanner.image_url})`,
          backgroundColor: currentBanner.background_color || '#1a1a1a'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative h-full flex items-center justify-between p-6">
        <div className="flex-1 max-w-2xl">
          <h3 className="text-2xl font-bold text-white mb-2 drop-shadow-lg">
            {currentBanner.title}
          </h3>
          {currentBanner.description && (
            <p className="text-gray-200 text-sm mb-4 line-clamp-2 drop-shadow-md">
              {currentBanner.description}
            </p>
          )}
          {currentBanner.cta_text && (
            <Button 
              onClick={handleCTAClick}
              className="bg-primary hover:bg-primary/90 text-white font-semibold px-6 py-2 rounded-lg shadow-lg transition-all duration-200 hover:scale-105"
            >
              <ExternalLink size={16} className="mr-2" />
              {currentBanner.cta_text}
            </Button>
          )}
        </div>

        {/* Navigation Arrows */}
        {banners.length > 1 && (
          <div className="flex items-center gap-2">
            <Button
              onClick={goToPrevious}
              variant="ghost"
              size="icon"
              className="bg-black/30 hover:bg-black/50 text-white rounded-full backdrop-blur-sm"
            >
              <ChevronLeft size={20} />
            </Button>
            <Button
              onClick={goToNext}
              variant="ghost"
              size="icon"
              className="bg-black/30 hover:bg-black/50 text-white rounded-full backdrop-blur-sm"
            >
              <ChevronRight size={20} />
            </Button>
          </div>
        )}
      </div>

      {/* Progress Indicator */}
      {banners.length > 1 && !isHovered && (
        <div className="absolute bottom-4 left-6 right-6">
          <div className="flex gap-2">
            {banners.map((_, index) => (
              <div
                key={index}
                className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                  index === currentIndex ? 'bg-primary' : 'bg-white/30'
                }`}
              >
                {index === currentIndex && (
                  <div 
                    className="h-full bg-primary rounded-full animate-pulse"
                    style={{
                      animation: `bannerProgress ${autoScrollInterval}ms linear infinite`
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Dots Navigation */}
      {banners.length > 1 && (
        <div className="absolute top-4 right-4 flex gap-2">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                index === currentIndex 
                  ? 'bg-primary scale-125' 
                  : 'bg-white/50 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AutoScrollBanner;
