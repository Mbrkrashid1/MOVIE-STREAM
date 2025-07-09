
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Play, Volume2, VolumeX, Heart, Share, MessageCircle } from "lucide-react";

interface Short {
  id: string;
  title: string;
  video_url: string;
  thumbnail_url?: string;
  views: number;
  likes: number;
  creator: string;
  duration: number;
}

interface ShortsHighlightsProps {
  shorts: Short[];
}

const ShortsHighlights = ({ shorts }: ShortsHighlightsProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [liked, setLiked] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  if (!shorts.length) return null;

  const currentShort = shorts[currentIndex];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % shorts.length);
    }, 8000); // Auto-advance every 8 seconds

    return () => clearInterval(interval);
  }, [shorts.length]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !currentShort?.video_url) return;

    const handleCanPlay = () => {
      video.muted = true;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch(() => setIsPlaying(false));
      }
    };

    const handleEnded = () => {
      setCurrentIndex(prev => (prev + 1) % shorts.length);
    };

    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('ended', handleEnded);
    };
  }, [currentIndex, currentShort?.video_url, shorts.length]);

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

  const formatViews = (views: number) => {
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
    return views.toString();
  };

  const formatDuration = (seconds: number) => {
    return `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full max-w-6xl mx-auto mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-white">Shorts Highlights</h2>
        <Button variant="ghost" className="text-gray-400 hover:text-white">
          View All
        </Button>
      </div>

      <div className="relative">
        {/* Main Shorts Player */}
        <div className="relative aspect-[9/16] max-w-sm mx-auto bg-black rounded-2xl overflow-hidden shadow-2xl">
          <video
            ref={videoRef}
            className="w-full h-full object-cover cursor-pointer"
            src={currentShort.video_url}
            poster={currentShort.thumbnail_url}
            muted={isMuted}
            playsInline
            autoPlay
            onClick={togglePlay}
          />

          {/* Overlay Controls */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30">
            {/* Top Info */}
            <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
              <div className="bg-black/50 backdrop-blur-sm rounded-full px-3 py-1">
                <span className="text-white text-sm font-medium">Shorts</span>
              </div>
              <div className="bg-black/50 backdrop-blur-sm rounded-full px-2 py-1">
                <span className="text-white text-xs">{formatDuration(currentShort.duration)}</span>
              </div>
            </div>

            {/* Play Button */}
            {!isPlaying && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Button
                  onClick={togglePlay}
                  variant="ghost"
                  size="icon"
                  className="bg-white/20 hover:bg-white/30 text-white rounded-full h-16 w-16 backdrop-blur-sm"
                >
                  <Play size={24} fill="white" />
                </Button>
              </div>
            )}

            {/* Side Actions */}
            <div className="absolute right-4 bottom-20 flex flex-col gap-4">
              <Button
                onClick={() => setLiked(!liked)}
                variant="ghost"
                size="icon"
                className={`rounded-full backdrop-blur-sm ${
                  liked ? 'bg-red-500/20 text-red-400' : 'bg-black/30 text-white'
                }`}
              >
                <Heart size={20} fill={liked ? 'currentColor' : 'none'} />
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                className="bg-black/30 text-white rounded-full backdrop-blur-sm"
              >
                <MessageCircle size={20} />
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                className="bg-black/30 text-white rounded-full backdrop-blur-sm"
              >
                <Share size={20} />
              </Button>
              
              <Button
                onClick={toggleMute}
                variant="ghost"
                size="icon"
                className="bg-black/30 text-white rounded-full backdrop-blur-sm"
              >
                {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </Button>
            </div>

            {/* Bottom Info */}
            <div className="absolute bottom-4 left-4 right-20">
              <h3 className="text-white font-semibold text-sm mb-1 line-clamp-2">
                {currentShort.title}
              </h3>
              <div className="flex items-center gap-2 text-gray-300 text-xs">
                <span>@{currentShort.creator}</span>
                <span>•</span>
                <span>{formatViews(currentShort.views)} views</span>
              </div>
            </div>
          </div>
        </div>

        {/* Shorts Preview Row */}
        <div 
          ref={containerRef}
          className="flex gap-3 mt-6 overflow-x-auto scrollbar-none pb-2"
        >
          {shorts.map((short, index) => (
            <div
              key={short.id}
              className={`min-w-[120px] w-[120px] cursor-pointer transition-all duration-300 ${
                index === currentIndex 
                  ? 'scale-105 ring-2 ring-primary' 
                  : 'hover:scale-105'
              }`}
              onClick={() => setCurrentIndex(index)}
            >
              <div className="relative aspect-[9/16] rounded-lg overflow-hidden bg-gray-800">
                <img
                  src={short.thumbnail_url || "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5"}
                  alt={short.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <div className="bg-white/20 rounded-full p-1 backdrop-blur-sm">
                    <Play size={12} fill="white" className="text-white" />
                  </div>
                </div>
                <div className="absolute bottom-1 right-1 bg-black/70 rounded px-1 py-0.5">
                  <span className="text-white text-xs">{formatDuration(short.duration)}</span>
                </div>
              </div>
              <div className="mt-2">
                <h4 className="text-white text-xs font-medium line-clamp-2 mb-1">
                  {short.title}
                </h4>
                <p className="text-gray-400 text-xs">{formatViews(short.views)} views</p>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Dots */}
        <div className="flex justify-center gap-2 mt-4">
          {shorts.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                index === currentIndex 
                  ? 'bg-primary scale-125' 
                  : 'bg-gray-500 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShortsHighlights;
