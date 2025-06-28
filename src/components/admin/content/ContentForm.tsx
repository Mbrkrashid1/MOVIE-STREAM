
import { useState, useRef, ChangeEvent } from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ContentFormData {
  title: string;
  description: string;
  type: string;
  category: string;
  thumbnail_url: string;
  backdrop_url: string;
  video_url: string;
  duration: string;
  release_year: string;
  language: string;
  is_featured: boolean;
}

interface ContentFormProps {
  formData: ContentFormData;
  editingContent: any;
  onSubmit: (e: React.FormEvent) => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectChange: (name: string, value: string) => void;
  onCancel: () => void;
  setFormData: React.Dispatch<React.SetStateAction<ContentFormData>>;
}

export function ContentForm({
  formData,
  editingContent,
  onSubmit,
  onInputChange,
  onSelectChange,
  onCancel,
  setFormData
}: ContentFormProps) {
  const { toast } = useToast();
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);
  const [uploadingBackdrop, setUploadingBackdrop] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const fileInputRefThumbnail = useRef<HTMLInputElement>(null);
  const fileInputRefBackdrop = useRef<HTMLInputElement>(null);
  const fileInputRefVideo = useRef<HTMLInputElement>(null);

  const handleUploadThumbnail = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploadingThumbnail(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-thumbnail.${fileExt}`;
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
        thumbnail_url: publicUrlData.publicUrl
      }));
      
      toast({
        title: "Thumbnail uploaded",
        description: "Thumbnail has been uploaded successfully."
      });
    } catch (error: any) {
      console.error("Error uploading thumbnail:", error);
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload thumbnail.",
        variant: "destructive"
      });
    } finally {
      setUploadingThumbnail(false);
      if (fileInputRefThumbnail.current) fileInputRefThumbnail.current.value = "";
    }
  };

  const handleUploadBackdrop = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploadingBackdrop(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-backdrop.${fileExt}`;
      const filePath = `backdrops/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('content')
        .upload(filePath, file);
      
      if (uploadError) throw uploadError;
      
      const { data: publicUrlData } = supabase.storage
        .from('content')
        .getPublicUrl(filePath);
      
      setFormData(prev => ({
        ...prev,
        backdrop_url: publicUrlData.publicUrl
      }));
      
      toast({
        title: "Backdrop uploaded",
        description: "Backdrop image has been uploaded successfully."
      });
    } catch (error: any) {
      console.error("Error uploading backdrop:", error);
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload backdrop image.",
        variant: "destructive"
      });
    } finally {
      setUploadingBackdrop(false);
      if (fileInputRefBackdrop.current) fileInputRefBackdrop.current.value = "";
    }
  };
  
  const handleUploadVideo = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploadingVideo(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-video.${fileExt}`;
      const filePath = `videos/${fileName}`;
      
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
        video_url: publicUrlData.publicUrl
      }));
      
      toast({
        title: "Video uploaded",
        description: "Video has been uploaded successfully."
      });
    } catch (error: any) {
      console.error("Error uploading video:", error);
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload video.",
        variant: "destructive"
      });
    } finally {
      setUploadingVideo(false);
      if (fileInputRefVideo.current) fileInputRefVideo.current.value = "";
    }
  };

  return (
    <div className="bg-card p-6 rounded-lg border border-border mb-6">
      <h3 className="text-lg font-medium mb-4">{editingContent ? 'Edit Content' : 'Add New Content'}</h3>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input 
              id="title" 
              name="title" 
              value={formData.title} 
              onChange={onInputChange}
              placeholder="Content Title"
              required
              className="bg-input border-border"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <Select 
              value={formData.type} 
              onValueChange={(value) => onSelectChange('type', value)}
            >
              <SelectTrigger className="bg-input border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="movie">Movie</SelectItem>
                <SelectItem value="series">Series</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select 
              value={formData.category} 
              onValueChange={(value) => onSelectChange('category', value)}
            >
              <SelectTrigger className="bg-input border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Hausa Movies">Hausa Movies</SelectItem>
                <SelectItem value="Hausa Series">Hausa Series</SelectItem>
                <SelectItem value="Comedy">Comedy</SelectItem>
                <SelectItem value="Drama">Drama</SelectItem>
                <SelectItem value="Action">Action</SelectItem>
                <SelectItem value="Kannywood">Kannywood</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="language">Language</Label>
            <Select 
              value={formData.language} 
              onValueChange={(value) => onSelectChange('language', value)}
            >
              <SelectTrigger className="bg-input border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Hausa">Hausa</SelectItem>
                <SelectItem value="English">English</SelectItem>
                <SelectItem value="Hausa/English">Hausa/English</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="video_url">Video</Label>
            <div className="flex items-center gap-2">
              <Input 
                id="video_url" 
                name="video_url" 
                value={formData.video_url} 
                onChange={onInputChange}
                placeholder="https://example.com/video.mp4"
                className="bg-input border-border"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRefVideo.current?.click()}
                disabled={uploadingVideo}
                className="whitespace-nowrap"
              >
                {uploadingVideo ? 'Uploading...' : <><Upload size={16} className="mr-2" /> Upload</>}
              </Button>
              <input
                type="file"
                ref={fileInputRefVideo}
                onChange={handleUploadVideo}
                accept="video/*"
                className="hidden"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="thumbnail_url">Thumbnail</Label>
            <div className="flex items-center gap-2">
              <Input 
                id="thumbnail_url" 
                name="thumbnail_url" 
                value={formData.thumbnail_url} 
                onChange={onInputChange}
                placeholder="https://example.com/thumbnail.jpg"
                className="bg-input border-border"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRefThumbnail.current?.click()}
                disabled={uploadingThumbnail}
                className="whitespace-nowrap"
              >
                {uploadingThumbnail ? 'Uploading...' : <><Upload size={16} className="mr-2" /> Upload</>}
              </Button>
              <input
                type="file"
                ref={fileInputRefThumbnail}
                onChange={handleUploadThumbnail}
                accept="image/*"
                className="hidden"
              />
            </div>
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="backdrop_url">Backdrop Image (HD Background)</Label>
            <div className="flex items-center gap-2">
              <Input 
                id="backdrop_url" 
                name="backdrop_url" 
                value={formData.backdrop_url} 
                onChange={onInputChange}
                placeholder="https://example.com/backdrop.jpg"
                className="bg-input border-border"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRefBackdrop.current?.click()}
                disabled={uploadingBackdrop}
                className="whitespace-nowrap"
              >
                {uploadingBackdrop ? 'Uploading...' : <><Upload size={16} className="mr-2" /> Upload HD</>}
              </Button>
              <input
                type="file"
                ref={fileInputRefBackdrop}
                onChange={handleUploadBackdrop}
                accept="image/*"
                className="hidden"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Upload a high-quality backdrop image (recommended: 1920x1080 or higher) for the video player background
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="duration">Duration (seconds)</Label>
            <Input 
              id="duration" 
              name="duration" 
              type="number"
              value={formData.duration} 
              onChange={onInputChange}
              placeholder="Duration in seconds"
              className="bg-input border-border"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="release_year">Release Year</Label>
            <Input 
              id="release_year" 
              name="release_year" 
              type="number"
              value={formData.release_year} 
              onChange={onInputChange}
              placeholder="Release year"
              className="bg-input border-border"
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="description">Description</Label>
            <Input 
              id="description" 
              name="description" 
              value={formData.description} 
              onChange={onInputChange}
              placeholder="Content description"
              className="bg-input border-border"
            />
          </div>
          <div className="space-y-2 flex items-center">
            <input 
              id="is_featured" 
              name="is_featured" 
              type="checkbox" 
              checked={formData.is_featured}
              onChange={onInputChange}
              className="mr-2"
            />
            <Label htmlFor="is_featured">Featured Content</Label>
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
          <Button type="submit" className="bg-primary">
            {editingContent ? 'Update Content' : 'Add Content'}
          </Button>
        </div>
      </form>
    </div>
  );
}
