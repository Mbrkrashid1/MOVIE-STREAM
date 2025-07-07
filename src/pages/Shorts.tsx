
import { useEffect, useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Play, 
  Pause, 
  Heart, 
  MessageCircle, 
  Share, 
  Music, 
  Volume2, 
  VolumeX,
  ChevronUp,
  ChevronDown,
  MoreHorizontal
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ShortVideo {
  id: string;
  title: string;
  description?: string;
  video_url: string;
  thumbnail_url?: string;
  views: number;
  duration: number;
  created_at: string;
}

export default function Shorts() {
  const { toast } = useToast();
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [likes, setLikes] = useState<{[key: string]: number}>({});
  const [isLiked, setIsLiked] = useState<{[key: string]: boolean}>({});
  const videoRefs = useRef<{[key: string]: HTMLVideoElement}>({});
  const containerRef = useRef<HTMLDivElement>(null);

  // Fetch short videos from Supabase
  const { data: shorts, isLoading } = useQuery({
    queryKey: ["shorts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("content")
        .select("*")
        .eq("type", "short")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return (data || []) as ShortVideo[];
    },
  });

  useEffect(() => {
    toast({
      title: "Welcome to Shorts! 🎬",
      description: "Swipe up and down to navigate through videos.",
    });
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' && currentVideoIndex > 0) {
        setCurrentVideoIndex(prev => prev - 1);
      } else if (e.key === 'ArrowDown' && shorts && currentVideoIndex < shorts.length - 1) {
        setCurrentVideoIndex(prev => prev + 1);
      } else if (e.key === ' ') {
        e.preventDefault();
        togglePlay();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentVideoIndex, shorts]);

  useEffect(() => {
    // Auto-play current video and pause others
    if (shorts) {
      shorts.forEach((short, index) => {
        const video = videoRefs.current[short.id];
        if (video) {
          if (index === currentVideoIndex) {
            if (isPlaying) {
              video.play().catch(console.error);
            } else {
              video.pause();
            }
          } else {
            video.pause();
          }
        }
      });
    }
  }, [currentVideoIndex, isPlaying, shorts]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (shorts) {
      const currentVideo = videoRefs.current[shorts[currentVideoIndex].id];
      if (currentVideo) {
        currentVideo.muted = !isMuted;
      }
    }
  };

  const handleLike = (videoId: string) => {
    setIsLiked(prev => ({ ...prev, [videoId]: !prev[videoId] }));
    setLikes(prev => ({ 
      ...prev, 
      [videoId]: (prev[videoId] || 0) + (isLiked[videoId] ? -1 : 1)
    }));
  };

  const navigateVideo = (direction: 'up' | 'down') => {
    if (direction === 'up' && currentVideoIndex > 0) {
      setCurrentVideoIndex(prev => prev - 1);
    } else if (direction === 'down' && shorts && currentVideoIndex < shorts.length - 1) {
      setCurrentVideoIndex(prev => prev + 1);
    }
  };

  const formatViews = (views: number) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`;
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`;
    }
    return views.toString();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading shorts...</p>
        </div>
      </div>
    );
  }

  if (!shorts || shorts.length === 0) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <div className="text-center">
          <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Play size={32} className="text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No Short Videos Yet</h3>
          <p className="text-gray-400">Short videos will appear here once they're uploaded.</p>
        </div>
      </div>
    );
  }

  const currentShort = shorts[currentVideoIndex];

  return (
    <div className="relative h-screen bg-black overflow-hidden">
      {/* Video Container */}
      <div 
        ref={containerRef}
        className="relative h-full w-full"
        style={{ transform: `translateY(-${currentVideoIndex * 100}vh)` }}
      >
        {shorts.map((short, index) => (
          <div
            key={short.id}
            className="relative h-screen w-full flex items-center justify-center"
            style={{ position: 'absolute', top: `${index * 100}vh` }}
          >
            <video
              ref={(el) => {
                if (el) videoRefs.current[short.id] = el;
              }}
              src={short.video_url}
              poster={short.thumbnail_url}
              className="w-full h-full object-cover"
              loop
              muted={isMuted}
              playsInline
              preload="metadata"
              onEnded={() => {
                if (index < shorts.length - 1) {
                  setCurrentVideoIndex(index + 1);
                }
              }}
            />

            {/* Video Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

            {/* Play/Pause Button */}
            <button
              onClick={togglePlay}
              className="absolute inset-0 flex items-center justify-center"
            >
              {!isPlaying && (
                <div className="bg-black/50 rounded-full p-6">
                  <Play className="w-12 h-12 text-white" fill="white" />
                </div>
              )}
            </button>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex flex-col gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigateVideo('up')}
          disabled={currentVideoIndex === 0}
          className="bg-black/30 text-white hover:bg-black/50 rounded-full h-12 w-12"
        >
          <ChevronUp className="h-6 w-6" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigateVideo('down')}
          disabled={currentVideoIndex === shorts.length - 1}
          className="bg-black/30 text-white hover:bg-black/50 rounded-full h-12 w-12"
        >
          <ChevronDown className="h-6 w-6" />
        </Button>
      </div>

      {/* Right Side Actions */}
      <div className="absolute right-4 bottom-20 flex flex-col items-center gap-6">
        {/* Profile Avatar */}
        <div className="relative">
          <Avatar className="h-12 w-12 border-2 border-white">
            <AvatarFallback className="bg-primary text-white font-bold">
              HB
            </AvatarFallback>
          </Avatar>
          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">+</span>
          </div>
        </div>

        {/* Like Button */}
        <div className="flex flex-col items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleLike(currentShort.id)}
            className={cn(
              "rounded-full h-12 w-12 transition-colors",
              isLiked[currentShort.id] 
                ? "bg-red-500/20 text-red-500" 
                : "bg-black/30 text-white hover:bg-black/50"
            )}
          >
            <Heart 
              className={cn("h-6 w-6", isLiked[currentShort.id] && "fill-current")} 
            />
          </Button>
          <span className="text-white text-xs mt-1 font-medium">
            {formatViews(likes[currentShort.id] || Math.floor(Math.random() * 1000))}
          </span>
        </div>

        {/* Comment Button */}
        <div className="flex flex-col items-center">
          <Button
            variant="ghost"
            size="icon"
            className="bg-black/30 text-white hover:bg-black/50 rounded-full h-12 w-12"
          >
            <MessageCircle className="h-6 w-6" />
          </Button>
          <span className="text-white text-xs mt-1 font-medium">
            {Math.floor(Math.random() * 100)}
          </span>
        </div>

        {/* Share Button */}
        <div className="flex flex-col items-center">
          <Button
            variant="ghost"
            size="icon"
            className="bg-black/30 text-white hover:bg-black/50 rounded-full h-12 w-12"
          >
            <Share className="h-6 w-6" />
          </Button>
          <span className="text-white text-xs mt-1 font-medium">Share</span>
        </div>

        {/* More Options */}
        <Button
          variant="ghost"
          size="icon"
          className="bg-black/30 text-white hover:bg-black/50 rounded-full h-12 w-12"
        >
          <MoreHorizontal className="h-6 w-6" />
        </Button>
      </div>

      {/* Bottom Info */}
      <div className="absolute bottom-0 left-0 right-0 p-6 pb-8">
        <div className="space-y-3">
          {/* User Info */}
          <div className="flex items-center gap-3">
            <span className="text-white font-semibold">@hausabox</span>
            <Button
              variant="outline"
              size="sm"
              className="border-white text-white bg-transparent hover:bg-white hover:text-black h-7 px-4"
            >
              Follow
            </Button>
          </div>

          {/* Video Title */}
          <h3 className="text-white font-medium text-lg leading-tight">
            {currentShort.title}
          </h3>

          {/* Description */}
          {currentShort.description && (
            <p className="text-white/80 text-sm leading-relaxed">
              {currentShort.description}
            </p>
          )}

          {/* Music Info */}
          <div className="flex items-center gap-2 text-white/80">
            <Music className="h-4 w-4" />
            <span className="text-sm">Original sound</span>
          </div>
        </div>
      </div>

      {/* Volume Control */}
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleMute}
        className="absolute top-4 right-4 bg-black/30 text-white hover:bg-black/50 rounded-full h-10 w-10"
      >
        {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
      </Button>

      {/* Progress Indicator */}
      <div className="absolute left-1 top-1/2 transform -translate-y-1/2 flex flex-col gap-1">
        {shorts.map((_, index) => (
          <div
            key={index}
            className={cn(
              "w-1 h-8 rounded-full transition-colors",
              index === currentVideoIndex ? "bg-white" : "bg-white/30"
            )}
          />
        ))}
      </div>
    </div>
  );
}
