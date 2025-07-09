
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

export function useVideoPlayerState(videoUrl: string) {
  const { toast } = useToast();
  const [videoError, setVideoError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Reset states when URL changes
    setVideoError(null);
    setRetryCount(0);
    setLoading(true);

    // Check for invalid/empty video URLs immediately
    if (!videoUrl || videoUrl.trim() === '' || videoUrl === 'placeholder' || videoUrl === 'null' || videoUrl === 'undefined') {
      console.log('Invalid video URL detected:', videoUrl);
      setVideoError("No video source available for this content");
      setLoading(false);
      return;
    }

    // For blob URLs, don't test accessibility
    if (videoUrl.startsWith('blob:')) {
      console.log('Blob URL detected, skipping validation');
      setLoading(false);
      setVideoError(null);
      return;
    }

    // Validate URL format for non-blob URLs
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

    // Test video accessibility with timeout
    const testVideo = document.createElement('video');
    testVideo.preload = 'metadata';
    testVideo.muted = true;
    testVideo.crossOrigin = 'anonymous';
    
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

    const handleTestLoad = () => {
      console.log('Video URL validated successfully');
      setVideoError(null);
      setLoading(false);
      cleanup();
    };
    
    const handleTestError = (e: Event) => {
      console.error('Video URL validation failed:', videoUrl, e);
      setVideoError("Video source is not accessible - trying alternative playback");
      setLoading(false);
      cleanup();
    };
    
    testVideo.addEventListener('loadedmetadata', handleTestLoad);
    testVideo.addEventListener('canplay', handleTestLoad);
    testVideo.addEventListener('error', handleTestError);
    
    // Set source with timeout
    const timeoutId = setTimeout(() => {
      console.warn('Video validation timeout - proceeding with playback attempt');
      setVideoError(null);
      setLoading(false);
      cleanup();
    }, 5000);
    
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
