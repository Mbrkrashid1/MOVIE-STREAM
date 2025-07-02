
import { useState, useRef, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Upload, Film, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ContentUploadFormProps {
  contentType: 'movie' | 'series';
}

const ContentUploadForm = ({ contentType }: ContentUploadFormProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [uploadingBackdrop, setUploadingBackdrop] = useState(false);
  const fileInputRefThumbnail = useRef<HTMLInputElement>(null);
  const fileInputRefVideo = useRef<HTMLInputElement>(null);
  const fileInputRefBackdrop = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: contentType === 'movie' ? 'Hausa Movies' : 'Hausa Series',
    thumbnail_url: '',
    video_url: '',
    backdrop_url: '',
    release_year: new Date().getFullYear().toString(),
    language: 'Hausa',
    is_featured: false,
    duration: '',
    is_sample: false
  });

  // Create content mutation
  const createContentMutation = useMutation({
    mutationFn: async (newContent: any) => {
      const { data, error } = await supabase
        .from('content')
        .insert({
          ...newContent,
          type: contentType,
          release_year: parseInt(newContent.release_year) || null,
          duration: parseInt(newContent.duration) || null
        })
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content'] });
      resetForm();
      toast({
        title: `${contentType === 'movie' ? 'Movie' : 'Series'} uploaded`,
        description: `The ${contentType} has been uploaded successfully.`
      });
    },
    onError: (error) => {
      console.error(`Error uploading ${contentType}:`, error);
      toast({
        title: "Upload failed",
        description: `Failed to upload ${contentType}. Please try again.`,
        variant: "destructive"
      });
    }
  });

  const handleFileUpload = async (
    e: ChangeEvent<HTMLInputElement>, 
    fileType: 'thumbnail' | 'video' | 'backdrop'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const setUploading = fileType === 'thumbnail' ? setUploadingThumbnail : 
                       fileType === 'video' ? setUploadingVideo : setUploadingBackdrop;
    
    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${contentType}-${fileType}.${fileExt}`;
      const filePath = `${fileType}s/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('content')
        .upload(filePath, file);
      
      if (uploadError) throw uploadError;
      
      const { data: publicUrlData } = supabase.storage
        .from('content')
        .getPublicUrl(filePath);
      
      setFormData(prev => ({
        ...prev,
        [`${fileType}_url`]: publicUrlData.publicUrl
      }));
      
      toast({
        title: `${fileType.charAt(0).toUpperCase() + fileType.slice(1)} uploaded`,
        description: `${fileType.charAt(0).toUpperCase() + fileType.slice(1)} has been uploaded successfully.`
      });
    } catch (error: any) {
      console.error(`Error uploading ${fileType}:`, error);
      toast({
        title: "Upload failed",
        description: error.message || `Failed to upload ${fileType}.`,
        variant: "destructive"
      });
    } finally {
      setUploading(false);
      // Reset file input
      const fileInput = fileType === 'thumbnail' ? fileInputRefThumbnail : 
                       fileType === 'video' ? fileInputRefVideo : fileInputRefBackdrop;
      if (fileInput.current) fileInput.current.value = "";
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.video_url) {
      toast({
        title: "Missing required fields",
        description: "Please provide at least a title and video file.",
        variant: "destructive"
      });
      return;
    }

    createContentMutation.mutate(formData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
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

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: contentType === 'movie' ? 'Hausa Movies' : 'Hausa Series',
      thumbnail_url: '',
      video_url: '',
      backdrop_url: '',
      release_year: new Date().getFullYear().toString(),
      language: 'Hausa',
      is_featured: false,
      duration: '',
      is_sample: false
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="title" className="text-white">
            {contentType === 'movie' ? 'Movie' : 'Series'} Title *
          </Label>
          <Input 
            id="title" 
            name="title" 
            value={formData.title} 
            onChange={handleInputChange}
            placeholder={`Enter ${contentType} title`}
            required
            className="bg-input border-border"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category" className="text-white">Category</Label>
          <Select 
            value={formData.category} 
            onValueChange={(value) => handleSelectChange('category', value)}
          >
            <SelectTrigger className="bg-input border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {contentType === 'movie' ? (
                <>
                  <SelectItem value="Hausa Movies">Hausa Movies</SelectItem>
                  <SelectItem value="Comedy">Comedy</SelectItem>
                  <SelectItem value="Drama">Drama</SelectItem>
                  <SelectItem value="Action">Action</SelectItem>
                  <SelectItem value="Kannywood">Kannywood</SelectItem>
                </>
              ) : (
                <>
                  <SelectItem value="Hausa Series">Hausa Series</SelectItem>
                  <SelectItem value="Comedy Series">Comedy Series</SelectItem>
                  <SelectItem value="Drama Series">Drama Series</SelectItem>
                  <SelectItem value="Action Series">Action Series</SelectItem>
                  <SelectItem value="Kannywood Series">Kannywood Series</SelectItem>
                </>
              )}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="language" className="text-white">Language</Label>
          <Select 
            value={formData.language} 
            onValueChange={(value) => handleSelectChange('language', value)}
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
          <Label htmlFor="release_year" className="text-white">Release Year</Label>
          <Input 
            id="release_year" 
            name="release_year" 
            type="number"
            value={formData.release_year} 
            onChange={handleInputChange}
            placeholder="Release year"
            className="bg-input border-border"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="duration" className="text-white">Duration (minutes)</Label>
          <Input 
            id="duration" 
            name="duration" 
            type="number"
            value={formData.duration} 
            onChange={handleInputChange}
            placeholder="Duration in minutes"
            className="bg-input border-border"
          />
        </div>
      </div>

      {/* File Upload Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-white">File Uploads</h3>
        
        {/* Video Upload */}
        <div className="space-y-2">
          <Label className="text-white">Video File *</Label>
          <div className="flex items-center gap-2">
            <Input 
              value={formData.video_url} 
              onChange={handleInputChange}
              name="video_url"
              placeholder="Video URL or upload file"
              className="bg-input border-border"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRefVideo.current?.click()}
              disabled={uploadingVideo}
              className="whitespace-nowrap"
            >
              {uploadingVideo ? 'Uploading...' : <><Upload size={16} className="mr-2" /> Upload Video</>}
            </Button>
            <input
              type="file"
              ref={fileInputRefVideo}
              onChange={(e) => handleFileUpload(e, 'video')}
              accept="video/*"
              className="hidden"
            />
          </div>
        </div>

        {/* Thumbnail Upload */}
        <div className="space-y-2">
          <Label className="text-white">Thumbnail/Poster</Label>
          <div className="flex items-center gap-2">
            <Input 
              value={formData.thumbnail_url} 
              onChange={handleInputChange}
              name="thumbnail_url"
              placeholder="Thumbnail URL or upload file"
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
              onChange={(e) => handleFileUpload(e, 'thumbnail')}
              accept="image/*"
              className="hidden"
            />
          </div>
        </div>

        {/* Backdrop Upload */}
        <div className="space-y-2">
          <Label className="text-white">Backdrop Image</Label>
          <div className="flex items-center gap-2">
            <Input 
              value={formData.backdrop_url} 
              onChange={handleInputChange}
              name="backdrop_url"
              placeholder="Backdrop URL or upload file"
              className="bg-input border-border"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRefBackdrop.current?.click()}
              disabled={uploadingBackdrop}
              className="whitespace-nowrap"
            >
              {uploadingBackdrop ? 'Uploading...' : <><Upload size={16} className="mr-2" /> Upload</>}
            </Button>
            <input
              type="file"
              ref={fileInputRefBackdrop}
              onChange={(e) => handleFileUpload(e, 'backdrop')}
              accept="image/*"
              className="hidden"
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className="text-white">Description</Label>
        <Textarea 
          id="description" 
          name="description" 
          value={formData.description} 
          onChange={handleInputChange}
          placeholder={`Enter ${contentType} description`}
          className="bg-input border-border resize-none"
          rows={4}
        />
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <input 
            id="is_featured" 
            name="is_featured" 
            type="checkbox" 
            checked={formData.is_featured}
            onChange={handleInputChange}
            className="rounded"
          />
          <Label htmlFor="is_featured" className="text-white">Featured Content</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <input 
            id="is_sample" 
            name="is_sample" 
            type="checkbox" 
            checked={formData.is_sample}
            onChange={handleInputChange}
            className="rounded"
          />
          <Label htmlFor="is_sample" className="text-white">Sample/Preview</Label>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={resetForm}>
          Clear Form
        </Button>
        <Button 
          type="submit" 
          className="bg-primary hover:bg-primary/90"
          disabled={createContentMutation.isPending}
        >
          {createContentMutation.isPending ? 'Uploading...' : (
            <>
              <Plus size={16} className="mr-2" />
              Upload {contentType === 'movie' ? 'Movie' : 'Series'}
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

export default ContentUploadForm;
