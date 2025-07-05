interface VideoErrorDisplayProps {
  error: string;
  onRetry: () => void;
}

export function VideoErrorDisplay({ error, onRetry }: VideoErrorDisplayProps) {
  const handleRetryClick = () => {
    // If it's a "No video available" error, just close the player
    if (error.includes("No video available") || error.includes("No video source")) {
      onRetry(); // This will close the player
      return;
    }
    
    // Otherwise, retry the video
    onRetry();
  };

  const getButtonText = () => {
    if (error.includes("No video available") || error.includes("No video source")) {
      return "Go Back";
    }
    return "Retry Playback";
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black text-white z-20">
      <div className="text-center p-8">
        <div className="mb-4 text-red-400">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold mb-2">
          {error.includes("No video available") ? "Content Not Available" : "Playback Error"}
        </h3>
        <p className="text-gray-300 mb-4">{error}</p>
        <button 
          onClick={handleRetryClick}
          className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/80 transition-colors"
        >
          {getButtonText()}
        </button>
      </div>
    </div>
  );
}
