
import { Play, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MovieActionsProps {
  movie: any;
  onPlay: () => void;
  onDownload: () => void;
}

export function MovieActions({ movie, onPlay, onDownload }: MovieActionsProps) {
  const isVideoAvailable = movie.video_url && movie.video_url.trim() !== '' && movie.video_url !== 'placeholder';

  return (
    <div className="flex gap-4 p-6">
      <Button 
        onClick={onPlay} 
        className="flex-1 bg-primary hover:bg-primary/90 text-white font-semibold py-3 transition-all duration-200 hover:scale-105"
        disabled={!isVideoAvailable}
      >
        <Play size={18} className="mr-2" fill="white" /> 
        {!isVideoAvailable ? 'Video Not Available' : 'Play Now'}
      </Button>
      <Button 
        onClick={onDownload} 
        variant="outline"
        className="flex-1 border-2 font-semibold py-3 transition-all duration-200 hover:scale-105"
      >
        <Download size={18} className="mr-2" /> 
        Download
      </Button>
    </div>
  );
}
