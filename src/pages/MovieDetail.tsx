
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Download, Play, Share, MessageSquare } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import BottomNavigation from "@/components/layout/BottomNavigation";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import VideoPlayer from "@/components/VideoPlayer";
import CommentSection from "@/components/CommentSection";

const MovieDetail = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [isPlaying, setIsPlaying] = useState(false);
  const [showComments, setShowComments] = useState(false);

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
      
      // Wait to record view count to avoid refetching causing multiple increments
      return data;
    }
  });

  // Use a separate mutation to increment view count
  const incrementViewMutation = useMutation({
    mutationFn: async (contentId: string) => {
      const { error } = await supabase
        .from('content')
        .update({ views: (movie?.views || 0) + 1 })
        .eq('id', contentId);
        
      if (error) throw error;
    }
  });

  // Run the view increment once when the movie data is loaded
  useEffect(() => {
    if (movie?.id) {
      incrementViewMutation.mutate(movie.id);
    }
  }, [movie?.id]);

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
        .filter('is_sample', 'eq', false) // Only show real content
        .limit(5);
        
      if (error) throw error;
      return data;
    },
    enabled: !!movie?.category
  });

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handleDownload = () => {
    toast({
      title: "Download started",
      description: `${movie?.title} is being downloaded...`,
    });
  };

  const formatDuration = (seconds: number | null | undefined) => {
    if (!seconds) return "Unknown";
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-kannyflix-background flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-kannyflix-green border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen bg-kannyflix-background flex items-center justify-center text-center px-4">
        <div>
          <h2 className="text-xl font-bold mb-2">Content Not Found</h2>
          <p className="text-gray-400 mb-4">The content you're looking for doesn't exist or has been removed.</p>
          <Link to="/">
            <Button>Return to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-24 bg-kannyflix-background min-h-screen">
      {!isPlaying ? (
        <>
          <Navbar />
          
          <div className="mt-14">
            {/* Movie poster and gradient overlay */}
            <div className="relative h-[50vh]">
              <img 
                src={movie.thumbnail_url || "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5"} 
                alt={movie.title} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-kannyflix-background via-kannyflix-background/40 to-transparent"></div>
              
              {/* Back button */}
              <Link 
                to="/" 
                className="absolute top-4 left-4 z-10 bg-black/40 p-2 rounded-full"
              >
                <ArrowLeft size={20} className="text-white" />
              </Link>
              
              {/* Movie info overlay */}
              <div className="absolute bottom-0 left-0 w-full p-6 text-white">
                <h1 className="text-3xl font-bold">{movie.title}</h1>
                <div className="flex items-center mt-2 text-sm text-gray-300">
                  <span>{movie.release_year || "Unknown"}</span>
                  <span className="mx-2">•</span>
                  <span>{formatDuration(movie.duration)}</span>
                  <span className="mx-2">•</span>
                  <span>{movie.views} views</span>
                </div>
                <div className="mt-1 text-sm">
                  <span className="text-gray-300">{movie.category} • {movie.language || "Hausa"}</span>
                </div>
                
                <div className="flex gap-3 mt-4">
                  <span className="badge bg-gray-800">
                    {movie.type === 'movie' ? 'Movie' : 'Series'}
                  </span>
                  {movie.is_featured && (
                    <span className="badge bg-kannyflix-green/20 text-kannyflix-green">
                      Featured
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            {/* Action buttons */}
            <div className="flex gap-4 p-6">
              <Button 
                onClick={handlePlay} 
                className="flex-1 bg-kannyflix-green hover:bg-kannyflix-green/90 text-white"
              >
                <Play size={18} className="mr-2" /> Play
              </Button>
              <Button 
                onClick={handleDownload} 
                className="flex-1 bg-gray-800 hover:bg-gray-700 text-white"
              >
                <Download size={18} className="mr-2" /> Download
              </Button>
            </div>
            
            {/* Description */}
            <div className="px-6">
              <h2 className="text-xl font-semibold mb-2">Description</h2>
              <p className="text-gray-300 text-sm">
                {movie.description || "No description available."}
              </p>
            </div>
            
            {/* Comments toggle button */}
            <div className="px-6 mt-6">
              <Button
                variant="outline"
                onClick={() => setShowComments(!showComments)}
                className="w-full flex items-center justify-center"
              >
                <MessageSquare size={18} className="mr-2" />
                {showComments ? "Hide Comments" : "Show Comments"}
              </Button>
            </div>
            
            {/* Comments section */}
            {showComments && (
              <div className="px-6">
                <CommentSection contentId={movie.id} />
              </div>
            )}
            
            {/* Recommended */}
            {similarContent && similarContent.length > 0 && (
              <div className="mt-8 px-6">
                <h2 className="text-xl font-semibold mb-4">You might also like</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {similarContent.map((item) => (
                    <Link to={`/${item.type}/${item.id}`} key={item.id} className="block">
                      <div className="relative aspect-video rounded-lg overflow-hidden">
                        <img 
                          src={item.thumbnail_url || "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5"} 
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-2">
                          <h3 className="text-white font-medium text-sm">{item.title}</h3>
                          <p className="text-gray-300 text-xs">{formatDuration(item.duration)}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <BottomNavigation />
        </>
      ) : (
        <div className="fixed inset-0 z-50 bg-black">
          <VideoPlayer 
            videoUrl={movie.video_url} 
            contentId={movie.id}
            thumbnail={movie.thumbnail_url}
            onClose={() => setIsPlaying(false)}
          />
        </div>
      )}
    </div>
  );
};

export default MovieDetail;
