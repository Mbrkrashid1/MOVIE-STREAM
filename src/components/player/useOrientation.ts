
import { useState, useEffect } from "react";

export function useOrientation() {
  const [isLandscape, setIsLandscape] = useState(false);
  const [userPreference, setUserPreference] = useState<'auto' | 'portrait' | 'landscape'>('auto');

  useEffect(() => {
    const handleOrientationChange = () => {
      const windowLandscape = window.innerWidth > window.innerHeight;
      const deviceOrientation = window.screen?.orientation?.angle || 0;
      const isDeviceLandscape = deviceOrientation === 90 || deviceOrientation === -90 || deviceOrientation === 270;
      
      if (userPreference === 'auto') {
        // YouTube-style: automatically go landscape when device is rotated or window is wider
        setIsLandscape(isDeviceLandscape || windowLandscape);
      } else if (userPreference === 'landscape') {
        setIsLandscape(true);
      } else {
        setIsLandscape(false);
      }
    };

    handleOrientationChange();
    window.addEventListener('orientationchange', handleOrientationChange);
    window.addEventListener('resize', handleOrientationChange);

    return () => {
      window.removeEventListener('orientationchange', handleOrientationChange);
      window.removeEventListener('resize', handleOrientationChange);
    };
  }, [userPreference]);

  const toggleOrientation = () => {
    setUserPreference(prev => {
      if (prev === 'auto') return 'landscape';
      if (prev === 'landscape') return 'portrait';
      return 'auto';
    });
  };

  return { 
    isLandscape, 
    userPreference, 
    toggleOrientation 
  };
}
