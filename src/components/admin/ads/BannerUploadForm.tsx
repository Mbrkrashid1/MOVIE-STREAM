
import { useState, useRef, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Image, Plus, Loader2 } from "lucide-react";
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
        title: "Success!",
        description: "Banner uploaded successfully and is now live.",
      });
    },
    onError: (error: any) => {
      console.error("Error uploading banner:", error);
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload banner. Please try again.",
        variant: "destructive"
      });
    }
  });

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file.",
        variant: "destructive"
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 5MB.",
        variant: "destructive"
      });
      return;
    }
    
    setUploadingImage(true);
    try {
      const fileExt = file.name.split('.').pop()?.toLowerCase();
      const fileName = `banner-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `banners/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('content')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });
      
      if (uploadError) throw uploadError;
      
      const { data: publicUrlData } = supabase.storage
        .from('content')
        .getPublicUrl(filePath);
      
      setFormData(prev => ({
        ...prev,
        image_url: publicUrlData.publicUrl
      }));
      
      toast({
        title: "Image uploaded!",
        description: "Banner image uploaded successfully.",
      });
    } catch (error: any) {
      console.error("Error uploading image:", error);
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload image. Please try again.",
        variant: "destructive"
      });
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast({
        title: "Title required",
        description: "Please provide a banner title.",
        variant: "destructive"
      });
      return;
    }

    if (!formData.image_url.trim()) {
      toast({
        title: "Image required",
        description: "Please upload or provide a banner image URL.",
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
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
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

        {/* Enhanced Image Upload Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-white flex items-center">
            <Image className="mr-2" size={20} />
            Banner Image *
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Input 
                value={formData.image_url} 
                onChange={handleInputChange}
                name="image_url"
                placeholder="Image URL or upload file below"
                className="bg-input border-border flex-1"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingImage}
                className="whitespace-nowrap min-w-[120px]"
              >
                {uploadingImage ? (
                  <>
                    <Loader2 size={16} className="mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload size={16} className="mr-2" />
                    Upload Image
                  </>
                )}
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
              <div className="mt-4">
                <img 
                  src={formData.image_url} 
                  alt="Banner preview" 
                  className="w-full max-w-2xl h-48 object-cover rounded-lg border border-border shadow-lg"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
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
            placeholder="Enter banner description (optional)"
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
            className="rounded border-border"
          />
          <Label htmlFor="is_active" className="text-white">Active Banner (show immediately)</Label>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-border">
          <Button type="button" variant="outline" onClick={resetForm}>
            Clear Form
          </Button>
          <Button 
            type="submit" 
            className="bg-primary hover:bg-primary/90 min-w-[120px]"
            disabled={createBannerMutation.isPending || uploadingImage}
          >
            {createBannerMutation.isPending ? (
              <>
                <Loader2 size={16} className="mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Plus size={16} className="mr-2" />
                Upload Banner
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default BannerUploadForm;
