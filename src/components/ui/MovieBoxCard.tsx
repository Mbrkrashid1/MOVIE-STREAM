
import { useState } from "react";
import { Play, Plus, Star, Calendar, Clock } from "lucide-react";
import { Link } from "react-router-dom";

export interface MovieBoxCardProps {
  id: string;
  title: string;
  thumbnail: string;
  type: "movie" | "series";
  rating?: number;
  year?: number;
  duration?: string;
  genre?: string;
  isNew?: boolean;
}

const MovieBoxCard = ({ 
  id, 
  title, 
  thumbnail, 
  type, 
  rating = 0, 
  year, 
  duration, 
  genre,
  isNew = false 
}: MovieBoxCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <Link to={`/${type}/${id}`} className="group block">
      <div className="relative bg-card rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl border border-border/50 hover:border-primary/30">
        {/* New Badge */}
        {isNew && (
          <div className="absolute top-3 left-3 z-10 bg-primary text-white text-xs px-2 py-1 rounded-full font-medium">
            NEW
          </div>
        )}

        {/* Image Container */}
        <div className="relative aspect-[2/3] overflow-hidden">
          {!imageLoaded && !imageError && (
            <div className="absolute inset-0 bg-muted animate-pulse flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          )}
          
          <img
            src={imageError ? "https://images.unsplash.com/photo-1489599507557-6b9b2b1e8e8f" : thumbnail}
            alt={title}
            className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-110 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
            onError={() => {
              setImageError(true);
              setImageLoaded(true);
            }}
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Play Button */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
            <div className="bg-primary text-white rounded-full p-4 transform scale-75 group-hover:scale-100 transition-transform duration-300 shadow-2xl">
              <Play size={24} fill="currentColor" />
            </div>
          </div>

          {/* Quick Actions */}
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button className="bg-black/60 backdrop-blur-sm text-white rounded-full p-2 hover:bg-primary transition-colors">
              <Plus size={16} />
            </button>
          </div>
        </div>

        {/* Content Info */}
        <div className="p-4">
          <h3 className="font-semibold text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors">
            {title}
          </h3>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            {rating > 0 && (
              <div className="flex items-center gap-1">
                <Star size={12} className="fill-yellow-400 text-yellow-400" />
                <span>{rating.toFixed(1)}</span>
              </div>
            )}
            {year && (
              <div className="flex items-center gap-1">
                <Calendar size={12} />
                <span>{year}</span>
              </div>
            )}
            {duration && (
              <div className="flex items-center gap-1">
                <Clock size={12} />
                <span>{duration}</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium uppercase">
              {type}
            </span>
            {genre && (
              <span className="text-xs text-muted-foreground">
                {genre}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MovieBoxCard;
