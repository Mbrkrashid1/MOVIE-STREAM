
import { useState, useEffect } from "react";
import { Play, Info, Plus, Star, Calendar, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface HeroItem {
  id: string;
  title: string;
  description?: string;
  backgroundImage: string;
  type: string;
  rating?: number;
  year?: number;
  duration?: string;
  genre?: string;
}

interface MovieBoxHeroProps {
  items: HeroItem[];
}

const MovieBoxHero = ({ items }: MovieBoxHeroProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(true);

  useEffect(() => {
    if (!isAutoplay || !items.length) return;
    
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % items.length);
    }, 6000);
    
    return () => clearInterval(interval);
  }, [isAutoplay, items.length]);

  if (!items.length) return null;

  const currentItem = items[activeIndex];

  return (
    <div className="relative h-[70vh] min-h-[500px] w-full overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out"
        style={{ 
          backgroundImage: `url(${currentItem.backgroundImage})`,
          filter: 'brightness(0.7)'
        }}
      />
      
      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
      
      {/* Content */}
      <div className="relative h-full flex items-center">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="max-w-2xl">
            {/* Title */}
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              {currentItem.title}
            </h1>
            
            {/* Meta Info */}
            <div className="flex items-center gap-4 mb-6">
              {currentItem.rating && (
                <div className="flex items-center gap-1 text-yellow-400">
                  <Star size={20} fill="currentColor" />
                  <span className="text-white font-medium">{currentItem.rating.toFixed(1)}</span>
                </div>
              )}
              {currentItem.year && (
                <div className="flex items-center gap-1 text-white">
                  <Calendar size={18} />
                  <span>{currentItem.year}</span>
                </div>
              )}
              {currentItem.duration && (
                <div className="flex items-center gap-1 text-white">
                  <Clock size={18} />
                  <span>{currentItem.duration}</span>
                </div>
              )}
              <span className="bg-primary text-white px-3 py-1 rounded-full text-sm font-medium uppercase">
                {currentItem.type}
              </span>
            </div>

            {/* Description */}
            {currentItem.description && (
              <p className="text-gray-200 text-lg mb-8 line-clamp-3 leading-relaxed">
                {currentItem.description}
              </p>
            )}

            {/* Action Buttons */}
            <div className="flex items-center gap-4">
              <Link to={`/${currentItem.type}/${currentItem.id}`}>
                <Button size="lg" className="moviebox-btn">
                  <Play size={20} className="mr-2" fill="currentColor" />
                  Watch Now
                </Button>
              </Link>
              
              <Button size="lg" variant="outline" className="moviebox-btn-outline">
                <Info size={20} className="mr-2" />
                More Info
              </Button>
              
              <Button size="lg" variant="ghost" className="text-white hover:bg-white/20">
                <Plus size={20} className="mr-2" />
                My List
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {items.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setActiveIndex(index);
              setIsAutoplay(false);
            }}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === activeIndex 
                ? 'bg-primary w-8' 
                : 'bg-white/30 hover:bg-white/50'
            }`}
          />
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={() => setActiveIndex((prev) => (prev - 1 + items.length) % items.length)}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-black/30 hover:bg-black/60 text-white rounded-full flex items-center justify-center transition-all duration-200 backdrop-blur-sm"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      
      <button
        onClick={() => setActiveIndex((prev) => (prev + 1) % items.length)}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-black/30 hover:bg-black/60 text-white rounded-full flex items-center justify-center transition-all duration-200 backdrop-blur-sm"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
};

export default MovieBoxHero;
