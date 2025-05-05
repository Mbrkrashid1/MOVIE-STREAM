
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Play, X, Info, ExternalLink } from "lucide-react";
import VideoPlayer from "@/components/VideoPlayer";

interface VideoAdBannerProps {
  ad: {
    id: string;
    title: string;
    description?: string;
    thumbnail_url?: string;
    video_url: string;
    cta_text?: string;
    cta_url?: string;
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

  const handleCTAClick = () => {
    if (ad.cta_url) {
      window.open(ad.cta_url, '_blank');
    }
  };

  return (
    <div className="mb-8 rounded-lg overflow-hidden shadow-lg border border-gray-800">
      {/* Ad label */}
      <div className="flex items-center justify-between px-3 py-1 bg-gray-900">
        <span className="text-xs text-gray-300 flex items-center">
          <span className="bg-yellow-500 text-black text-xs px-2 py-0.5 rounded mr-2">
            AD
          </span>
          Sponsored Content
        </span>
      </div>

      {/* Ad content */}
      <div className={`bg-gray-800 transition-all duration-300 ${isExpanded ? 'h-auto' : 'h-auto'}`}>
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
                className="w-full h-56 object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                <Button 
                  onClick={handlePlayVideo}
                  variant="ghost" 
                  size="icon" 
                  className="rounded-full bg-primary hover:bg-primary/90 text-white h-16 w-16 transition-transform hover:scale-110"
                >
                  <Play size={36} />
                </Button>
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent py-6 px-4">
                <h3 className="text-xl font-bold text-white">{ad.title}</h3>
              </div>
            </div>
            
            <div className="p-4">
              {ad.description && (
                <p className={`text-sm text-gray-300 mb-3 ${isExpanded ? '' : 'line-clamp-2'}`}>
                  {ad.description}
                </p>
              )}
              <div className="flex flex-wrap gap-2">
                <Button 
                  onClick={handlePlayVideo} 
                  variant="default" 
                  className="bg-primary hover:bg-primary/90"
                >
                  <Play size={16} className="mr-1" /> Watch Now
                </Button>
                {ad.cta_text && (
                  <Button 
                    onClick={handleCTAClick} 
                    variant="outline" 
                    className="border-yellow-500 text-yellow-500 hover:bg-yellow-500/10"
                  >
                    <ExternalLink size={16} className="mr-1" /> {ad.cta_text}
                  </Button>
                )}
                {ad.description && ad.description.length > 100 && (
                  <Button 
                    onClick={handleToggleExpand} 
                    variant="ghost"
                    className="text-gray-300"
                  >
                    <Info size={16} className="mr-1" /> {isExpanded ? 'Show Less' : 'More Info'}
                  </Button>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default VideoAdBanner;
