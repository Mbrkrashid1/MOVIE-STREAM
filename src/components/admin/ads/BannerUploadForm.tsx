
import { useState, useRef, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Image, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const BannerUploadForm = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_url: '',
    cta_text: '',
    cta_url: '',
    is_active: true
  });

  // Create banner mutation
  const createBannerMutation = useMutation({
    mutationFn: async (newBanner: any) => {
      const { data, error } = await supabase
        .from('ads')
        .insert({
          title: newBanner.title,
          description: newBanner.description,
          thumbnail_url: newBanner.image_url,
          video_url: newBanner.image_url, // Use image as video_url for banner ads
          cta_text: newBanner.cta_text,
          cta_url: newBanner.cta_url,
          duration: 0, // Banners don't have duration
          is_skippable: true
        })
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ads'] });
      resetForm();
      toast({
        title: "Banner uploaded",
        description: "The banner has been uploaded successfully."
      });
    },
    onError: (error) => {
      console.error("Error uploading banner:", error);
      toast({
        title: "Upload failed",
        description: "Failed to upload banner. Please try again.",
        variant: "destructive"
      });
    }
  });

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploadingImage(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-banner.${fileExt}`;
      const filePath = `thumbnails/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('content')
        .upload(filePath, file);
      
      if (uploadError) throw uploadError;
      
      const { data: publicUrlData } = supabase.storage
        .from('content')
        .getPublicUrl(filePath);
      
      setFormData(prev => ({
        ...prev,
        image_url: publicUrlData.publicUrl
      }));
      
      toast({
        title: "Image uploaded",
        description: "Banner image has been uploaded successfully."
      });
    } catch (error: any) {
      console.error("Error uploading image:", error);
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload image.",
        variant: "destructive"
      });
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.image_url) {
      toast({
        title: "Missing required fields",
        description: "Please provide at least a title and banner image.",
        variant: "destructive"
      });
      return;
    }

    createBannerMutation.mutate(formData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      image_url: '',
      cta_text: '',
      cta_url: '',
      is_active: true
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="title" className="text-white">Banner Title *</Label>
          <Input 
            id="title" 
            name="title" 
            value={formData.title} 
            onChange={handleInputChange}
            placeholder="Enter banner title"
            required
            className="bg-input border-border"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="cta_text" className="text-white">Call-to-Action Text</Label>
          <Input 
            id="cta_text" 
            name="cta_text" 
            value={formData.cta_text} 
            onChange={handleInputChange}
            placeholder="e.g., Learn More, Shop Now"
            className="bg-input border-border"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="cta_url" className="text-white">Call-to-Action URL</Label>
          <Input 
            id="cta_url" 
            name="cta_url" 
            type="url"
            value={formData.cta_url} 
            onChange={handleInputChange}
            placeholder="https://example.com"
            className="bg-input border-border"
          />
        </div>
      </div>

      {/* Image Upload Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-white">Banner Image</h3>
        
        <div className="space-y-2">
          <Label className="text-white">Banner Image *</Label>
          <div className="flex items-center gap-2">
            <Input 
              value={formData.image_url} 
              onChange={handleInputChange}
              name="image_url"
              placeholder="Image URL or upload file"
              className="bg-input border-border"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingImage}
              className="whitespace-nowrap"
            >
              {uploadingImage ? 'Uploading...' : <><Upload size={16} className="mr-2" /> Upload Image</>}
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*"
              className="hidden"
            />
          </div>
          {formData.image_url && (
            <div className="mt-2">
              <img 
                src={formData.image_url} 
                alt="Banner preview" 
                className="w-full max-w-md h-32 object-cover rounded-lg border border-border"
              />
            </div>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className="text-white">Description</Label>
        <Textarea 
          id="description" 
          name="description" 
          value={formData.description} 
          onChange={handleInputChange}
          placeholder="Enter banner description"
          className="bg-input border-border resize-none"
          rows={3}
        />
      </div>

      <div className="flex items-center space-x-2">
        <input 
          id="is_active" 
          name="is_active" 
          type="checkbox" 
          checked={formData.is_active}
          onChange={handleInputChange}
          className="rounded"
        />
        <Label htmlFor="is_active" className="text-white">Active Banner</Label>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={resetForm}>
          Clear Form
        </Button>
        <Button 
          type="submit" 
          className="bg-primary hover:bg-primary/90"
          disabled={createBannerMutation.isPending}
        >
          {createBannerMutation.isPending ? 'Uploading...' : (
            <>
              <Plus size={16} className="mr-2" />
              Upload Banner
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

export default BannerUploadForm;
