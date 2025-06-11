
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Play, X, Info, ExternalLink, Clock, Eye, Heart } from "lucide-react";
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
    duration?: number;
  };
}

const VideoAdBanner = ({ ad }: VideoAdBannerProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

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

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="mb-8 rounded-xl overflow-hidden shadow-2xl border border-primary/20 bg-gradient-to-br from-card/90 to-background/50 backdrop-blur-sm">
      {/* Ad label with HausaBox branding */}
      <div className="flex items-center justify-between px-4 py-2 bg-gradient-to-r from-primary/20 to-primary/10 backdrop-blur-sm border-b border-primary/20">
        <div className="flex items-center">
          <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs px-3 py-1 rounded-full font-bold mr-3 shadow-lg">
            SPONSORED
          </span>
          <span className="text-xs text-gray-300 font-medium">
            Powered by HausaBox
          </span>
        </div>
        <div className="flex items-center space-x-2 text-xs text-gray-400">
          <Eye size={12} />
          <span>Premium Content</span>
        </div>
      </div>

      {/* Ad content */}
      <div className="bg-gradient-to-br from-card/80 to-background/60 backdrop-blur-sm">
        {isPlaying ? (
          <div className="relative w-full h-64">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleCloseVideo} 
              className="absolute top-3 right-3 z-10 bg-black/70 text-white hover:bg-black/90 rounded-full backdrop-blur-sm"
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
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10"></div>
              <img 
                src={ad.thumbnail_url || "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5"} 
                alt={ad.title}
                className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
              />
              
              {/* Duration badge */}
              {ad.duration && (
                <div className="absolute top-3 right-3 z-20 bg-black/70 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
                  <Clock size={12} className="inline mr-1" />
                  {formatDuration(ad.duration)}
                </div>
              )}
              
              {/* Play button with enhanced styling */}
              <div className="absolute inset-0 flex items-center justify-center z-20">
                <Button 
                  onClick={handlePlayVideo}
                  variant="ghost" 
                  size="icon" 
                  className="rounded-full bg-primary/90 hover:bg-primary text-white h-16 w-16 transition-all duration-300 hover:scale-110 shadow-xl backdrop-blur-sm group-hover:bg-primary"
                >
                  <Play size={28} fill="white" />
                </Button>
              </div>
              
              {/* Content overlay */}
              <div className="absolute bottom-0 left-0 right-0 z-20 p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2 drop-shadow-lg">{ad.title}</h3>
                    {ad.description && (
                      <p className="text-sm text-gray-200 line-clamp-2 drop-shadow-md">
                        {ad.description}
                      </p>
                    )}
                  </div>
                  <Button
                    onClick={handleLike}
                    variant="ghost"
                    size="icon"
                    className={`ml-3 rounded-full backdrop-blur-sm transition-all duration-200 ${
                      isLiked 
                        ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' 
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    <Heart size={20} fill={isLiked ? 'currentColor' : 'none'} />
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex flex-wrap gap-3">
                <Button 
                  onClick={handlePlayVideo} 
                  className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white font-semibold px-6 py-2 rounded-lg shadow-lg transition-all duration-200 hover:scale-105"
                >
                  <Play size={16} className="mr-2" fill="white" /> 
                  Watch Now
                </Button>
                
                {ad.cta_text && (
                  <Button 
                    onClick={handleCTAClick} 
                    variant="outline" 
                    className="border-2 border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/10 hover:border-yellow-400 font-semibold px-6 py-2 rounded-lg backdrop-blur-sm transition-all duration-200 hover:scale-105"
                  >
                    <ExternalLink size={16} className="mr-2" /> 
                    {ad.cta_text}
                  </Button>
                )}
                
                {ad.description && ad.description.length > 100 && (
                  <Button 
                    onClick={handleToggleExpand} 
                    variant="ghost"
                    className="text-gray-300 hover:text-white hover:bg-white/10 rounded-lg backdrop-blur-sm transition-all duration-200"
                  >
                    <Info size={16} className="mr-2" /> 
                    {isExpanded ? 'Show Less' : 'More Info'}
                  </Button>
                )}
              </div>
              
              {isExpanded && ad.description && (
                <div className="mt-4 p-4 bg-background/30 rounded-lg backdrop-blur-sm border border-border/30">
                  <p className="text-sm text-gray-300 leading-relaxed">
                    {ad.description}
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default VideoAdBanner;
