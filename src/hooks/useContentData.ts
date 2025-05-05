
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { formatTimeAgo, formatDuration } from "@/utils/formatters";

export interface ContentItem {
  id: string;
  title: string;
  thumbnail: string;
  channelName: string;
  views: string;
  timeAgo: string;
  duration: string;
  type: 'movie' | 'series';
}

export interface FeaturedItem {
  id: string;
  title: string;
  backgroundImage: string;
  type: string;
}

export const useContentData = () => {
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

  // Content manipulation methods
  const getMovieContent = () => videosList?.filter(item => item.type === 'movie') || [];
  const getSeriesContent = () => videosList?.filter(item => item.type === 'series') || [];

  return {
    featuredItems,
    videosList,
    videoAds,
    isLoading: featuredLoading || videosLoading || adsLoading,
    getMovieContent,
    getSeriesContent
  };
};
