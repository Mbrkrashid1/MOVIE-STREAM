
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import MovieBoxCard, { MovieBoxCardProps } from "./MovieBoxCard";

interface MovieBoxRowProps {
  title: string;
  viewAllLink?: string;
  movies: MovieBoxCardProps[];
  priority?: boolean;
}

const MovieBoxRow = ({ title, viewAllLink, movies, priority = false }: MovieBoxRowProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  if (!movies.length) return null;

  const checkScrollButtons = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    setCanScrollLeft(container.scrollLeft > 0);
    setCanScrollRight(
      container.scrollLeft < container.scrollWidth - container.clientWidth - 10
    );
  };

  const scroll = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollAmount = container.clientWidth * 0.7;
    const newScrollLeft = direction === 'left' 
      ? container.scrollLeft - scrollAmount
      : container.scrollLeft + scrollAmount;

    container.scrollTo({
      left: newScrollLeft,
      behavior: 'smooth'
    });

    setTimeout(checkScrollButtons, 300);
  };

  return (
    <div className="relative group mb-8">
      {/* Compact Header */}
      <div className="flex justify-between items-center px-4 mb-4">
        <h2 className="text-lg font-bold text-foreground flex items-center">
          {title}
          {priority && (
            <span className="ml-2 text-primary text-sm">🔥</span>
          )}
        </h2>
        {viewAllLink && (
          <Link 
            to={viewAllLink} 
            className="text-primary hover:text-primary/80 text-sm font-medium flex items-center group"
          >
            <span className="mr-1">View All</span> 
            <ChevronRight size={14} className="transition-transform group-hover:translate-x-1" />
          </Link>
        )}
      </div>

      {/* Content Container */}
      <div className="relative">
        {/* Left Scroll Button */}
        {canScrollLeft && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-1 top-1/2 transform -translate-y-1/2 z-10 w-10 h-10 bg-black/80 hover:bg-black/90 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm shadow-lg"
          >
            <ChevronLeft size={20} />
          </button>
        )}

        {/* Right Scroll Button */}
        {canScrollRight && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 z-10 w-10 h-10 bg-black/80 hover:bg-black/90 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm shadow-lg"
          >
            <ChevronRight size={20} />
          </button>
        )}

        {/* Movies Grid - Smaller Cards */}
        <div
          ref={scrollContainerRef}
          className="overflow-x-auto scrollbar-none pb-2"
          onScroll={checkScrollButtons}
        >
          <div className="flex space-x-3 px-4">
            {movies.map((movie) => (
              <div key={movie.id} className="min-w-[140px] w-[140px] lg:min-w-[160px] lg:w-[160px]">
                <MovieBoxCard {...movie} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieBoxRow;
