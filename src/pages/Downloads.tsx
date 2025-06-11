
import { useState } from "react";
import { Trash2, Play, Download, Pause, RotateCcw } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import BottomNavigation from "@/components/layout/BottomNavigation";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface DownloadedContent {
  id: string;
  title: string;
  thumbnail: string;
  size: string;
  progress: number;
  status: 'downloading' | 'completed' | 'paused' | 'failed';
  type: 'movie' | 'series';
  downloadSpeed?: string;
}

const Downloads = () => {
  const { toast } = useToast();
  const [downloadedContent, setDownloadedContent] = useState<DownloadedContent[]>([
    {
      id: "hausa-love-story",
      title: "Hausa Love Story",
      thumbnail: "https://images.unsplash.com/photo-1500673922987-e212871fec22",
      size: "381MB",
      progress: 100,
      status: 'completed',
      type: 'movie',
    },
    {
      id: "kannywood-classic",
      title: "Kannywood Classic",
      thumbnail: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5",
      size: "248.14MB",
      progress: 75,
      status: 'downloading',
      type: 'movie',
      downloadSpeed: '2.1 MB/s',
    },
    {
      id: "hausa-series-ep1",
      title: "Gidan Badamasi - Episode 1",
      thumbnail: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
      size: "425.06MB",
      progress: 45,
      status: 'paused',
      type: 'series',
    },
    {
      id: "documentary",
      title: "Northern Nigeria Culture",
      thumbnail: "https://images.unsplash.com/photo-1578662996442-48f60103fc96",
      size: "156.23MB",
      progress: 15,
      status: 'failed',
      type: 'movie',
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

  const handlePauseResume = (id: string) => {
    setDownloadedContent(prevContent =>
      prevContent.map(content => {
        if (content.id === id) {
          const newStatus = content.status === 'downloading' ? 'paused' : 'downloading';
          return { ...content, status: newStatus };
        }
        return content;
      })
    );
    
    const content = downloadedContent.find(c => c.id === id);
    if (content) {
      toast({
        title: content.status === 'downloading' ? "Download paused" : "Download resumed",
        description: `${content.title} ${content.status === 'downloading' ? 'paused' : 'resumed'}.`,
      });
    }
  };

  const handleRetry = (id: string) => {
    setDownloadedContent(prevContent =>
      prevContent.map(content => {
        if (content.id === id) {
          return { ...content, status: 'downloading', progress: 0 };
        }
        return content;
      })
    );
    
    toast({
      title: "Download restarted",
      description: "The download has been restarted.",
    });
  };

  const handlePlay = (id: string) => {
    const content = downloadedContent.find(c => c.id === id);
    if (content && content.status === 'completed') {
      toast({
        title: "Playing offline content",
        description: `Now playing: ${content.title}`,
      });
    }
  };

  // Calculate storage
  const totalStorage = 64.0; // GB
  const usedStorage = downloadedContent
    .filter(content => content.status === 'completed')
    .reduce((acc, content) => acc + parseFloat(content.size.replace('MB', '')) / 1024, 0);
  const remainingStorage = totalStorage - usedStorage;
  const usedPercentage = (usedStorage / totalStorage) * 100;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-500';
      case 'downloading': return 'text-blue-500';
      case 'paused': return 'text-yellow-500';
      case 'failed': return 'text-red-500';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Ready to watch';
      case 'downloading': return 'Downloading...';
      case 'paused': return 'Paused';
      case 'failed': return 'Failed';
      default: return status;
    }
  };

  return (
    <div className="pb-24 bg-background min-h-screen">
      <Navbar />
      
      <div className="mt-14 p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Downloads</h1>
          <Button variant="outline" size="sm">
            Download Quality: HD
          </Button>
        </div>
        
        {/* Storage indicator */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <div className="flex items-center">
              <span className="h-3 w-3 bg-primary rounded-sm mr-2"></span>
              <span>Storage used: {usedStorage.toFixed(2)}GB of {totalStorage.toFixed(0)}GB</span>
            </div>
            <div className="flex items-center">
              <span className="h-3 w-3 bg-muted rounded-sm mr-2"></span>
              <span>{remainingStorage.toFixed(2)}GB available</span>
            </div>
          </div>
          <Progress value={usedPercentage} className="h-2" />
        </div>
        
        {/* Download settings */}
        <div className="flex justify-between items-center mb-6 bg-card rounded-lg p-4 border border-border">
          <div>
            <span className="text-foreground font-medium">Smart Downloads</span>
            <p className="text-sm text-muted-foreground">Auto-download next episodes when on WiFi</p>
          </div>
          <Button variant="outline" size="sm">
            Configure
          </Button>
        </div>
        
        {/* Downloaded content list */}
        <div className="space-y-4">
          {downloadedContent.map(content => (
            <div key={content.id} className="flex bg-card rounded-lg overflow-hidden border border-border">
              <div className="relative">
                <img 
                  src={content.thumbnail} 
                  alt={content.title} 
                  className="w-24 h-24 object-cover"
                />
                {content.status === 'completed' && (
                  <button 
                    onClick={() => handlePlay(content.id)}
                    className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                  >
                    <Play size={20} className="text-white" fill="white" />
                  </button>
                )}
              </div>
              
              <div className="flex-1 p-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-medium text-foreground">{content.title}</h3>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full uppercase">
                      {content.type}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <span>{content.size}</span>
                    {content.downloadSpeed && content.status === 'downloading' && (
                      <span>• {content.downloadSpeed}</span>
                    )}
                  </div>
                </div>
                
                {content.status === 'completed' ? (
                  <div className="flex justify-between items-center">
                    <span className={`text-xs font-medium ${getStatusColor(content.status)}`}>
                      {getStatusText(content.status)}
                    </span>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handlePlay(content.id)}
                      >
                        <Play size={14} className="mr-1" />
                        Play
                      </Button>
                      <Button 
                        size="sm"
                        variant="ghost" 
                        onClick={() => handleDelete(content.id)}
                        className="text-red-500 hover:text-red-600"
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex justify-between text-xs mb-2">
                      <span className={getStatusColor(content.status)}>
                        {getStatusText(content.status)}
                      </span>
                      <span className="text-muted-foreground">{content.progress}%</span>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <Progress value={content.progress} className="h-1 flex-1" />
                      <div className="flex gap-1">
                        {content.status === 'failed' ? (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleRetry(content.id)}
                            className="text-blue-500 hover:text-blue-600 p-1"
                          >
                            <RotateCcw size={14} />
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handlePauseResume(content.id)}
                            className="text-blue-500 hover:text-blue-600 p-1"
                          >
                            {content.status === 'downloading' ? 
                              <Pause size={14} /> : <Play size={14} />
                            }
                          </Button>
                        )}
                        <Button 
                          size="sm"
                          variant="ghost" 
                          onClick={() => handleDelete(content.id)}
                          className="text-red-500 hover:text-red-600 p-1"
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {downloadedContent.length === 0 && (
          <div className="text-center p-8">
            <Download size={48} className="mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No downloads yet</h3>
            <p className="text-muted-foreground mb-4">
              Download your favorite Hausa movies and series to watch offline
            </p>
            <Button>
              Browse Content
            </Button>
          </div>
        )}
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default Downloads;
