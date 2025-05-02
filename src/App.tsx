
import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import MovieDetail from "./pages/MovieDetail";
import Downloads from "./pages/Downloads";
import Library from "./pages/Library";
import Profile from "./pages/Profile";
import Shorts from "./pages/Shorts";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";
import { supabase } from "./integrations/supabase/client";

// Initialize with default options
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1
    }
  }
});

const App = () => {
  // Create storage bucket on app initialization if it doesn't exist
  useEffect(() => {
    const createStorageBucket = async () => {
      try {
        // Check if bucket exists first
        const { data: buckets } = await supabase.storage.listBuckets();
        const contentBucketExists = buckets?.some(bucket => bucket.name === 'content');
        
        if (!contentBucketExists) {
          const { data, error } = await supabase.storage.createBucket('content', {
            public: true,
            fileSizeLimit: 52428800, // 50MB limit
          });
          
          if (error) {
            console.error("Failed to create storage bucket:", error);
          } else {
            console.log("Storage bucket created:", data);
          }
        }
      } catch (error) {
        console.error("Error checking/creating storage bucket:", error);
      }
    };

    createStorageBucket();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/movie/:id" element={<MovieDetail />} />
            <Route path="/series/:id" element={<MovieDetail />} />
            <Route path="/downloads" element={<Downloads />} />
            <Route path="/library" element={<Library />} />
            <Route path="/shorts" element={<Shorts />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
