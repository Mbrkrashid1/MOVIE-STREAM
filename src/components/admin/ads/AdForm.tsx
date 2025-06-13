
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
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Upload, Film, Image } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const adFormSchema = z.object({
  title: z.string().min(2, {
    message: "Ad title must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  thumbnail_url: z.string().optional(),
  video_url: z.string().optional(),
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
  const [uploadedVideoUrl, setUploadedVideoUrl] = useState("");
  const [uploadedThumbnailUrl, setUploadedThumbnailUrl] = useState("");
  const { toast } = useToast();

  const adForm = useForm<AdFormData>({
    resolver: zodResolver(adFormSchema),
    defaultValues: {
      title: editingAd?.title || "",
      description: editingAd?.description || "",
      thumbnail_url: editingAd?.thumbnail_url || "",
      video_url: editingAd?.video_url || "",
      duration: editingAd?.duration || 30,
      is_skippable: editingAd?.is_skippable ?? true,
      skip_after_seconds: editingAd?.skip_after_seconds || 5,
    },
  });

  const handleVideoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      toast({
        title: "Error",
        description: "Please select a valid video file.",
        variant: "destructive",
      });
      return;
    }

    setIsVideoUploading(true);
    try {
      // Create a temporary URL for the uploaded file
      const videoUrl = URL.createObjectURL(file);
      setUploadedVideoUrl(videoUrl);
      adForm.setValue("video_url", videoUrl);
      
      // Get video duration
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.onloadedmetadata = () => {
        const duration = Math.round(video.duration);
        adForm.setValue("duration", duration);
        URL.revokeObjectURL(video.src);
      };
      video.src = videoUrl;

      toast({
        title: "Success",
        description: "Video uploaded successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload video. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsVideoUploading(false);
    }
  };

  const handleThumbnailUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Error",
        description: "Please select a valid image file.",
        variant: "destructive",
      });
      return;
    }

    setIsThumbnailUploading(true);
    try {
      const thumbnailUrl = URL.createObjectURL(file);
      setUploadedThumbnailUrl(thumbnailUrl);
      adForm.setValue("thumbnail_url", thumbnailUrl);

      toast({
        title: "Success",
        description: "Thumbnail uploaded successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload thumbnail. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsThumbnailUploading(false);
    }
  };

  const handleSubmit = (values: AdFormData) => {
    onSubmit(values);
    adForm.reset();
    setUploadedVideoUrl("");
    setUploadedThumbnailUrl("");
  };

  const handleCancel = () => {
    onCancel();
    adForm.reset();
    setUploadedVideoUrl("");
    setUploadedThumbnailUrl("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-card border-border max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white">
            {editingAd ? "Edit Advertisement" : "Upload New Advertisement"}
          </DialogTitle>
          <DialogDescription>
            {editingAd ? "Update your advertisement details." : "Create a new ad for HausaBox platform."}
          </DialogDescription>
        </DialogHeader>
        <Form {...adForm}>
          <form onSubmit={adForm.handleSubmit(handleSubmit)} className="space-y-4">
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
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Video Upload Section */}
            <div className="space-y-2">
              <FormLabel>Video Upload</FormLabel>
              <div className="flex flex-col space-y-2">
                <div className="flex items-center space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isVideoUploading}
                    onClick={() => document.getElementById('video-upload')?.click()}
                    className="flex items-center space-x-2"
                  >
                    <Film size={16} />
                    <span>{isVideoUploading ? "Uploading..." : "Upload Video"}</span>
                  </Button>
                  <input
                    id="video-upload"
                    type="file"
                    accept="video/*"
                    onChange={handleVideoUpload}
                    className="hidden"
                  />
                </div>
                {uploadedVideoUrl && (
                  <div className="w-full">
                    <video
                      src={uploadedVideoUrl}
                      controls
                      className="w-full h-32 object-cover rounded border"
                    />
                  </div>
                )}
              </div>
              <FormField
                control={adForm.control}
                name="video_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Or Video URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/video.mp4" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Thumbnail Upload Section */}
            <div className="space-y-2">
              <FormLabel>Thumbnail Upload</FormLabel>
              <div className="flex flex-col space-y-2">
                <div className="flex items-center space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isThumbnailUploading}
                    onClick={() => document.getElementById('thumbnail-upload')?.click()}
                    className="flex items-center space-x-2"
                  >
                    <Image size={16} />
                    <span>{isThumbnailUploading ? "Uploading..." : "Upload Thumbnail"}</span>
                  </Button>
                  <input
                    id="thumbnail-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleThumbnailUpload}
                    className="hidden"
                  />
                </div>
                {uploadedThumbnailUrl && (
                  <div className="w-24 h-16">
                    <img
                      src={uploadedThumbnailUrl}
                      alt="Thumbnail preview"
                      className="w-full h-full object-cover rounded border"
                    />
                  </div>
                )}
              </div>
              <FormField
                control={adForm.control}
                name="thumbnail_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Or Thumbnail URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/thumbnail.jpg" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
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
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
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
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-primary hover:bg-primary/90">
                {editingAd ? "Update Ad" : "Upload Ad"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
