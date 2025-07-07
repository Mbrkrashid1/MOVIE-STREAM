
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useContentData } from "@/hooks/useContentData";
import MobileHomeLayout from "@/components/home/MobileHomeLayout";
import LoadingScreen from "@/components/home/LoadingScreen";

const Index = () => {
  const { toast } = useToast();
  const { isLoading } = useContentData();

  useEffect(() => {
    toast({
      title: "Welcome to HausaBox! 🎬",
      description: "Discover amazing Hausa movies and series.",
      duration: 3000,
    });
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return <MobileHomeLayout />;
};

export default Index;
