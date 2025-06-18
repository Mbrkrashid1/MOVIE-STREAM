
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Upload, Film, Image, X, Play, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";

const adFormSchema = z.object({
  title: z.string().min(2, {
    message: "Ad title must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  ad_type: z.enum(["video", "banner"], {
    required_error: "Please select an ad type.",
  }),
  thumbnail_url: z.string().optional(),
  video_url: z.string().optional(),
  cta_text: z.string().optional(),
  cta_url: z.string().url().optional().or(z.literal("")),
  duration: z.number().min(1, { message: "Duration must be at least 1 second." }),
  is_skippable: z.boolean().default(true),
  skip_after_seconds: z.number().min(1).max(30).default(5),
});

type AdFormData = z.infer<typeof adFormSchema>;

interface AdFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editingAd: any;
  onSubmit: (values: AdFormData) => void;
  onCancel: () => void;
}

export function AdForm({ isOpen, onOpenChange, editingAd, onSubmit, onCancel }: AdFormProps) {
  const [isVideoUploading, setIsVideoUploading] = useState(false);
  const [isThumbnailUploading, setIsThumbnailUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedVideoUrl, setUploadedVideoUrl] = useState("");
  const [uploadedThumbnailUrl, setUploadedThumbnailUrl] = useState("");
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { toast } = useToast();

  const adForm = useForm<AdFormData>({
    resolver: zodResolver(adFormSchema),
    defaultValues: {
      title: editingAd?.title || "",
      description: editingAd?.description || "",
      ad_type: editingAd?.ad_type || "video",
      thumbnail_url: editingAd?.thumbnail_url || "",
      video_url: editingAd?.video_url || "",
      cta_text: editingAd?.cta_text || "",
      cta_url: editingAd?.cta_url || "",
      duration: editingAd?.duration || 30,
      is_skippable: editingAd?.is_skippable ?? true,
      skip_after_seconds: editingAd?.skip_after_seconds || 5,
    },
  });

  const watchedAdType = adForm.watch("ad_type");

  const simulateProgress = (callback: () => void) => {
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          callback();
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleVideoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('video/')) {
      toast({
        title: "Invalid File Type",
        description: "Please select a valid video file (MP4, WebM, AVI, etc.).",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (50MB limit)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      toast({
        title: "File Too Large",
        description: "Video file must be smaller than 50MB.",
        variant: "destructive",
      });
      return;
    }

    setIsVideoUploading(true);
    
    simulateProgress(() => {
      try {
        const videoUrl = URL.createObjectURL(file);
        setUploadedVideoUrl(videoUrl);
        setVideoPreview(videoUrl);
        adForm.setValue("video_url", videoUrl);
        
        // Get video duration and auto-generate thumbnail
        const video = document.createElement('video');
        video.preload = 'metadata';
        video.onloadedmetadata = () => {
          const duration = Math.round(video.duration);
          adForm.setValue("duration", duration);
          
          // Generate thumbnail at 2 seconds
          video.currentTime = 2;
          video.oncanplay = () => {
            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.drawImage(video, 0, 0);
              canvas.toBlob((blob) => {
                if (blob) {
                  const thumbnailUrl = URL.createObjectURL(blob);
                  setUploadedThumbnailUrl(thumbnailUrl);
                  setImagePreview(thumbnailUrl);
                  adForm.setValue("thumbnail_url", thumbnailUrl);
                }
              }, 'image/jpeg', 0.8);
            }
          };
        };
        video.src = videoUrl;

        toast({
          title: "Video Uploaded Successfully!",
          description: "Thumbnail has been auto-generated from the video.",
        });
      } catch (error) {
        toast({
          title: "Upload Failed",
          description: "Failed to upload video. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsVideoUploading(false);
        setUploadProgress(0);
      }
    });
  };

  const handleThumbnailUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid File Type",
        description: "Please select a valid image file (JPG, PNG, GIF, etc.).",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      toast({
        title: "File Too Large",
        description: "Image file must be smaller than 10MB.",
        variant: "destructive",
      });
      return;
    }

    setIsThumbnailUploading(true);
    
    simulateProgress(() => {
      try {
        const thumbnailUrl = URL.createObjectURL(file);
        setUploadedThumbnailUrl(thumbnailUrl);
        setImagePreview(thumbnailUrl);
        adForm.setValue("thumbnail_url", thumbnailUrl);

        toast({
          title: "Image Uploaded Successfully!",
          description: watchedAdType === "banner" ? "Banner image is ready for display." : "Thumbnail has been set for the video ad.",
        });
      } catch (error) {
        toast({
          title: "Upload Failed",
          description: "Failed to upload image. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsThumbnailUploading(false);
        setUploadProgress(0);
      }
    });
  };

  const removeVideo = () => {
    setUploadedVideoUrl("");
    setVideoPreview(null);
    adForm.setValue("video_url", "");
    adForm.setValue("duration", 30);
  };

  const removeImage = () => {
    setUploadedThumbnailUrl("");
    setImagePreview(null);
    adForm.setValue("thumbnail_url", "");
  };

  const handleSubmit = (values: AdFormData) => {
    // Validate based on ad type
    if (values.ad_type === "video" && !values.video_url) {
      toast({
        title: "Video Required",
        description: "Please upload a video file for video ads.",
        variant: "destructive",
      });
      return;
    }

    if (values.ad_type === "banner" && !values.thumbnail_url) {
      toast({
        title: "Image Required",
        description: "Please upload an image file for banner ads.",
        variant: "destructive",
      });
      return;
    }

    onSubmit(values);
    handleCancel();
  };

  const handleCancel = () => {
    onCancel();
    adForm.reset();
    setUploadedVideoUrl("");
    setUploadedThumbnailUrl("");
    setVideoPreview(null);
    setImagePreview(null);
    setUploadProgress(0);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] bg-card border-border max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white">
            {editingAd ? "Edit Advertisement" : "Create New Advertisement"}
          </DialogTitle>
          <DialogDescription>
            {editingAd ? "Update your advertisement details." : "Create a new ad for your platform. Choose between video ads and banner displays."}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...adForm}>
          <form onSubmit={adForm.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Ad Type Selection */}
            <FormField
              control={adForm.control}
              name="ad_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Advertisement Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select ad type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="video">Video Ad</SelectItem>
                      <SelectItem value="banner">Banner Display</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Video ads can be played during content, banner ads are displayed as static images.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Basic Information */}
            <div className="grid grid-cols-1 gap-4">
              <FormField
                control={adForm.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter ad title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={adForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter ad description"
                        className="resize-none h-20"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Video Upload Section - Only for video ads */}
            {watchedAdType === "video" && (
              <div className="space-y-4 p-4 border border-border rounded-lg bg-card/50">
                <div className="flex items-center gap-2">
                  <Film className="w-5 h-5 text-primary" />
                  <FormLabel className="text-base font-semibold">Video Upload</FormLabel>
                </div>
                
                {!videoPreview ? (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Button
                        type="button"
                        variant="outline"
                        disabled={isVideoUploading}
                        onClick={() => document.getElementById('video-upload')?.click()}
                        className="flex items-center space-x-2"
                      >
                        <Upload size={16} />
                        <span>{isVideoUploading ? "Uploading..." : "Upload Video"}</span>
                      </Button>
                      <span className="text-sm text-gray-400">Max size: 50MB</span>
                    </div>
                    
                    {isVideoUploading && (
                      <div className="space-y-2">
                        <Progress value={uploadProgress} className="w-full" />
                        <p className="text-sm text-gray-400">Uploading... {uploadProgress}%</p>
                      </div>
                    )}
                    
                    <input
                      id="video-upload"
                      type="file"
                      accept="video/*"
                      onChange={handleVideoUpload}
                      className="hidden"
                    />
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="relative">
                      <video
                        src={videoPreview}
                        controls
                        className="w-full h-48 object-cover rounded border bg-black"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        onClick={removeVideo}
                        className="absolute top-2 right-2 h-8 w-8"
                      >
                        <X size={16} />
                      </Button>
                    </div>
                    <p className="text-sm text-green-400">✓ Video uploaded successfully</p>
                  </div>
                )}

                <FormField
                  control={adForm.control}
                  name="video_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Or paste video URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com/video.mp4" {...field} />
                      </FormControl>
                      <FormDescription>You can paste a direct video URL instead of uploading</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {/* Image Upload Section */}
            <div className="space-y-4 p-4 border border-border rounded-lg bg-card/50">
              <div className="flex items-center gap-2">
                <Image className="w-5 h-5 text-primary" />
                <FormLabel className="text-base font-semibold">
                  {watchedAdType === "banner" ? "Banner Image" : "Thumbnail Image"}
                </FormLabel>
              </div>
              
              {!imagePreview ? (
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Button
                      type="button"
                      variant="outline"
                      disabled={isThumbnailUploading}
                      onClick={() => document.getElementById('thumbnail-upload')?.click()}
                      className="flex items-center space-x-2"
                    >
                      <Upload size={16} />
                      <span>{isThumbnailUploading ? "Uploading..." : `Upload ${watchedAdType === "banner" ? "Banner" : "Thumbnail"}`}</span>
                    </Button>
                    <span className="text-sm text-gray-400">Max size: 10MB</span>
                  </div>
                  
                  {isThumbnailUploading && (
                    <div className="space-y-2">
                      <Progress value={uploadProgress} className="w-full" />
                      <p className="text-sm text-gray-400">Uploading... {uploadProgress}%</p>
                    </div>
                  )}
                  
                  <input
                    id="thumbnail-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleThumbnailUpload}
                    className="hidden"
                  />
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded border"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={removeImage}
                      className="absolute top-2 right-2 h-8 w-8"
                    >
                      <X size={16} />
                    </Button>
                  </div>
                  <p className="text-sm text-green-400">✓ Image uploaded successfully</p>
                </div>
              )}

              <FormField
                control={adForm.control}
                name="thumbnail_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Or paste image URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/image.jpg" {...field} />
                    </FormControl>
                    <FormDescription>You can paste a direct image URL instead of uploading</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Call to Action */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={adForm.control}
                name="cta_text"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Call to Action Text</FormLabel>
                    <FormControl>
                      <Input placeholder="Learn More, Shop Now, etc." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={adForm.control}
                name="cta_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Call to Action URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Video-specific settings */}
            {watchedAdType === "video" && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={adForm.control}
                    name="duration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Duration (seconds)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="30"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={adForm.control}
                    name="skip_after_seconds"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Skip after (seconds)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="5"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={adForm.control}
                  name="is_skippable"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel>Skippable Ad</FormLabel>
                        <FormDescription>
                          Allow users to skip this ad after the specified time.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </>
            )}
            
            <div className="flex justify-end space-x-3 pt-6 border-t border-border">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-primary hover:bg-primary/90"
                disabled={isVideoUploading || isThumbnailUploading}
              >
                {editingAd ? "Update Ad" : "Create Ad"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
