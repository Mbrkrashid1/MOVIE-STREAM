
import { useState, useEffect } from "react";
import { Play, Info, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

interface HeroSectionProps {
  featuredItems: Array<{
    id: string;
    title: string;
    backgroundImage: string;
    type: string;
  }>;
}

const HeroSection = ({ featuredItems }: HeroSectionProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-advance slides
  useEffect(() => {
    if (featuredItems.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % featuredItems.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [featuredItems.length]);

  if (!featuredItems || featuredItems.length === 0) return null;

  const currentItem = featuredItems[currentIndex];

  return (
    <div className="relative h-[50vh] overflow-hidden rounded-b-2xl mb-6">
      {/* Background Image with Gradient Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000"
        style={{ 
          backgroundImage: `url(${currentItem.backgroundImage})`,
        }}
      />
      
      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
      
      {/* Content */}
      <div className="relative h-full flex items-end p-6">
        <div className="max-w-sm">
          <h1 className="text-2xl font-bold text-white mb-3 leading-tight">
            {currentItem.title}
          </h1>
          
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-primary text-white px-3 py-1 rounded-full text-xs font-medium uppercase">
              {currentItem.type}
            </span>
            <span className="text-gray-300 text-sm">2024</span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <Link to={`/${currentItem.type}/${currentItem.id}`}>
              <button className="bg-primary text-white px-6 py-2 rounded-full flex items-center gap-2 font-medium hover:bg-primary/90 transition-colors">
                <Play size={16} fill="white" />
                Watch Now
              </button>
            </Link>
            
            <button className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full flex items-center gap-2 font-medium hover:bg-white/30 transition-colors">
              <Info size={16} />
              Info
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      {featuredItems.length > 1 && (
        <>
          <button
            onClick={() => setCurrentIndex((prev) => (prev - 1 + featuredItems.length) % featuredItems.length)}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-black/30 hover:bg-black/60 text-white rounded-full flex items-center justify-center transition-all duration-200 backdrop-blur-sm"
          >
            <ChevronLeft size={20} />
          </button>
          
          <button
            onClick={() => setCurrentIndex((prev) => (prev + 1) % featuredItems.length)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-black/30 hover:bg-black/60 text-white rounded-full flex items-center justify-center transition-all duration-200 backdrop-blur-sm"
          >
            <ChevronRight size={20} />
          </button>
        </>
      )}

      {/* Pagination Dots */}
      {featuredItems.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {featuredItems.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'bg-primary w-6' 
                  : 'bg-white/30 hover:bg-white/50'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default HeroSection;
