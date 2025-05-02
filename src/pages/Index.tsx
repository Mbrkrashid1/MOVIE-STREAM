
import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import BottomNavigation from "@/components/layout/BottomNavigation";
import VideoCard from "@/components/ui/VideoCard"; 
import FeaturedSlider from "@/components/ui/FeaturedSlider";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";

// Mock data - would be replaced with real data from Supabase
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

const videosList = [
  {
    id: "wednesday",
    title: "Wednesday - The Breakout Netflix Series Everyone's Talking About",
    thumbnail: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5",
    channelName: "Netflix Series",
    views: "12M",
    timeAgo: "3 weeks ago",
    duration: "10:28",
    type: "series" as const,
  },
  {
    id: "weak-hero-class-2-thumb",
    title: "Weak Hero Class 2 | Official Trailer | Coming Soon",
    thumbnail: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81",
    channelName: "Korean Drama",
    views: "5.4M",
    timeAgo: "2 months ago",
    duration: "2:45",
    type: "series" as const,
  },
  {
    id: "all-the-queens-men-thumb",
    title: "All the Queen's Men Season 2 - Full Episode Review and Analysis",
    thumbnail: "https://images.unsplash.com/photo-1500673922987-e212871fec22",
    channelName: "Series Reviews",
    views: "823K",
    timeAgo: "5 days ago",
    duration: "15:20",
    type: "series" as const,
  },
  {
    id: "homeland",
    title: "Homeland - The Complete Series Overview | What Made It Great",
    thumbnail: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
    channelName: "TV Classics",
    views: "1.2M",
    timeAgo: "1 year ago",
    duration: "22:45",
    type: "series" as const,
  },
  {
    id: "mobland",
    title: "MobLand Movie Review - The Crime Drama That's Taking Over",
    thumbnail: "https://images.unsplash.com/photo-1500673922987-e212871fec22",
    channelName: "Movie Critics",
    views: "345K",
    timeAgo: "3 weeks ago",
    duration: "8:12",
    type: "movie" as const,
  },
  {
    id: "the-monkey",
    title: "The Monkey - Official Trailer | Watch Now on KannyFlix",
    thumbnail: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5",
    channelName: "KannyFlix Originals",
    views: "2.1M",
    timeAgo: "2 months ago",
    duration: "3:05",
    type: "movie" as const,
  },
  {
    id: "nairobi-half-life",
    title: "Nairobi Half Life - The Award Winning African Cinema Masterpiece",
    thumbnail: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
    channelName: "African Cinema",
    views: "987K",
    timeAgo: "6 months ago",
    duration: "12:33",
    type: "movie" as const,
  },
  {
    id: "ocean-paradise",
    title: "Ocean's Paradise - Behind the Scenes | Making of the Blockbuster",
    thumbnail: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
    channelName: "Movie Insights",
    views: "568K",
    timeAgo: "2 weeks ago",
    duration: "18:42",
    type: "movie" as const,
  },
  {
    id: "desert-storm",
    title: "Desert Storm - Action Movie Review | The Best of 2024?",
    thumbnail: "https://images.unsplash.com/photo-1500673922987-e212871fec22",
    channelName: "Action Movie Club",
    views: "782K",
    timeAgo: "1 month ago",
    duration: "9:18",
    type: "movie" as const,
  },
  {
    id: "mountain-peak",
    title: "Mountain Peak - The Survival Thriller Everyone's Talking About",
    thumbnail: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5",
    channelName: "Thriller Reviews",
    views: "423K",
    timeAgo: "3 weeks ago",
    duration: "7:55",
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

  return (
    <div className="pb-24">
      <Navbar />
      <div className="mt-14">
        <FeaturedSlider items={featuredItems} />
        
        <div className="px-4">
          {/* YouTube-style scrolling video list */}
          <ScrollArea className="h-[calc(100vh-300px)] pt-4">
            <div className="space-y-4">
              {videosList.map((video) => (
                <VideoCard 
                  key={video.id}
                  id={video.id}
                  title={video.title}
                  thumbnail={video.thumbnail}
                  channelName={video.channelName}
                  views={video.views}
                  timeAgo={video.timeAgo}
                  duration={video.duration}
                  type={video.type}
                />
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
      <BottomNavigation />
    </div>
  );
};

export default Index;
