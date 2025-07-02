
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";

interface BannerAd {
  id: string;
  title: string;
  description?: string;
  image_url: string;
  cta_text?: string;
  cta_url?: string;
  background_color?: string;
}

interface BannerAdSpaceProps {
  ads: BannerAd[];
  autoSlideInterval?: number;
  showNavigation?: boolean;
  className?: string;
}

const BannerAdSpace = ({ 
  ads, 
  autoSlideInterval = 8000,
  showNavigation = true,
  className = ""
}: BannerAdSpaceProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  // Auto-slide functionality - Fixed to always auto-scroll
  useEffect(() => {
    if (ads.length > 1 && autoSlideInterval > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % ads.length);
      }, autoSlideInterval);

      return () => clearInterval(interval);
    }
  }, [ads.length, autoSlideInterval]);

  if (!ads.length || !isVisible) return null;

  const currentAd = ads[currentIndex];

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + ads.length) % ads.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % ads.length);
  };

  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
  };

  const handleCTAClick = () => {
    if (currentAd.cta_url) {
      window.open(currentAd.cta_url, '_blank');
    }
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  return (
    <div className={`relative w-full rounded-lg overflow-hidden shadow-lg border border-primary/10 bg-gradient-to-r ${
      currentAd.background_color || 'from-card/90 to-background/50'
    } backdrop-blur-sm ${className}`}>
      {/* Close Button */}
      <Button
        onClick={handleClose}
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 z-20 bg-black/50 hover:bg-black/70 text-white rounded-full h-6 w-6 backdrop-blur-sm"
      >
        <X size={12} />
      </Button>

      {/* Ad Label */}
      <div className="absolute top-2 left-2 z-20 bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs px-2 py-0.5 rounded-full font-bold">
        SPONSORED
      </div>

      {/* Main Content */}
      <div className="relative flex items-center min-h-[120px] p-4">
        {/* Navigation Arrows */}
        {showNavigation && ads.length > 1 && (
          <>
            <button
              onClick={handlePrevious}
              className="absolute left-2 z-10 w-8 h-8 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center transition-all duration-200"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-2 z-10 w-8 h-8 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center transition-all duration-200"
            >
              <ChevronRight size={16} />
            </button>
          </>
        )}

        {/* Image */}
        <div className="flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden mr-4">
          <img 
            src={currentAd.image_url || "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5"} 
            alt={currentAd.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-bold text-base sm:text-lg mb-1 line-clamp-1">
            {currentAd.title}
          </h3>
          {currentAd.description && (
            <p className="text-gray-300 text-xs sm:text-sm mb-3 line-clamp-2">
              {currentAd.description}
            </p>
          )}
          
          {/* CTA Button */}
          {currentAd.cta_text && (
            <Button 
              onClick={handleCTAClick}
              size="sm"
              className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white font-medium px-4 py-1.5 text-xs sm:text-sm"
            >
              <ExternalLink size={12} className="mr-1.5" />
              {currentAd.cta_text}
            </Button>
          )}
        </div>
      </div>

      {/* Pagination Dots */}
      {ads.length > 1 && (
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1.5">
          {ads.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'bg-primary w-4' 
                  : 'bg-gray-500 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>
      )}

      {/* Progress Bar - Always show for auto-scrolling */}
      {ads.length > 1 && autoSlideInterval > 0 && (
        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-800">
          <div 
            className="h-full bg-primary transition-all duration-100 ease-linear animate-progress"
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
          .animate-progress {
            animation: progress linear infinite;
          }
        `}
      </style>
    </div>
  );
};

export default BannerAdSpace;
