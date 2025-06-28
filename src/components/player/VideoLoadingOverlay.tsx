
interface VideoLoadingOverlayProps {
  loading: boolean;
}

export function VideoLoadingOverlay({ loading }: VideoLoadingOverlayProps) {
  if (!loading) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-white text-sm">Loading video...</p>
      </div>
    </div>
  );
}
