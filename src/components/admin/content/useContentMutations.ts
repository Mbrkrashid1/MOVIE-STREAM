
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function useContentMutations() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const createContentMutation = useMutation({
    mutationFn: async (newContent: any) => {
      const { data, error } = await supabase
        .from('content')
        .insert(newContent)
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content'] });
      toast({
        title: "Content created",
        description: "The content has been created successfully."
      });
    },
    onError: (error) => {
      console.error("Error creating content:", error);
      toast({
        title: "Error",
        description: "Failed to create content. Please try again.",
        variant: "destructive"
      });
    }
  });

  const updateContentMutation = useMutation({
    mutationFn: async ({ updatedContent, id }: { updatedContent: any; id: string }) => {
      const { data, error } = await supabase
        .from('content')
        .update(updatedContent)
        .eq('id', id)
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content'] });
      toast({
        title: "Content updated",
        description: "The content has been updated successfully."
      });
    },
    onError: (error) => {
      console.error("Error updating content:", error);
      toast({
        title: "Error",
        description: "Failed to update content. Please try again.",
        variant: "destructive"
      });
    }
  });

  const deleteContentMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('content')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content'] });
      toast({
        title: "Content deleted",
        description: "The content has been deleted successfully."
      });
    },
    onError: (error) => {
      console.error("Error deleting content:", error);
      toast({
        title: "Error",
        description: "Failed to delete content. Please try again.",
        variant: "destructive"
      });
    }
  });

  return {
    createContentMutation,
    updateContentMutation,
    deleteContentMutation
  };
}
