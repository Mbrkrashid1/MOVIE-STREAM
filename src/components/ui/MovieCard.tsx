
import { Link } from "react-router-dom";

export interface MovieProps {
  id: string;
  title: string;
  thumbnail: string;
  episodeCount?: number;
  progress?: number;
  type: 'movie' | 'series';
  year?: number;
  category?: string;
}

const MovieCard = ({ id, title, thumbnail, episodeCount, progress, type }: MovieProps) => {
  return (
    <Link to={`/${type}/${id}`} className="movie-card block">
      <div className="aspect-[2/3] relative">
        <img 
          src={thumbnail} 
          alt={title} 
          className="w-full h-full object-cover rounded-lg"
        />
        {progress && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/40">
            <div 
              className="h-full bg-kannyflix-gold" 
              style={{width: `${progress}%`}}
            ></div>
          </div>
        )}
        {episodeCount && (
          <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
            Total {episodeCount} Episode(s)
          </div>
        )}
      </div>
      <h3 className="mt-2 text-sm font-medium text-gray-200 line-clamp-2">{title}</h3>
    </Link>
  );
};

export default MovieCard;
