
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

type AdFormData = {
  title: string;
  description: string;
  thumbnail_url: string;
  video_url: string;
  duration: number;
  is_skippable: boolean;
  skip_after_seconds: number;
};

export function useAdMutations() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createAdMutation = useMutation({
    mutationFn: async (values: AdFormData) => {
      const { data, error } = await supabase
        .from("ads")
        .insert({
          title: values.title,
          description: values.description,
          thumbnail_url: values.thumbnail_url,
          video_url: values.video_url,
          duration: values.duration,
          is_skippable: values.is_skippable,
          skip_after_seconds: values.skip_after_seconds,
        })
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ads"] });
      toast({
        title: "Success!",
        description: "Ad created successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create ad. Please try again.",
        variant: "destructive",
      });
      console.error("Error creating ad:", error);
    },
  });

  const updateAdMutation = useMutation({
    mutationFn: async ({ id, values }: { id: string; values: AdFormData }) => {
      const { data, error } = await supabase
        .from("ads")
        .update({
          title: values.title,
          description: values.description,
          thumbnail_url: values.thumbnail_url,
          video_url: values.video_url,
          duration: values.duration,
          is_skippable: values.is_skippable,
          skip_after_seconds: values.skip_after_seconds,
        })
        .eq("id", id)
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ads"] });
      toast({
        title: "Success!",
        description: "Ad updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update ad. Please try again.",
        variant: "destructive",
      });
      console.error("Error updating ad:", error);
    },
  });

  const deleteAdMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("ads")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ads"] });
      toast({
        title: "Success!",
        description: "Ad deleted successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete ad. Please try again.",
        variant: "destructive",
      });
      console.error("Error deleting ad:", error);
    },
  });

  return {
    createAdMutation,
    updateAdMutation,
    deleteAdMutation,
  };
}
