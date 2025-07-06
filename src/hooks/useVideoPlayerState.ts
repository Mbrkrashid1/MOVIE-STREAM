
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

export function useVideoPlayerState(videoUrl: string) {
  const { toast } = useToast();
  const [videoError, setVideoError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Enhanced video URL validation and error handling
  useEffect(() => {
    // Check for invalid/empty video URLs immediately
    if (!videoUrl || videoUrl.trim() === '' || videoUrl === 'placeholder' || videoUrl === 'null' || videoUrl === 'undefined') {
      console.log('Invalid video URL detected:', videoUrl);
      setVideoError("No video source available for this content");
      setLoading(false);
      return;
    }

    // Reset error and retry count when URL changes
    setVideoError(null);
    setRetryCount(0);
    setLoading(true);

    // Validate URL format
    try {
      const url = new URL(videoUrl);
      if (!url.protocol.startsWith('http')) {
        throw new Error('Invalid protocol');
      }
    } catch (error) {
      console.error('Invalid video URL format:', videoUrl);
      setVideoError("Invalid video URL format");
      setLoading(false);
      return;
    }

    // For blob URLs, don't test accessibility as they're temporary
    if (videoUrl.startsWith('blob:')) {
      console.log('Blob URL detected, skipping validation');
      setLoading(false);
      setVideoError(null);
      return;
    }

    // Test video accessibility for http/https URLs with enhanced error handling
    const testVideo = document.createElement('video');
    testVideo.preload = 'metadata';
    testVideo.muted = true;
    testVideo.crossOrigin = 'anonymous';
    
    const handleTestLoad = () => {
      console.log('Video URL validated successfully');
      setVideoError(null);
      setLoading(false);
      cleanup();
    };
    
    const handleTestError = (e: Event) => {
      console.error('Video URL validation failed:', videoUrl, e);
      setVideoError("Video source is not accessible or format not supported");
      setLoading(false);
      cleanup();
    };

    const cleanup = () => {
      testVideo.removeEventListener('loadedmetadata', handleTestLoad);
      testVideo.removeEventListener('error', handleTestError);
      testVideo.removeEventListener('canplay', handleTestLoad);
      try {
        testVideo.src = '';
        testVideo.load();
      } catch (e) {
        // Ignore cleanup errors
      }
    };
    
    testVideo.addEventListener('loadedmetadata', handleTestLoad);
    testVideo.addEventListener('canplay', handleTestLoad);
    testVideo.addEventListener('error', handleTestError);
    
    // Set source with timeout
    const timeoutId = setTimeout(() => {
      console.warn('Video validation timeout');
      setVideoError("Video loading timeout - please try again");
      setLoading(false);
      cleanup();
    }, 8000);
    
    testVideo.src = videoUrl;
    
    return () => {
      clearTimeout(timeoutId);
      cleanup();
    };
  }, [videoUrl]);

  return {
    videoError,
    setVideoError,
    retryCount,
    setRetryCount,
    loading,
    setLoading
  };
}
