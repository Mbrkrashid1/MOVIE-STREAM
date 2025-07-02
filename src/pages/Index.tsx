
import { useEffect } from "react";
import MovieBoxNavbar from "@/components/layout/MovieBoxNavbar";
import BottomNavigation from "@/components/layout/BottomNavigation";
import { useToast } from "@/hooks/use-toast";
import { useContentData } from "@/hooks/useContentData";
import LoadingScreen from "@/components/home/LoadingScreen";
import HeroSection from "@/components/home/HeroSection";
import ContentRowsSection from "@/components/home/ContentRowsSection";
import AutoSlideAdBanner from "@/components/ui/AutoSlideAdBanner";
import AutoPlayAdSequencer from "@/components/home/AutoPlayAdSequencer";
import BannerAdSpace from "@/components/home/BannerAdSpace";
import Scene3D from "@/components/home/Scene3D";

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

  const videoAdsList = videoAds?.filter(ad => ad.thumbnail_url && ad.video_url) || [];
  
  // Convert video ads to banner ads format - safely handle optional CTA properties
  const bannerAds = videoAdsList.slice(0, 5).map(ad => ({
    id: ad.id,
    title: ad.title,
    description: ad.description,
    image_url: ad.thumbnail_url || '',
    cta_text: ad.cta_text || undefined,
    cta_url: ad.cta_url || undefined,
    background_color: 'from-purple-900/20 to-blue-900/20'
  }));

  const handleAdComplete = (adId: string) => {
    console.log('Ad completed:', adId);
    // Track ad completion here
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card/20 to-background pb-20 relative overflow-hidden">
      {/* 3D Background Scene */}
      <Scene3D />
      
      <MovieBoxNavbar />
      
      <div className="pt-16 relative z-10">
        {/* Hero Section with enhanced 3D effects */}
        {featuredItems && featuredItems.length > 0 && (
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-accent/10 blur-3xl"></div>
            <HeroSection featuredItems={featuredItems} />
          </div>
        )}

        {/* Banner Ad Space */}
        {bannerAds.length > 0 && (
          <div className="px-3 mb-6">
            <BannerAdSpace 
              ads={bannerAds}
              autoSlideInterval={6000}
              showNavigation={true}
              className="mb-4"
            />
          </div>
        )}

        {/* Premium Auto-Slide Ad Banner */}
        {videoAdsList.length > 0 && (
          <div className="px-3 mb-8 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 rounded-2xl blur-lg transform scale-105"></div>
            <div className="relative z-10">
              <AutoSlideAdBanner 
                ads={videoAdsList.slice(0, 5)} 
                autoSlideInterval={7000}
                showControls={true}
              />
            </div>
          </div>
        )}

        {/* Content with Integrated Ad Banners */}
        <div className="space-y-8 relative">
          {/* Floating 3D decorative elements */}
          <div className="absolute -top-10 -left-10 w-32 h-32 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-2xl animate-pulse-slow"></div>
          <div className="absolute top-1/2 -right-10 w-24 h-24 bg-gradient-to-bl from-accent/15 to-primary/15 rounded-full blur-xl animate-spin-slow"></div>
          
          {/* Content Rows with Auto Ad Banner Integration */}
          <div className="relative">
            <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 w-40 h-40 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 rounded-full blur-3xl"></div>
            <ContentRowsSection 
              movieContent={movieContent} 
              seriesContent={seriesContent} 
            />
          </div>
        </div>

        {/* Enhanced Bottom Gradient with 3D effect */}
        <div className="h-16 bg-gradient-to-t from-background via-background/80 to-transparent mt-8 relative">
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 blur-sm"></div>
        </div>
      </div>
      
      {/* Auto-Playing Ad Sequencer (Fixed Position) */}
      {videoAdsList.length > 0 && (
        <AutoPlayAdSequencer
          ads={videoAdsList}
          autoPlayDuration={30}
          onAdComplete={handleAdComplete}
        />
      )}
      
      <BottomNavigation />
    </div>
  );
};

export default Index;
