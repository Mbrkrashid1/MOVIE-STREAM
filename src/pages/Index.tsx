
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useContentData } from "@/hooks/useContentData";
import MovieBoxHomeLayout from "@/components/home/MovieBoxHomeLayout";
import LoadingScreen from "@/components/home/LoadingScreen";

const Index = () => {
  const { toast } = useToast();
  const { isLoading } = useContentData();

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

  return (
    <div className="w-full min-h-screen bg-black">
      <MovieBoxHomeLayout />
    </div>
  );
};

export default Index;
