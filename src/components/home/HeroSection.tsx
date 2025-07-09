
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Play, Download, Plus } from "lucide-react";

interface HeroSectionProps {
  heroItems: Array<{
    id: string;
    title: string;
    description: string;
    backgroundImage: string;
    type: string;
    rating: number;
    year: number;
    duration: string;
    genre: string;
    video_url: string;
  }>;
}

const HeroSection = ({ heroItems }: HeroSectionProps) => {
  if (!heroItems.length) return null;

  const featuredItem = heroItems[0];

  return (
    <div className="relative w-full">
      <div className="relative aspect-[16/9] sm:aspect-[2/1] rounded-xl overflow-hidden">
        <img
          src={featuredItem.backgroundImage}
          alt={featuredItem.title}
          className="w-full h-full object-cover"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
        
        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="max-w-md">
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              {featuredItem.title}
            </h1>
            
            <div className="flex items-center gap-2 text-sm text-gray-300 mb-3">
              <span className="bg-red-600 text-white px-2 py-0.5 rounded text-xs">
                {featuredItem.type.toUpperCase()}
              </span>
              <span>|</span>
              <span>{featuredItem.year}</span>
              <span>|</span>
              <span>{featuredItem.genre}</span>
            </div>
            
            <p className="text-gray-300 text-sm mb-4 line-clamp-2">
              {featuredItem.description}
            </p>
            
            <div className="flex items-center gap-3">
              <Button className="bg-white text-black hover:bg-gray-200 px-6 py-2 rounded-lg font-semibold">
                <Play size={16} className="mr-2" fill="black" />
                Play
              </Button>
              
              <Button variant="outline" className="bg-white/20 border-white/30 text-white hover:bg-white/30 px-4 py-2 rounded-lg backdrop-blur-sm">
                <Plus size={16} className="mr-2" />
                My List
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
