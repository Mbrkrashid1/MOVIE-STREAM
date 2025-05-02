
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface CommentSectionProps {
  contentId: string;
}

const CommentSection = ({ contentId }: CommentSectionProps) => {
  const [comment, setComment] = useState("");
  const [username, setUsername] = useState("");
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch comments for this content
  const { data: comments, isLoading } = useQuery({
    queryKey: ["comments", contentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("comments")
        .select("*")
        .eq("content_id", contentId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });

  // Add new comment
  const addCommentMutation = useMutation({
    mutationFn: async (newComment: { content_id: string; username: string; comment: string }) => {
      const { data, error } = await supabase
        .from("comments")
        .insert(newComment)
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", contentId] });
      setComment("");
      toast({
        title: "Comment added",
        description: "Your comment has been added successfully.",
      });
    },
    onError: (error) => {
      console.error("Error adding comment:", error);
      toast({
        title: "Error",
        description: "Failed to add your comment. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim() || !username.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide both a username and comment.",
        variant: "destructive",
      });
      return;
    }

    addCommentMutation.mutate({
      content_id: contentId,
      username: username.trim(),
      comment: comment.trim(),
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Comments</h2>

      {/* Add comment form */}
      <form onSubmit={handleSubmitComment} className="mb-6 space-y-3">
        <div>
          <Input
            placeholder="Your name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="bg-gray-800 border-gray-700"
            required
          />
        </div>
        <div className="flex items-center gap-2">
          <Input
            placeholder="Add a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="flex-1 bg-gray-800 border-gray-700"
            required
          />
          <Button type="submit" disabled={addCommentMutation.isPending}>
            {addCommentMutation.isPending ? "Posting..." : "Post"}
          </Button>
        </div>
      </form>

      {/* Comments list */}
      <div className="space-y-4">
        {isLoading && <p className="text-center text-gray-400">Loading comments...</p>}
        
        {!isLoading && comments?.length === 0 && (
          <p className="text-center text-gray-400">No comments yet. Be the first to comment!</p>
        )}

        {comments?.map((comment) => (
          <div key={comment.id} className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">{comment.username}</span>
              <span className="text-xs text-gray-400">{formatDate(comment.created_at)}</span>
            </div>
            <p className="text-gray-300">{comment.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentSection;
