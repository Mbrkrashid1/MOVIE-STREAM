
import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Clock } from "lucide-react";

interface FeaturedItem {
  id: string;
  title: string;
  backgroundImage: string;
  type: 'movie' | 'series';
}

interface FeaturedSliderProps {
  items: FeaturedItem[];
}

const FeaturedSlider = ({ items }: FeaturedSliderProps) => {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!items.length) return null;

  const currentItem = items[activeIndex];

  return (
    <div className="relative h-[50vh] min-h-[400px] w-full">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${currentItem.backgroundImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-kannyflix-background via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-kannyflix-background/90 via-transparent to-transparent"></div>
      </div>
      
      <div className="absolute bottom-0 left-0 w-full p-6 text-white z-10">
        <h1 className="text-4xl font-bold mb-2">{currentItem.title}</h1>
        <div className="flex items-center space-x-6 mt-6">
          <Link 
            to={`/${currentItem.type}/${currentItem.id}`}
            className="flex items-center justify-center px-6 py-2 bg-kannyflix-green rounded-md text-white font-medium"
          >
            Watch Now
          </Link>
          <Link 
            to={`/${currentItem.type}/${currentItem.id}`}
            className="flex items-center justify-center px-6 py-2 bg-gray-800/80 rounded-md text-white"
          >
            + My List
          </Link>
        </div>
      </div>

      {/* Pagination dots */}
      <div className="absolute bottom-4 right-4 flex space-x-1 z-10">
        {items.map((_, index) => (
          <button 
            key={index}
            onClick={() => setActiveIndex(index)}
            className={`h-1 rounded-full ${
              index === activeIndex ? 'w-6 bg-white' : 'w-2 bg-gray-600'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default FeaturedSlider;
