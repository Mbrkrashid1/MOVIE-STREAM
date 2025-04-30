
import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import BottomNavigation from "@/components/layout/BottomNavigation";
import { useToast } from "@/hooks/use-toast";

// Mock shorts data
const shortsData = [
  {
    id: "short1",
    title: "Hausa Comedy Skit",
    creator: "Ibrahim Comedy",
    views: "1.2M",
    thumbnail: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5",
  },
  {
    id: "short2",
    title: "Kannywood Dance Clip",
    creator: "Hausa Stars",
    views: "890K",
    thumbnail: "https://images.unsplash.com/photo-1500673922987-e212871fec22",
  },
  {
    id: "short3",
    title: "Cooking Tutorial",
    creator: "Hausa Kitchen",
    views: "450K",
    thumbnail: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
  },
];

const Shorts = () => {
  const { toast } = useToast();
  const [currentShortIndex, setCurrentShortIndex] = useState(0);

  const handleShortSwipe = (direction: "up" | "down") => {
    if (direction === "up" && currentShortIndex < shortsData.length - 1) {
      setCurrentShortIndex(currentShortIndex + 1);
    } else if (direction === "down" && currentShortIndex > 0) {
      setCurrentShortIndex(currentShortIndex - 1);
    }
  };

  const currentShort = shortsData[currentShortIndex];

  return (
    <div className="pb-24">
      <Navbar />
      <div className="mt-14 h-[calc(100vh-120px)] bg-black">
        <div className="relative h-full">
          <img
            src={currentShort.thumbnail}
            alt={currentShort.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
            <h3 className="text-lg font-semibold">{currentShort.title}</h3>
            <div className="flex items-center mt-2">
              <span className="text-sm">{currentShort.creator}</span>
              <span className="mx-2">•</span>
              <span className="text-sm">{currentShort.views} views</span>
            </div>
          </div>

          {/* Swipe controls */}
          <div 
            className="absolute top-0 left-0 w-full h-1/2" 
            onClick={() => handleShortSwipe("down")}
          />
          <div 
            className="absolute bottom-0 left-0 w-full h-1/2" 
            onClick={() => handleShortSwipe("up")}
          />
        </div>
      </div>
      <BottomNavigation />
    </div>
  );
};

export default Shorts;
