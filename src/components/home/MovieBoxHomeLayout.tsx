
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
    <div className="min-h-screen bg-black text-white relative overflow-hidden w-full">
      <MovieBoxNavbar />
      
      <div className="relative z-10 w-full">
        {/* Hero Section with 3D Background */}
        <HeroSection heroItems={heroItems} />

        {/* Video and Banner Ads Sections */}
        <AdsSection videoAds={videoAdsWithVideo} bannerAds={bannerAdsOnly} />

        {/* Content Library with Movie and Series Rows */}
        <ContentRowsSection 
          movieContent={movieContent} 
          seriesContent={seriesContent} 
          videosList={videosList} 
        />
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default MovieBoxHomeLayout;
