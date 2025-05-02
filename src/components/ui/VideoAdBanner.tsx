
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Play, X } from "lucide-react";
import VideoPlayer from "@/components/VideoPlayer";

interface VideoAdBannerProps {
  ad: {
    id: string;
    title: string;
    description?: string;
    thumbnail_url?: string;
    video_url: string;
  };
}

const VideoAdBanner = ({ ad }: VideoAdBannerProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handlePlayVideo = () => {
    setIsPlaying(true);
  };

  const handleCloseVideo = () => {
    setIsPlaying(false);
  };

  return (
    <div className="mb-6">
      {/* Ad label */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-gray-400 flex items-center">
          <span className="bg-yellow-500 text-black text-xs px-2 py-0.5 rounded mr-2">
            AD
          </span>
          Sponsored
        </span>
      </div>

      {/* Ad content */}
      <div className={`bg-gray-800 rounded-lg overflow-hidden transition-all duration-300 ${isExpanded ? 'h-auto' : 'h-auto'}`}>
        {isPlaying ? (
          <div className="relative w-full h-64">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleCloseVideo} 
              className="absolute top-2 right-2 z-10 bg-black/50 text-white hover:bg-black/70"
            >
              <X size={18} />
            </Button>
            <VideoPlayer 
              videoUrl={ad.video_url} 
              contentId={ad.id} 
              thumbnail={ad.thumbnail_url}
              onClose={handleCloseVideo}
            />
          </div>
        ) : (
          <>
            <div className="relative">
              <img 
                src={ad.thumbnail_url || "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5"} 
                alt={ad.title}
                className="w-full h-48 object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <Button 
                  onClick={handlePlayVideo}
                  variant="ghost" 
                  size="icon" 
                  className="rounded-full bg-black/50 text-white hover:bg-black/70 h-16 w-16"
                >
                  <Play size={32} />
                </Button>
              </div>
            </div>
            
            <div className="p-4">
              <h3 className="text-base font-semibold text-white mb-1">{ad.title}</h3>
              {ad.description && (
                <p className="text-sm text-gray-300 line-clamp-2 mb-3">{ad.description}</p>
              )}
              <div className="flex space-x-2">
                <Button 
                  onClick={handlePlayVideo} 
                  variant="default" 
                  className="bg-primary"
                >
                  <Play size={16} className="mr-1" /> Watch Now
                </Button>
                <Button 
                  onClick={handleToggleExpand} 
                  variant="outline"
                >
                  {isExpanded ? 'Show Less' : 'Learn More'}
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default VideoAdBanner;
