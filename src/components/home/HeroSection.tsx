
import { useEffect } from "react";
import MovieBoxHero from "@/components/ui/MovieBoxHero";
import Scene3D from "@/components/home/Scene3D";

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
  return (
    <>
      {/* Cinematic Background Scene */}
      <Scene3D />
      
      {/* Premium Glass Morphism Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 pointer-events-none" />
      
      {/* Cinematic Hero Section */}
      {heroItems.length > 0 && (
        <MovieBoxHero items={heroItems} />
      )}
    </>
  );
};

export default HeroSection;
