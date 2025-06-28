
import { ReactNode } from "react";

interface VideoPlayerContainerProps {
  children: ReactNode;
  isFullscreen: boolean;
  isLandscape: boolean;
  backdropImage?: string;
  showBackdrop: boolean;
}

export function VideoPlayerContainer({ 
  children, 
  isFullscreen, 
  isLandscape, 
  backdropImage, 
  showBackdrop 
}: VideoPlayerContainerProps) {
  const getContainerClasses = () => {
    if (isFullscreen || isLandscape) {
      return "fixed inset-0 z-50 bg-black";
    }
    return "relative w-full h-full bg-black flex flex-col";
  };

  return (
    <div className={getContainerClasses()}>
      {/* Enhanced backdrop with custom image support */}
      {backdropImage && (
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-300"
          style={{ 
            backgroundImage: `url(${backdropImage})`,
            opacity: showBackdrop ? 1 : 0
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/80" />
        </div>
      )}
      
      {children}
    </div>
  );
}
