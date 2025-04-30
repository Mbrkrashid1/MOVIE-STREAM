
import { useState } from "react";
import { Plus, Play, Pencil, Trash2, Link } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow 
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function AdManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCreating, setIsCreating] = useState(false);
  const [editingAd, setEditingAd] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    video_url: '',
    thumbnail_url: '',
    duration: '',
    is_skippable: true,
    skip_after_seconds: 5
  });

  // Fetch ads from Supabase
  const { data: ads, isLoading } = useQuery({
    queryKey: ['ads'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ads')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      return data || [];
    }
  });

  // Add new ad
  const createAdMutation = useMutation({
    mutationFn: async (newAd: any) => {
      const { data, error } = await supabase
        .from('ads')
        .insert(newAd)
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ads'] });
      resetForm();
      toast({
        title: "Ad created",
        description: "The ad has been created successfully."
      });
    },
    onError: (error) => {
      console.error("Error creating ad:", error);
      toast({
        title: "Error",
        description: "Failed to create ad. Please try again.",
        variant: "destructive"
      });
    }
  });

  // Update ad
  const updateAdMutation = useMutation({
    mutationFn: async (updatedAd: any) => {
      const { data, error } = await supabase
        .from('ads')
        .update(updatedAd)
        .eq('id', editingAd.id)
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ads'] });
      resetForm();
      toast({
        title: "Ad updated",
        description: "The ad has been updated successfully."
      });
    },
    onError: (error) => {
      console.error("Error updating ad:", error);
      toast({
        title: "Error",
        description: "Failed to update ad. Please try again.",
        variant: "destructive"
      });
    }
  });

  // Delete ad
  const deleteAdMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('ads')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return id;
    },
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: ['ads'] });
      toast({
        title: "Ad deleted",
        description: "The ad has been deleted successfully."
      });
    },
    onError: (error) => {
      console.error("Error deleting ad:", error);
      toast({
        title: "Error",
        description: "Failed to delete ad. Please try again.",
        variant: "destructive"
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const payload = {
      ...formData,
      duration: parseInt(formData.duration) || 0,
      skip_after_seconds: parseInt(formData.skip_after_seconds) || 5
    };

    if (editingAd) {
      updateAdMutation.mutate(payload);
    } else {
      createAdMutation.mutate(payload);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleEdit = (ad: any) => {
    setEditingAd(ad);
    setFormData({
      title: ad.title,
      description: ad.description || '',
      video_url: ad.video_url,
      thumbnail_url: ad.thumbnail_url || '',
      duration: ad.duration?.toString() || '',
      is_skippable: ad.is_skippable,
      skip_after_seconds: ad.skip_after_seconds
    });
    setIsCreating(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      video_url: '',
      thumbnail_url: '',
      duration: '',
      is_skippable: true,
      skip_after_seconds: 5
    });
    setEditingAd(null);
    setIsCreating(false);
  };

  const formatDuration = (seconds: number) => {
    if (!seconds) return "Unknown";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Ads Management</h2>
        <Button 
          onClick={() => setIsCreating(!isCreating)} 
          className={isCreating ? "bg-gray-600" : "bg-kannyflix-green"}
        >
          {isCreating ? "Cancel" : <><Plus size={18} className="mr-2" /> Create New Ad</>}
        </Button>
      </div>

      {isCreating && (
        <div className="bg-zinc-900 p-6 rounded-lg border border-gray-800 mb-6">
          <h3 className="text-lg font-medium mb-4">{editingAd ? 'Edit Ad' : 'Create New Ad'}</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input 
                  id="title" 
                  name="title" 
                  value={formData.title} 
                  onChange={handleInputChange}
                  placeholder="Ad Title"
                  required
                  className="bg-zinc-800 border-gray-700"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Duration (seconds)</Label>
                <Input 
                  id="duration" 
                  name="duration" 
                  type="number"
                  value={formData.duration} 
                  onChange={handleInputChange}
                  placeholder="Duration in seconds"
                  className="bg-zinc-800 border-gray-700"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="video_url">Video URL</Label>
                <Input 
                  id="video_url" 
                  name="video_url" 
                  value={formData.video_url} 
                  onChange={handleInputChange}
                  placeholder="https://example.com/video.mp4"
                  required
                  className="bg-zinc-800 border-gray-700"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="thumbnail_url">Thumbnail URL</Label>
                <Input 
                  id="thumbnail_url" 
                  name="thumbnail_url" 
                  value={formData.thumbnail_url} 
                  onChange={handleInputChange}
                  placeholder="https://example.com/thumbnail.jpg"
                  className="bg-zinc-800 border-gray-700"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">Description</Label>
                <Input 
                  id="description" 
                  name="description" 
                  value={formData.description} 
                  onChange={handleInputChange}
                  placeholder="Ad description"
                  className="bg-zinc-800 border-gray-700"
                />
              </div>
              <div className="space-y-2 flex items-center">
                <input 
                  id="is_skippable" 
                  name="is_skippable" 
                  type="checkbox" 
                  checked={formData.is_skippable}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <Label htmlFor="is_skippable">Skippable</Label>
              </div>
              <div className="space-y-2">
                <Label htmlFor="skip_after_seconds">Skip After (seconds)</Label>
                <Input 
                  id="skip_after_seconds" 
                  name="skip_after_seconds" 
                  type="number"
                  value={formData.skip_after_seconds} 
                  onChange={handleInputChange}
                  placeholder="5"
                  disabled={!formData.is_skippable}
                  className="bg-zinc-800 border-gray-700"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>
              <Button type="submit" className="bg-kannyflix-green">
                {editingAd ? 'Update Ad' : 'Create Ad'}
              </Button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-zinc-900 rounded-lg border border-gray-800 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]">Ad</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Skippable</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8">
                  Loading ads...
                </TableCell>
              </TableRow>
            ) : ads && ads.length > 0 ? (
              ads.map((ad) => (
                <TableRow key={ad.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      {ad.thumbnail_url ? (
                        <div className="w-12 h-8 rounded overflow-hidden">
                          <img 
                            src={ad.thumbnail_url} 
                            alt={ad.title} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-12 h-8 bg-gray-700 rounded flex items-center justify-center">
                          <Play size={16} />
                        </div>
                      )}
                      <div>
                        <div className="font-medium">{ad.title}</div>
                        <div className="text-xs text-gray-400">{ad.description}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{formatDuration(ad.duration)}</TableCell>
                  <TableCell>{ad.is_skippable ? `Yes (after ${ad.skip_after_seconds}s)` : 'No'}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => window.open(ad.video_url, '_blank')}
                        title="View Ad"
                      >
                        <Link size={16} />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => handleEdit(ad)}
                        title="Edit Ad"
                      >
                        <Pencil size={16} />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => {
                          if (window.confirm(`Are you sure you want to delete "${ad.title}"?`)) {
                            deleteAdMutation.mutate(ad.id);
                          }
                        }}
                        className="text-red-500 hover:text-red-600"
                        title="Delete Ad"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                  No ads found. Create your first ad to get started.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default AdManagement;
