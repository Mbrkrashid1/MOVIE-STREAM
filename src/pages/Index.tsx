
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
    toast({
      title: "Welcome to HausaBox! 🎬",
      description: "Discover amazing Hausa movies and series offline & online.",
    });
  }, []);

  const movieContent = getMovieContent();
  const seriesContent = getSeriesContent();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-card to-background">
        <MovieBoxNavbar />
        <div className="pt-16 h-[calc(100vh-120px)] flex items-center justify-center">
          <div className="text-center">
            <div className="relative">
              <div className="w-16 h-16 border-3 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
              <div className="absolute inset-0 w-12 h-12 border-3 border-accent/20 border-b-accent rounded-full animate-spin mx-auto mt-2 ml-2"></div>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Loading HausaBox
              </h3>
              <p className="text-muted-foreground animate-pulse text-sm">Preparing amazing Hausa content...</p>
            </div>
          </div>
        </div>
        <BottomNavigation />
      </div>
    );
  }

  // Transform content for MovieBox components with smaller sizes
  const transformedFeatured = featuredItems?.map(item => ({
    ...item,
    rating: 8.5 + Math.random() * 1.5,
    year: 2020 + Math.floor(Math.random() * 4),
    duration: "2h 15m",
    genre: "Drama",
    description: "An epic Hausa story that captures the essence of Northern Nigerian culture."
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
    .slice(0, 12);

  const trending = [...transformedMovies, ...transformedSeries]
    .sort(() => 0.5 - Math.random())
    .slice(0, 15);

  const videoAdsList = videoAds?.filter(ad => ad.video_url) || [];
  const imageAdsList = videoAds?.filter(ad => !ad.video_url && ad.thumbnail_url) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card/20 to-background pb-20">
      <MovieBoxNavbar />
      
      <div className="pt-16">
        {/* MovieBox Hero Section */}
        {transformedFeatured.length > 0 && (
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent z-10 pointer-events-none"></div>
            <MovieBoxHero items={transformedFeatured} />
          </div>
        )}

        {/* Premium Video Ad Section */}
        {videoAdsList.length > 0 && (
          <div className="px-3 mb-6">
            <ContinuousVideoAd ads={[videoAdsList[0]]} />
          </div>
        )}

        {/* Content Grid Layout - MovieBox Style */}
        <div className="space-y-6">
          {/* Trending Section with Compact Layout */}
          {trending.length > 0 && (
            <div className="relative">
              <div className="absolute -top-2 -left-2 w-24 h-24 bg-gradient-to-br from-primary/15 to-accent/15 rounded-full blur-2xl"></div>
              <MovieBoxRow 
                title="🔥 Trending Now" 
                movies={trending.slice(0, 12)}
                priority={true}
              />
            </div>
          )}

          {/* Image Banner Ad */}
          {imageAdsList.length > 0 && (
            <div className="px-3">
              <ImageBannerAd ad={imageAdsList[0]} />
            </div>
          )}

          {/* Popular Movies - Compact Grid */}
          {transformedMovies.length > 0 && (
            <div className="relative">
              <div className="absolute top-1/2 left-0 w-20 h-20 bg-gradient-to-r from-primary/20 to-transparent rounded-full blur-xl"></div>
              <MovieBoxRow 
                title="🎬 Popular Movies" 
                movies={transformedMovies.slice(0, 10)}
                viewAllLink="/movies"
              />
            </div>
          )}

          {/* Mid-Section Video Ad */}
          {videoAdsList.length > 1 && (
            <div className="px-3">
              <ContinuousVideoAd ads={[videoAdsList[1]]} />
            </div>
          )}

          {/* Recently Added - Smaller Cards */}
          {recentlyAdded.length > 0 && (
            <div className="relative">
              <div className="absolute -top-2 -right-2 w-28 h-28 bg-gradient-to-bl from-accent/12 to-primary/12 rounded-full blur-2xl"></div>
              <MovieBoxRow 
                title="✨ Fresh Uploads" 
                movies={recentlyAdded}
              />
            </div>
          )}

          {/* Second Image Banner Ad */}
          {imageAdsList.length > 1 && (
            <div className="px-3">
              <ImageBannerAd ad={imageAdsList[1]} />
            </div>
          )}

          {/* Kannywood Series */}
          {transformedSeries.length > 0 && (
            <div className="relative">
              <div className="absolute top-1/2 right-0 w-24 h-24 bg-gradient-to-l from-accent/18 to-transparent rounded-full blur-xl"></div>
              <MovieBoxRow 
                title="📺 Kannywood Series" 
                movies={transformedSeries.slice(0, 10)}
                viewAllLink="/series"
              />
            </div>
          )}

          {/* Bottom Video Ad */}
          {videoAdsList.length > 2 && (
            <div className="px-3">
              <ContinuousVideoAd ads={[videoAdsList[2]]} />
            </div>
          )}
        </div>

        {/* Bottom Gradient Fade */}
        <div className="h-12 bg-gradient-to-t from-background to-transparent mt-6"></div>
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default Index;
