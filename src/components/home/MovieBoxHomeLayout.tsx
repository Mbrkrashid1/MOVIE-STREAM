
import { useEffect } from "react";
import { useContentData } from "@/hooks/useContentData";
import { useToast } from "@/hooks/use-toast";
import MovieBoxNavbar from "@/components/layout/MovieBoxNavbar";
import BottomNavigation from "@/components/layout/BottomNavigation";
import LoadingScreen from "@/components/home/LoadingScreen";
import HeroSection from "@/components/home/HeroSection";
import CategoryTabs from "@/components/home/CategoryTabs";
import TrendingSection from "@/components/home/TrendingSection";
import ContentCategories from "@/components/home/ContentCategories";
import VideoAdsDisplay from "@/components/home/VideoAdsDisplay";
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

  const heroItems = transformFeaturedForHero(featuredItems);
  const videoAdsWithVideo = filterVideoAds(videoAds);
  const bannerAdsOnly = filterBannerAds(videoAds);

  return (
    <div className="min-h-screen bg-black text-white w-full overflow-x-hidden">
      <MovieBoxNavbar />
      
      <div className="w-full pt-16 pb-20">
        {/* Search Bar */}
        <div className="px-4 py-3 w-full">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-full px-4 py-3 flex items-center w-full border border-gray-700/30 max-w-md mx-auto lg:max-w-lg">
            <svg className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span className="text-gray-400 text-sm">Search movies, series...</span>
          </div>
        </div>

        {/* Category Navigation */}
        <div className="w-full">
          <CategoryTabs />
        </div>

        {/* Hero Featured Content */}
        {heroItems.length > 0 && (
          <div className="px-4 mb-6 w-full">
            <HeroSection heroItems={heroItems} />
          </div>
        )}

        {/* Video Ads Display with Autoplay */}
        {videoAdsWithVideo.length > 0 && (
          <div className="px-4 mb-6 w-full">
            <VideoAdsDisplay ads={videoAdsWithVideo} />
          </div>
        )}

        {/* Content Categories */}
        <div className="w-full">
          <ContentCategories />
        </div>

        {/* Trending Section */}
        <div className="w-full">
          <TrendingSection 
            videosList={videosList} 
            movieContent={movieContent} 
            seriesContent={seriesContent} 
          />
        </div>
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default MovieBoxHomeLayout;
