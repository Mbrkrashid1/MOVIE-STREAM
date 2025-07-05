
import { Link } from "react-router-dom";
import { ArrowLeft, Eye } from "lucide-react";

interface MovieHeroProps {
  movie: any;
  formatDuration: (seconds: number | null | undefined) => string;
}

export function MovieHero({ movie, formatDuration }: MovieHeroProps) {
  return (
    <div className="relative h-[50vh]">
      <img 
        src={movie.backdrop_url || movie.thumbnail_url || "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5"} 
        alt={movie.title} 
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent"></div>
      
      {/* Back button */}
      <Link 
        to="/" 
        className="absolute top-4 left-4 z-10 bg-black/60 p-2 rounded-full backdrop-blur-sm hover:bg-black/80 transition-colors"
      >
        <ArrowLeft size={20} className="text-white" />
      </Link>
      
      {/* Movie info overlay */}
      <div className="absolute bottom-0 left-0 w-full p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">{movie.title}</h1>
        
        {/* Enhanced metadata */}
        <div className="flex items-center flex-wrap gap-4 mb-4 text-sm">
          <div className="flex items-center bg-black/40 px-3 py-1 rounded-full backdrop-blur-sm">
            <Eye size={14} className="mr-1" />
            <span>{movie.views?.toLocaleString() || 0} views</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <span>{movie.release_year || "Unknown"}</span>
            <span>•</span>
            <span>{formatDuration(movie.duration)}</span>
          </div>
          
          <div className="text-sm">
            <span>{movie.category} • {movie.language || "Hausa"}</span>
          </div>
        </div>
        
        <div className="flex gap-3">
          <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm font-medium">
            {movie.type === 'movie' ? 'Movie' : 'Series'}
          </span>
          {movie.is_featured && (
            <span className="px-3 py-1 bg-accent/20 text-accent rounded-full text-sm font-medium">
              Featured
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
