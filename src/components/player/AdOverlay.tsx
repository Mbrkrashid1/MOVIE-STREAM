
import React from "react";
import { Button } from "@/components/ui/button";
import { FastForward } from "lucide-react";
import { AdPlacement } from "./useAdHandling";

interface AdOverlayProps {
  adPlaying: AdPlacement;
  videoRef: React.RefObject<HTMLVideoElement>;
  onTimeUpdate: () => void;
  onLoadedMetadata: () => void;
  onEnded: () => void;
  onPlay: () => void;
  onPause: () => void;
  canSkip: boolean;
  skipCounter: number;
  onSkip: () => void;
  thumbnail?: string;
}

export const AdOverlay: React.FC<AdOverlayProps> = ({
  adPlaying,
  videoRef,
  onTimeUpdate,
  onLoadedMetadata,
  onEnded,
  onPlay,
  onPause,
  canSkip,
  skipCounter,
  onSkip,
  thumbnail
}) => {
  return (
    <div className="absolute inset-0 z-20 flex flex-col">
      <div className="absolute top-0 left-0 right-0 bg-black bg-opacity-70 p-2 text-white z-30 flex justify-between items-center">
        <div className="flex items-center">
          <span className="bg-yellow-600 text-black text-xs px-2 py-1 rounded mr-2">AD</span>
          <span className="text-sm">{adPlaying.ad.title}</span>
        </div>
        {adPlaying.ad.is_skippable && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onSkip}
            disabled={!canSkip}
            className="text-xs"
          >
            {canSkip ? (
              <>
                <FastForward size={14} className="mr-1"/> Skip Ad
              </>
            ) : (
              `Skip in ${skipCounter}s`
            )}
          </Button>
        )}
      </div>
      
      <video
        ref={videoRef}
        className="w-full h-full object-contain"
        src={adPlaying.ad.video_url}
        poster={thumbnail}
        autoPlay
        onTimeUpdate={onTimeUpdate}
        onLoadedMetadata={onLoadedMetadata}
        onEnded={onEnded}
        onPlay={onPlay}
        onPause={onPause}
      />
    </div>
  );
};

export default AdOverlay;
