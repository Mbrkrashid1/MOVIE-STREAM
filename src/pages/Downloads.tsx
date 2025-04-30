
import { useState } from "react";
import { Trash2 } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import BottomNavigation from "@/components/layout/BottomNavigation";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

interface DownloadedContent {
  id: string;
  title: string;
  thumbnail: string;
  size: string;
  progress: number;
}

const Downloads = () => {
  const { toast } = useToast();
  const [downloadedContent, setDownloadedContent] = useState<DownloadedContent[]>([
    {
      id: "mobland",
      title: "MobLand",
      thumbnail: "https://images.unsplash.com/photo-1500673922987-e212871fec22",
      size: "381MB",
      progress: 100,
    },
    {
      id: "the-monkey",
      title: "The Monkey",
      thumbnail: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5",
      size: "248.14MB",
      progress: 92,
    },
    {
      id: "nairobi-half-life",
      title: "Nairobi Half Life",
      thumbnail: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
      size: "425.06MB",
      progress: 96,
    },
  ]);

  const handleDelete = (id: string) => {
    setDownloadedContent(prevContent => 
      prevContent.filter(content => content.id !== id)
    );
    toast({
      title: "Content deleted",
      description: "The downloaded content has been removed.",
    });
  };

  // Calculate storage
  const totalStorage = 51.63; // GB
  const usedStorage = 31.86; // GB
  const remainingStorage = totalStorage - usedStorage;
  const usedPercentage = (usedStorage / totalStorage) * 100;

  return (
    <div className="pb-24">
      <Navbar />
      
      <div className="mt-14 p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Download</h1>
          <button className="text-gray-400">Edit</button>
        </div>
        
        {/* Storage indicator */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-400 mb-1">
            <div className="flex items-center">
              <span className="h-3 w-3 bg-purple-500 rounded-sm mr-2"></span>
              <span>Internal storage {totalStorage.toFixed(2)}GB</span>
            </div>
            <div className="flex items-center">
              <span className="h-3 w-3 bg-kannyflix-green rounded-sm mr-2"></span>
              <span>{remainingStorage.toFixed(2)}GB remaining</span>
            </div>
          </div>
          <Progress value={usedPercentage} className="h-2" />
        </div>
        
        {/* Background download toggle */}
        <div className="flex justify-between items-center mb-6 bg-gray-900 rounded-lg p-3">
          <span className="text-gray-300">Uninterrupted Background Download</span>
          <button className="text-kannyflix-green font-medium">Set Now</button>
        </div>
        
        {/* Downloaded content list */}
        <div className="space-y-4">
          {downloadedContent.map(content => (
            <div key={content.id} className="flex bg-gray-900 rounded-lg overflow-hidden">
              <img 
                src={content.thumbnail} 
                alt={content.title} 
                className="w-24 h-24 object-cover"
              />
              <div className="flex-1 p-3 flex flex-col justify-between">
                <div>
                  <h3 className="font-medium">{content.title}</h3>
                  <p className="text-sm text-gray-400">{content.size}</p>
                </div>
                {content.progress < 100 ? (
                  <div>
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>Downloading...</span>
                      <span>{content.progress}%</span>
                    </div>
                    <Progress value={content.progress} className="h-1 mt-1" />
                  </div>
                ) : (
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-kannyflix-gold">Ready to watch</span>
                    <button 
                      onClick={() => handleDelete(content.id)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {downloadedContent.length === 0 && (
          <div className="text-center p-8">
            <p className="text-gray-400">No downloads yet</p>
          </div>
        )}
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default Downloads;
