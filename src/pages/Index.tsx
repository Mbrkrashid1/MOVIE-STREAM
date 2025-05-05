
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
import MovieRow from "@/components/ui/MovieRow";

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

  // Insert ads in specific positions in the content
  const insertAdsInContent = () => {
    if (!videosList) return [];
    if (!videoAds || videoAds.length === 0) return videosList;

    // Group videos into segments of 4 for regular pattern
    const result = [];
    let adIndex = 0;

    // First premium ad position (after featured slider)
    if (videoAds.length > 0) {
      const premiumAd = videoAds[0];
      result.push({
        id: `premium-ad-${premiumAd.id}`,
        isAd: true,
        isPremium: true,
        adData: premiumAd
      });
    }

    // First batch of videos (4 videos)
    const firstBatch = videosList.slice(0, 4);
    firstBatch.forEach(video => result.push(video));

    // Mid-section standard ad
    if (videoAds.length > 1) {
      const midAd = videoAds[1];
      result.push({
        id: `mid-ad-${midAd.id}`,
        isAd: true,
        isPremium: false,
        adData: midAd
      });
    }

    // Remaining videos with ads every 6 videos
    for (let i = 4; i < videosList.length; i++) {
      result.push(videosList[i]);
      
      // Insert standard ad every 6 videos after the first section
      if ((i - 3) % 6 === 0 && adIndex + 2 < videoAds.length) {
        adIndex = (adIndex + 1) % (videoAds.length - 2);
        const ad = videoAds[adIndex + 2]; // Skip the first 2 premium ads
        result.push({
          id: `ad-${ad.id}`,
          isAd: true,
          isPremium: false,
          adData: ad
        });
      }
    }

    return result;
  };

  const contentWithAds = insertAdsInContent();
  
  // Group content by type for horizontal sliders
  const movieContent = videosList?.filter(item => item.type === 'movie') || [];
  const seriesContent = videosList?.filter(item => item.type === 'series') || [];

  return (
    <div className="pb-24">
      <Navbar />
      <div className="mt-14">
        {/* Featured hero slider */}
        {featuredItems && featuredItems.length > 0 && (
          <FeaturedSlider items={featuredItems} />
        )}
        
        {/* Premium ad slot (first position, full width) */}
        {contentWithAds.length > 0 && contentWithAds[0].isAd && contentWithAds[0].isPremium && (
          <div className="px-4 mt-4">
            <VideoAdBanner 
              key={contentWithAds[0].id}
              ad={{...contentWithAds[0].adData, cta_text: "Learn More"}}
            />
          </div>
        )}

        {/* Movie row sliders */}
        {movieContent.length > 0 && (
          <MovieRow 
            title="Popular Movies" 
            movies={movieContent.slice(0, 8).map(item => ({
              id: item.id,
              title: item.title,
              poster: item.thumbnail,
              type: "movie"
            }))}
            viewAllLink="/movies"
          />
        )}
        
        {/* Middle ad placement */}
        {contentWithAds.find(item => item.isAd && !item.isPremium) && (
          <div className="px-4 mt-4">
            <VideoAdBanner 
              key={contentWithAds.find(item => item.isAd && !item.isPremium)?.id}
              ad={contentWithAds.find(item => item.isAd && !item.isPremium)?.adData}
            />
          </div>
        )}
        
        {/* Series row */}
        {seriesContent.length > 0 && (
          <MovieRow 
            title="Latest Series" 
            movies={seriesContent.slice(0, 8).map(item => ({
              id: item.id,
              title: item.title,
              poster: item.thumbnail,
              type: "series"
            }))}
            viewAllLink="/series"
          />
        )}
        
        <div className="px-4 mt-6">
          <h2 className="text-xl font-bold mb-4">Recommended For You</h2>
          
          {/* YouTube-style scrolling video list */}
          <ScrollArea className="h-[calc(100vh-500px)] pt-2">
            <div className="space-y-4">
              {contentWithAds.slice(1).map((item, index) => (
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
