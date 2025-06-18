
import MovieBoxNavbar from "@/components/layout/MovieBoxNavbar";
import BottomNavigation from "@/components/layout/BottomNavigation";

const LoadingScreen = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-background">
      <MovieBoxNavbar />
      <div className="pt-16 h-[calc(100vh-120px)] flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-3 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
            <div className="absolute inset-0 w-12 h-12 border-3 border-accent/20 border-b-accent rounded-full animate-spin mx-auto mt-2 ml-2"></div>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Loading HausaBox
            </h3>
            <p className="text-muted-foreground animate-pulse text-sm">Preparing amazing Hausa content...</p>
          </div>
        </div>
      </div>
      <BottomNavigation />
    </div>
  );
};

export default LoadingScreen;
