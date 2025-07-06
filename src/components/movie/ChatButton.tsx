
import { useState } from 'react';
import { MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useChat } from '@/hooks/useChat';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface ChatButtonProps {
  movieId: string;
  movieTitle: string;
}

export function ChatButton({ movieId, movieTitle }: ChatButtonProps) {
  const { user } = useAuth();
  const { createMovieDiscussion } = useChat();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleStartDiscussion = async () => {
    if (!user) {
      navigate('/auth');
      return;
    }

    setLoading(true);
    const chatRoomId = await createMovieDiscussion(movieId, movieTitle);
    
    if (chatRoomId) {
      navigate('/chat');
      toast({
        title: "Discussion Started",
        description: `Started discussion for ${movieTitle}`
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to start discussion",
        variant: "destructive"
      });
    }
    setLoading(false);
  };

  return (
    <Button
      onClick={handleStartDiscussion}
      disabled={loading}
      className="flex items-center gap-2"
      variant="outline"
    >
      <MessageSquare className="h-4 w-4" />
      {loading ? "Starting..." : "Discuss Movie"}
    </Button>
  );
}
