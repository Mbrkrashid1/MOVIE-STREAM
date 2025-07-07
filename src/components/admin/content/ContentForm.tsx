
import { useState, useRef, ChangeEvent } from "react";
import { Upload, Loader2, X, CheckCircle } from "lucide-react";
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
import { Progress } from "@/components/ui/progress";
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
  const [uploadProgress, setUploadProgress] = useState({ thumbnail: 0, backdrop: 0, video: 0 });
  const fileInputRefThumbnail = useRef<HTMLInputElement>(null);
  const fileInputRefBackdrop = useRef<HTMLInputElement>(null);
  const fileInputRefVideo = useRef<HTMLInputElement>(null);

  const validateFile = (file: File, type: 'image' | 'video') => {
    const maxSizes = {
      image: 10 * 1024 * 1024, // 10MB for images
      video: 1000 * 1024 * 1024  // 1GB for videos
    };

    const allowedTypes = {
      image: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'],
      video: ['video/mp4', 'video/avi', 'video/mov', 'video/wmv', 'video/mkv', 'video/webm']
    };

    if (!allowedTypes[type].includes(file.type)) {
      throw new Error(`Invalid file type. Allowed types: ${allowedTypes[type].join(', ')}`);
    }

    if (file.size > maxSizes[type]) {
      const maxSizeMB = Math.floor(maxSizes[type] / (1024 * 1024));
      throw new Error(`File too large. Maximum size: ${maxSizeMB}MB`);
    }
  };

  const uploadFileWithProgress = async (file: File, folder: string, type: 'image' | 'video', progressKey: 'thumbnail' | 'backdrop' | 'video') => {
    validateFile(file, type);
    
    const fileExt = file.name.split('.').pop()?.toLowerCase();
    const fileName = `${folder}-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;
    
    // Create a promise that tracks upload progress
    const uploadPromise = new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const percentComplete = (e.loaded / e.total) * 100;
          setUploadProgress(prev => ({ ...prev, [progressKey]: percentComplete }));
        }
      });
      
      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          resolve(xhr.response);
        } else {
          reject(new Error(`Upload failed with status: ${xhr.status}`));
        }
      });
      
      xhr.addEventListener('error', () => {
        reject(new Error('Upload failed'));
      });
      
      // Use Supabase storage upload
      supabase.storage
        .from('content')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })
        .then(({ error }) => {
          if (error) {
            reject(error);
          } else {
            resolve(filePath);
          }
        })
        .catch(reject);
    });

    await uploadPromise;
    
    const { data: publicUrlData } = supabase.storage
      .from('content')
      .getPublicUrl(filePath);
    
    return publicUrlData.publicUrl;
  };

  const handleUploadThumbnail = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploadingThumbnail(true);
    setUploadProgress(prev => ({ ...prev, thumbnail: 0 }));
    
    try {
      const url = await uploadFileWithProgress(file, 'thumbnails', 'image', 'thumbnail');
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
      setUploadProgress(prev => ({ ...prev, thumbnail: 0 }));
      if (fileInputRefThumbnail.current) fileInputRefThumbnail.current.value = "";
    }
  };

  const handleUploadBackdrop = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploadingBackdrop(true);
    setUploadProgress(prev => ({ ...prev, backdrop: 0 }));
    
    try {
      const url = await uploadFileWithProgress(file, 'backdrops', 'image', 'backdrop');
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
      setUploadProgress(prev => ({ ...prev, backdrop: 0 }));
      if (fileInputRefBackdrop.current) fileInputRefBackdrop.current.value = "";
    }
  };
  
  const handleUploadVideo = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploadingVideo(true);
    setUploadProgress(prev => ({ ...prev, video: 0 }));
    
    try {
      const url = await uploadFileWithProgress(file, 'videos', 'video', 'video');
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
      setUploadProgress(prev => ({ ...prev, video: 0 }));
      if (fileInputRefVideo.current) fileInputRefVideo.current.value = "";
    }
  };

  const clearField = (field: string) => {
    setFormData(prev => ({ ...prev, [field]: '' }));
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-xl border border-gray-700 mb-8 shadow-2xl">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-2xl font-bold text-white flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <Upload className="w-5 h-5 text-white" />
          </div>
          {editingContent ? 'Edit Content' : 'Add New Content'}
        </h3>
        <div className="flex items-center gap-2 text-green-400">
          <CheckCircle className="w-4 h-4" />
          <span className="text-sm">Professional Upload System</span>
        </div>
      </div>
      
      <form onSubmit={onSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
          <h4 className="text-lg font-semibold text-white mb-4">Basic Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-white font-medium">Title *</Label>
              <Input 
                id="title" 
                name="title" 
                value={formData.title} 
                onChange={onInputChange}
                placeholder="Content Title"
                required
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-primary"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="type" className="text-white font-medium">Type *</Label>
              <Select 
                value={formData.type} 
                onValueChange={(value) => onSelectChange('type', value)}
              >
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  <SelectItem value="movie">Movie</SelectItem>
                  <SelectItem value="series">Series</SelectItem>
                  <SelectItem value="short">Short Video</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category" className="text-white font-medium">Category *</Label>
              <Select 
                value={formData.category} 
                onValueChange={(value) => onSelectChange('category', value)}
              >
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  <SelectItem value="Hausa Movies">Hausa Movies</SelectItem>
                  <SelectItem value="Hausa Series">Hausa Series</SelectItem>
                  <SelectItem value="Short Videos">Short Videos</SelectItem>
                  <SelectItem value="Comedy">Comedy</SelectItem>
                  <SelectItem value="Drama">Drama</SelectItem>
                  <SelectItem value="Action">Action</SelectItem>
                  <SelectItem value="Kannywood">Kannywood</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="language" className="text-white font-medium">Language</Label>
              <Select 
                value={formData.language} 
                onValueChange={(value) => onSelectChange('language', value)}
              >
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  <SelectItem value="Hausa">Hausa</SelectItem>
                  <SelectItem value="English">English</SelectItem>
                  <SelectItem value="Hausa/English">Hausa/English</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration" className="text-white font-medium">Duration (seconds)</Label>
              <Input 
                id="duration" 
                name="duration" 
                type="number"
                value={formData.duration} 
                onChange={onInputChange}
                placeholder="Duration in seconds"
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-primary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="release_year" className="text-white font-medium">Release Year</Label>
              <Input 
                id="release_year" 
                name="release_year" 
                type="number"
                value={formData.release_year} 
                onChange={onInputChange}
                placeholder="Release year"
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-primary"
              />
            </div>
          </div>
        </div>

        {/* Media Uploads */}
        <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700 space-y-8">
          <h4 className="text-lg font-semibold text-white mb-4">Media Files</h4>
          
          {/* Video Upload */}
          <div className="space-y-4">
            <Label className="text-white text-lg font-medium">Video Content *</Label>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Input 
                  name="video_url" 
                  value={formData.video_url} 
                  onChange={onInputChange}
                  placeholder="Video URL or upload file below"
                  className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-primary flex-1"
                />
                {formData.video_url && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => clearField('video_url')}
                    className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                  >
                    <X size={16} />
                  </Button>
                )}
              </div>
              
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRefVideo.current?.click()}
                  disabled={uploadingVideo}
                  className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600 min-w-[140px]"
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
              
              {uploadingVideo && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>Uploading video...</span>
                    <span>{Math.round(uploadProgress.video)}%</span>
                  </div>
                  <Progress value={uploadProgress.video} className="bg-gray-700" />
                </div>
              )}
            </div>
          </div>

          {/* Thumbnail Upload */}
          <div className="space-y-4">
            <Label className="text-white text-lg font-medium">Thumbnail Image</Label>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Input 
                  name="thumbnail_url" 
                  value={formData.thumbnail_url} 
                  onChange={onInputChange}
                  placeholder="Thumbnail URL or upload file below"
                  className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-primary flex-1"
                />
                {formData.thumbnail_url && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => clearField('thumbnail_url')}
                    className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                  >
                    <X size={16} />
                  </Button>
                )}
              </div>
              
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRefThumbnail.current?.click()}
                  disabled={uploadingThumbnail}
                  className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600 min-w-[140px]"
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
              
              {uploadingThumbnail && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>Uploading thumbnail...</span>
                    <span>{Math.round(uploadProgress.thumbnail)}%</span>
                  </div>
                  <Progress value={uploadProgress.thumbnail} className="bg-gray-700" />
                </div>
              )}
              
              {formData.thumbnail_url && (
                <img 
                  src={formData.thumbnail_url} 
                  alt="Thumbnail preview" 
                  className="w-32 h-48 object-cover rounded-lg border border-gray-600 shadow-lg"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              )}
            </div>
          </div>

          {/* Backdrop Upload */}
          <div className="space-y-4">
            <Label className="text-white text-lg font-medium">Backdrop Image (HD Background)</Label>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Input 
                  name="backdrop_url" 
                  value={formData.backdrop_url} 
                  onChange={onInputChange}
                  placeholder="Backdrop URL or upload file below"
                  className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-primary flex-1"
                />
                {formData.backdrop_url && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => clearField('backdrop_url')}
                    className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                  >
                    <X size={16} />
                  </Button>
                )}
              </div>
              
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRefBackdrop.current?.click()}
                  disabled={uploadingBackdrop}
                  className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600 min-w-[140px]"
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
              
              {uploadingBackdrop && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>Uploading backdrop...</span>
                    <span>{Math.round(uploadProgress.backdrop)}%</span>
                  </div>
                  <Progress value={uploadProgress.backdrop} className="bg-gray-700" />
                </div>
              )}
              
              <p className="text-xs text-gray-400">
                Upload a high-quality backdrop image (recommended: 1920x1080 or higher)
              </p>
              
              {formData.backdrop_url && (
                <img 
                  src={formData.backdrop_url} 
                  alt="Backdrop preview" 
                  className="w-full max-w-md h-32 object-cover rounded-lg border border-gray-600 shadow-lg"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              )}
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
          <h4 className="text-lg font-semibold text-white mb-4">Description & Settings</h4>
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="description" className="text-white font-medium">Description</Label>
              <Textarea 
                id="description" 
                name="description" 
                value={formData.description} 
                onChange={onInputChange}
                placeholder="Content description"
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-primary resize-none"
                rows={4}
              />
            </div>

            {/* Featured Content Toggle */}
            <div className="flex items-center space-x-3 p-4 bg-gray-700/50 rounded-lg">
              <input 
                id="is_featured" 
                name="is_featured" 
                type="checkbox" 
                checked={formData.is_featured}
                onChange={onInputChange}
                className="rounded border-gray-600 text-primary focus:ring-primary"
              />
              <Label htmlFor="is_featured" className="text-white font-medium">
                Featured Content (show on homepage)
              </Label>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 pt-6 border-t border-gray-700">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            className="bg-primary hover:bg-primary/90 min-w-[140px] shadow-lg"
            disabled={uploadingThumbnail || uploadingBackdrop || uploadingVideo}
          >
            {editingContent ? 'Update Content' : 'Add Content'}
          </Button>
        </div>
      </form>
    </div>
  );
}
