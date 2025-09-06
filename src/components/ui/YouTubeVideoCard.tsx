import { Link } from "react-router-dom";
import { MoreVertical } from "lucide-react";
import { ContentItem } from "@/hooks/useContentData";

interface YouTubeVideoCardProps {
  video: ContentItem;
}

const YouTubeVideoCard = ({ video }: YouTubeVideoCardProps) => {
  return (
    <div className="flex flex-col gap-3 group">
      {/* Thumbnail */}
      <Link to={`/movie/${video.id}`} className="relative">
        <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-200">
          <img
            src={video.thumbnail || "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5"}
            alt={video.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5";
            }}
          />
          
          {/* Duration overlay */}
          <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1 py-0.5 rounded">
            {video.duration}
          </div>
        </div>
      </Link>

      {/* Video info */}
      <div className="flex gap-3">
        {/* Channel avatar */}
        <div className="flex-shrink-0">
          <div className="w-9 h-9 bg-gray-300 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-gray-600">
              {video.channelName.charAt(0).toUpperCase()}
            </span>
          </div>
        </div>

        {/* Title and metadata */}
        <div className="flex-1 min-w-0">
          <Link to={`/movie/${video.id}`}>
            <h3 className="text-gray-900 font-medium text-sm leading-5 line-clamp-2 mb-1 hover:text-gray-700">
              {video.title}
            </h3>
          </Link>
          
          <p className="text-gray-600 text-sm mb-1">{video.channelName}</p>
          
          <div className="flex items-center text-gray-600 text-sm">
            <span>{video.views} views</span>
            <span className="mx-1">•</span>
            <span>{video.timeAgo}</span>
          </div>
        </div>

        {/* More options */}
        <div className="flex-shrink-0">
          <button className="p-1 hover:bg-gray-100 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
            <MoreVertical className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default YouTubeVideoCard;