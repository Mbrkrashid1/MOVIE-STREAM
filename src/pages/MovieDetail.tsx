
import { useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import BottomNavigation from "@/components/layout/BottomNavigation";
import { useToast } from "@/hooks/use-toast";
import VideoPlayer from "@/components/VideoPlayer";
import CommentSection from "@/components/CommentSection";
import BannerAdSpace from "@/components/home/BannerAdSpace";
import { MovieHero } from "@/components/movie/MovieHero";
import { MovieActions } from "@/components/movie/MovieActions";
import { MovieDescription } from "@/components/movie/MovieDescription";
import { CommentsToggle } from "@/components/movie/CommentsToggle";
import { SimilarContent } from "@/components/movie/SimilarContent";
import { MovieLoadingState } from "@/components/movie/MovieLoadingState";
import { MovieErrorState } from "@/components/movie/MovieErrorState";
import { useMovieData } from "@/hooks/useMovieData";
import { formatDuration } from "@/utils/movieUtils";

const MovieDetail = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [isPlaying, setIsPlaying] = useState(false);
  const [showComments, setShowComments] = useState(false);

  const { movie, isLoading, error, similarContent, bannerAds } = useMovieData(id);

  const handlePlay = () => {
    // Validate video URL before playing
    if (!movie?.video_url || movie.video_url.trim() === '' || movie.video_url === 'placeholder') {
      toast({
        title: "Video Not Available",
        description: "This content doesn't have a valid video source.",
        variant: "destructive"
      });
      return;
    }
    
    setIsPlaying(true);
  };

  const handleDownload = () => {
    toast({
      title: "Download started",
      description: `${movie?.title} is being downloaded...`,
    });
  };

  if (isLoading) {
    return <MovieLoadingState />;
  }

  if (error || !movie) {
    return <MovieErrorState />;
  }

  return (
    <div className="pb-24 bg-background min-h-screen">
      {!isPlaying ? (
        <>
          <Navbar />
          
          <div className="mt-14">
            <MovieHero movie={movie} formatDuration={formatDuration} />
            
            <MovieActions 
              movie={movie}
              onPlay={handlePlay}
              onDownload={handleDownload}
            />
            
            <MovieDescription movie={movie} />
            
            <CommentsToggle 
              showComments={showComments}
              onToggle={() => setShowComments(!showComments)}
            />
            
            {/* Comments section */}
            {showComments && (
              <div className="px-6 mb-8">
                <CommentSection contentId={movie.id} />
              </div>
            )}
            
            {/* Banner Ad Space - Sequential Display */}
            {bannerAds && bannerAds.length > 0 && (
              <div className="px-6 mb-8">
                <BannerAdSpace 
                  ads={bannerAds}
                  autoSlideInterval={8000}
                  showNavigation={true}
                  className="mb-4"
                />
              </div>
            )}
            
            <SimilarContent 
              similarContent={similarContent || []}
              formatDuration={formatDuration}
            />
          </div>
          
          <BottomNavigation />
        </>
      ) : (
        <div className="fixed inset-0 z-50 bg-black">
          <VideoPlayer 
            videoUrl={movie.video_url} 
            contentId={movie.id}
            thumbnail={movie.thumbnail_url}
            backdrop={movie.backdrop_url || movie.thumbnail_url}
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
