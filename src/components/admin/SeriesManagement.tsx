
import { useState, useRef, ChangeEvent } from "react";
import { Plus, Pencil, Trash2, Play, Upload, Film } from "lucide-react";
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
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow 
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function SeriesManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCreating, setIsCreating] = useState(false);
  const [editingSeries, setEditingSeries] = useState<any>(null);
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [seriesToDelete, setSeriesToDelete] = useState<any>(null);
  const fileInputRefThumbnail = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Hausa Series',
    thumbnail_url: '',
    release_year: new Date().getFullYear().toString(),
    language: 'Hausa',
    is_featured: false,
    total_seasons: 1,
    status: 'ongoing'
  });

  // Fetch series from Supabase (content with type = 'series')
  const { data: series, isLoading } = useQuery({
    queryKey: ['series'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('content')
        .select('*')
        .eq('type', 'series')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      return data || [];
    }
  });

  // Create series mutation
  const createSeriesMutation = useMutation({
    mutationFn: async (newSeries: any) => {
      const { data, error } = await supabase
        .from('content')
        .insert({
          ...newSeries,
          type: 'series',
          video_url: 'placeholder' // Series don't have direct video URLs
        })
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['series'] });
      resetForm();
      toast({
        title: "Series created",
        description: "The series has been created successfully."
      });
    },
    onError: (error) => {
      console.error("Error creating series:", error);
      toast({
        title: "Error",
        description: "Failed to create series. Please try again.",
        variant: "destructive"
      });
    }
  });

  // Update series mutation
  const updateSeriesMutation = useMutation({
    mutationFn: async (updatedSeries: any) => {
      const { data, error } = await supabase
        .from('content')
        .update(updatedSeries)
        .eq('id', editingSeries.id)
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['series'] });
      resetForm();
      toast({
        title: "Series updated",
        description: "The series has been updated successfully."
      });
    },
    onError: (error) => {
      console.error("Error updating series:", error);
      toast({
        title: "Error",
        description: "Failed to update series. Please try again.",
        variant: "destructive"
      });
    }
  });

  // Delete series mutation
  const deleteSeriesMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('content')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['series'] });
      toast({
        title: "Series deleted",
        description: "The series has been deleted successfully."
      });
      setDeleteDialogOpen(false);
      setSeriesToDelete(null);
    },
    onError: (error) => {
      console.error("Error deleting series:", error);
      toast({
        title: "Error",
        description: "Failed to delete series. Please try again.",
        variant: "destructive"
      });
      setDeleteDialogOpen(false);
    }
  });

  const handleUploadThumbnail = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploadingThumbnail(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-series-thumbnail.${fileExt}`;
      const filePath = `thumbnails/${fileName}`;
      
      const { error: uploadError, data } = await supabase.storage
        .from('content')
        .upload(filePath, file);
      
      if (uploadError) throw uploadError;
      
      const { data: publicUrlData } = supabase.storage
        .from('content')
        .getPublicUrl(filePath);
      
      setFormData(prev => ({
        ...prev,
        thumbnail_url: publicUrlData.publicUrl
      }));
      
      toast({
        title: "Thumbnail uploaded",
        description: "Series thumbnail has been uploaded successfully."
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const payload = {
      ...formData,
      release_year: parseInt(formData.release_year) || null,
      total_seasons: parseInt(formData.total_seasons.toString()) || 1
    };

    if (editingSeries) {
      updateSeriesMutation.mutate(payload);
    } else {
      createSeriesMutation.mutate(payload);
    }
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

  const handleEdit = (item: any) => {
    setEditingSeries(item);
    setFormData({
      title: item.title,
      description: item.description || '',
      category: item.category,
      thumbnail_url: item.thumbnail_url || '',
      release_year: item.release_year?.toString() || new Date().getFullYear().toString(),
      language: item.language || 'Hausa',
      is_featured: item.is_featured || false,
      total_seasons: 1,
      status: 'ongoing'
    });
    setIsCreating(true);
  };

  const confirmDelete = (item: any) => {
    setSeriesToDelete(item);
    setDeleteDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: 'Hausa Series',
      thumbnail_url: '',
      release_year: new Date().getFullYear().toString(),
      language: 'Hausa',
      is_featured: false,
      total_seasons: 1,
      status: 'ongoing'
    });
    setEditingSeries(null);
    setIsCreating(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-white">Series Management</h2>
          <p className="text-gray-400 mt-1">Manage Hausa series and shows</p>
        </div>
        <Button 
          onClick={() => setIsCreating(!isCreating)} 
          className={isCreating ? "bg-gray-600" : "bg-primary"}
        >
          {isCreating ? "Cancel" : <><Plus size={18} className="mr-2" /> Add New Series</>}
        </Button>
      </div>

      {isCreating && (
        <div className="bg-card p-6 rounded-lg border border-border mb-6">
          <h3 className="text-lg font-medium mb-4 text-white">
            {editingSeries ? 'Edit Series' : 'Add New Series'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-white">Series Title</Label>
                <Input 
                  id="title" 
                  name="title" 
                  value={formData.title} 
                  onChange={handleInputChange}
                  placeholder="Enter series title"
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
                    <SelectItem value="Hausa Series">Hausa Series</SelectItem>
                    <SelectItem value="Comedy Series">Comedy Series</SelectItem>
                    <SelectItem value="Drama Series">Drama Series</SelectItem>
                    <SelectItem value="Action Series">Action Series</SelectItem>
                    <SelectItem value="Kannywood Series">Kannywood Series</SelectItem>
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
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="thumbnail_url" className="text-white">Series Poster</Label>
                <div className="flex items-center gap-2">
                  <Input 
                    id="thumbnail_url" 
                    name="thumbnail_url" 
                    value={formData.thumbnail_url} 
                    onChange={handleInputChange}
                    placeholder="https://example.com/poster.jpg"
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
                    onChange={handleUploadThumbnail}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description" className="text-white">Description</Label>
                <Textarea 
                  id="description" 
                  name="description" 
                  value={formData.description} 
                  onChange={handleInputChange}
                  placeholder="Enter series description"
                  className="bg-input border-border resize-none"
                  rows={3}
                />
              </div>
              <div className="space-y-2 flex items-center">
                <input 
                  id="is_featured" 
                  name="is_featured" 
                  type="checkbox" 
                  checked={formData.is_featured}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <Label htmlFor="is_featured" className="text-white">Featured Series</Label>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>
              <Button type="submit" className="bg-primary">
                {editingSeries ? 'Update Series' : 'Add Series'}
              </Button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]">Series</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Language</TableHead>
              <TableHead>Year</TableHead>
              <TableHead>Views</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  Loading series...
                </TableCell>
              </TableRow>
            ) : series && series.length > 0 ? (
              series.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      {item.thumbnail_url ? (
                        <div className="w-12 h-8 rounded overflow-hidden">
                          <img 
                            src={item.thumbnail_url} 
                            alt={item.title} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-12 h-8 bg-muted rounded flex items-center justify-center">
                          <Film size={16} />
                        </div>
                      )}
                      <div>
                        <div className="font-medium text-white">{item.title}</div>
                        <div className="text-xs text-muted-foreground">Series</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{item.category}</TableCell>
                  <TableCell className="text-muted-foreground">{item.language}</TableCell>
                  <TableCell className="text-muted-foreground">{item.release_year}</TableCell>
                  <TableCell className="text-muted-foreground">{item.views?.toLocaleString() || '0'}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => handleEdit(item)}
                      >
                        <Pencil size={16} />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => confirmDelete(item)}
                        className="text-red-500 hover:text-red-600"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No series found. Add your first series to get started.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the series
              "{seriesToDelete?.title}" and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => deleteSeriesMutation.mutate(seriesToDelete?.id)}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default SeriesManagement;
