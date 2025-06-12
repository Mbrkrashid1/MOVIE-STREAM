
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  DialogTrigger,
} from "@/components/ui/dialog";
import { Upload } from "lucide-react";
import { AdForm } from "./ads/AdForm";
import { AdTable } from "./ads/AdTable";
import { useAdMutations } from "./ads/useAdMutations";

const AdManagement = () => {
  const [editingAd, setEditingAd] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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
          <h1 className="text-3xl font-bold text-white">Ad Management</h1>
          <p className="text-gray-400 mt-1">Create and manage your advertising campaigns</p>
        </div>
        <Button 
          className="bg-primary hover:bg-primary/90"
          onClick={() => setIsDialogOpen(true)}
        >
          <Upload className="mr-2" size={16} />
          Upload Ad
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
    </div>
  );
};

export default AdManagement;
