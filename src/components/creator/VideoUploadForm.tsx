import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Upload, X, FileVideo } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';

interface VideoUploadFormProps {
  creatorId: string;
  onClose: () => void;
  onSuccess: () => void;
}

const categories = [
  'Entertainment',
  'Education', 
  'Comedy',
  'Music',
  'News',
  'Sports',
  'Culture',
  'Religion',
  'Technology',
  'Lifestyle'
];

const languages = [
  { value: 'hausa', label: 'Hausa' },
  { value: 'english', label: 'English' },
  { value: 'yoruba', label: 'Yoruba' },
  { value: 'igbo', label: 'Igbo' },
  { value: 'fulani', label: 'Fulani' }
];

export function VideoUploadForm({ creatorId, onClose, onSuccess }: VideoUploadFormProps) {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    language: 'hausa',
    tags: '',
    monetization_enabled: true
  });
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);

  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('video/')) {
        toast({
          title: "Invalid File",
          description: "Please select a valid video file",
          variant: "destructive"
        });
        return;
      }

      // Validate file size (500MB limit)
      if (file.size > 500 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "Video file must be smaller than 500MB",
          variant: "destructive"
        });
        return;
      }

      setVideoFile(file);
      
      // Auto-generate title from filename if empty
      if (!formData.title) {
        const filename = file.name.replace(/\.[^/.]+$/, "");
        setFormData(prev => ({ ...prev, title: filename }));
      }
    }
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid File",
          description: "Please select a valid image file",
          variant: "destructive"
        });
        return;
      }
      setThumbnailFile(file);
    }
  };

  const uploadFile = async (file: File, bucket: string, path: string) => {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) throw error;
    return data;
  };

  const getVideoDuration = (file: File): Promise<number> => {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      
      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src);
        resolve(Math.round(video.duration));
      };
      
      video.src = URL.createObjectURL(file);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!videoFile) {
      toast({
        title: "Missing Video",
        description: "Please select a video file to upload",
        variant: "destructive"
      });
      return;
    }

    if (!formData.category) {
      toast({
        title: "Missing Category", 
        description: "Please select a category",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      // Get video duration
      const durationSeconds = await getVideoDuration(videoFile);
      setUploadProgress(10);

      // Upload video file
      const videoFileName = `${Date.now()}_${videoFile.name}`;
      const videoPath = `videos/${creatorId}/${videoFileName}`;
      
      await uploadFile(videoFile, 'content', videoPath);
      setUploadProgress(50);

      // Upload thumbnail if provided
      let thumbnailPath = null;
      if (thumbnailFile) {
        const thumbnailFileName = `${Date.now()}_${thumbnailFile.name}`;
        thumbnailPath = `thumbnails/${creatorId}/${thumbnailFileName}`;
        await uploadFile(thumbnailFile, 'content', thumbnailPath);
      }
      setUploadProgress(70);

      // Get public URLs
      const { data: videoUrl } = supabase.storage
        .from('content')
        .getPublicUrl(videoPath);

      const thumbnailUrl = thumbnailPath 
        ? supabase.storage.from('content').getPublicUrl(thumbnailPath).data?.publicUrl
        : null;

      setUploadProgress(80);

      // Parse tags
      const tagsArray = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      // Save video record to database
      const { error: dbError } = await supabase
        .from('videos')
        .insert({
          creator_id: creatorId,
          title: formData.title,
          description: formData.description,
          video_url: videoUrl.publicUrl,
          thumbnail_url: thumbnailUrl,
          duration_seconds: durationSeconds,
          category: formData.category,
          language: formData.language,
          tags: tagsArray,
          monetization_enabled: formData.monetization_enabled,
          status: 'published'
        });

      if (dbError) throw dbError;

      setUploadProgress(100);

      toast({
        title: "Upload Successful",
        description: "Your video has been uploaded and is now live!"
      });

      onSuccess();

    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload Failed",
        description: "Failed to upload video. Please try again.",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-streaming-card border-streaming-border">
        <DialogHeader>
          <DialogTitle className="text-streaming-text">Upload Video</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Video File Upload */}
          <div className="space-y-2">
            <Label className="text-streaming-text">Video File *</Label>
            <div className="border-2 border-dashed border-streaming-border rounded-lg p-6 text-center">
              {!videoFile ? (
                <div>
                  <Upload className="w-8 h-8 mx-auto mb-2 text-streaming-muted" />
                  <p className="text-streaming-muted mb-2">
                    Drag and drop your video here, or click to select
                  </p>
                  <p className="text-xs text-streaming-muted">
                    Supported formats: MP4, MOV, AVI. Max size: 500MB
                  </p>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleVideoFileChange}
                    className="hidden"
                    id="video-upload"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="mt-2"
                    onClick={() => document.getElementById('video-upload')?.click()}
                  >
                    Select Video File
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <FileVideo className="w-8 h-8 text-streaming-accent" />
                  <div className="flex-1 text-left">
                    <p className="text-streaming-text font-medium">{videoFile.name}</p>
                    <p className="text-sm text-streaming-muted">
                      {formatFileSize(videoFile.size)}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setVideoFile(null)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Thumbnail Upload */}
          <div className="space-y-2">
            <Label className="text-streaming-text">Custom Thumbnail (Optional)</Label>
            <div className="flex items-center gap-3">
              <input
                type="file"
                accept="image/*"
                onChange={handleThumbnailChange}
                className="hidden"
                id="thumbnail-upload"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById('thumbnail-upload')?.click()}
              >
                {thumbnailFile ? 'Change Thumbnail' : 'Upload Thumbnail'}
              </Button>
              {thumbnailFile && (
                <span className="text-sm text-streaming-muted">
                  {thumbnailFile.name}
                </span>
              )}
            </div>
          </div>

          {/* Upload Progress */}
          {uploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-streaming-muted">Uploading...</span>
                <span className="text-streaming-muted">{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
            </div>
          )}

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-streaming-text">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter video title"
              className="bg-streaming-darker border-streaming-border text-streaming-text"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-streaming-text">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe your video..."
              rows={4}
              className="bg-streaming-darker border-streaming-border text-streaming-text"
            />
          </div>

          {/* Category and Language */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-streaming-text">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger className="bg-streaming-darker border-streaming-border text-streaming-text">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="bg-streaming-card border-streaming-border">
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-streaming-text">Language</Label>
              <Select
                value={formData.language}
                onValueChange={(value) => setFormData(prev => ({ ...prev, language: value }))}
              >
                <SelectTrigger className="bg-streaming-darker border-streaming-border text-streaming-text">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-streaming-card border-streaming-border">
                  {languages.map((lang) => (
                    <SelectItem key={lang.value} value={lang.value}>
                      {lang.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label htmlFor="tags" className="text-streaming-text">Tags</Label>
            <Input
              id="tags"
              value={formData.tags}
              onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
              placeholder="comedy, hausa, entertainment (separate with commas)"
              className="bg-streaming-darker border-streaming-border text-streaming-text"
            />
          </div>

          {/* Monetization */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="monetization"
              checked={formData.monetization_enabled}
              onChange={(e) => setFormData(prev => ({ ...prev, monetization_enabled: e.target.checked }))}
              className="rounded"
            />
            <Label htmlFor="monetization" className="text-streaming-text">
              Enable monetization (earn money from ads)
            </Label>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={uploading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={uploading || !videoFile}
              className="flex-1 bg-streaming-accent hover:bg-streaming-accent/90"
            >
              {uploading ? 'Uploading...' : 'Upload Video'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}