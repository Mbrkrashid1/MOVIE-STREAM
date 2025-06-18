
import { useEffect } from "react";
import MovieBoxNavbar from "@/components/layout/MovieBoxNavbar";
import BottomNavigation from "@/components/layout/BottomNavigation";
import { useToast } from "@/hooks/use-toast";
import { useContentData } from "@/hooks/useContentData";
import LoadingScreen from "@/components/home/LoadingScreen";
import HeroSection from "@/components/home/HeroSection";
import ContentRowsSection from "@/components/home/ContentRowsSection";
import AdsPlacement from "@/components/home/AdsPlacement";
import ContinuousVideoAd from "@/components/home/ContinuousVideoAd";

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
    return <LoadingScreen />;
  }

  const videoAdsList = videoAds?.filter(ad => ad.video_url) || [];
  const imageAdsList = videoAds?.filter(ad => !ad.video_url && ad.thumbnail_url) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card/20 to-background pb-20">
      <MovieBoxNavbar />
      
      <div className="pt-16">
        {/* Hero Section */}
        {featuredItems && featuredItems.length > 0 && (
          <HeroSection featuredItems={featuredItems} />
        )}

        {/* Ads and Content Layout */}
        <div className="space-y-6">
          {/* First Video Ad */}
          {videoAdsList.length > 0 && (
            <div className="px-3 mb-6">
              <ContinuousVideoAd ads={[videoAdsList[0]]} />
            </div>
          )}

          {/* Content Rows */}
          <ContentRowsSection 
            movieContent={movieContent} 
            seriesContent={seriesContent} 
          />

          {/* Additional Ads */}
          <AdsPlacement 
            videoAds={videoAdsList.slice(1)} 
            imageAds={imageAdsList} 
          />
        </div>

        {/* Bottom Gradient Fade */}
        <div className="h-12 bg-gradient-to-t from-background to-transparent mt-6"></div>
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default Index;
