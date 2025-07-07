
import { useState, useEffect } from "react";

export function useOrientation() {
  const [isLandscape, setIsLandscape] = useState(false);
  const [userPreference, setUserPreference] = useState<'auto' | 'portrait' | 'landscape'>('auto');

  useEffect(() => {
    const handleOrientationChange = () => {
      if (userPreference === 'auto') {
        const orientation = window.screen?.orientation?.angle || 0;
        const isDeviceLandscape = orientation === 90 || orientation === -90 || orientation === 270;
        const windowLandscape = window.innerWidth > window.innerHeight;
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
