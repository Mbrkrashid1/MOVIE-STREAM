
import { Link } from "react-router-dom";

export interface VideoCardProps {
  id: string;
  title: string;
  thumbnail: string;
  channelName?: string;
  views?: string;
  timeAgo?: string;
  duration?: string;
  type: 'movie' | 'series';
}

const VideoCard = ({ id, title, thumbnail, channelName, views, timeAgo, duration, type }: VideoCardProps) => {
  return (
    <Link to={`/${type}/${id}`} className="block mb-4">
      <div className="w-full">
        {/* Thumbnail with duration */}
        <div className="relative aspect-video w-full">
          <img 
            src={thumbnail} 
            alt={title} 
            className="w-full h-full object-cover rounded-lg"
          />
          {duration && (
            <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1 py-0.5 rounded">
              {duration}
            </div>
          )}
        </div>
        
        {/* Video info row */}
        <div className="flex mt-2">
          {/* Channel avatar */}
          <div className="mr-3">
            <div className="w-9 h-9 rounded-full bg-gray-700 flex items-center justify-center text-white">
              {channelName ? channelName.charAt(0) : 'K'}
            </div>
          </div>
          
          {/* Video details */}
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-white line-clamp-2">{title}</h3>
            <div className="text-xs text-gray-400 mt-1">
              <span>{channelName || 'KannyFlix'}</span>
              {views && (
                <>
                  <span className="px-1">•</span>
                  <span>{views} views</span>
                </>
              )}
              {timeAgo && (
                <>
                  <span className="px-1">•</span>
                  <span>{timeAgo}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default VideoCard;
