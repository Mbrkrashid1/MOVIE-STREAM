import React, { useState, useEffect, useRef } from "react";

interface Ad {
  id: string;
  title: string;
  description?: string;
  video_url: string;
  thumbnail_url?: string;
}

interface AutoPlayAdSequencerProps {
  ads: Ad[];
  autoPlayDuration?: number;
  onAdComplete?: (adId: string) => void;
}

const AutoPlayAdSequencer = ({ ads, autoPlayDuration = 5, onAdComplete }: AutoPlayAdSequencerProps) => {
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [currentAd, setCurrentAd] = useState<Ad | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [adTimer, setAdTimer] = useState<NodeJS.Timeout | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (ads.length === 0) return;

    const playNextAd = () => {
      const currentAd = ads[currentAdIndex];
      setCurrentAd(currentAd);
      setIsPlaying(true);
      setIsVisible(true);

      // Enhanced autoplay with better error handling
      const video = videoRef.current;
      if (video) {
        video.muted = true; // Ensure muted for autoplay
        video.volume = 0;
        video.currentTime = 0;
        
        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              console.log('Video ad autoplay successful');
              setIsPlaying(true);
            })
            .catch(error => {
              console.error('Ad video autoplay failed:', error);
              // Try again after user interaction
              setTimeout(() => {
                if (video && !video.paused) return;
                video.muted = true;
                video.play().catch(e => console.log('Retry failed:', e));
              }, 1000);
            });
        }
      }

      const timer = setTimeout(() => {
        handleAdComplete();
      }, autoPlayDuration * 1000);

      setAdTimer(timer);
    };

    playNextAd();
    
    const interval = setInterval(() => {
      setCurrentAdIndex(prev => (prev + 1) % ads.length);
    }, (autoPlayDuration + 2) * 1000);

    return () => {
      clearInterval(interval);
      if (adTimer) clearTimeout(adTimer);
    };
  }, [ads, currentAdIndex, autoPlayDuration]);

  const handleAdComplete = () => {
    if (currentAd) {
      onAdComplete?.(currentAd.id);
    }
    setIsPlaying(false);
    setIsVisible(false);
    if (adTimer) clearTimeout(adTimer);
  };

  const handleVideoError = (error: any) => {
    console.error('Ad video error:', error);
    handleAdComplete();
  };

  const handleCanPlay = () => {
    const video = videoRef.current;
    if (video && !isPlaying) {
      video.muted = true;
      video.play().catch(e => console.log('Autoplay was prevented'));
    }
  };

  return (
    <div className={`fixed bottom-20 right-4 z-50 transition-all duration-500 ${
      isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
    }`}>
      {currentAd && (
        <div className="relative w-64 h-36 bg-black rounded-lg overflow-hidden shadow-2xl border border-white/20">
          {/* Ad Label */}
          <div className="absolute top-2 left-2 z-20 bg-yellow-500 text-black text-xs px-2 py-1 rounded font-bold">
            AD
          </div>

          {/* Close Button */}
          <button
            onClick={handleAdComplete}
            className="absolute top-2 right-2 z-20 w-6 h-6 bg-black/70 hover:bg-black/90 text-white rounded-full flex items-center justify-center text-sm transition-colors"
          >
            ×
          </button>

          {/* Video */}
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            src={currentAd.video_url}
            poster={currentAd.thumbnail_url}
            muted
            autoPlay
            playsInline
            onEnded={handleAdComplete}
            onError={handleVideoError}
            onCanPlay={handleCanPlay}
            onLoadedData={handleCanPlay}
          />

          {/* Ad Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-3">
            <h4 className="text-white text-sm font-medium mb-1 line-clamp-1">
              {currentAd.title}
            </h4>
            {currentAd.description && (
              <p className="text-gray-300 text-xs line-clamp-1">
                {currentAd.description}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AutoPlayAdSequencer;
