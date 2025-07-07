
import { useEffect } from "react";
import { useContentData } from "@/hooks/useContentData";
import { useToast } from "@/hooks/use-toast";
import MovieBoxHero from "@/components/ui/MovieBoxHero";
import MovieBoxRow from "@/components/ui/MovieBoxRow";
import AutoPlayAdSequencer from "@/components/home/AutoPlayAdSequencer";
import BannerAdSpace from "@/components/home/BannerAdSpace";
import MovieBoxNavbar from "@/components/layout/MovieBoxNavbar";
import BottomNavigation from "@/components/layout/BottomNavigation";
import LoadingScreen from "@/components/home/LoadingScreen";
import Scene3D from "@/components/home/Scene3D";

const MovieBoxHomeLayout = () => {
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
      description: "Your premium streaming destination.",
    });
  }, []);

  const movieContent = getMovieContent();
  const seriesContent = getSeriesContent();

  if (isLoading) {
    return <LoadingScreen />;
  }

  // Transform content for MovieBox cards
  const transformToMovieBoxCard = (content: any[]) => {
    return content.map(item => ({
      id: item.id,
      title: item.title,
      thumbnail: item.thumbnail || "https://images.unsplash.com/photo-1489599507557-6b9b2b1e8e8f",
      type: item.type as "movie" | "series",
      rating: Math.random() * 5, // Placeholder rating
      year: 2024,
      duration: item.duration || "2h 15m",
      genre: "Drama",
      isNew: Math.random() > 0.7
    }));
  };

  // Transform featured items for hero section
  const heroItems = featuredItems?.map(item => ({
    id: item.id,
    title: item.title,
    description: "Experience the best of Hausa cinema with premium quality streaming.",
    backgroundImage: item.backgroundImage,
    type: item.type,
    rating: 4.5,
    year: 2024,
    duration: "2h 30m",
    genre: "Drama"
  })) || [];

  // Separate banner ads and video ads
  const bannerAds = videoAds?.filter(ad => 
    ad.thumbnail_url && (!ad.duration || ad.duration === 0)
  ).map(ad => ({
    id: ad.id,
    title: ad.title,
    description: ad.description,
    image_url: ad.thumbnail_url || '',
    cta_text: ad.cta_text || "Learn More",
    cta_url: ad.cta_url || "#",
    background_color: 'from-red-900/20 to-black/40'
  })) || [];

  const actualVideoAds = videoAds?.filter(ad => 
    ad.video_url && ad.duration && ad.duration > 0
  ) || [];

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* 3D Background Scene */}
      <Scene3D />
      
      <MovieBoxNavbar />
      
      <div className="relative z-10">
        {/* Hero Section */}
        {heroItems.length > 0 && (
          <MovieBoxHero items={heroItems} />
        )}

        {/* Banner Ad Space */}
        {bannerAds.length > 0 && (
          <div className="px-6 mb-12">
            <BannerAdSpace 
              ads={bannerAds}
              autoSlideInterval={6000}
              showNavigation={true}
              className="mb-8"
            />
          </div>
        )}

        {/* Content Rows */}
        <div className="space-y-12 pb-32">
          {/* Trending Movies */}
          {movieContent.length > 0 && (
            <MovieBoxRow
              title="🔥 Trending Movies"
              movies={transformToMovieBoxCard(movieContent.slice(0, 12))}
              viewAllLink="/movies"
              priority={true}
            />
          )}

          {/* Popular Series */}
          {seriesContent.length > 0 && (
            <MovieBoxRow
              title="📺 Popular Series"
              movies={transformToMovieBoxCard(seriesContent.slice(0, 12))}
              viewAllLink="/series"
            />
          )}

          {/* New Releases */}
          {videosList && videosList.length > 0 && (
            <MovieBoxRow
              title="✨ New Releases"
              movies={transformToMovieBoxCard(videosList.slice(0, 12))}
              viewAllLink="/new"
            />
          )}

          {/* Recommended for You */}
          {movieContent.length > 6 && (
            <MovieBoxRow
              title="🎯 Recommended for You"
              movies={transformToMovieBoxCard(movieContent.slice(6, 18))}
              viewAllLink="/recommended"
            />
          )}

          {/* Action Movies */}
          {movieContent.length > 12 && (
            <MovieBoxRow
              title="💥 Action & Adventure"
              movies={transformToMovieBoxCard(movieContent.slice(12, 24))}
              viewAllLink="/action"
            />
          )}
        </div>
      </div>

      {/* Floating Auto-Play Video Ads */}
      {actualVideoAds.length > 0 && (
        <AutoPlayAdSequencer 
          ads={actualVideoAds.slice(0, 3)}
          autoPlayDuration={8}
          onAdComplete={(adId) => {
            console.log('Ad completed:', adId);
          }}
        />
      )}
      
      <BottomNavigation />
    </div>
  );
};

export default MovieBoxHomeLayout;
