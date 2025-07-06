
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Upload, Film, Play, Video, Image } from "lucide-react";
import { AdForm } from "./ads/AdForm";
import { AdTable } from "./ads/AdTable";
import { useAdMutations } from "./ads/useAdMutations";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ContentUploadForm from "./ads/ContentUploadForm";
import ShortVideoUploadForm from "./ads/ShortVideoUploadForm";
import BannerUploadForm from "./ads/BannerUploadForm";

const AdManagement = () => {
  const [editingAd, setEditingAd] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("ads");

  const { createAdMutation, updateAdMutation, deleteAdMutation } = useAdMutations();

  // Fetch ads from Supabase
  const { data: ads, isLoading } = useQuery({
    queryKey: ["ads"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ads")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });

  // Fetch content for movies/series upload
  const { data: content, isLoading: contentLoading } = useQuery({
    queryKey: ["content"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("content")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });

  const onSubmit = (values: any) => {
    if (editingAd) {
      updateAdMutation.mutate({ id: editingAd.id, values });
    } else {
      createAdMutation.mutate(values);
    }
    setIsDialogOpen(false);
    setEditingAd(null);
  };

  const handleEdit = (ad: any) => {
    setEditingAd(ad);
    setIsDialogOpen(true);
  };

  const handleDelete = (adId: string) => {
    if (confirm("Are you sure you want to delete this ad?")) {
      deleteAdMutation.mutate(adId);
    }
  };

  const handleCancel = () => {
    setIsDialogOpen(false);
    setEditingAd(null);
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Content & Ad Management</h1>
          <p className="text-gray-400 mt-1">Manage all content uploads and advertising campaigns</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-card">
          <TabsTrigger value="ads" className="data-[state=active]:bg-primary">
            <Play className="mr-2" size={16} />
            Video Ads
          </TabsTrigger>
          <TabsTrigger value="banners" className="data-[state=active]:bg-primary">
            <Image className="mr-2" size={16} />
            Banner Ads
          </TabsTrigger>
          <TabsTrigger value="movies" className="data-[state=active]:bg-primary">
            <Film className="mr-2" size={16} />
            Movies
          </TabsTrigger>
          <TabsTrigger value="series" className="data-[state=active]:bg-primary">
            <Upload className="mr-2" size={16} />
            Series
          </TabsTrigger>
          <TabsTrigger value="shorts" className="data-[state=active]:bg-primary">
            <Video className="mr-2" size={16} />
            Short Videos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="ads" className="space-y-6">
          <div className="flex justify-end">
            <Button 
              className="bg-primary hover:bg-primary/90"
              onClick={() => setIsDialogOpen(true)}
            >
              <Upload className="mr-2" size={16} />
              Upload Video Ad
            </Button>
          </div>

          <AdTable 
            ads={ads}
            isLoading={isLoading}
            onEdit={handleEdit}
            onDelete={handleDelete}
            formatDuration={formatDuration}
          />

          <AdForm
            isOpen={isDialogOpen}
            onOpenChange={setIsDialogOpen}
            editingAd={editingAd}
            onSubmit={onSubmit}
            onCancel={handleCancel}
          />
        </TabsContent>

        <TabsContent value="banners" className="space-y-6">
          <div className="bg-card p-6 rounded-lg border border-border">
            <h2 className="text-xl font-semibold text-white mb-4">Upload Banner Advertisement</h2>
            <BannerUploadForm />
          </div>
        </TabsContent>

        <TabsContent value="movies" className="space-y-6">
          <div className="bg-card p-6 rounded-lg border border-border">
            <h2 className="text-xl font-semibold text-white mb-4">Upload Movie Content</h2>
            <ContentUploadForm contentType="movie" />
          </div>
        </TabsContent>

        <TabsContent value="series" className="space-y-6">
          <div className="bg-card p-6 rounded-lg border border-border">
            <h2 className="text-xl font-semibold text-white mb-4">Upload Series Content</h2>
            <ContentUploadForm contentType="series" />
          </div>
        </TabsContent>

        <TabsContent value="shorts" className="space-y-6">
          <div className="bg-card p-6 rounded-lg border border-border">
            <h2 className="text-xl font-semibold text-white mb-4">Upload Short Video Content</h2>
            <ShortVideoUploadForm />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdManagement;
