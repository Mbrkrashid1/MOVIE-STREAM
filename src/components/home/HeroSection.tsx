
import MovieBoxHero from "@/components/ui/MovieBoxHero";
import { MovieBoxCardProps } from "@/components/ui/MovieBoxCard";

interface HeroSectionProps {
  featuredItems: any[];
}

const HeroSection = ({ featuredItems }: HeroSectionProps) => {
  if (!featuredItems.length) return null;

  const transformedFeatured = featuredItems.map(item => ({
    ...item,
    rating: 8.5 + Math.random() * 1.5,
    year: 2020 + Math.floor(Math.random() * 4),
    duration: "2h 15m",
    genre: "Drama",
    description: "An epic Hausa story that captures the essence of Northern Nigerian culture."
  }));

  return (
    <div className="relative mb-6">
      <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent z-10 pointer-events-none"></div>
      <MovieBoxHero items={transformedFeatured} />
    </div>
  );
};

export default HeroSection;
