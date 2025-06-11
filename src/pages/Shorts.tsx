
import { useState, useEffect, useRef } from "react";
import Navbar from "@/components/layout/Navbar";
import BottomNavigation from "@/components/layout/BottomNavigation";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Heart, MessageCircle, Share2, MoreHorizontal, Music } from "lucide-react";
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
  const [likedVideos, setLikedVideos] = useState<Set<string>>(new Set());
  const [followedUsers, setFollowedUsers] = useState<Set<string>>(new Set());
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

      if (!data || data.length === 0) {
        return [];
      }

      // Remove duplicates based on video URL and title
      const uniqueShorts = data.filter((item, index, self) => 
        index === self.findIndex(t => t.video_url === item.video_url && t.title === item.title)
      );

      return uniqueShorts.map(item => ({
        id: item.id,
        title: item.title,
        description: item.description,
        creator: item.genre || "HausaBox User",
        views: `${(item.views || 0).toLocaleString()}`,
        thumbnail: item.thumbnail_url || "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5",
        videoUrl: item.video_url,
        likes: Math.floor(Math.random() * 100000) + 1000,
        comments: Math.floor(Math.random() * 5000) + 100,
        shares: Math.floor(Math.random() * 10000) + 500,
      }));
    },
  });

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
    const currentVideo = shorts?.[currentShortIndex];
    if (!currentVideo) return;

    setLikedVideos(prev => {
      const newSet = new Set(prev);
      if (newSet.has(currentVideo.id)) {
        newSet.delete(currentVideo.id);
        toast({
          title: "Unliked",
          description: "Removed from liked videos",
        });
      } else {
        newSet.add(currentVideo.id);
        toast({
          title: "Liked! ❤️",
          description: "Added to your liked videos",
        });
      }
      return newSet;
    });
  };

  const handleFollow = () => {
    const currentVideo = shorts?.[currentShortIndex];
    if (!currentVideo) return;

    setFollowedUsers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(currentVideo.creator)) {
        newSet.delete(currentVideo.creator);
        toast({
          title: "Unfollowed",
          description: `You unfollowed ${currentVideo.creator}`,
        });
      } else {
        newSet.add(currentVideo.creator);
        toast({
          title: "Following! 🎉",
          description: `You're now following ${currentVideo.creator}`,
        });
      }
      return newSet;
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
      title: "Shared! 📤",
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

  if (shorts.length === 0) {
    return (
      <div className="pb-24">
        <Navbar />
        <div className="mt-14 h-[calc(100vh-120px)] bg-black flex items-center justify-center">
          <div className="text-center text-white">
            <h2 className="text-xl font-bold mb-2">No Shorts Available</h2>
            <p className="text-gray-400">Check back later for new content!</p>
          </div>
        </div>
        <BottomNavigation />
      </div>
    );
  }

  const currentShort = shorts[currentShortIndex];
  const isLiked = likedVideos.has(currentShort.id);
  const isFollowing = followedUsers.has(currentShort.creator);

  return (
    <div className="pb-24">
      <Navbar />
      <div 
        ref={containerRef}
        className="mt-14 h-[calc(100vh-120px)] bg-black relative overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Video Player */}
        <div className="absolute inset-0 z-10">
          <VideoPlayer 
            videoUrl={currentShort.videoUrl}
            contentId={currentShort.id}
            thumbnail={currentShort.thumbnail}
          />
        </div>
        
        {/* TikTok-style UI Overlay */}
        <div className="absolute inset-0 z-20 pointer-events-none">
          
          {/* Right Side Action Buttons */}
          <div className="absolute right-3 bottom-32 flex flex-col items-center space-y-6 pointer-events-auto">
            
            {/* Profile Picture + Follow */}
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-gray-600 border-2 border-white overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                  {currentShort.creator.charAt(0).toUpperCase()}
                </div>
              </div>
              {!isFollowing && (
                <button 
                  onClick={handleFollow}
                  className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-lg font-bold"
                >
                  +
                </button>
              )}
            </div>
            
            {/* Like Button */}
            <div className="flex flex-col items-center">
              <button 
                onClick={handleLike}
                className={`p-3 rounded-full transition-all duration-200 ${
                  isLiked ? 'text-red-500 scale-110' : 'text-white'
                }`}
              >
                <Heart size={28} fill={isLiked ? 'currentColor' : 'none'} />
              </button>
              <span className="text-white text-xs font-semibold mt-1">
                {currentShort.likes?.toLocaleString()}
              </span>
            </div>
            
            {/* Comment Button */}
            <div className="flex flex-col items-center">
              <button 
                onClick={handleComment}
                className="text-white p-3 rounded-full hover:bg-white/10 transition-colors duration-200"
              >
                <MessageCircle size={28} />
              </button>
              <span className="text-white text-xs font-semibold mt-1">
                {currentShort.comments?.toLocaleString()}
              </span>
            </div>
            
            {/* Share Button */}
            <div className="flex flex-col items-center">
              <button 
                onClick={handleShare}
                className="text-white p-3 rounded-full hover:bg-white/10 transition-colors duration-200"
              >
                <Share2 size={28} />
              </button>
              <span className="text-white text-xs font-semibold mt-1">
                {currentShort.shares?.toLocaleString()}
              </span>
            </div>
            
            {/* More Options */}
            <button className="text-white p-3 rounded-full hover:bg-white/10 transition-colors duration-200">
              <MoreHorizontal size={28} />
            </button>
            
            {/* Music Icon */}
            <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center animate-spin-slow">
              <Music size={20} className="text-white" />
            </div>
          </div>
          
          {/* Bottom Content Info */}
          <div className="absolute bottom-20 left-4 right-20 pointer-events-auto">
            <div className="mb-3">
              <button 
                onClick={handleFollow}
                className="text-white font-bold text-base mb-2 flex items-center"
              >
                @{currentShort.creator}
                {!isFollowing && (
                  <span className="ml-3 text-white font-normal border border-white px-4 py-1 rounded text-sm">
                    Follow
                  </span>
                )}
              </button>
              <p className="text-white text-sm mb-2 line-clamp-2">
                {currentShort.description || currentShort.title}
              </p>
              <p className="text-white/80 text-xs">
                ♫ Original sound - {currentShort.creator}
              </p>
            </div>
          </div>
          
          {/* Video Progress Indicators */}
          <div className="absolute top-4 right-4">
            <div className="text-white text-xs bg-black/50 px-2 py-1 rounded">
              {currentShortIndex + 1} / {shorts.length}
            </div>
          </div>
        </div>
      </div>
      <BottomNavigation />
    </div>
  );
};

export default Shorts;
