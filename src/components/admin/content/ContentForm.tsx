
import { useState, useRef, ChangeEvent } from "react";
import { Upload, Loader2, X } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
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
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
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

  const validateFile = (file: File, type: 'image' | 'video') => {
    const maxSizes = {
      image: 10 * 1024 * 1024, // 10MB for images
      video: 500 * 1024 * 1024  // 500MB for videos
    };

    const allowedTypes = {
      image: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
      video: ['video/mp4', 'video/avi', 'video/mov', 'video/wmv', 'video/mkv']
    };

    if (!allowedTypes[type].includes(file.type)) {
      throw new Error(`Invalid file type. Please select a valid ${type} file.`);
    }

    if (file.size > maxSizes[type]) {
      const maxSizeMB = Math.floor(maxSizes[type] / (1024 * 1024));
      throw new Error(`File too large. Please select a ${type} smaller than ${maxSizeMB}MB.`);
    }
  };

  const uploadFile = async (file: File, folder: string, type: 'image' | 'video') => {
    validateFile(file, type);
    
    const fileExt = file.name.split('.').pop()?.toLowerCase();
    const fileName = `${folder}-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;
    
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
    
    return publicUrlData.publicUrl;
  };

  const handleUploadThumbnail = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploadingThumbnail(true);
    try {
      const url = await uploadFile(file, 'thumbnails', 'image');
      setFormData(prev => ({ ...prev, thumbnail_url: url }));
      toast({
        title: "Success!",
        description: "Thumbnail uploaded successfully."
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
      const url = await uploadFile(file, 'backdrops', 'image');
      setFormData(prev => ({ ...prev, backdrop_url: url }));
      toast({
        title: "Success!",
        description: "Backdrop image uploaded successfully."
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
      const url = await uploadFile(file, 'videos', 'video');
      setFormData(prev => ({ ...prev, video_url: url }));
      toast({
        title: "Success!",
        description: "Video uploaded successfully."
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

  const clearField = (field: string) => {
    setFormData(prev => ({ ...prev, [field]: '' }));
  };

  return (
    <div className="bg-card p-6 rounded-lg border border-border mb-6">
      <h3 className="text-xl font-semibold text-white mb-6">
        {editingContent ? 'Edit Content' : 'Add New Content'}
      </h3>
      
      <form onSubmit={onSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-white">Title *</Label>
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
            <Label htmlFor="type" className="text-white">Type *</Label>
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
            <Label htmlFor="category" className="text-white">Category *</Label>
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
            <Label htmlFor="language" className="text-white">Language</Label>
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
            <Label htmlFor="duration" className="text-white">Duration (seconds)</Label>
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
            <Label htmlFor="release_year" className="text-white">Release Year</Label>
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
        </div>

        {/* Media Uploads */}
        <div className="space-y-6">
          {/* Video Upload */}
          <div className="space-y-3">
            <Label className="text-white text-lg">Video Content *</Label>
            <div className="flex items-center gap-2">
              <Input 
                name="video_url" 
                value={formData.video_url} 
                onChange={onInputChange}
                placeholder="Video URL or upload file below"
                className="bg-input border-border flex-1"
              />
              {formData.video_url && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => clearField('video_url')}
                  className="text-red-400 hover:text-red-300"
                >
                  <X size={16} />
                </Button>
              )}
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRefVideo.current?.click()}
                disabled={uploadingVideo}
                className="min-w-[120px]"
              >
                {uploadingVideo ? (
                  <>
                    <Loader2 size={16} className="mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload size={16} className="mr-2" />
                    Upload Video
                  </>
                )}
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

          {/* Thumbnail Upload */}
          <div className="space-y-3">
            <Label className="text-white text-lg">Thumbnail Image</Label>
            <div className="flex items-center gap-2">
              <Input 
                name="thumbnail_url" 
                value={formData.thumbnail_url} 
                onChange={onInputChange}
                placeholder="Thumbnail URL or upload file below"
                className="bg-input border-border flex-1"
              />
              {formData.thumbnail_url && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => clearField('thumbnail_url')}
                  className="text-red-400 hover:text-red-300"
                >
                  <X size={16} />
                </Button>
              )}
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRefThumbnail.current?.click()}
                disabled={uploadingThumbnail}
                className="min-w-[120px]"
              >
                {uploadingThumbnail ? (
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
                ref={fileInputRefThumbnail}
                onChange={handleUploadThumbnail}
                accept="image/*"
                className="hidden"
              />
            </div>
            {formData.thumbnail_url && (
              <img 
                src={formData.thumbnail_url} 
                alt="Thumbnail preview" 
                className="w-32 h-48 object-cover rounded border border-border"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            )}
          </div>

          {/* Backdrop Upload */}
          <div className="space-y-3">
            <Label className="text-white text-lg">Backdrop Image (HD Background)</Label>
            <div className="flex items-center gap-2">
              <Input 
                name="backdrop_url" 
                value={formData.backdrop_url} 
                onChange={onInputChange}
                placeholder="Backdrop URL or upload file below"
                className="bg-input border-border flex-1"
              />
              {formData.backdrop_url && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => clearField('backdrop_url')}
                  className="text-red-400 hover:text-red-300"
                >
                  <X size={16} />
                </Button>
              )}
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRefBackdrop.current?.click()}
                disabled={uploadingBackdrop}
                className="min-w-[120px]"
              >
                {uploadingBackdrop ? (
                  <>
                    <Loader2 size={16} className="mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload size={16} className="mr-2" />
                    Upload HD
                  </>
                )}
              </Button>
              <input
                type="file"
                ref={fileInputRefBackdrop}
                onChange={handleUploadBackdrop}
                accept="image/*"
                className="hidden"
              />
            </div>
            <p className="text-xs text-gray-400">
              Upload a high-quality backdrop image (recommended: 1920x1080 or higher)
            </p>
            {formData.backdrop_url && (
              <img 
                src={formData.backdrop_url} 
                alt="Backdrop preview" 
                className="w-full max-w-md h-32 object-cover rounded border border-border"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            )}
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description" className="text-white">Description</Label>
          <Textarea 
            id="description" 
            name="description" 
            value={formData.description} 
            onChange={onInputChange}
            placeholder="Content description"
            className="bg-input border-border resize-none"
            rows={4}
          />
        </div>

        {/* Featured Content Toggle */}
        <div className="flex items-center space-x-2">
          <input 
            id="is_featured" 
            name="is_featured" 
            type="checkbox" 
            checked={formData.is_featured}
            onChange={onInputChange}
            className="rounded border-border"
          />
          <Label htmlFor="is_featured" className="text-white">Featured Content (show on homepage)</Label>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-6 border-t border-border">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            className="bg-primary hover:bg-primary/90 min-w-[120px]"
            disabled={uploadingThumbnail || uploadingBackdrop || uploadingVideo}
          >
            {editingContent ? 'Update Content' : 'Add Content'}
          </Button>
        </div>
      </form>
    </div>
  );
}
