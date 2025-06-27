
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
        // Ensure video is ready before playing
        if (videoRef.current.readyState >= 2) {
          await videoRef.current.play();
          setIsPlaying(true);
        } else {
          // Wait for video to be ready
          setLoading(true);
          const handleCanPlay = () => {
            videoRef.current?.play()
              .then(() => setIsPlaying(true))
              .catch(handlePlayError);
            videoRef.current?.removeEventListener('canplay', handleCanPlay);
            setLoading(false);
          };
          
          videoRef.current.addEventListener('canplay', handleCanPlay);
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
    
    // Handle different types of play errors
    if (error.name === 'NotAllowedError') {
      toast({
        title: "Playback Blocked",
        description: "Please interact with the page to enable video playback.",
        variant: "destructive"
      });
    } else if (error.name === 'NotSupportedError') {
      toast({
        title: "Format Not Supported",
        description: "This video format is not supported by your browser.",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Playback Error",
        description: "There was an error playing this video.",
        variant: "destructive"
      });
    }
  };

  const toggleMute = useCallback(() => {
    if (!videoRef.current) return;
    
    const newMutedState = !isMuted;
    videoRef.current.muted = newMutedState;
    setIsMuted(newMutedState);
    
    // Also adjust volume to provide visual feedback
    if (newMutedState) {
      videoRef.current.volume = 0;
    } else {
      videoRef.current.volume = 0.8; // Set to 80% volume when unmuting
    }
  }, [isMuted]);

  const handleLoadedMetadata = useCallback(() => {
    if (!videoRef.current) return;
    
    setDuration(videoRef.current.duration);
    setLoading(false);
    
    // Set initial volume
    videoRef.current.volume = 0.8;
    
    console.log('Video loaded:', {
      duration: videoRef.current.duration,
      readyState: videoRef.current.readyState,
      videoWidth: videoRef.current.videoWidth,
      videoHeight: videoRef.current.videoHeight
    });
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
