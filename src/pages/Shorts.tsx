
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import MovieBoxNavbar from "@/components/layout/MovieBoxNavbar";
import BottomNavigation from "@/components/layout/BottomNavigation";
import { Link } from "react-router-dom";
import { Play, Eye } from "lucide-react";

const Shorts = () => {
  const { toast } = useToast();

  // Fetch short videos from Supabase
  const { data: shorts, isLoading } = useQuery({
    queryKey: ["shorts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("content")
        .select("*")
        .eq("type", "short")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });

  useEffect(() => {
    toast({
      title: "Welcome to Shorts! 🎬",
      description: "Discover amazing short videos and clips.",
    });
  }, []);

  const formatViews = (views: number | null) => {
    if (!views) return "0";
    if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}k`;
    }
    return views.toString();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading shorts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      <MovieBoxNavbar />
      
      <div className="pt-16 px-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white mb-2">Short Videos</h1>
          <p className="text-gray-400">Quick entertainment at your fingertips</p>
        </div>

        {shorts && shorts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {shorts.map((short) => (
              <Link 
                to={`/movie/${short.id}`} 
                key={short.id}
                className="relative group"
              >
                <div className="relative aspect-[9/16] rounded-lg overflow-hidden bg-gray-800">
                  <img 
                    src={short.thumbnail_url || "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5"} 
                    alt={short.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  
                  {/* Play overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="bg-primary rounded-full p-3">
                      <Play size={20} fill="white" className="text-white ml-1" />
                    </div>
                  </div>
                  
                  {/* Duration */}
                  {short.duration && (
                    <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                      {short.duration}s
                    </div>
                  )}
                  
                  {/* View count */}
                  <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded flex items-center">
                    <Eye size={12} className="mr-1" />
                    {formatViews(short.views)}
                  </div>
                </div>
                
                <h3 className="text-white text-sm font-medium mt-2 line-clamp-2">{short.title}</h3>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Play size={32} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No Short Videos Yet</h3>
            <p className="text-gray-400">Short videos will appear here once they're uploaded.</p>
          </div>
        )}
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default Shorts;
