
import { useState, useRef, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";

export function useVideoControls() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = useCallback(async () => {
    if (!videoRef.current) return;
    
    try {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        // Enhanced video source validation
        if (!videoRef.current.src || 
            videoRef.current.src === window.location.href ||
            videoRef.current.src === 'placeholder' ||
            videoRef.current.src.trim() === '') {
          console.error('Invalid video source:', videoRef.current.src);
          toast({
            title: "Video Error",
            description: "No valid video source available.",
            variant: "destructive"
          });
          return;
        }

        // Check video readiness with enhanced validation
        if (videoRef.current.readyState >= 2) {
          const playPromise = videoRef.current.play();
          if (playPromise !== undefined) {
            await playPromise;
            setIsPlaying(true);
          }
        } else {
          // Wait for video to be ready with enhanced timeout handling
          setLoading(true);
          
          const timeoutId = setTimeout(() => {
            setLoading(false);
            toast({
              title: "Video Loading Timeout",
              description: "Video is taking too long to load. Please check your connection and try again.",
              variant: "destructive"
            });
          }, 15000); // Increased timeout to 15 seconds

          const handleCanPlay = async () => {
            clearTimeout(timeoutId);
            setLoading(false);
            
            try {
              if (videoRef.current) {
                const playPromise = videoRef.current.play();
                if (playPromise !== undefined) {
                  await playPromise;
                  setIsPlaying(true);
                }
              }
            } catch (error) {
              handlePlayError(error);
            }
            
            videoRef.current?.removeEventListener('canplay', handleCanPlay);
          };
          
          videoRef.current.addEventListener('canplay', handleCanPlay);
          
          // Also listen for canplaythrough for better reliability
          const handleCanPlayThrough = async () => {
            clearTimeout(timeoutId);
            setLoading(false);
            
            try {
              if (videoRef.current) {
                const playPromise = videoRef.current.play();
                if (playPromise !== undefined) {
                  await playPromise;
                  setIsPlaying(true);
                }
              }
            } catch (error) {
              handlePlayError(error);
            }
            
            videoRef.current?.removeEventListener('canplaythrough', handleCanPlayThrough);
          };
          
          videoRef.current.addEventListener('canplaythrough', handleCanPlayThrough);
        }
      }
    } catch (error) {
      handlePlayError(error);
    }
  }, [isPlaying]);

  const handlePlayError = (error: any) => {
    console.error("Error playing video:", error);
    setIsPlaying(false);
    setLoading(false);
    
    // Enhanced error handling with more specific messages
    let errorTitle = "Playback Error";
    let errorDescription = "Unable to play this video.";
    
    if (error.name === 'NotAllowedError') {
      errorTitle = "Playback Blocked";
      errorDescription = "Please tap to enable video playback or check browser permissions.";
    } else if (error.name === 'NotSupportedError') {
      errorTitle = "Format Not Supported";
      errorDescription = "This video format is not supported by your browser.";
    } else if (error.name === 'AbortError') {
      errorTitle = "Playback Aborted";
      errorDescription = "Video playback was interrupted. Please try again.";
    } else if (error.name === 'NetworkError') {
      errorTitle = "Network Error";
      errorDescription = "Unable to load video due to network issues. Check your connection.";
    } else if (error.message && error.message.includes('decode')) {
      errorTitle = "Video Decode Error";
      errorDescription = "The video file appears to be corrupted or in an unsupported format.";
    } else {
      errorDescription = "Please check your connection and try again.";
    }
    
    toast({
      title: errorTitle,
      description: errorDescription,
      variant: "destructive"
    });
  };

  const toggleMute = useCallback(() => {
    if (!videoRef.current) return;
    
    const newMutedState = !isMuted;
    videoRef.current.muted = newMutedState;
    setIsMuted(newMutedState);
    
    // Enhanced volume control
    if (newMutedState) {
      videoRef.current.volume = 0;
    } else {
      // Gradually increase volume for better UX
      videoRef.current.volume = 0.8;
    }
  }, [isMuted]);

  const handleLoadedMetadata = useCallback(() => {
    if (!videoRef.current) return;
    
    setDuration(videoRef.current.duration);
    setLoading(false);
    
    // Enhanced video setup
    videoRef.current.volume = 0.8;
    
    console.log('Video loaded successfully:', {
      duration: videoRef.current.duration,
      readyState: videoRef.current.readyState,
      videoWidth: videoRef.current.videoWidth,
      videoHeight: videoRef.current.videoHeight,
      src: videoRef.current.src,
      networkState: videoRef.current.networkState
    });

    // Enhanced validation for video dimensions
    if (videoRef.current.videoWidth === 0 || videoRef.current.videoHeight === 0) {
      console.warn('Video loaded but has no dimensions - might be audio only or corrupted');
      toast({
        title: "Video Warning",
        description: "Video loaded but may have display issues.",
        variant: "destructive"
      });
    }
  }, []);

  const formatTime = useCallback((time: number) => {
    if (!time || !isFinite(time)) return "0:00";
    
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }, []);
  
  const handleSeek = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (!videoRef.current) return;
    
    const newTime = parseFloat(e.target.value);
    if (isFinite(newTime) && newTime >= 0 && newTime <= duration) {
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  }, [duration]);

  const handleTimeUpdate = useCallback(() => {
    if (!videoRef.current) return;
    
    const newTime = videoRef.current.currentTime;
    if (isFinite(newTime)) {
      setCurrentTime(newTime);
    }
  }, []);

  return {
    isPlaying,
    isMuted,
    currentTime,
    duration,
    loading,
    videoRef,
    setIsPlaying,
    togglePlay,
    toggleMute,
    handleLoadedMetadata,
    formatTime,
    handleSeek,
    handleTimeUpdate,
    setLoading
  };
}
