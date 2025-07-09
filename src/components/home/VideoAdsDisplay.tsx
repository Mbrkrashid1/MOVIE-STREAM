
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Play, Download, X } from "lucide-react";

interface VideoAd {
  id: string;
  title: string;
  description?: string;
  video_url: string;
  thumbnail_url?: string;
  cta_text?: string;
  cta_url?: string;
}

interface VideoAdsDisplayProps {
  ads: VideoAd[];
}

const VideoAdsDisplay = ({ ads }: VideoAdsDisplayProps) => {
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  if (!ads.length || !isVisible) return null;

  const currentAd = ads[currentAdIndex];

  const handleNextAd = () => {
    setCurrentAdIndex((prev) => (prev + 1) % ads.length);
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  return (
    <div className="relative mb-6">
      {/* Main Featured Ad */}
      <div className="relative rounded-xl overflow-hidden bg-gray-900/50 backdrop-blur-sm border border-gray-800/50">
        <div className="relative aspect-[16/9] sm:aspect-[2.5/1]">
          <img
            src={currentAd.thumbnail_url || "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5"}
            alt={currentAd.title}
            className="w-full h-full object-cover"
          />
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          
          {/* Content */}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="flex items-end justify-between">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-2">{currentAd.title}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-300 mb-3">
                  <span className="bg-yellow-500 text-black px-2 py-0.5 rounded text-xs font-bold">
                    SPONSORED
                  </span>
                  <span>|</span>
                  <span>2025</span>
                  <span>|</span>
                  <span>Action</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <Button className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-lg font-semibold">
                    <Play size={16} className="mr-2" fill="white" />
                    Watch Now
                  </Button>
                  
                  <Button variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20 px-4 py-2 rounded-lg">
                    <Download size={16} className="mr-2" />
                    Download
                  </Button>
                </div>
              </div>
              
              <Button
                onClick={handleClose}
                variant="ghost"
                size="icon"
                className="text-white/70 hover:text-white hover:bg-white/10 rounded-full"
              >
                <X size={20} />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Ads Preview */}
      {ads.length > 1 && (
        <div className="flex gap-3 mt-4 overflow-x-auto scrollbar-none">
          {ads.slice(1, 4).map((ad, index) => (
            <div
              key={ad.id}
              className="min-w-[200px] w-[200px] relative rounded-lg overflow-hidden bg-gray-900/30 cursor-pointer hover:scale-105 transition-transform duration-300"
              onClick={() => setCurrentAdIndex(index + 1)}
            >
              <div className="aspect-[16/10]">
                <img
                  src={ad.thumbnail_url || "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5"}
                  alt={ad.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-primary/90 rounded-full p-2">
                    <Play size={14} fill="white" className="text-white" />
                  </div>
                </div>
              </div>
              <div className="p-3">
                <h4 className="text-white text-sm font-medium line-clamp-1">{ad.title}</h4>
                <p className="text-gray-400 text-xs">Sponsored</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VideoAdsDisplay;
