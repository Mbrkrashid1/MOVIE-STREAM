
import { useEffect } from "react";
import { useContentData } from "@/hooks/useContentData";
import { useToast } from "@/hooks/use-toast";
import AutoSlideAdBanner from "@/components/ui/AutoSlideAdBanner";
import BannerAdSpace from "@/components/home/BannerAdSpace";
import MovieBoxNavbar from "@/components/layout/MovieBoxNavbar";
import BottomNavigation from "@/components/layout/BottomNavigation";
import LoadingScreen from "@/components/home/LoadingScreen";
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
  
  // Convert video ads to banner ads format
  const bannerAds = videoAdsList.slice(0, 5).map(ad => ({
    id: ad.id,
    title: ad.title,
    description: ad.description,
    image_url: ad.thumbnail_url || '',
    cta_text: ad.cta_text || undefined,
    cta_url: ad.cta_url || undefined,
    background_color: 'from-purple-900/20 to-blue-900/20'
  }));

  // Trending content (mix of movies and series)
  const trendingContent = [...movieContent, ...seriesContent]
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 6);

  const formatViews = (views: number) => {
    if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}k`;
    }
    return views.toString();
  };

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      <MovieBoxNavbar />
      
      <div className="pt-16">
        {/* Search Bar */}
        <div className="px-4 py-3">
          <div className="bg-gray-800 rounded-full px-4 py-3 flex items-center">
            <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span className="text-gray-400">Search movies and series...</span>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex px-4 space-x-6 mb-6">
          <button className="text-white font-medium border-b-2 border-primary pb-2">Trending</button>
          <button className="text-gray-400 font-medium pb-2">Nollywood</button>
          <button className="text-gray-400 font-medium pb-2">Movie</button>
          <button className="text-gray-400 font-medium pb-2">Western</button>
        </div>

        {/* Trending Content Grid */}
        <div className="px-4 mb-6">
          <div className="grid grid-cols-3 gap-3">
            {trendingContent.map((item, index) => (
              <Link 
                to={`/${item.type}/${item.id}`} 
                key={item.id}
                className="relative group"
              >
                <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-gray-800">
                  <img 
                    src={item.thumbnail_url || "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5"} 
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  
                  {/* Play overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="bg-primary rounded-full p-3">
                      <Play size={16} fill="white" className="text-white ml-0.5" />
                    </div>
                  </div>
                  
                  {/* Stats overlay */}
                  <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    {formatViews(item.views || 0)} booked
                  </div>
                </div>
                
                <div className="mt-2">
                  <h3 className="text-white text-sm font-medium line-clamp-1">{item.title}</h3>
                  <div className="flex items-center text-xs text-teal-400 mt-1">
                    <div className="w-3 h-3 border border-teal-400 rounded mr-1 flex items-center justify-center">
                      <span className="text-[8px]">+</span>
                    </div>
                    <span>Remind me</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Premium Auto-Slide Ad Banner */}
        {videoAdsList.length > 0 && (
          <div className="px-4 mb-6">
            <AutoSlideAdBanner 
              ads={videoAdsList.slice(0, 5)} 
              autoSlideInterval={7000}
              showControls={true}
            />
          </div>
        )}

        {/* Banner Ad Space */}
        {bannerAds.length > 0 && (
          <div className="px-4 mb-6">
            <BannerAdSpace 
              ads={bannerAds}
              autoSlideInterval={6000}
              showNavigation={true}
              className="mb-4"
            />
          </div>
        )}

        {/* Must-watch Section */}
        <div className="px-4 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white text-lg font-semibold">Must-watch Black Shows</h2>
            <button className="text-gray-400 text-sm flex items-center">
              More
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          
          <div className="flex space-x-3 overflow-x-auto scrollbar-hide">
            {seriesContent.slice(0, 5).map((item) => (
              <Link 
                to={`/${item.type}/${item.id}`} 
                key={item.id}
                className="flex-shrink-0 w-32 group"
              >
                <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-gray-800">
                  <img 
                    src={item.thumbnail_url || "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5"} 
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  
                  {/* Play overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="bg-primary rounded-full p-2">
                      <Play size={12} fill="white" className="text-white ml-0.5" />
                    </div>
                  </div>
                </div>
                
                <h3 className="text-white text-sm font-medium mt-2 line-clamp-1">{item.title}</h3>
              </Link>
            ))}
          </div>
        </div>

        {/* Made in Africa Section */}
        <div className="px-4 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white text-lg font-semibold">Made in Africa</h2>
            <button className="text-gray-400 text-sm flex items-center">
              More
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          
          <div className="flex space-x-3 overflow-x-auto scrollbar-hide">
            {movieContent.slice(0, 5).map((item) => (
              <Link 
                to={`/${item.type}/${item.id}`} 
                key={item.id}
                className="flex-shrink-0 w-32 group"
              >
                <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-gray-800">
                  <img 
                    src={item.thumbnail_url || "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5"} 
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  
                  {/* Play overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="bg-primary rounded-full p-2">
                      <Play size={12} fill="white" className="text-white ml-0.5" />
                    </div>
                  </div>
                </div>
                
                <h3 className="text-white text-sm font-medium mt-2 line-clamp-1">{item.title}</h3>
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
