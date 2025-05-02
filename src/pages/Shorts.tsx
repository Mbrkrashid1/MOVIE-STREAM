
import { useState, useEffect, useRef } from "react";
import Navbar from "@/components/layout/Navbar";
import BottomNavigation from "@/components/layout/BottomNavigation";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ArrowUp, ArrowDown, Heart, MessageCircle, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import VideoPlayer from "@/components/VideoPlayer";

interface Short {
  id: string;
  title: string;
  description?: string;
  creator: string;
  views: string;
  thumbnail: string;
  videoUrl: string;
  likes?: number;
  comments?: number;
  shares?: number;
}

const Shorts = () => {
  const { toast } = useToast();
  const [currentShortIndex, setCurrentShortIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Fetch shorts from Supabase
  const { data: shorts, isLoading } = useQuery({
    queryKey: ["shorts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("content")
        .select("*")
        .eq("type", "shorts")
        .order("created_at", { ascending: false });

      if (error) throw error;

      // If no shorts data, use mock data
      if (!data || data.length === 0) {
        return mockShortsData.map(short => ({
          ...short,
          videoUrl: short.videoUrl || "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
        }));
      }

      return data.map(item => ({
        id: item.id,
        title: item.title,
        description: item.description,
        creator: "KannyFlix User",
        views: `${(item.views || 0).toLocaleString()}`,
        thumbnail: item.thumbnail_url || "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5",
        videoUrl: item.video_url,
        likes: Math.floor(Math.random() * 10000) + 100,
        comments: Math.floor(Math.random() * 500) + 10,
        shares: Math.floor(Math.random() * 1000) + 50,
      }));
    },
  });

  // Mock shorts data as fallback
  const mockShortsData: Short[] = [
    {
      id: "short1",
      title: "Hausa Comedy Skit",
      description: "Watch this hilarious comedy skit that will make your day!",
      creator: "Ibrahim Comedy",
      views: "1.2M",
      thumbnail: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      likes: 45600,
      comments: 234,
      shares: 1200,
    },
    {
      id: "short2",
      title: "Kannywood Dance Clip",
      description: "Amazing dance moves from Kannywood stars! 🕺💃",
      creator: "Hausa Stars",
      views: "890K",
      thumbnail: "https://images.unsplash.com/photo-1500673922987-e212871fec22",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      likes: 23400,
      comments: 456,
      shares: 789,
    },
    {
      id: "short3",
      title: "Cooking Tutorial",
      description: "Learn how to make traditional Nigerian jollof rice in 2 minutes!",
      creator: "Hausa Kitchen",
      views: "450K",
      thumbnail: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      likes: 12500,
      comments: 345,
      shares: 567,
    },
  ];

  const handleSwipe = (direction: "up" | "down") => {
    if (!shorts) return;
    
    if (direction === "up" && currentShortIndex < shorts.length - 1) {
      setCurrentShortIndex(currentShortIndex + 1);
    } else if (direction === "down" && currentShortIndex > 0) {
      setCurrentShortIndex(currentShortIndex - 1);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientY);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isSwipeUp = distance > 50;
    const isSwipeDown = distance < -50;
    
    if (isSwipeUp) {
      handleSwipe("up");
    } else if (isSwipeDown) {
      handleSwipe("down");
    }
    
    setTouchStart(null);
    setTouchEnd(null);
  };

  const handleLike = () => {
    toast({
      title: "Liked!",
      description: "You liked this short video",
    });
  };

  const handleComment = () => {
    toast({
      title: "Comments",
      description: "Comment functionality coming soon",
    });
  };

  const handleShare = () => {
    toast({
      title: "Shared!",
      description: "Share functionality coming soon",
    });
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp") {
        handleSwipe("down");
      } else if (e.key === "ArrowDown") {
        handleSwipe("up");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentShortIndex]);

  if (isLoading || !shorts) {
    return (
      <div className="pb-24">
        <Navbar />
        <div className="mt-14 h-[calc(100vh-120px)] bg-black flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white"></div>
        </div>
        <BottomNavigation />
      </div>
    );
  }

  const currentShort = shorts[currentShortIndex];

  return (
    <div className="pb-24">
      <Navbar />
      <div 
        ref={containerRef}
        className="mt-14 h-[calc(100vh-120px)] bg-black"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="relative h-full">
          {/* Video Player */}
          <div className="absolute inset-0 z-10">
            <VideoPlayer 
              videoUrl={currentShort.videoUrl}
              contentId={currentShort.id}
              thumbnail={currentShort.thumbnail}
            />
          </div>
          
          {/* Video Info & Interaction Buttons */}
          <div className="absolute bottom-0 left-0 right-0 z-20 p-4 bg-gradient-to-t from-black to-transparent">
            <div className="flex flex-col">
              <h3 className="text-lg font-bold text-white">{currentShort.title}</h3>
              {currentShort.description && (
                <p className="text-sm text-gray-300 mb-2">{currentShort.description}</p>
              )}
              <div className="flex items-center">
                <span className="text-sm text-white">{currentShort.creator}</span>
                <span className="mx-2 text-gray-400">•</span>
                <span className="text-sm text-gray-400">{currentShort.views} views</span>
              </div>
            </div>
          </div>
          
          {/* Right Side Action Buttons */}
          <div className="absolute right-4 bottom-24 z-20 flex flex-col space-y-6">
            <div className="flex flex-col items-center">
              <Button 
                onClick={handleLike}
                variant="ghost" 
                size="icon" 
                className="rounded-full bg-black/40 text-white hover:bg-black/60"
              >
                <Heart size={24} />
              </Button>
              <span className="text-xs text-white mt-1">{currentShort.likes?.toLocaleString()}</span>
            </div>
            
            <div className="flex flex-col items-center">
              <Button 
                onClick={handleComment}
                variant="ghost" 
                size="icon" 
                className="rounded-full bg-black/40 text-white hover:bg-black/60"
              >
                <MessageCircle size={24} />
              </Button>
              <span className="text-xs text-white mt-1">{currentShort.comments?.toLocaleString()}</span>
            </div>
            
            <div className="flex flex-col items-center">
              <Button 
                onClick={handleShare}
                variant="ghost" 
                size="icon" 
                className="rounded-full bg-black/40 text-white hover:bg-black/60"
              >
                <Share2 size={24} />
              </Button>
              <span className="text-xs text-white mt-1">{currentShort.shares?.toLocaleString()}</span>
            </div>
          </div>
          
          {/* Navigation Indicators */}
          <div className="absolute right-4 top-1/2 z-30 transform -translate-y-1/2 flex flex-col items-center space-y-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleSwipe("down")}
              disabled={currentShortIndex === 0}
              className={`rounded-full bg-black/20 ${currentShortIndex === 0 ? 'text-gray-600' : 'text-white'}`}
            >
              <ArrowUp size={20} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleSwipe("up")}
              disabled={currentShortIndex === shorts.length - 1}
              className={`rounded-full bg-black/20 ${currentShortIndex === shorts.length - 1 ? 'text-gray-600' : 'text-white'}`}
            >
              <ArrowDown size={20} />
            </Button>
          </div>
        </div>
      </div>
      <BottomNavigation />
    </div>
  );
};

export default Shorts;
