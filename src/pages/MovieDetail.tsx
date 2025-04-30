
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Download, Play, Share } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import BottomNavigation from "@/components/layout/BottomNavigation";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const MovieDetail = () => {
  const { id } = useParams();
  const { toast } = useToast();

  // Mock movie data - in a real app this would be fetched from an API
  const movie = {
    id,
    title: "The Monkey",
    description: "A thrilling adventure that takes you on a journey through the wilderness. Follow the protagonist as they discover secrets and face challenges never seen before.",
    year: 2023,
    duration: "1h 48m",
    genre: "Action, Adventure",
    rating: "PG-13",
    thumbnail: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5",
    quality: ["480p", "720p", "1080p"],
  };

  const handlePlay = () => {
    // In a real app, this would navigate to the video player
    toast({
      title: "Starting video",
      description: "Preparing to play The Monkey...",
    });
  };

  const handleDownload = () => {
    toast({
      title: "Download started",
      description: "The Monkey is being downloaded...",
    });
  };

  return (
    <div className="pb-24">
      <Navbar />
      
      <div className="mt-14">
        {/* Movie poster and gradient overlay */}
        <div className="relative h-[50vh]">
          <img 
            src={movie.thumbnail} 
            alt={movie.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-kannyflix-background via-kannyflix-background/40 to-transparent"></div>
          
          {/* Back button */}
          <Link 
            to="/" 
            className="absolute top-4 left-4 z-10 bg-black/40 p-2 rounded-full"
          >
            <ArrowLeft size={20} className="text-white" />
          </Link>
          
          {/* Movie info overlay */}
          <div className="absolute bottom-0 left-0 w-full p-6 text-white">
            <h1 className="text-3xl font-bold">{movie.title}</h1>
            <div className="flex items-center mt-2 text-sm text-gray-300">
              <span>{movie.year}</span>
              <span className="mx-2">•</span>
              <span>{movie.duration}</span>
              <span className="mx-2">•</span>
              <span>{movie.rating}</span>
            </div>
            <div className="mt-1 text-sm">
              <span className="text-gray-300">{movie.genre}</span>
            </div>
            
            <div className="flex gap-3 mt-4">
              {movie.quality.map((q) => (
                <span key={q} className="badge bg-gray-800">
                  {q}
                </span>
              ))}
            </div>
          </div>
        </div>
        
        {/* Action buttons */}
        <div className="flex gap-4 p-6">
          <Button 
            onClick={handlePlay} 
            className="flex-1 bg-kannyflix-green hover:bg-kannyflix-green/90 text-white"
          >
            <Play size={18} className="mr-2" /> Play
          </Button>
          <Button 
            onClick={handleDownload} 
            className="flex-1 bg-gray-800 hover:bg-gray-700 text-white"
          >
            <Download size={18} className="mr-2" /> Download
          </Button>
        </div>
        
        {/* Description */}
        <div className="px-6">
          <h2 className="text-xl font-semibold mb-2">Description</h2>
          <p className="text-gray-300 text-sm">
            {movie.description}
          </p>
        </div>
        
        {/* Recommended - This would be another MovieRow component in a full implementation */}
        <div className="mt-8 px-6">
          <h2 className="text-xl font-semibold mb-2">You might also like</h2>
          <div className="text-gray-400 text-sm">
            Similar recommendations would appear here...
          </div>
        </div>
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default MovieDetail;
