
import { useEffect } from "react";
import { useContentData } from "@/hooks/useContentData";
import { useToast } from "@/hooks/use-toast";
import MovieBoxHero from "@/components/ui/MovieBoxHero";
import MovieBoxRow from "@/components/ui/MovieBoxRow";
import BannerAdSpace from "@/components/home/BannerAdSpace";
import YouTubeStyleVideoAd from "@/components/home/YouTubeStyleVideoAd";
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

  // Transform content for MovieBox cards with enhanced metadata
  const transformToMovieBoxCard = (content: any[]) => {
    return content.map(item => ({
      id: item.id,
      title: item.title,
      thumbnail: item.thumbnail || item.thumbnail_url || "https://images.unsplash.com/photo-1489599507557-6b9b2b1e8e8f",
      type: item.type as "movie" | "series",
      rating: Math.random() * 2 + 3.5,
      year: 2024,
      duration: item.duration || "2h 15m",
      genre: ["Action", "Drama", "Comedy", "Thriller", "Romance"][Math.floor(Math.random() * 5)],
      isNew: Math.random() > 0.6,
      video_url: item.video_url // Ensure video URL is available
    }));
  };

  // Transform featured items for hero section
  const heroItems = featuredItems?.map(item => ({
    id: item.id,
    title: item.title,
    description: item.description || "Experience the finest Hausa cinema with stunning visuals, compelling storytelling, and unforgettable performances that capture the essence of our rich cultural heritage.",
    backgroundImage: item.backdrop_url || item.thumbnail_url,
    type: item.type,
    rating: 4.5,
    year: 2024,
    duration: "2h 30m",
    genre: "Drama",
    video_url: item.video_url
  })) || [];

  // Separate video ads and banner ads properly
  const videoAdsWithVideo = videoAds?.filter(ad => 
    ad.video_url && ad.video_url !== 'placeholder' && ad.video_url.trim() !== ''
  ) || [];

  const bannerAdsOnly = videoAds?.filter(ad => 
    ad.thumbnail_url && (!ad.video_url || ad.video_url === 'placeholder' || ad.video_url.trim() === '')
  ).map(ad => ({
    id: ad.id,
    title: ad.title,
    description: ad.description,
    image_url: ad.thumbnail_url || '',
    cta_text: ad.cta_text || "Learn More",
    cta_url: ad.cta_url || "#",
    background_color: 'from-red-900/30 to-black/60'
  })) || [];

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Cinematic Background Scene */}
      <Scene3D />
      
      {/* Premium Glass Morphism Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 pointer-events-none" />
      
      <MovieBoxNavbar />
      
      <div className="relative z-10">
        {/* Cinematic Hero Section */}
        {heroItems.length > 0 && (
          <MovieBoxHero items={heroItems} />
        )}

        {/* Organized Video Ads Section */}
        {videoAdsWithVideo.length > 0 && (
          <div className="px-6 mb-12">
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-white mb-2">🎬 Featured Videos</h2>
              <p className="text-gray-400 text-sm">Sponsored content you might enjoy</p>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent rounded-2xl blur-xl" />
              <div className="relative backdrop-blur-sm bg-black/10 rounded-2xl border border-white/5 p-6 shadow-2xl">
                <YouTubeStyleVideoAd 
                  ads={videoAdsWithVideo}
                  onAdComplete={(adId) => {
                    console.log('Video ad completed:', adId);
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Banner Ads Section */}
        {bannerAdsOnly.length > 0 && (
          <div className="px-6 mb-12">
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-white mb-2">📢 Sponsored</h2>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 to-transparent rounded-2xl blur-xl" />
              <BannerAdSpace 
                ads={bannerAdsOnly}
                autoSlideInterval={8000}
                showNavigation={true}
                className="relative backdrop-blur-sm bg-black/10 rounded-2xl border border-white/5 p-4 shadow-2xl"
              />
            </div>
          </div>
        )}

        {/* Content Library with Cinematic Sections */}
        <div className="space-y-12 pb-32">
          {/* Trending Now - Premium Showcase */}
          {movieContent.length > 0 && (
            <MovieBoxRow
              title="🔥 Trending Now"
              movies={transformToMovieBoxCard(movieContent.slice(0, 15))}
              viewAllLink="/movies"
              priority={true}
            />
          )}

          {/* New & Popular - Fresh Content */}
          {seriesContent.length > 0 && (
            <MovieBoxRow
              title="🆕 New & Popular"
              movies={transformToMovieBoxCard(seriesContent.slice(0, 15))}
              viewAllLink="/series"
            />
          )}

          {/* Continue Watching - Personalized */}
          {videosList && videosList.length > 6 && (
            <MovieBoxRow
              title="▶️ Continue Watching"
              movies={transformToMovieBoxCard(videosList.slice(0, 12))}
              viewAllLink="/continue"
            />
          )}

          {/* Premium Originals */}
          {movieContent.length > 12 && (
            <MovieBoxRow
              title="⭐ HausaBox Originals"
              movies={transformToMovieBoxCard(movieContent.slice(12, 27))}
              viewAllLink="/originals"
            />
          )}

          {/* Kannywood Classics */}
          {movieContent.length > 18 && (
            <MovieBoxRow
              title="🎭 Kannywood Classics"
              movies={transformToMovieBoxCard(movieContent.slice(18, 33))}
              viewAllLink="/classics"
            />
          )}

          {/* Action & Adventure */}
          {movieContent.length > 24 && (
            <MovieBoxRow
              title="💥 Action & Adventure"
              movies={transformToMovieBoxCard(movieContent.slice(24, 39))}
              viewAllLink="/action"
            />
          )}

          {/* Romance & Drama */}
          {seriesContent.length > 12 && (
            <MovieBoxRow
              title="💝 Romance & Drama"
              movies={transformToMovieBoxCard(seriesContent.slice(12, 27))}
              viewAllLink="/romance"
            />
          )}

          {/* Comedy Central */}
          {videosList && videosList.length > 18 && (
            <MovieBoxRow
              title="😂 Comedy Central"
              movies={transformToMovieBoxCard(videosList.slice(18, 33))}
              viewAllLink="/comedy"
            />
          )}

          {/* Family Entertainment */}
          {movieContent.length > 30 && (
            <MovieBoxRow
              title="👨‍👩‍👧‍👦 Family Entertainment"
              movies={transformToMovieBoxCard(movieContent.slice(30, 45))}
              viewAllLink="/family"
            />
          )}
        </div>
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default MovieBoxHomeLayout;
