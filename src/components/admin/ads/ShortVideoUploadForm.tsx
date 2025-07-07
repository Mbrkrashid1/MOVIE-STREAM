
import { useState, useRef, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Upload, Video, Plus, CheckCircle, Loader2, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const ShortVideoUploadForm = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({ thumbnail: 0, video: 0 });
  const fileInputRefThumbnail = useRef<HTMLInputElement>(null);
  const fileInputRefVideo = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Short Videos',
    thumbnail_url: '',
    video_url: '',
    language: 'Hausa',
    duration: '',
    is_featured: false
  });

  // Create short video mutation
  const createShortMutation = useMutation({
    mutationFn: async (newShort: any) => {
      const { data, error } = await supabase
        .from('content')
        .insert({
          ...newShort,
          type: 'short',
          duration: parseInt(newShort.duration) || null
        })
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content'] });
      resetForm();
      toast({
        title: "Short video uploaded! 🎬",
        description: "The short video has been uploaded successfully and is now live."
      });
    },
    onError: (error) => {
      console.error("Error uploading short video:", error);
      toast({
        title: "Upload failed",
        description: "Failed to upload short video. Please try again.",
        variant: "destructive"
      });
    }
  });

  const validateFile = (file: File, type: 'image' | 'video') => {
    const maxSizes = {
      image: 10 * 1024 * 1024, // 10MB for images
      video: 100 * 1024 * 1024  // 100MB for short videos
    };

    const allowedTypes = {
      image: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
      video: ['video/mp4', 'video/webm', 'video/mov']
    };

    if (!allowedTypes[type].includes(file.type)) {
      throw new Error(`Invalid file type. Allowed: ${allowedTypes[type].join(', ')}`);
    }

    if (file.size > maxSizes[type]) {
      const maxSizeMB = Math.floor(maxSizes[type] / (1024 * 1024));
      throw new Error(`File too large. Maximum size: ${maxSizeMB}MB`);
    }

    // Additional validation for short videos
    if (type === 'video') {
      // Create video element to check duration
      const video = document.createElement('video');
      video.preload = 'metadata';
      return new Promise((resolve, reject) => {
        video.onloadedmetadata = () => {
          if (video.duration > 60) {
            reject(new Error('Short videos must be 60 seconds or less'));
          } else {
            resolve(true);
          }
        };
        video.onerror = () => reject(new Error('Invalid video file'));
        video.src = URL.createObjectURL(file);
      });
    }
  };

  const uploadFileWithProgress = async (file: File, folder: string, type: 'image' | 'video', progressKey: 'thumbnail' | 'video') => {
    if (type === 'video') {
      await validateFile(file, type);
    } else {
      validateFile(file, type);
    }
    
    const fileExt = file.name.split('.').pop()?.toLowerCase();
    const fileName = `${folder}-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;
    
    // Simulate progress for better UX
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => ({
        ...prev,
        [progressKey]: Math.min(prev[progressKey] + Math.random() * 15, 90)
      }));
    }, 200);
    
    try {
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
      
      setUploadProgress(prev => ({ ...prev, [progressKey]: 100 }));
      
      return publicUrlData.publicUrl;
    } finally {
      clearInterval(progressInterval);
    }
  };

  const handleFileUpload = async (
    e: ChangeEvent<HTMLInputElement>, 
    fileType: 'thumbnail' | 'video'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const setUploading = fileType === 'thumbnail' ? setUploadingThumbnail : setUploadingVideo;
    
    setUploading(true);
    setUploadProgress(prev => ({ ...prev, [fileType]: 0 }));
    
    try {
      const url = await uploadFileWithProgress(
        file, 
        fileType === 'thumbnail' ? 'thumbnails' : 'videos',
        fileType === 'thumbnail' ? 'image' : 'video',
        fileType
      );
      
      setFormData(prev => ({
        ...prev,
        [`${fileType}_url`]: url
      }));
      
      toast({
        title: `${fileType === 'thumbnail' ? 'Thumbnail' : 'Video'} uploaded! ✅`,
        description: `${fileType === 'thumbnail' ? 'Thumbnail' : 'Video'} has been uploaded successfully.`
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
      setUploadProgress(prev => ({ ...prev, [fileType]: 0 }));
      const fileInput = fileType === 'thumbnail' ? fileInputRefThumbnail : fileInputRefVideo;
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

    createShortMutation.mutate(formData);
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
      category: 'Short Videos',
      thumbnail_url: '',
      video_url: '',
      language: 'Hausa',
      duration: '',
      is_featured: false
    });
  };

  const clearField = (field: string) => {
    setFormData(prev => ({ ...prev, [field]: '' }));
  };

  return (
    <div className="bg-gradient-to-br from-purple-900 to-pink-900 p-8 rounded-xl border border-purple-700 mb-8 shadow-2xl">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-2xl font-bold text-white flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <Video className="w-5 h-5 text-white" />
          </div>
          TikTok-Style Shorts Upload
        </h3>
        <div className="flex items-center gap-2 text-purple-300">
          <CheckCircle className="w-4 h-4" />
          <span className="text-sm">Vertical Video Optimized</span>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-black/20 backdrop-blur-sm p-6 rounded-lg border border-purple-700/50">
          <h4 className="text-lg font-semibold text-white mb-4">Short Video Details</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-white font-medium">Short Title *</Label>
              <Input 
                id="title" 
                name="title" 
                value={formData.title} 
                onChange={handleInputChange}
                placeholder="Enter catchy short title"
                required
                className="bg-purple-900/50 border-purple-600 text-white placeholder-purple-300 focus:border-pink-400"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="language" className="text-white font-medium">Language</Label>
              <Select 
                value={formData.language} 
                onValueChange={(value) => handleSelectChange('language', value)}
              >
                <SelectTrigger className="bg-purple-900/50 border-purple-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-purple-900 border-purple-600">
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
                onChange={handleInputChange}
                placeholder="Max 60 seconds"
                max="60"
                className="bg-purple-900/50 border-purple-600 text-white placeholder-purple-300 focus:border-pink-400"
              />
              <p className="text-xs text-purple-300">Keep it short and engaging!</p>
            </div>
          </div>
        </div>

        {/* File Upload Section */}
        <div className="bg-black/20 backdrop-blur-sm p-6 rounded-lg border border-purple-700/50 space-y-8">
          <h4 className="text-lg font-semibold text-white mb-4">Media Upload</h4>
          
          {/* Video Upload */}
          <div className="space-y-4">
            <Label className="text-white text-lg font-medium">Short Video File * (Vertical 9:16 Ratio)</Label>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Input 
                  value={formData.video_url} 
                  onChange={handleInputChange}
                  name="video_url"
                  placeholder="Video URL or upload file below"
                  className="bg-purple-900/50 border-purple-600 text-white placeholder-purple-300 focus:border-pink-400 flex-1"
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
                  className="bg-purple-700 border-purple-600 text-white hover:bg-purple-600 min-w-[160px]"
                >
                  {uploadingVideo ? (
                    <>
                      <Loader2 size={16} className="mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload size={16} className="mr-2" />
                      Upload Short Video
                    </>
                  )}
                </Button>
                <input
                  type="file"
                  ref={fileInputRefVideo}
                  onChange={(e) => handleFileUpload(e, 'video')}
                  accept="video/mp4,video/webm,video/mov"
                  className="hidden"
                />
              </div>
              
              {uploadingVideo && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-purple-300">
                    <span>Uploading short video...</span>
                    <span>{Math.round(uploadProgress.video)}%</span>
                  </div>
                  <Progress 
                    value={uploadProgress.video} 
                    className="bg-purple-900/50"
                  />
                </div>
              )}
              
              <div className="bg-purple-800/30 p-4 rounded-lg">
                <h5 className="text-white font-medium mb-2">Tips for Best Results:</h5>
                <ul className="text-sm text-purple-200 space-y-1">
                  <li>• Use vertical orientation (9:16 aspect ratio)</li>
                  <li>• Keep videos under 60 seconds</li>
                  <li>• Ensure good lighting and clear audio</li>
                  <li>• Add engaging content in the first 3 seconds</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Thumbnail Upload */}
          <div className="space-y-4">
            <Label className="text-white text-lg font-medium">Thumbnail Image (Optional)</Label>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Input 
                  value={formData.thumbnail_url} 
                  onChange={handleInputChange}
                  name="thumbnail_url"
                  placeholder="Thumbnail URL or upload file below"
                  className="bg-purple-900/50 border-purple-600 text-white placeholder-purple-300 focus:border-pink-400 flex-1"
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
                  className="bg-purple-700 border-purple-600 text-white hover:bg-purple-600 min-w-[140px]"
                >
                  {uploadingThumbnail ? (
                    <>
                      <Loader2 size={16} className="mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload size={16} className="mr-2" />
                      Upload Thumbnail
                    </>
                  )}
                </Button>
                <input
                  type="file"
                  ref={fileInputRefThumbnail}
                  onChange={(e) => handleFileUpload(e, 'thumbnail')}
                  accept="image/*"
                  className="hidden"
                />
              </div>
              
              {uploadingThumbnail && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-purple-300">
                    <span>Uploading thumbnail...</span>
                    <span>{Math.round(uploadProgress.thumbnail)}%</span>
                  </div>
                  <Progress 
                    value={uploadProgress.thumbnail} 
                    className="bg-purple-900/50"
                  />
                </div>
              )}
              
              {formData.thumbnail_url && (
                <img 
                  src={formData.thumbnail_url} 
                  alt="Thumbnail preview" 
                  className="w-24 h-32 object-cover rounded-lg border border-purple-600 shadow-lg"
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
        <div className="bg-black/20 backdrop-blur-sm p-6 rounded-lg border border-purple-700/50">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="description" className="text-white font-medium">Description</Label>
              <Textarea 
                id="description" 
                name="description" 
                value={formData.description} 
                onChange={handleInputChange}
                placeholder="Write an engaging description with hashtags..."
                className="bg-purple-900/50 border-purple-600 text-white placeholder-purple-300 focus:border-pink-400 resize-none"
                rows={3}
              />
            </div>

            <div className="flex items-center space-x-3 p-4 bg-purple-800/30 rounded-lg">
              <input 
                id="is_featured" 
                name="is_featured" 
                type="checkbox" 
                checked={formData.is_featured}
                onChange={handleInputChange}
                className="rounded border-purple-600 text-pink-500 focus:ring-pink-400"
              />
              <Label htmlFor="is_featured" className="text-white font-medium">
                Featured Short (promote on main feed)
              </Label>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 pt-6 border-t border-purple-700/50">
          <Button 
            type="button" 
            variant="outline" 
            onClick={resetForm}
            className="bg-purple-900/50 border-purple-600 text-white hover:bg-purple-800"
          >
            Clear Form
          </Button>
          <Button 
            type="submit" 
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 min-w-[160px] shadow-lg"
            disabled={createShortMutation.isPending}
          >
            {createShortMutation.isPending ? 'Uploading...' : (
              <>
                <Plus size={16} className="mr-2" />
                Upload Short Video
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ShortVideoUploadForm;
