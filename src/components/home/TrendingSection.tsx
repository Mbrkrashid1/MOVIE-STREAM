
import { Link } from "react-router-dom";
import { Play, Eye, ChevronRight } from "lucide-react";
import { ContentItem } from "@/hooks/useContentData";

interface TrendingSectionProps {
  videosList: ContentItem[];
  movieContent: ContentItem[];
  seriesContent: ContentItem[];
}

const TrendingSection = ({ videosList, movieContent, seriesContent }: TrendingSectionProps) => {
  const formatViews = (views: string | number | null) => {
    if (!views) return "0";
    const numViews = typeof views === 'string' ? parseInt(views) || 0 : views;
    if (numViews >= 1000) {
      return `${(numViews / 1000).toFixed(1)}k`;
    }
    return numViews.toString();
  };

  const trendingContent = [...movieContent, ...seriesContent]
    .sort((a, b) => {
      const aViews = typeof a.views === 'string' ? parseInt(a.views) || 0 : a.views || 0;
      const bViews = typeof b.views === 'string' ? parseInt(b.views) || 0 : b.views || 0;
      return bViews - aViews;
    })
    .slice(0, 6);

  return (
    <div className="px-4 mb-6">
      {/* Trending Now Section */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xl">🔥</span>
          <h2 className="text-white text-lg font-semibold">Trending Now</h2>
        </div>
        <button className="text-gray-400 text-sm flex items-center hover:text-white transition-colors">
          All
          <ChevronRight size={16} className="ml-1" />
        </button>
      </div>
      
      <div className="grid grid-cols-3 gap-3 mb-8">
        {trendingContent.map((item) => (
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
              
              <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                <Eye size={10} />
                {formatViews(item.views)}
              </div>
            </div>
            
            <h3 className="text-white text-sm font-medium mt-2 line-clamp-1">{item.title}</h3>
          </Link>
        ))}
      </div>

      {/* Hollywood Movies */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white text-lg font-semibold">Hollywood Movies</h2>
          <button className="text-gray-400 text-sm flex items-center hover:text-white transition-colors">
            All
            <ChevronRight size={16} className="ml-1" />
          </button>
        </div>
        
        <div className="grid grid-cols-3 gap-3">
          {movieContent.slice(0, 6).map((item) => (
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
                
                <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                  <Eye size={10} />
                  {formatViews(item.views)}
                </div>
              </div>
              
              <h3 className="text-white text-sm font-medium mt-2 line-clamp-1">{item.title}</h3>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrendingSection;
