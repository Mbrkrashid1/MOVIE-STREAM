
import { useEffect } from "react";
import { useContentData } from "@/hooks/useContentData";
import { useToast } from "@/hooks/use-toast";
import MovieBoxNavbar from "@/components/layout/MovieBoxNavbar";
import BottomNavigation from "@/components/layout/BottomNavigation";
import LoadingScreen from "@/components/home/LoadingScreen";
import HeroSection from "@/components/home/HeroSection";
import AdsSection from "@/components/home/AdsSection";
import ContentRowsSection from "@/components/home/ContentRowsSection";
import { transformFeaturedForHero, filterVideoAds, filterBannerAds } from "@/utils/contentTransformers";

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

  // Transform featured items for hero section
  const heroItems = transformFeaturedForHero(featuredItems);

  // Filter video and banner ads
  const videoAdsWithVideo = filterVideoAds(videoAds);
  const bannerAdsOnly = filterBannerAds(videoAds);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90 text-foreground relative overflow-hidden w-full">
      {/* Professional Header */}
      <MovieBoxNavbar />
      
      {/* Main Content Area */}
      <div className="relative z-10 w-full">
        {/* Hero Section with Premium Design */}
        <div className="relative">
          <HeroSection heroItems={heroItems} />
          
          {/* Subtle overlay for better content separation */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/5 to-background/20 pointer-events-none" />
        </div>

        {/* Content Sections with Professional Spacing */}
        <div className="relative z-20 space-y-12 pb-24">
          {/* Video and Banner Ads with Enhanced Design */}
          <div className="px-6 lg:px-8">
            <AdsSection videoAds={videoAdsWithVideo} bannerAds={bannerAdsOnly} />
          </div>

          {/* Content Library with Professional Layout */}
          <div className="px-6 lg:px-8">
            <ContentRowsSection 
              movieContent={movieContent} 
              seriesContent={seriesContent} 
              videosList={videosList} 
            />
          </div>
        </div>
      </div>
      
      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};

export default MovieBoxHomeLayout;
