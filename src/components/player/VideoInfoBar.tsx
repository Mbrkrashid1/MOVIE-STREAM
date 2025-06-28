
import { Eye } from "lucide-react";

interface VideoInfoBarProps {
  title: string;
  description?: string;
  views: number;
  duration: number;
  hasTrackedView: boolean;
  formatTime: (time: number) => string;
  isVisible: boolean;
}

export function VideoInfoBar({ 
  title, 
  description = "", 
  views, 
  duration, 
  hasTrackedView, 
  formatTime, 
  isVisible 
}: VideoInfoBarProps) {
  if (!isVisible) return null;

  return (
    <div className="bg-gradient-to-t from-black/90 to-transparent p-3 sm:p-4 text-white">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
        <div className="flex-1 min-w-0">
          <h2 className="text-base sm:text-lg font-bold mb-1 line-clamp-1">{title}</h2>
          <div className="flex items-center flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm text-gray-300">
            <span className="flex items-center">
              <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
              {views.toLocaleString()} views
            </span>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:inline">{formatTime(duration)} duration</span>
            {description && (
              <>
                <span className="hidden md:inline">•</span>
                <span className="hidden md:inline line-clamp-1 max-w-xs">{description}</span>
              </>
            )}
          </div>
          {/* Mobile-specific info row */}
          <div className="sm:hidden mt-1 text-xs text-gray-400">
            {formatTime(duration)} • {description && <span className="line-clamp-1">{description}</span>}
          </div>
        </div>
        
        {/* View tracking indicator */}
        {hasTrackedView && (
          <div className="flex items-center text-xs text-green-400 shrink-0">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-1 animate-pulse"></div>
            <span className="hidden sm:inline">View tracked</span>
            <span className="sm:hidden">✓</span>
          </div>
        )}
      </div>
    </div>
  );
}
