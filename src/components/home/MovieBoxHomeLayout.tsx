
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
import ShortsHighlights from "@/components/home/ShortsHighlights";
import AutoScrollBanner from "@/components/home/AutoScrollBanner";
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

  // Mock data for shorts highlights
  const mockShorts = [
    {
      id: "1",
      title: "Amazing Action Sequence from Latest Movie",
      video_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      thumbnail_url: "https://images.unsplash.com/photo-1518611012118-696072aa579a",
      views: 1500000,
      likes: 45000,
      creator: "MovieClips",
      duration: 45
    },
    {
      id: "2", 
      title: "Behind the Scenes Comedy Moments",
      video_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      thumbnail_url: "https://images.unsplash.com/photo-1489599162946-648229b4b4bb",
      views: 980000,
      likes: 32000,
      creator: "BehindScenes",
      duration: 60
    },
    {
      id: "3",
      title: "Epic Movie Trailer Breakdown",
      video_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4", 
      thumbnail_url: "https://images.unsplash.com/photo-1518611012118-696072aa579a",
      views: 2300000,
      likes: 78000,
      creator: "TrailerBreak",
      duration: 90
    }
  ];

  // Mock data for banners
  const mockBanners = [
    {
      id: "1",
      title: "Premium Movie Collection",
      description: "Discover the best movies of 2024 with exclusive content and behind-the-scenes footage",
      image_url: "https://images.unsplash.com/photo-1489599162946-648229b4b4bb",
      cta_text: "Explore Now",
      cta_url: "#",
      background_color: "#1a1a2e"
    },
    {
      id: "2", 
      title: "New Series Launch",
      description: "Watch the most anticipated series premiering this month",
      image_url: "https://images.unsplash.com/photo-1518611012118-696072aa579a",
      cta_text: "Watch Trailer",
      cta_url: "#",
      background_color: "#16213e"
    },
    {
      id: "3",
      title: "Exclusive Documentaries", 
      description: "Award-winning documentaries now available for streaming",
      image_url: "https://images.unsplash.com/photo-1536440136628-849c177e76a1",
      cta_text: "Learn More",
      cta_url: "#",
      background_color: "#0f3460"
    }
  ];

  if (isLoading) {
    return <LoadingScreen />;
  }

  const heroItems = transformFeaturedForHero(featuredItems);
  const videoAdsWithVideo = filterVideoAds(videoAds);
  const bannerAdsOnly = filterBannerAds(videoAds);

  return (
    <div className="min-h-screen bg-streaming-darker text-streaming-text w-full">
      <MovieBoxNavbar />
      
      <main className="w-full pt-20">
        {/* Category Navigation - Aligned with search bar */}
        <div className="bg-streaming-darker border-b border-streaming-border/20">
          <CategoryTabs />
        </div>

        {/* Content Sections with edge-to-edge layout */}
        <div className="w-full space-y-6">
          {/* Hero Featured Content */}
          {heroItems.length > 0 && (
            <section className="container mx-auto px-4 pt-6 max-w-7xl">
              <div className="mb-4">
                <h2 className="text-xl font-bold text-gradient mb-1">Featured Videos</h2>
                <p className="text-streaming-muted text-sm">Premium content handpicked for you</p>
              </div>
              <HeroSection heroItems={heroItems} />
            </section>
          )}

          {/* Auto-Scroll Banner */}
          <section className="container mx-auto px-4 max-w-7xl">
            <AutoScrollBanner banners={mockBanners} autoScrollInterval={5000} />
          </section>

          {/* Video Ads Display with Autoplay */}
          {videoAdsWithVideo.length > 0 && (
            <section className="container mx-auto px-4 max-w-7xl">
              <VideoAdsDisplay ads={videoAdsWithVideo} />
            </section>
          )}

          {/* Shorts Highlights */}
          <section className="container mx-auto px-4 max-w-7xl">
            <div className="mb-4">
              <h2 className="text-xl font-bold text-gradient mb-1">Trending Shorts</h2>
              <p className="text-streaming-muted text-sm">Quick highlights from your favorite content</p>
            </div>
            <ShortsHighlights shorts={mockShorts} />
          </section>

          {/* Content Categories */}
          <section className="w-full">
            <ContentCategories />
          </section>

          {/* Trending Section */}
          <section className="w-full pb-8">
            <TrendingSection 
              videosList={videosList} 
              movieContent={movieContent} 
              seriesContent={seriesContent} 
            />
          </section>
        </div>
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default MovieBoxHomeLayout;
