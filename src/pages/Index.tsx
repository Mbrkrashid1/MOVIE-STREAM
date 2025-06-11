
import { useEffect } from "react";
import MovieBoxNavbar from "@/components/layout/MovieBoxNavbar";
import BottomNavigation from "@/components/layout/BottomNavigation";
import { useToast } from "@/hooks/use-toast";
import { useContentData } from "@/hooks/useContentData";
import MovieBoxHero from "@/components/ui/MovieBoxHero";
import MovieBoxRow from "@/components/ui/MovieBoxRow";
import VideoAdBanner from "@/components/ui/VideoAdBanner";

const Index = () => {
  const { toast } = useToast();
  const { 
    featuredItems, 
    videosList, 
    videoAds, 
    isLoading,
    getMovieContent,
    getSeriesContent 
  } = useContentData();

  useEffect(() => {
    // Show welcome toast on initial load
    toast({
      title: "Welcome to HausaBox!",
      description: "Discover amazing Hausa movies and series offline & online.",
    });
  }, []);

  // Find premium ad if available
  const premiumAd = videoAds?.length > 0 ? videoAds[0] : null;
  
  // Find mid-section ad if available
  const midAd = videoAds?.length > 1 ? videoAds[1] : null;
  
  // Get movie and series content
  const movieContent = getMovieContent();
  const seriesContent = getSeriesContent();

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <MovieBoxNavbar />
        <div className="pt-16 h-[calc(100vh-120px)] flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading amazing Hausa content...</p>
          </div>
        </div>
        <BottomNavigation />
      </div>
    );
  }

  // Transform content for MovieBox components
  const transformedFeatured = featuredItems?.map(item => ({
    ...item,
    rating: 8.5 + Math.random() * 1.5,
    year: 2020 + Math.floor(Math.random() * 4),
    duration: "2h 15m",
    genre: "Drama",
    description: "An epic Hausa story that captures the essence of Northern Nigerian culture with compelling characters and beautiful cinematography."
  })) || [];

  const transformedMovies = movieContent.map(item => ({
    id: item.id,
    title: item.title,
    thumbnail: item.thumbnail,
    type: "movie" as const,
    rating: 7.0 + Math.random() * 2.5,
    year: 2018 + Math.floor(Math.random() * 6),
    duration: item.duration,
    genre: "Drama",
    isNew: Math.random() > 0.7
  }));

  const transformedSeries = seriesContent.map(item => ({
    id: item.id,
    title: item.title,
    thumbnail: item.thumbnail,
    type: "series" as const,
    rating: 7.5 + Math.random() * 2.0,
    year: 2019 + Math.floor(Math.random() * 5),
    duration: "45m",
    genre: "Drama",
    isNew: Math.random() > 0.6
  }));

  const recentlyAdded = [...transformedMovies, ...transformedSeries]
    .sort(() => 0.5 - Math.random())
    .slice(0, 10);

  const trending = [...transformedMovies, ...transformedSeries]
    .sort(() => 0.5 - Math.random())
    .slice(0, 12);

  return (
    <div className="min-h-screen bg-background pb-24">
      <MovieBoxNavbar />
      
      <div className="pt-16">
        {/* Hero Section */}
        {transformedFeatured.length > 0 && (
          <MovieBoxHero items={transformedFeatured} />
        )}
        
        {/* Premium Ad */}
        {premiumAd && (
          <div className="px-6 mt-12">
            <VideoAdBanner 
              key={premiumAd.id}
              ad={{...premiumAd, cta_text: "Learn More"}}
            />
          </div>
        )}

        {/* Content Sections */}
        <div className="mt-12">
          {/* Trending Now */}
          {trending.length > 0 && (
            <MovieBoxRow 
              title="🔥 Trending Hausa Content" 
              movies={trending}
              priority={true}
            />
          )}

          {/* Recently Added */}
          {recentlyAdded.length > 0 && (
            <MovieBoxRow 
              title="✨ Fresh Uploads" 
              movies={recentlyAdded}
            />
          )}

          {/* Mid-section Ad */}
          {midAd && (
            <div className="px-6 my-12">
              <VideoAdBanner 
                key={midAd.id}
                ad={midAd}
              />
            </div>
          )}

          {/* Popular Movies */}
          {transformedMovies.length > 0 && (
            <MovieBoxRow 
              title="🎬 Popular Hausa Movies" 
              movies={transformedMovies.slice(0, 12)}
              viewAllLink="/movies"
            />
          )}

          {/* Latest Series */}
          {transformedSeries.length > 0 && (
            <MovieBoxRow 
              title="📺 Kannywood Series" 
              movies={transformedSeries.slice(0, 12)}
              viewAllLink="/series"
            />
          )}
        </div>
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default Index;
