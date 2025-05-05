
import { useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import BottomNavigation from "@/components/layout/BottomNavigation";
import { useToast } from "@/hooks/use-toast";
import { useContentData } from "@/hooks/useContentData";
import FeaturedSection from "@/components/home/FeaturedSection";
import ContentRows from "@/components/home/ContentRows";
import RecommendedContent from "@/components/home/RecommendedContent";

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
      title: "Welcome to KannyFlix!",
      description: "Discover amazing movies and series.",
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
      <div className="pb-24">
        <Navbar />
        <div className="mt-14 h-[calc(100vh-120px)] flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
        <BottomNavigation />
      </div>
    );
  }

  return (
    <div className="pb-24">
      <Navbar />
      <div className="mt-14">
        {/* Featured content and premium ad */}
        <FeaturedSection 
          featuredItems={featuredItems} 
          premiumAd={premiumAd}
        />
        
        {/* Movie and Series rows with mid-ad */}
        <ContentRows
          movieContent={movieContent}
          seriesContent={seriesContent}
          midAd={midAd}
        />
        
        {/* Recommended content section with ad sequencing */}
        <RecommendedContent 
          videosList={videosList}
          videoAds={videoAds}
        />
      </div>
      <BottomNavigation />
    </div>
  );
};

export default Index;
