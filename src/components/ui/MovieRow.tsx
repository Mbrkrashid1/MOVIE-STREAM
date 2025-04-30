
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import MovieCard, { MovieProps } from "./MovieCard";

interface MovieRowProps {
  title: string;
  viewAllLink?: string;
  movies: MovieProps[];
}

const MovieRow = ({ title, viewAllLink, movies }: MovieRowProps) => {
  if (!movies.length) return null;

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center px-4 mb-4">
        <h2 className="text-xl font-bold text-white flex items-center">
          {title}
          {title.toLowerCase().includes("top") && (
            <span className="ml-2 text-kannyflix-gold">🔥</span>
          )}
        </h2>
        {viewAllLink && (
          <Link to={viewAllLink} className="flex items-center text-gray-400 text-sm">
            <span className="mr-1">More</span> 
            <ChevronRight size={16} />
          </Link>
        )}
      </div>
      <div className="overflow-x-auto scrollbar-none pb-4">
        <div className="flex space-x-4 px-4">
          {movies.map((movie) => (
            <div key={movie.id} className="min-w-[140px] w-[140px]">
              <MovieCard {...movie} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MovieRow;
