
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useContentData } from "@/hooks/useContentData";
import MobileHomeLayout from "@/components/home/MobileHomeLayout";

const Index = () => {
  const { toast } = useToast();
  const { isLoading } = useContentData();

  useEffect(() => {
    toast({
      title: "Welcome to HausaBox! 🎬",
      description: "Discover amazing Hausa movies and series offline & online.",
    });
  }, []);

  return <MobileHomeLayout />;
};

export default Index;
