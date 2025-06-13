
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ExternalLink, X, Eye, Heart } from "lucide-react";

interface ImageBannerAdProps {
  ad: {
    id: string;
    title: string;
    description?: string;
    thumbnail_url?: string;
    cta_text?: string;
    cta_url?: string;
  };
}

const ImageBannerAd = ({ ad }: ImageBannerAdProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [showFullscreen, setShowFullscreen] = useState(false);

  const handleCTAClick = () => {
    if (ad.cta_url) {
      window.open(ad.cta_url, '_blank');
    }
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  const openFullscreen = () => {
    setShowFullscreen(true);
  };

  const closeFullscreen = () => {
    setShowFullscreen(false);
  };

  return (
    <>
      {/* Main Banner */}
      <div className="relative rounded-xl overflow-hidden shadow-2xl border border-primary/20 bg-gradient-to-br from-card/90 to-background/50 backdrop-blur-sm group">
        {/* Ad Label */}
        <div className="absolute top-3 left-3 z-10 bg-gradient-to-r from-blue-400 to-blue-600 text-white text-xs px-3 py-1 rounded-full font-bold shadow-lg">
          FEATURED
        </div>

        {/* Engagement Metrics */}
        <div className="absolute top-3 right-3 z-10 flex items-center space-x-2">
          <div className="bg-black/70 text-white text-xs px-2 py-1 rounded backdrop-blur-sm flex items-center">
            <Eye size={12} className="mr-1" />
            {Math.floor(Math.random() * 10000) + 1000}
          </div>
        </div>

        {/* Image Container with Backdrop */}
        <div className="relative h-48 overflow-hidden cursor-pointer" onClick={openFullscreen}>
          {/* Backdrop/Background Image (Blurred) */}
          <div 
            className="absolute inset-0 bg-cover bg-center filter blur-sm scale-110"
            style={{
              backgroundImage: `url(${ad.thumbnail_url || "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5"})`
            }}
          />
          
          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40" />
          
          {/* Main Image (Centered) */}
          <div className="absolute inset-0 flex items-center justify-center">
            <img 
              src={ad.thumbnail_url || "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5"}
              alt={ad.title}
              className="max-h-full max-w-full object-contain shadow-2xl rounded-lg transition-transform duration-300 group-hover:scale-105"
            />
          </div>

          {/* Content Overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
            <div className="flex items-end justify-between">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-2 drop-shadow-lg">{ad.title}</h3>
                {ad.description && (
                  <p className="text-sm text-gray-200 line-clamp-2 drop-shadow-md">
                    {ad.description}
                  </p>
                )}
              </div>
              
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  handleLike();
                }}
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

        {/* Action Section */}
        <div className="p-4 bg-gradient-to-r from-card/80 to-background/60 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="flex space-x-3">
              {ad.cta_text && (
                <Button 
                  onClick={handleCTAClick}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold px-6 py-2 shadow-lg transition-all duration-200 hover:scale-105"
                >
                  <ExternalLink size={16} className="mr-2" />
                  {ad.cta_text}
                </Button>
              )}
              
              <Button 
                onClick={openFullscreen}
                variant="outline"
                className="border-2 border-primary/50 text-primary hover:bg-primary/10 hover:border-primary font-semibold px-6 py-2 backdrop-blur-sm transition-all duration-200 hover:scale-105"
              >
                View Full Size
              </Button>
            </div>
            
            <div className="text-xs text-gray-400">
              Sponsored Content
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Backdrop Modal */}
      {showFullscreen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative max-w-6xl max-h-full">
            {/* Close Button */}
            <Button
              onClick={closeFullscreen}
              variant="ghost"
              size="icon"
              className="absolute -top-12 right-0 text-white hover:bg-white/20 rounded-full"
            >
              <X size={24} />
            </Button>
            
            {/* Fullscreen Image */}
            <img 
              src={ad.thumbnail_url || "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5"}
              alt={ad.title}
              className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
            />
            
            {/* Bottom Info */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 rounded-b-lg">
              <h3 className="text-2xl font-bold text-white mb-2">{ad.title}</h3>
              {ad.description && (
                <p className="text-gray-200 mb-4">{ad.description}</p>
              )}
              {ad.cta_text && (
                <Button 
                  onClick={handleCTAClick}
                  className="bg-primary hover:bg-primary/90 text-white"
                >
                  <ExternalLink size={16} className="mr-2" />
                  {ad.cta_text}
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ImageBannerAd;
