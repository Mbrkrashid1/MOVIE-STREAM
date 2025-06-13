
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, Volume2, VolumeX, ExternalLink, X } from "lucide-react";

interface ContinuousVideoAdProps {
  ads: Array<{
    id: string;
    title: string;
    description?: string;
    video_url: string;
    thumbnail_url?: string;
    cta_text?: string;
    cta_url?: string;
  }>;
}

const ContinuousVideoAd = ({ ads }: ContinuousVideoAdProps) => {
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [showControls, setShowControls] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const currentAd = ads[currentAdIndex];

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleEnded = () => {
      // Auto-play next ad or loop back to first
      const nextIndex = (currentAdIndex + 1) % ads.length;
      setCurrentAdIndex(nextIndex);
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    video.addEventListener('ended', handleEnded);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);

    // Auto-play when ad changes
    video.play().catch(() => {
      // Handle autoplay restrictions
      setIsPlaying(false);
    });

    return () => {
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
    };
  }, [currentAdIndex, ads.length]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleCTAClick = () => {
    if (currentAd.cta_url) {
      window.open(currentAd.cta_url, '_blank');
    }
  };

  if (!ads.length) return null;

  return (
    <div className="relative rounded-xl overflow-hidden shadow-2xl border border-primary/20 bg-gradient-to-br from-card/90 to-background/50 backdrop-blur-sm">
      {/* Ad Label */}
      <div className="absolute top-3 left-3 z-20 bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs px-3 py-1 rounded-full font-bold shadow-lg">
        SPONSORED
      </div>

      {/* Ad Counter */}
      {ads.length > 1 && (
        <div className="absolute top-3 right-3 z-20 bg-black/70 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
          {currentAdIndex + 1} / {ads.length}
        </div>
      )}

      {/* Video Container */}
      <div 
        className="relative group cursor-pointer"
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
        onClick={togglePlay}
      >
        <video
          ref={videoRef}
          className="w-full h-64 object-cover"
          src={currentAd.video_url}
          poster={currentAd.thumbnail_url}
          muted={isMuted}
          loop={false}
          playsInline
        />

        {/* Video Controls Overlay */}
        <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-opacity duration-300 ${showControls || !isPlaying ? 'opacity-100' : 'opacity-0'}`}>
          {/* Play/Pause Button */}
          <div className="absolute inset-0 flex items-center justify-center">
            {!isPlaying && (
              <Button
                variant="ghost"
                size="icon"
                className="bg-primary/90 hover:bg-primary text-white rounded-full h-16 w-16 transition-all duration-300 hover:scale-110"
              >
                <Play size={24} fill="white" />
              </Button>
            )}
          </div>

          {/* Bottom Controls */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-white font-bold text-lg drop-shadow-lg">{currentAd.title}</h3>
                {currentAd.description && (
                  <p className="text-gray-200 text-sm mt-1 line-clamp-2 drop-shadow-md">
                    {currentAd.description}
                  </p>
                )}
              </div>
              
              <div className="flex items-center space-x-2 ml-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleMute();
                  }}
                  className="bg-black/50 hover:bg-black/70 text-white rounded-full backdrop-blur-sm"
                >
                  {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="p-4 bg-gradient-to-r from-card/80 to-background/60 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex space-x-3">
            {currentAd.cta_text && (
              <Button 
                onClick={handleCTAClick}
                className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white font-semibold px-6 py-2 shadow-lg transition-all duration-200 hover:scale-105"
              >
                <ExternalLink size={16} className="mr-2" />
                {currentAd.cta_text}
              </Button>
            )}
          </div>
          
          {/* Ad Navigation Dots */}
          {ads.length > 1 && (
            <div className="flex space-x-2">
              {ads.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentAdIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-200 ${
                    index === currentAdIndex 
                      ? 'bg-primary scale-125' 
                      : 'bg-gray-400 hover:bg-gray-300'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContinuousVideoAd;
