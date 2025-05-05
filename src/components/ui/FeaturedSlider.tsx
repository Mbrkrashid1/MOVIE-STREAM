
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Play, ChevronLeft, ChevronRight } from "lucide-react";

interface FeaturedItem {
  id: string;
  title: string;
  backgroundImage: string;
  type: string;
}

interface FeaturedSliderProps {
  items: FeaturedItem[];
}

const FeaturedSlider = ({ items }: FeaturedSliderProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(true);

  useEffect(() => {
    if (!autoplay || !items.length) return;
    
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % items.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [autoplay, items.length]);

  if (!items.length) return null;

  const currentItem = items[activeIndex];
  
  const goToPrev = () => {
    setActiveIndex((prev) => (prev - 1 + items.length) % items.length);
  };
  
  const goToNext = () => {
    setActiveIndex((prev) => (prev + 1) % items.length);
  };

  return (
    <div className="relative h-[350px] w-full">
      <div 
        className="absolute inset-0 bg-cover bg-center transition-opacity duration-500"
        style={{ backgroundImage: `url(${currentItem.backgroundImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent"></div>
      </div>
      
      <div className="absolute bottom-0 left-0 w-full p-8 text-white z-10">
        <h1 className="text-3xl font-bold mb-3">{currentItem.title}</h1>
        <div className="flex items-center space-x-4 mb-6">
          <Link 
            to={`/${currentItem.type}/${currentItem.id}`}
            className="flex items-center justify-center px-6 py-3 bg-primary rounded-md text-white font-medium hover:bg-primary/90 transition-colors"
          >
            <Play size={20} className="mr-2" /> Watch Now
          </Link>
          <button 
            className="flex items-center justify-center px-6 py-3 bg-white/20 backdrop-blur-sm rounded-md text-white font-medium hover:bg-white/30 transition-colors"
            onClick={() => setAutoplay(!autoplay)}
          >
            {autoplay ? "Pause" : "Play"} Slideshow
          </button>
        </div>
      </div>

      {/* Navigation arrows */}
      <button 
        onClick={goToPrev} 
        className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center h-10 w-10 rounded-full bg-black/30 text-white z-10 hover:bg-black/50 transition-colors"
        aria-label="Previous slide"
      >
        <ChevronLeft size={24} />
      </button>
      <button 
        onClick={goToNext} 
        className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center justify-center h-10 w-10 rounded-full bg-black/30 text-white z-10 hover:bg-black/50 transition-colors"
        aria-label="Next slide"
      >
        <ChevronRight size={24} />
      </button>

      {/* Pagination dots */}
      <div className="absolute bottom-4 right-4 flex space-x-1 z-10">
        {items.map((_, index) => (
          <button 
            key={index}
            onClick={() => setActiveIndex(index)}
            className={`h-1 rounded-full transition-all ${
              index === activeIndex ? 'w-8 bg-primary' : 'w-2 bg-gray-600'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default FeaturedSlider;
