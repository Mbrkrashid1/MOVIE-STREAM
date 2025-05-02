
import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import BottomNavigation from "@/components/layout/BottomNavigation";
import VideoCard from "@/components/ui/VideoCard"; 
import FeaturedSlider from "@/components/ui/FeaturedSlider";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import VideoAdBanner from "@/components/ui/VideoAdBanner";

const Index = () => {
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState("global");

  // Fetch featured content
  const { data: featuredItems, isLoading: featuredLoading } = useQuery({
    queryKey: ["featured"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("content")
        .select("*")
        .eq("is_featured", true)
        .limit(5);

      if (error) throw error;
      
      if (!data || data.length === 0) {
        // Fallback to mock data
        return [
          {
            id: "weak-hero-class-2",
            title: "Weak Hero Class 2",
            backgroundImage: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81",
            type: "series",
          },
          {
            id: "all-the-queens-men",
            title: "All The Queen's Men",
            backgroundImage: "https://images.unsplash.com/photo-1500673922987-e212871fec22",
            type: "series",
          },
        ];
      }

      return data.map(item => ({
        id: item.id,
        title: item.title,
        backgroundImage: item.thumbnail_url || "https://images.unsplash.com/photo-1605810230434-7631ac76ec81",
        type: item.type,
      }));
    }
  });

  // Fetch video content
  const { data: videosList, isLoading: videosLoading } = useQuery({
    queryKey: ["videos"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("content")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(15);

      if (error) throw error;
      
      if (!data || data.length === 0) {
        // Use mock data for now
        return [];
      }

      return data.map(item => ({
        id: item.id,
        title: item.title,
        thumbnail: item.thumbnail_url || "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5",
        channelName: "KannyFlix",
        views: item.views ? `${item.views}` : "0",
        timeAgo: formatTimeAgo(item.created_at),
        duration: formatDuration(item.duration || 120),
        type: item.type,
      }));
    }
  });

  // Fetch video ads
  const { data: videoAds, isLoading: adsLoading } = useQuery({
    queryKey: ["ads"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ads")
        .select("*")
        .limit(3);

      if (error) throw error;
      
      return data || [];
    }
  });

  // Format time ago
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (seconds < 60) return `${seconds} seconds ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days} ${days === 1 ? 'day' : 'days'} ago`;
    const months = Math.floor(days / 30);
    if (months < 12) return `${months} ${months === 1 ? 'month' : 'months'} ago`;
    const years = Math.floor(months / 12);
    return `${years} ${years === 1 ? 'year' : 'years'} ago`;
  };

  // Format duration
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  useEffect(() => {
    // Show welcome toast on initial load
    toast({
      title: "Welcome to KannyFlix!",
      description: "Discover amazing movies and series.",
    });
  }, []);

  // Loading state
  if (featuredLoading && videosLoading) {
    return (
      <div className="pb-24">
        <Navbar />
        <div className="mt-14 h-[calc(100vh-120px)] flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
        <BottomNavigation />
      </div>
    );
  }

  // Insert ads every 4 videos
  const insertAdsInContent = () => {
    if (!videosList) return [];
    if (!videoAds || videoAds.length === 0) return videosList;

    const result = [];
    let adIndex = 0;

    for (let i = 0; i < videosList.length; i++) {
      result.push(videosList[i]);

      // Insert an ad every 4 videos
      if ((i + 1) % 4 === 0 && adIndex < videoAds.length) {
        const ad = videoAds[adIndex];
        result.push({
          id: `ad-${ad.id}`,
          isAd: true,
          adData: ad
        });
        adIndex = (adIndex + 1) % videoAds.length;
      }
    }

    return result;
  };

  const contentWithAds = insertAdsInContent();

  return (
    <div className="pb-24">
      <Navbar />
      <div className="mt-14">
        {featuredItems && featuredItems.length > 0 && (
          <FeaturedSlider items={featuredItems} />
        )}
        
        <div className="px-4">
          {/* YouTube-style scrolling video list */}
          <ScrollArea className="h-[calc(100vh-300px)] pt-4">
            <div className="space-y-4">
              {contentWithAds.map((item, index) => (
                item.isAd ? (
                  <VideoAdBanner 
                    key={`ad-${index}`}
                    ad={item.adData}
                  />
                ) : (
                  <VideoCard 
                    key={item.id}
                    id={item.id}
                    title={item.title}
                    thumbnail={item.thumbnail}
                    channelName={item.channelName}
                    views={item.views}
                    timeAgo={item.timeAgo}
                    duration={item.duration}
                    type={item.type}
                  />
                )
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
      <BottomNavigation />
    </div>
  );
};

export default Index;
