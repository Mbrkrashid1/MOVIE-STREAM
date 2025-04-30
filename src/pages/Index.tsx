
import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import BottomNavigation from "@/components/layout/BottomNavigation";
import FeaturedSlider from "@/components/ui/FeaturedSlider";
import CategoryFilter from "@/components/ui/CategoryFilter";
import MovieRow from "@/components/ui/MovieRow";
import { useToast } from "@/hooks/use-toast";

// Mock data
const categories = [
  { id: "global", name: "Global" },
  { id: "movie", name: "Movie" },
  { id: "western", name: "Western" },
  { id: "anime", name: "Anime" },
  { id: "kdrama", name: "K-Drama" },
  { id: "kannywood", name: "Kannywood" },
];

const featuredItems = [
  {
    id: "weak-hero-class-2",
    title: "Weak Hero Class 2",
    backgroundImage: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81",
    type: "series" as const,
  },
  {
    id: "all-the-queens-men",
    title: "All The Queen's Men",
    backgroundImage: "https://images.unsplash.com/photo-1500673922987-e212871fec22",
    type: "series" as const,
  },
];

const weeklyTopMovies = [
  {
    id: "wednesday",
    title: "Wednesday",
    thumbnail: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5",
    type: "series" as const,
    episodeCount: 8,
  },
  {
    id: "weak-hero-class-2-thumb",
    title: "Weak Hero Class 2",
    thumbnail: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81",
    type: "series" as const,
    episodeCount: 8,
  },
  {
    id: "all-the-queens-men-thumb",
    title: "All the Queen's Men Season 2",
    thumbnail: "https://images.unsplash.com/photo-1500673922987-e212871fec22",
    type: "series" as const,
    episodeCount: 20,
  },
  {
    id: "homeland",
    title: "Homeland",
    thumbnail: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
    type: "series" as const,
    episodeCount: 12,
  },
];

const topPicks = [
  {
    id: "mobland",
    title: "MobLand",
    thumbnail: "https://images.unsplash.com/photo-1500673922987-e212871fec22",
    type: "movie" as const,
    progress: 0,
  },
  {
    id: "the-monkey",
    title: "The Monkey",
    thumbnail: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5",
    type: "movie" as const,
    progress: 92,
  },
  {
    id: "nairobi-half-life",
    title: "Nairobi Half Life",
    thumbnail: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
    type: "movie" as const,
    progress: 96,
  },
];

const recentlyAdded = [
  {
    id: "movie1",
    title: "Ocean's Paradise",
    thumbnail: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
    type: "movie" as const,
  },
  {
    id: "movie2",
    title: "Desert Storm",
    thumbnail: "https://images.unsplash.com/photo-1500673922987-e212871fec22",
    type: "movie" as const,
  },
  {
    id: "movie3",
    title: "Mountain Peak",
    thumbnail: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5",
    type: "movie" as const,
  },
  {
    id: "movie4",
    title: "City Lights",
    thumbnail: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81",
    type: "movie" as const,
  },
];

const Index = () => {
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState("global");

  // Simulate loading state
  useEffect(() => {
    // Show welcome toast on initial load
    toast({
      title: "Welcome to KannyFlix!",
      description: "Discover amazing movies and series.",
    });
  }, []);

  const handleSelectCategory = (categoryId: string) => {
    setSelectedCategory(categoryId);
    console.log("Selected category:", categoryId);
  };

  return (
    <div className="pb-24">
      <Navbar />
      <div className="mt-14">
        <FeaturedSlider items={featuredItems} />
        <CategoryFilter 
          categories={categories} 
          onSelectCategory={handleSelectCategory} 
        />
        <MovieRow 
          title="Weekly TOP 20" 
          viewAllLink="/top-charts" 
          movies={weeklyTopMovies} 
        />
        <MovieRow 
          title="Top Picks" 
          viewAllLink="/top-picks" 
          movies={topPicks} 
        />
        <MovieRow 
          title="Recently Added" 
          viewAllLink="/recently-added" 
          movies={recentlyAdded} 
        />
      </div>
      <BottomNavigation />
    </div>
  );
};

export default Index;
