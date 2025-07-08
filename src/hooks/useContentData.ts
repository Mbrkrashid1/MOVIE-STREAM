
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
  type: "movie" | "series";
}

export interface FeaturedItem {
  id: string;
  title: string;
  backgroundImage: string;
  type: string;
  description?: string;
  backdrop_url?: string;
  thumbnail_url?: string;
  video_url?: string;
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
      
      return data?.map(item => ({
        id: item.id,
        title: item.title,
        backgroundImage: item.backdrop_url || item.thumbnail_url || "https://images.unsplash.com/photo-1605810230434-7631ac76ec81",
        type: item.type,
        description: item.description,
        backdrop_url: item.backdrop_url,
        thumbnail_url: item.thumbnail_url,
        video_url: item.video_url
      })) || [];
    }
  });

  // Fetch video content (all content, no sample filtering)
  const { data: videosList, isLoading: videosLoading } = useQuery({
    queryKey: ["videos"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("content")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      return data?.map(item => ({
        id: item.id,
        title: item.title,
        thumbnail: item.thumbnail_url || "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5",
        channelName: "HausaBox",
        views: item.views ? `${item.views}` : "0",
        timeAgo: formatTimeAgo(item.created_at),
        duration: formatDuration(item.duration || 120),
        type: (item.type === "movie" || item.type === "series") ? item.type as "movie" | "series" : "movie",
        video_url: item.video_url
      })) || [];
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
