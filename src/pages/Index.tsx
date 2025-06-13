
import { useEffect } from "react";
import MovieBoxNavbar from "@/components/layout/MovieBoxNavbar";
import BottomNavigation from "@/components/layout/BottomNavigation";
import { useToast } from "@/hooks/use-toast";
import { useContentData } from "@/hooks/useContentData";
import MovieBoxHero from "@/components/ui/MovieBoxHero";
import MovieBoxRow from "@/components/ui/MovieBoxRow";
import ContinuousVideoAd from "@/components/home/ContinuousVideoAd";
import ImageBannerAd from "@/components/home/ImageBannerAd";

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
      title: "Welcome to HausaBox! 🎬",
      description: "Discover amazing Hausa movies and series offline & online.",
    });
  }, []);

  // Get movie and series content
  const movieContent = getMovieContent();
  const seriesContent = getSeriesContent();

  // Loading state with enhanced graphics
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-card to-background">
        <MovieBoxNavbar />
        <div className="pt-16 h-[calc(100vh-120px)] flex items-center justify-center">
          <div className="text-center">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-6"></div>
              <div className="absolute inset-0 w-16 h-16 border-4 border-accent/20 border-b-accent rounded-full animate-spin mx-auto mt-2 ml-2"></div>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Loading HausaBox
              </h3>
              <p className="text-muted-foreground animate-pulse">Preparing amazing Hausa content...</p>
            </div>
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

  // Separate video and image ads
  const videoAdsList = videoAds?.filter(ad => ad.video_url) || [];
  const imageAdsList = videoAds?.filter(ad => !ad.video_url && ad.thumbnail_url) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card/30 to-background pb-24">
      <MovieBoxNavbar />
      
      <div className="pt-16">
        {/* Enhanced Hero Section with Gradient Overlay */}
        {transformedFeatured.length > 0 && (
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent z-10"></div>
            <MovieBoxHero items={transformedFeatured} />
          </div>
        )}

        {/* Continuous Video Ad Section */}
        {videoAdsList.length > 0 && (
          <div className="px-4 mt-8">
            <ContinuousVideoAd ads={videoAdsList} />
          </div>
        )}

        {/* Content Sections with Enhanced Styling */}
        <div className="mt-12 space-y-8">
          {/* Trending Section with Graphics */}
          {trending.length > 0 && (
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-32 h-32 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-3xl"></div>
              <MovieBoxRow 
                title="🔥 Trending Hausa Content" 
                movies={trending}
                priority={true}
              />
            </div>
          )}

          {/* Image Banner Ad */}
          {imageAdsList.length > 0 && (
            <div className="px-4">
              <ImageBannerAd ad={imageAdsList[0]} />
            </div>
          )}

          {/* Recently Added with Graphics */}
          {recentlyAdded.length > 0 && (
            <div className="relative">
              <div className="absolute -top-4 -right-4 w-40 h-40 bg-gradient-to-bl from-accent/15 to-primary/15 rounded-full blur-3xl"></div>
              <MovieBoxRow 
                title="✨ Fresh Uploads" 
                movies={recentlyAdded}
              />
            </div>
          )}

          {/* Second Video Ad for Mid-Section */}
          {videoAdsList.length > 1 && (
            <div className="px-4">
              <ContinuousVideoAd ads={[videoAdsList[1]]} />
            </div>
          )}

          {/* Popular Movies with Enhanced Graphics */}
          {transformedMovies.length > 0 && (
            <div className="relative">
              <div className="absolute top-1/2 left-0 w-24 h-24 bg-gradient-to-r from-primary/25 to-transparent rounded-full blur-2xl"></div>
              <MovieBoxRow 
                title="🎬 Popular Hausa Movies" 
                movies={transformedMovies.slice(0, 12)}
                viewAllLink="/movies"
              />
            </div>
          )}

          {/* Image Banner Ad (Second) */}
          {imageAdsList.length > 1 && (
            <div className="px-4">
              <ImageBannerAd ad={imageAdsList[1]} />
            </div>
          )}

          {/* Latest Series with Graphics */}
          {transformedSeries.length > 0 && (
            <div className="relative">
              <div className="absolute top-1/2 right-0 w-28 h-28 bg-gradient-to-l from-accent/20 to-transparent rounded-full blur-2xl"></div>
              <MovieBoxRow 
                title="📺 Kannywood Series" 
                movies={transformedSeries.slice(0, 12)}
                viewAllLink="/series"
              />
            </div>
          )}
        </div>

        {/* Bottom Gradient Overlay */}
        <div className="h-16 bg-gradient-to-t from-background to-transparent mt-8"></div>
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default Index;
