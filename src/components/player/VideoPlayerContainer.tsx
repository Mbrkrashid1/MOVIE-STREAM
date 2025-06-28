
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
      {/* Enhanced HD backdrop with optimized loading */}
      {backdropImage && (
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-500"
          style={{ 
            backgroundImage: `url(${backdropImage})`,
            opacity: showBackdrop ? 1 : 0,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          {/* Enhanced gradient overlay for better readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-black/90" />
          
          {/* Preload the image for better performance */}
          <img 
            src={backdropImage} 
            alt="Backdrop" 
            className="hidden" 
            loading="eager"
            onLoad={() => console.log('Backdrop loaded')}
          />
        </div>
      )}
      
      {children}
    </div>
  );
}
