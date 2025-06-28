
import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useViewTracking(contentId: string, initialViews: number) {
  const [hasTrackedView, setHasTrackedView] = useState(false);
  const [currentViews, setCurrentViews] = useState(initialViews);

  const trackViewMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase
        .from('content')
        .update({ views: currentViews + 1 })
        .eq('id', contentId)
        .select('views')
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      if (data) {
        setCurrentViews(data.views || 0);
        console.log('View tracked successfully');
      }
    },
    onError: (error) => {
      console.error('Error tracking view:', error);
    }
  });

  const trackView = (isPlaying: boolean, currentTime: number, adPlaying: boolean) => {
    if (isPlaying && currentTime > 30 && !hasTrackedView && !adPlaying) {
      setHasTrackedView(true);
      trackViewMutation.mutate();
    }
  };

  return {
    hasTrackedView,
    currentViews,
    trackView
  };
}
