
import { useState } from "react";
import { Link } from "react-router-dom";
import { Play } from "lucide-react";

interface FeaturedItem {
  id: string;
  title: string;
  backgroundImage: string;
  type: string; // Changed from 'movie' | 'series' to string to be more flexible
}

interface FeaturedSliderProps {
  items: FeaturedItem[];
}

const FeaturedSlider = ({ items }: FeaturedSliderProps) => {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!items.length) return null;

  const currentItem = items[activeIndex];

  return (
    <div className="relative h-[200px] w-full">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${currentItem.backgroundImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
      </div>
      
      <div className="absolute bottom-0 left-0 w-full p-4 text-white z-10">
        <h1 className="text-xl font-semibold mb-2">{currentItem.title}</h1>
        <Link 
          to={`/${currentItem.type}/${currentItem.id}`}
          className="flex items-center justify-center w-10 h-10 bg-white rounded-full text-black"
        >
          <Play size={20} fill="black" />
        </Link>
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
