
import { useContentData } from "@/hooks/useContentData";
import MovieBoxNavbar from "@/components/layout/MovieBoxNavbar";
import BottomNavigation from "@/components/layout/BottomNavigation";
import { Eye, ThumbsUp, ChevronDown } from "lucide-react";

const MobileHomeLayout = () => {
  const { featuredItems, videosList, videoAds } = useContentData();

  // Mock content cards for the clean layout
  const contentCards = Array.from({ length: 6 }, (_, i) => ({
    id: i + 1,
    placeholder: true
  }));

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-20 overflow-x-hidden">
      <MovieBoxNavbar />
      
      {/* Content Section */}
      <div className="px-4 py-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Content</h2>
        
        {/* Content Card */}
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm border border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Content</h3>
          
          {/* Content Grid */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {contentCards.map((item) => (
              <div 
                key={item.id} 
                className="aspect-video bg-gray-200 rounded-lg"
              />
            ))}
          </div>
          
          {/* Stats */}
          <div className="flex items-center gap-6 text-gray-600">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              <span className="text-sm">Views</span>
            </div>
            <div className="flex items-center gap-2">
              <ThumbsUp className="w-4 h-4" />
              <span className="text-sm">Likes</span>
            </div>
          </div>
        </div>

        {/* Sponsored Ad Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900">Sponsored ad</h3>
            <div className="flex items-center gap-2 text-gray-500">
              <span className="text-sm">Scroll</span>
              <ChevronDown className="w-4 h-4" />
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <div className="flex items-center justify-center h-32 bg-gray-100 rounded-lg">
              <span className="text-4xl font-bold text-gray-400">ADS</span>
            </div>
          </div>
        </div>

        {/* More Content Section */}
        <h3 className="text-xl font-bold text-gray-900 mb-4">Content</h3>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="aspect-video bg-gray-200 rounded-lg"></div>
        </div>
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default MobileHomeLayout;
