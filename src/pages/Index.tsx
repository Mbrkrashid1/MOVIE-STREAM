
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useContentData } from "@/hooks/useContentData";
import { useIsMobile } from "@/hooks/use-mobile";
import YouTubeLayout from "@/components/layout/YouTubeLayout";
import YouTubeHomeLayout from "@/components/home/YouTubeHomeLayout";
import MobileHomeLayout from "@/components/home/MobileHomeLayout";
import LoadingScreen from "@/components/home/LoadingScreen";

const Index = () => {
  const { toast } = useToast();
  const { isLoading } = useContentData();
  const isMobile = useIsMobile();

  useEffect(() => {
    toast({
      title: "Welcome to HausaBox! 🎬",
      description: "Your premium streaming destination for quality content.",
      duration: 3000,
    });
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (isMobile) {
    return (
      <div className="w-full min-h-screen bg-streaming-darker overflow-x-hidden">
        <MobileHomeLayout />
      </div>
    );
  }

  return (
    <YouTubeLayout>
      <YouTubeHomeLayout />
    </YouTubeLayout>
  );
};

export default Index;
