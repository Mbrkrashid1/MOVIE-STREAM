
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useMovieData(id: string | undefined) {
  // Fetch movie data from Supabase
  const { data: movie, isLoading, error } = useQuery({
    queryKey: ['content', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('content')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) throw error;
      return data;
    }
  });

  // Fetch similar content
  const { data: similarContent } = useQuery({
    queryKey: ['similar-content', movie?.category],
    queryFn: async () => {
      if (!movie?.category) return [];
      
      const { data, error } = await supabase
        .from('content')
        .select('*')
        .eq('category', movie.category)
        .neq('id', id)
        .filter('is_sample', 'eq', false)
        .limit(5);
        
      if (error) throw error;
      return data;
    },
    enabled: !!movie?.category
  });

  // Fetch banner ads for bottom placement
  const { data: bannerAds } = useQuery({
    queryKey: ['banner-ads'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ads')
        .select('*')
        .limit(5);
        
      if (error) throw error;
      
      // Convert to banner ad format
      return data?.map(ad => ({
        id: ad.id,
        title: ad.title,
        description: ad.description,
        image_url: ad.thumbnail_url || '',
        cta_text: ad.cta_text || 'Learn More',
        cta_url: ad.cta_url || undefined,
        background_color: 'from-purple-900/20 to-blue-900/20'
      })) || [];
    }
  });

  return {
    movie,
    isLoading,
    error,
    similarContent,
    bannerAds
  };
}
