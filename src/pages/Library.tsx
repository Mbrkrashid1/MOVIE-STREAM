
import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import BottomNavigation from "@/components/layout/BottomNavigation";
import MovieCard, { MovieProps } from "@/components/ui/MovieCard";

const Library = () => {
  const [activeTab, setActiveTab] = useState("myList");
  
  const myListMovies: MovieProps[] = [
    {
      id: "movie1",
      title: "Ocean's Paradise",
      thumbnail: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
      type: "movie",
    },
    {
      id: "movie2",
      title: "Desert Storm",
      thumbnail: "https://images.unsplash.com/photo-1500673922987-e212871fec22",
      type: "movie",
    },
  ];
  
  const watchedMovies: MovieProps[] = [
    {
      id: "the-monkey",
      title: "The Monkey",
      thumbnail: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5",
      type: "movie",
      progress: 92,
    },
    {
      id: "nairobi-half-life",
      title: "Nairobi Half Life",
      thumbnail: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
      type: "movie",
      progress: 96,
    },
  ];

  return (
    <div className="pb-24">
      <Navbar />
      
      <div className="mt-14 p-4">
        <h1 className="text-2xl font-bold mb-6">Library</h1>
        
        {/* Tabs */}
        <div className="flex mb-6 border-b border-gray-800">
          <button
            onClick={() => setActiveTab("myList")}
            className={`py-2 px-4 text-sm ${
              activeTab === "myList"
                ? "border-b-2 border-kannyflix-green text-white"
                : "text-gray-400"
            }`}
          >
            My List
          </button>
          <button
            onClick={() => setActiveTab("watched")}
            className={`py-2 px-4 text-sm ${
              activeTab === "watched"
                ? "border-b-2 border-kannyflix-green text-white"
                : "text-gray-400"
            }`}
          >
            Watched
          </button>
        </div>
        
        {/* Content */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {activeTab === "myList"
            ? myListMovies.map((movie) => (
                <MovieCard key={movie.id} {...movie} />
              ))
            : watchedMovies.map((movie) => (
                <MovieCard key={movie.id} {...movie} />
              ))}
        </div>
        
        {/* Empty state */}
        {((activeTab === "myList" && myListMovies.length === 0) || 
          (activeTab === "watched" && watchedMovies.length === 0)) && (
          <div className="text-center py-12">
            <p className="text-gray-400">No content in this category</p>
            {activeTab === "myList" && (
              <p className="text-sm text-gray-500 mt-2">
                Add movies and series to your list to find them here
              </p>
            )}
          </div>
        )}
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default Library;
