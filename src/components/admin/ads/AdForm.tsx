
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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

const adFormSchema = z.object({
  title: z.string().min(2, {
    message: "Ad title must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  thumbnail_url: z.string().url({ message: "Invalid URL." }),
  video_url: z.string().url({ message: "Invalid URL." }),
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

  const handleSubmit = (values: AdFormData) => {
    onSubmit(values);
    adForm.reset();
  };

  const handleCancel = () => {
    onCancel();
    adForm.reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-card border-border">
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
            <FormField
              control={adForm.control}
              name="thumbnail_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Thumbnail URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/thumbnail.jpg" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={adForm.control}
              name="video_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Video URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/video.mp4" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
            <div className="flex justify-end space-x-2">
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
