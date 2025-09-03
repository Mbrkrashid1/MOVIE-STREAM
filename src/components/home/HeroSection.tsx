
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
      <div className="relative aspect-[16/9] sm:aspect-[2.5/1] rounded-2xl overflow-hidden shadow-card">
        <img
          src={featuredItem.backgroundImage}
          alt={featuredItem.title}
          className="w-full h-full object-cover"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-streaming-darker/95 via-streaming-darker/40 to-transparent" />
        
        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-lg">
            <h1 className="text-3xl sm:text-4xl font-bold text-streaming-text mb-3 leading-tight">
              {featuredItem.title}
            </h1>
            
            <div className="flex items-center gap-3 text-sm text-streaming-muted mb-4">
              <span className="bg-gradient-primary text-white px-3 py-1 rounded-full text-xs font-medium shadow-glow">
                {featuredItem.type.toUpperCase()}
              </span>
              <span>•</span>
              <span>{featuredItem.year}</span>
              <span>•</span>
              <span>{featuredItem.genre}</span>
            </div>
            
            <p className="text-streaming-muted text-base mb-6 line-clamp-2 leading-relaxed">
              {featuredItem.description}
            </p>
            
            <div className="flex items-center gap-4">
              <Button className="bg-gradient-primary hover:shadow-glow text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105">
                <Play size={18} className="mr-2" fill="white" />
                Play Now
              </Button>
              
              <Button variant="outline" className="bg-streaming-card/40 border-streaming-border/60 text-streaming-text hover:bg-streaming-card/60 px-6 py-3 rounded-xl backdrop-blur-sm transition-all duration-200">
                <Plus size={18} className="mr-2" />
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
