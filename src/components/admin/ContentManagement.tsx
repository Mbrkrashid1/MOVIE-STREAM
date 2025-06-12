
import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ContentForm } from "./content/ContentForm";
import { ContentTable } from "./content/ContentTable";
import { useContentMutations } from "./content/useContentMutations";

export function ContentManagement() {
  const [isCreating, setIsCreating] = useState(false);
  const [editingContent, setEditingContent] = useState<any>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [contentToDelete, setContentToDelete] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'movie',
    category: 'Hausa Movies',
    thumbnail_url: '',
    video_url: '',
    duration: '',
    release_year: new Date().getFullYear().toString(),
    language: 'Hausa',
    is_featured: false
  });

  const { createContentMutation, updateContentMutation, deleteContentMutation } = useContentMutations();

  // Fetch content from Supabase
  const { data: content, isLoading } = useQuery({
    queryKey: ['content'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('content')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      return data || [];
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const payload = {
      ...formData,
      duration: parseInt(formData.duration) || null,
      release_year: parseInt(formData.release_year) || null
    };

    if (editingContent) {
      updateContentMutation.mutate({ updatedContent: payload, id: editingContent.id });
    } else {
      createContentMutation.mutate(payload);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEdit = (item: any) => {
    setEditingContent(item);
    setFormData({
      title: item.title,
      description: item.description || '',
      type: item.type,
      category: item.category,
      thumbnail_url: item.thumbnail_url || '',
      video_url: item.video_url,
      duration: item.duration?.toString() || '',
      release_year: item.release_year?.toString() || new Date().getFullYear().toString(),
      language: item.language || 'Hausa',
      is_featured: item.is_featured || false
    });
    setIsCreating(true);
  };

  const confirmDelete = (item: any) => {
    setContentToDelete(item);
    setDeleteDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      type: 'movie',
      category: 'Hausa Movies',
      thumbnail_url: '',
      video_url: '',
      duration: '',
      release_year: new Date().getFullYear().toString(),
      language: 'Hausa',
      is_featured: false
    });
    setEditingContent(null);
    setIsCreating(false);
  };

  const formatDuration = (seconds: number) => {
    if (!seconds) return "Unknown";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Content Management</h2>
        <Button 
          onClick={() => setIsCreating(!isCreating)} 
          className={isCreating ? "bg-gray-600" : "bg-primary"}
        >
          {isCreating ? "Cancel" : <><Plus size={18} className="mr-2" /> Add New Content</>}
        </Button>
      </div>

      {isCreating && (
        <ContentForm
          formData={formData}
          editingContent={editingContent}
          onSubmit={handleSubmit}
          onInputChange={handleInputChange}
          onSelectChange={handleSelectChange}
          onCancel={resetForm}
          setFormData={setFormData}
        />
      )}

      <ContentTable
        content={content}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={confirmDelete}
        formatDuration={formatDuration}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the content
              "{contentToDelete?.title}" and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => {
                deleteContentMutation.mutate(contentToDelete?.id);
                setDeleteDialogOpen(false);
                setContentToDelete(null);
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default ContentManagement;
