
import { Link } from "react-router-dom";
import { Eye } from "lucide-react";

interface SimilarContentProps {
  similarContent: any[];
  formatDuration: (seconds: number | null | undefined) => string;
}

export function SimilarContent({ similarContent, formatDuration }: SimilarContentProps) {
  if (!similarContent || similarContent.length === 0) return null;

  return (
    <div className="mt-8 px-6">
      <h2 className="text-xl font-semibold mb-6 flex items-center">
        <span className="w-1 h-6 bg-primary rounded-full mr-3"></span>
        More Like This
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {similarContent.map((item) => (
          <Link to={`/${item.type}/${item.id}`} key={item.id} className="block group">
            <div className="relative aspect-video rounded-lg overflow-hidden shadow-lg transition-transform duration-200 group-hover:scale-105">
              <img 
                src={item.thumbnail_url || "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5"} 
                alt={item.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-3">
                <h3 className="text-white font-semibold text-sm mb-1 line-clamp-2">{item.title}</h3>
                <div className="flex items-center text-xs text-gray-300 space-x-2">
                  <span>{formatDuration(item.duration)}</span>
                  <span>•</span>
                  <span className="flex items-center">
                    <Eye size={10} className="mr-1" />
                    {item.views?.toLocaleString() || 0}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
