import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge";
import { Play, Edit, Trash2, Upload, Eye, Clock } from "lucide-react";

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
})

type AdFormData = z.infer<typeof adFormSchema>;

const AdManagement = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingAd, setEditingAd] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Fetch ads from Supabase
  const { data: ads, isLoading } = useQuery({
    queryKey: ["ads"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ads")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });

  const adForm = useForm<AdFormData>({
    resolver: zodResolver(adFormSchema),
    defaultValues: {
      title: "",
      description: "",
      thumbnail_url: "",
      video_url: "",
      duration: 30,
      is_skippable: true,
      skip_after_seconds: 5,
    },
  })

  // Create ad mutation
  const createAdMutation = useMutation({
    mutationFn: async (values: AdFormData) => {
      const { data, error } = await supabase
        .from("ads")
        .insert({
          title: values.title,
          description: values.description,
          thumbnail_url: values.thumbnail_url,
          video_url: values.video_url,
          duration: values.duration,
          is_skippable: values.is_skippable,
          skip_after_seconds: values.skip_after_seconds,
        })
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ads"] });
      toast({
        title: "Success!",
        description: "Ad created successfully.",
      });
      setIsDialogOpen(false);
      adForm.reset();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create ad. Please try again.",
        variant: "destructive",
      });
      console.error("Error creating ad:", error);
    },
  });

  // Update ad mutation
  const updateAdMutation = useMutation({
    mutationFn: async ({ id, values }: { id: string; values: AdFormData }) => {
      const { data, error } = await supabase
        .from("ads")
        .update({
          title: values.title,
          description: values.description,
          thumbnail_url: values.thumbnail_url,
          video_url: values.video_url,
          duration: values.duration,
          is_skippable: values.is_skippable,
          skip_after_seconds: values.skip_after_seconds,
        })
        .eq("id", id)
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ads"] });
      toast({
        title: "Success!",
        description: "Ad updated successfully.",
      });
      setIsDialogOpen(false);
      setEditingAd(null);
      adForm.reset();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update ad. Please try again.",
        variant: "destructive",
      });
      console.error("Error updating ad:", error);
    },
  });

  // Delete ad mutation
  const deleteAdMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("ads")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ads"] });
      toast({
        title: "Success!",
        description: "Ad deleted successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete ad. Please try again.",
        variant: "destructive",
      });
      console.error("Error deleting ad:", error);
    },
  });

  const onSubmit = (values: AdFormData) => {
    if (editingAd) {
      updateAdMutation.mutate({ id: editingAd.id, values });
    } else {
      createAdMutation.mutate(values);
    }
  }

  const handleEdit = (ad: any) => {
    setEditingAd(ad);
    adForm.reset({
      title: ad.title,
      description: ad.description,
      thumbnail_url: ad.thumbnail_url,
      video_url: ad.video_url,
      duration: ad.duration,
      is_skippable: ad.is_skippable,
      skip_after_seconds: ad.skip_after_seconds,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (adId: string) => {
    if (confirm("Are you sure you want to delete this ad?")) {
      deleteAdMutation.mutate(adId);
    }
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Ad Management</h1>
          <p className="text-gray-400 mt-1">Create and manage your advertising campaigns</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <Upload className="mr-2" size={16} />
              Upload Ad
            </Button>
          </DialogTrigger>
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
              <form onSubmit={adForm.handleSubmit(onSubmit)} className="space-y-4">
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
                    onClick={() => {
                      setIsDialogOpen(false);
                      setEditingAd(null);
                      adForm.reset();
                    }}
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
      </div>

      <div className="bg-card rounded-lg border border-border">
        <Table>
          <TableCaption>
            {ads?.length === 0 ? "No advertisements found. Upload your first ad to get started!" : `Managing ${ads?.length} advertisements`}
          </TableCaption>
          <TableHead>
            <TableRow className="border-border">
              <TableHead className="w-[120px]">Preview</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Skippable</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHead>
          <TableBody>
            {ads?.map((ad) => (
              <TableRow key={ad.id} className="border-border hover:bg-muted/50">
                <TableCell>
                  <div className="relative w-20 h-12 rounded overflow-hidden bg-muted">
                    {ad.thumbnail_url ? (
                      <img 
                        src={ad.thumbnail_url} 
                        alt={ad.title} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Play size={16} className="text-muted-foreground" />
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell className="font-medium text-white">{ad.title}</TableCell>
                <TableCell className="max-w-xs truncate text-muted-foreground">
                  {ad.description}
                </TableCell>
                <TableCell>
                  <div className="flex items-center text-muted-foreground">
                    <Clock size={14} className="mr-1" />
                    {formatDuration(ad.duration)}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={ad.is_skippable ? "secondary" : "destructive"}>
                    {ad.is_skippable ? `Skip after ${ad.skip_after_seconds}s` : "Non-skippable"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => window.open(ad.video_url, '_blank')}
                    >
                      <Eye size={14} />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleEdit(ad)}
                    >
                      <Edit size={14} />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDelete(ad.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdManagement;

</edits_to_apply>
