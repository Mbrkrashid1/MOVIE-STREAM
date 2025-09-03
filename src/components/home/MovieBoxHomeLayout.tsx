
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
    <div className="min-h-screen bg-streaming-darker text-streaming-text w-full overflow-x-hidden">
      <MovieBoxNavbar />
      
      <main className="w-full pt-16 pb-20">
        {/* Professional Header Section */}
        <div className="bg-gradient-dark border-b border-streaming-border/30">
          {/* Search Bar */}
          <div className="container mx-auto px-4 py-6 max-w-7xl">
            <div className="bg-streaming-card/60 backdrop-blur-sm rounded-2xl px-6 py-4 flex items-center border border-streaming-border/40 shadow-card hover:shadow-primary transition-all duration-300 max-w-2xl">
              <svg className="w-5 h-5 text-streaming-muted mr-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input 
                type="text" 
                placeholder="Search movies, series, documentaries..." 
                className="bg-transparent text-streaming-text placeholder-streaming-muted text-sm flex-1 outline-none"
              />
              <div className="ml-4 px-3 py-1.5 bg-gradient-primary text-white text-xs font-medium rounded-lg cursor-pointer hover:shadow-glow transition-all duration-200">
                Search
              </div>
            </div>
          </div>

          {/* Category Navigation */}
          <div className="container mx-auto px-4 max-w-7xl">
            <CategoryTabs />
          </div>
        </div>

        {/* Content Sections */}
        <div className="container mx-auto px-4 max-w-7xl space-y-8">
          {/* Hero Featured Content */}
          {heroItems.length > 0 && (
            <section className="mt-8">
              <HeroSection heroItems={heroItems} />
            </section>
          )}

          {/* Auto-Scroll Banner */}
          <section className="py-4">
            <AutoScrollBanner banners={mockBanners} autoScrollInterval={5000} />
          </section>

          {/* Video Ads Display with Autoplay */}
          {videoAdsWithVideo.length > 0 && (
            <section className="py-4">
              <VideoAdsDisplay ads={videoAdsWithVideo} />
            </section>
          )}

          {/* Shorts Highlights */}
          <section className="py-4">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gradient mb-2">Trending Shorts</h2>
              <p className="text-streaming-muted text-sm">Quick highlights from your favorite content</p>
            </div>
            <ShortsHighlights shorts={mockShorts} />
          </section>

          {/* Content Categories */}
          <section className="py-4">
            <ContentCategories />
          </section>

          {/* Trending Section */}
          <section className="py-4 mb-8">
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
