
import { useEffect } from "react";
import { useContentData } from "@/hooks/useContentData";
import { useToast } from "@/hooks/use-toast";
import BannerAdSpace from "@/components/home/BannerAdSpace";
import YouTubeStyleVideoAd from "@/components/home/YouTubeStyleVideoAd";
import MovieBoxNavbar from "@/components/layout/MovieBoxNavbar";
import BottomNavigation from "@/components/layout/BottomNavigation";
import LoadingScreen from "@/components/home/LoadingScreen";
import HeroSection from "@/components/home/HeroSection";
import { Link } from "react-router-dom";
import { Play, Eye } from "lucide-react";

const MobileHomeLayout = () => {
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
      title: "Barka da zuwa HausaBox! 🎬",
      description: "Gano kyawawan fina-finai da serials na Hausa.",
    });
  }, []);

  const movieContent = getMovieContent();
  const seriesContent = getSeriesContent();

  if (isLoading) {
    return <LoadingScreen />;
  }

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
    background_color: 'from-purple-900/20 to-blue-900/20'
  })) || [];

  // Filter content for Hausa categories only
  const hausaMovies = movieContent.filter(item => 
    item.title.toLowerCase().includes('hausa') || 
    ['kannywood', 'hausa movie', 'arewa'].some(keyword => 
      item.title.toLowerCase().includes(keyword)
    )
  );

  const hausaSeries = seriesContent.filter(item => 
    item.title.toLowerCase().includes('hausa') || 
    ['hausa series', 'arewa series'].some(keyword => 
      item.title.toLowerCase().includes(keyword)
    )
  );

  // Trending Hausa content
  const trendingContent = [...hausaMovies, ...hausaSeries]
    .sort((a, b) => {
      const aViews = typeof a.views === 'string' ? parseInt(a.views) || 0 : a.views || 0;
      const bViews = typeof b.views === 'string' ? parseInt(b.views) || 0 : b.views || 0;
      return bViews - aViews;
    })
    .slice(0, 6);

  const formatViews = (views: string | number | null) => {
    if (!views) return "0";
    const numViews = typeof views === 'string' ? parseInt(views) || 0 : views;
    if (numViews >= 1000) {
      return `${(numViews / 1000).toFixed(1)}k`;
    }
    return numViews.toString();
  };

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      <MovieBoxNavbar />
      
      <div className="pt-16">
        {/* Hero Section with Backdrop Images */}
        {featuredItems && featuredItems.length > 0 && (
          <HeroSection featuredItems={featuredItems} />
        )}

        {/* Search Bar */}
        <div className="px-4 py-3">
          <div className="bg-gray-800 rounded-full px-4 py-3 flex items-center">
            <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span className="text-gray-400">Nemo fina-finai da serials...</span>
          </div>
        </div>

        {/* Hausa Category Tabs */}
        <div className="flex px-4 space-x-6 mb-6 overflow-x-auto">
          <button className="text-white font-medium border-b-2 border-primary pb-2 whitespace-nowrap">Trending</button>
          <button className="text-gray-400 font-medium pb-2 whitespace-nowrap">Kannywood</button>
          <button className="text-gray-400 font-medium pb-2 whitespace-nowrap">Hausa Movies</button>
          <button className="text-gray-400 font-medium pb-2 whitespace-nowrap">Hausa Series</button>
          <button className="text-gray-400 font-medium pb-2 whitespace-nowrap">Music Videos</button>
        </div>

        {/* Organized Video Ads Section */}
        {videoAdsWithVideo.length > 0 && (
          <div className="px-4 mb-8">
            <div className="mb-3">
              <h3 className="text-lg font-semibold text-white mb-1">🎬 Featured Videos</h3>
              <p className="text-sm text-gray-400">Sponsored content</p>
            </div>
            <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-800">
              <YouTubeStyleVideoAd 
                ads={videoAdsWithVideo.slice(0, 3)}
                onAdComplete={(adId) => {
                  console.log('Mobile video ad completed:', adId);
                }}
              />
            </div>
          </div>
        )}

        {/* Banner Ad Space */}
        {bannerAdsOnly.length > 0 && (
          <div className="px-4 mb-8">
            <div className="mb-3">
              <h3 className="text-sm font-medium text-gray-400 mb-2">Sponsored</h3>
            </div>
            <BannerAdSpace 
              ads={bannerAdsOnly}
              autoSlideInterval={8000}
              showNavigation={true}
              className="mb-4"
            />
          </div>
        )}

        {/* Hausa Content Categories */}
        <div className="px-4 mb-6">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-800 rounded-lg p-4 text-center">
              <h3 className="text-white font-semibold mb-1">Kannywood Movies</h3>
              <p className="text-gray-400 text-sm">Latest releases</p>
              <div className="mt-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center mx-auto">
                <span className="text-white text-lg">🎬</span>
              </div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4 text-center">
              <h3 className="text-white font-semibold mb-1">Hausa Series</h3>
              <p className="text-gray-400 text-sm">Popular shows</p>
              <div className="mt-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center mx-auto">
                <span className="text-white text-lg">📺</span>
              </div>
            </div>
          </div>
        </div>

        {/* Kannywood Movies Section */}
        <div className="px-4 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white text-lg font-semibold">Kannywood Movies</h2>
            <button className="text-gray-400 text-sm flex items-center">
              More
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            {(hausaMovies.length > 0 ? hausaMovies : movieContent).slice(0, 6).map((item) => (
              <Link 
                to={`/${item.type}/${item.id}`} 
                key={item.id}
                className="relative group"
              >
                <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-gray-800">
                  <img 
                    src={item.thumbnail || "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5"} 
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5";
                    }}
                  />
                  
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="bg-primary rounded-full p-3">
                      <Play size={16} fill="white" className="text-white ml-0.5" />
                    </div>
                  </div>
                  
                  <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    👁 {formatViews(item.views)}
                  </div>
                </div>
                
                <h3 className="text-white text-sm font-medium mt-2 line-clamp-1">{item.title}</h3>
              </Link>
            ))}
          </div>
        </div>

        {/* Hausa Music Videos Section */}
        <div className="px-4 mb-6">
          <h2 className="text-white text-lg font-semibold mb-4">Hausa Music Videos</h2>
          
          <div className="grid grid-cols-2 gap-3">
            {(hausaSeries.length > 0 ? hausaSeries : seriesContent).slice(0, 4).map((item) => (
              <Link 
                to={`/${item.type}/${item.id}`} 
                key={item.id}
                className="relative group"
              >
                <div className="relative aspect-[16/9] rounded-lg overflow-hidden bg-gray-800">
                  <img 
                    src={item.thumbnail || "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5"} 
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5";
                    }}
                  />
                  
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="bg-primary rounded-full p-2">
                      <Play size={16} fill="white" className="text-white ml-0.5" />
                    </div>
                  </div>
                  
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    {item.duration}
                  </div>
                </div>
                
                <h3 className="text-white text-sm font-medium mt-2 line-clamp-2">{item.title}</h3>
              </Link>
            ))}
          </div>
        </div>

        {/* Trending Hausa Movies Section */}
        <div className="px-4 mb-6">
          <h2 className="text-white text-lg font-semibold mb-4">📈 Trending Hausa Movies</h2>
          
          <div className="grid grid-cols-3 gap-3">
            {trendingContent.slice(0, 6).map((item) => (
              <Link 
                to={`/${item.type}/${item.id}`} 
                key={item.id}
                className="relative group"
              >
                <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-gray-800">
                  <img 
                    src={item.thumbnail || "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5"} 
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5";
                    }}
                  />
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80"></div>
                  
                  <div className="absolute bottom-2 left-2 right-2">
                    <h3 className="text-white text-xs font-medium line-clamp-2">{item.title}</h3>
                    <div className="flex items-center mt-1">
                      <Eye size={10} className="text-gray-300 mr-1" />
                      <span className="text-gray-300 text-xs">{formatViews(item.views)}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default MobileHomeLayout;
