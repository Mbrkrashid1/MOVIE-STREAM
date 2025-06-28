
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Download, Play, Share, MessageSquare, Eye } from "lucide-react";
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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-muted-foreground">Loading content...</p>
        </div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-center px-4">
        <div>
          <h2 className="text-xl font-bold mb-2">Content Not Found</h2>
          <p className="text-muted-foreground mb-4">The content you're looking for doesn't exist or has been removed.</p>
          <Link to="/">
            <Button>Return to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-24 bg-background min-h-screen">
      {!isPlaying ? (
        <>
          <Navbar />
          
          <div className="mt-14">
            {/* Movie poster with backdrop support */}
            <div className="relative h-[50vh]">
              <img 
                src={(movie as any).backdrop_url || movie.thumbnail_url || "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5"} 
                alt={movie.title} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent"></div>
              
              {/* Back button */}
              <Link 
                to="/" 
                className="absolute top-4 left-4 z-10 bg-black/60 p-2 rounded-full backdrop-blur-sm hover:bg-black/80 transition-colors"
              >
                <ArrowLeft size={20} className="text-white" />
              </Link>
              
              {/* Movie info overlay */}
              <div className="absolute bottom-0 left-0 w-full p-6 text-white">
                <h1 className="text-3xl font-bold mb-2">{movie.title}</h1>
                
                {/* Enhanced metadata */}
                <div className="flex items-center flex-wrap gap-4 mb-4 text-sm">
                  <div className="flex items-center bg-black/40 px-3 py-1 rounded-full backdrop-blur-sm">
                    <Eye size={14} className="mr-1" />
                    <span>{movie.views?.toLocaleString() || 0} views</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span>{movie.release_year || "Unknown"}</span>
                    <span>•</span>
                    <span>{formatDuration(movie.duration)}</span>
                  </div>
                  
                  <div className="text-sm">
                    <span>{movie.category} • {movie.language || "Hausa"}</span>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm font-medium">
                    {movie.type === 'movie' ? 'Movie' : 'Series'}
                  </span>
                  {movie.is_featured && (
                    <span className="px-3 py-1 bg-accent/20 text-accent rounded-full text-sm font-medium">
                      Featured
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            {/* Enhanced action buttons */}
            <div className="flex gap-4 p-6">
              <Button 
                onClick={handlePlay} 
                className="flex-1 bg-primary hover:bg-primary/90 text-white font-semibold py-3 transition-all duration-200 hover:scale-105"
              >
                <Play size={18} className="mr-2" fill="white" /> 
                Play Now
              </Button>
              <Button 
                onClick={handleDownload} 
                variant="outline"
                className="flex-1 border-2 font-semibold py-3 transition-all duration-200 hover:scale-105"
              >
                <Download size={18} className="mr-2" /> 
                Download
              </Button>
            </div>
            
            {/* Description */}
            <div className="px-6 mb-6">
              <h2 className="text-xl font-semibold mb-3">About this {movie.type}</h2>
              <p className="text-muted-foreground leading-relaxed">
                {movie.description || "No description available for this content."}
              </p>
            </div>
            
            {/* Comments toggle button */}
            <div className="px-6 mb-6">
              <Button
                variant="outline"
                onClick={() => setShowComments(!showComments)}
                className="w-full flex items-center justify-center py-3 font-semibold transition-all duration-200"
              >
                <MessageSquare size={18} className="mr-2" />
                {showComments ? "Hide Comments" : `Show Comments & Discussion`}
              </Button>
            </div>
            
            {/* Comments section */}
            {showComments && (
              <div className="px-6 mb-8">
                <CommentSection contentId={movie.id} />
              </div>
            )}
            
            {/* Recommended content */}
            {similarContent && similarContent.length > 0 && (
              <div className="mt-8 px-6">
                <h2 className="text-xl font-semibold mb-6 flex items-center">
                  <span className="w-1 h-6 bg-primary rounded-full mr-3"></span>
                  More Like This
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {similarContent.map((item) => (
                    <Link to={`/${item.type}/${item.id}`} key={item.id} className="block group">
                      <div className="relative aspect-video rounded-lg overflow-hidden shadow-lg transition-transform duration-200 group-hover:scale-105">
                        <img 
                          src={item.thumbnail_url || "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5"} 
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-3">
                          <h3 className="text-white font-semibold text-sm mb-1 line-clamp-2">{item.title}</h3>
                          <div className="flex items-center text-xs text-gray-300 space-x-2">
                            <span>{formatDuration(item.duration)}</span>
                            <span>•</span>
                            <span className="flex items-center">
                              <Eye size={10} className="mr-1" />
                              {item.views?.toLocaleString() || 0}
                            </span>
                          </div>
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
            backdrop={(movie as any).backdrop_url || movie.thumbnail_url}
            title={movie.title}
            description={movie.description}
            views={movie.views || 0}
            onClose={() => setIsPlaying(false)}
          />
        </div>
      )}
    </div>
  );
};

export default MovieDetail;
