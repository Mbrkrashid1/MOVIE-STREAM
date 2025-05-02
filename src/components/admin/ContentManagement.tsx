
import { useState, useRef, ChangeEvent } from "react";
import { Plus, Pencil, Trash2, Play, Upload } from "lucide-react";
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

export function ContentManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCreating, setIsCreating] = useState(false);
  const [editingContent, setEditingContent] = useState<any>(null);
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [contentToDelete, setContentToDelete] = useState<any>(null);
  const fileInputRefThumbnail = useRef<HTMLInputElement>(null);
  const fileInputRefVideo = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'movie',
    category: 'Hausa Movies',
    thumbnail_url: '',
    video_url: '',
    duration: '',
    release_year: new Date().getFullYear().toString(),
    language: 'Hausa',
    is_featured: false,
    is_sample: false
  });

  // Fetch content from Supabase
  const { data: content, isLoading } = useQuery({
    queryKey: ['content'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('content')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      return data || [];
    }
  });

  // Add new content
  const createContentMutation = useMutation({
    mutationFn: async (newContent: any) => {
      const { data, error } = await supabase
        .from('content')
        .insert(newContent)
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content'] });
      resetForm();
      toast({
        title: "Content created",
        description: "The content has been created successfully."
      });
    },
    onError: (error) => {
      console.error("Error creating content:", error);
      toast({
        title: "Error",
        description: "Failed to create content. Please try again.",
        variant: "destructive"
      });
    }
  });

  // Update content
  const updateContentMutation = useMutation({
    mutationFn: async (updatedContent: any) => {
      const { data, error } = await supabase
        .from('content')
        .update(updatedContent)
        .eq('id', editingContent.id)
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content'] });
      resetForm();
      toast({
        title: "Content updated",
        description: "The content has been updated successfully."
      });
    },
    onError: (error) => {
      console.error("Error updating content:", error);
      toast({
        title: "Error",
        description: "Failed to update content. Please try again.",
        variant: "destructive"
      });
    }
  });

  // Delete content
  const deleteContentMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('content')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content'] });
      toast({
        title: "Content deleted",
        description: "The content has been deleted successfully."
      });
      setDeleteDialogOpen(false);
      setContentToDelete(null);
    },
    onError: (error) => {
      console.error("Error deleting content:", error);
      toast({
        title: "Error",
        description: "Failed to delete content. Please try again.",
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
      // Generate a unique filename with timestamp and original extension
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-thumbnail.${fileExt}`;
      const filePath = `thumbnails/${fileName}`;
      
      // Upload to Supabase Storage
      const { error: uploadError, data } = await supabase.storage
        .from('content')
        .upload(filePath, file);
      
      if (uploadError) throw uploadError;
      
      // Get the public URL
      const { data: publicUrlData } = supabase.storage
        .from('content')
        .getPublicUrl(filePath);
      
      // Update form data
      setFormData(prev => ({
        ...prev,
        thumbnail_url: publicUrlData.publicUrl
      }));
      
      toast({
        title: "Thumbnail uploaded",
        description: "Thumbnail has been uploaded successfully."
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
  
  const handleUploadVideo = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploadingVideo(true);
    try {
      // Generate a unique filename with timestamp and original extension
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-video.${fileExt}`;
      const filePath = `videos/${fileName}`;
      
      // Upload to Supabase Storage
      const { error: uploadError, data } = await supabase.storage
        .from('content')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });
      
      if (uploadError) throw uploadError;
      
      // Get the public URL
      const { data: publicUrlData } = supabase.storage
        .from('content')
        .getPublicUrl(filePath);
      
      // Update form data
      setFormData(prev => ({
        ...prev,
        video_url: publicUrlData.publicUrl
      }));
      
      toast({
        title: "Video uploaded",
        description: "Video has been uploaded successfully."
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
      if (fileInputRefVideo.current) fileInputRefVideo.current.value = "";
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const payload = {
      ...formData,
      duration: parseInt(formData.duration) || null,
      release_year: parseInt(formData.release_year) || null,
      is_sample: false // Ensure new content is not marked as sample
    };

    if (editingContent) {
      updateContentMutation.mutate(payload);
    } else {
      createContentMutation.mutate(payload);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
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
    setEditingContent(item);
    setFormData({
      title: item.title,
      description: item.description || '',
      type: item.type,
      category: item.category,
      thumbnail_url: item.thumbnail_url || '',
      video_url: item.video_url,
      duration: item.duration?.toString() || '',
      release_year: item.release_year?.toString() || new Date().getFullYear().toString(),
      language: item.language || 'Hausa',
      is_featured: item.is_featured || false,
      is_sample: item.is_sample || false
    });
    setIsCreating(true);
  };

  const confirmDelete = (item: any) => {
    setContentToDelete(item);
    setDeleteDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      type: 'movie',
      category: 'Hausa Movies',
      thumbnail_url: '',
      video_url: '',
      duration: '',
      release_year: new Date().getFullYear().toString(),
      language: 'Hausa',
      is_featured: false,
      is_sample: false
    });
    setEditingContent(null);
    setIsCreating(false);
  };

  const formatDuration = (seconds: number) => {
    if (!seconds) return "Unknown";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Filter out sample content unless in editing mode
  const filteredContent = content?.filter(item => !item.is_sample) || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Content Management</h2>
        <Button 
          onClick={() => setIsCreating(!isCreating)} 
          className={isCreating ? "bg-gray-600" : "bg-kannyflix-green"}
        >
          {isCreating ? "Cancel" : <><Plus size={18} className="mr-2" /> Add New Content</>}
        </Button>
      </div>

      {isCreating && (
        <div className="bg-zinc-900 p-6 rounded-lg border border-gray-800 mb-6">
          <h3 className="text-lg font-medium mb-4">{editingContent ? 'Edit Content' : 'Add New Content'}</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input 
                  id="title" 
                  name="title" 
                  value={formData.title} 
                  onChange={handleInputChange}
                  placeholder="Content Title"
                  required
                  className="bg-zinc-800 border-gray-700"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select 
                  value={formData.type} 
                  onValueChange={(value) => handleSelectChange('type', value)}
                >
                  <SelectTrigger className="bg-zinc-800 border-gray-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="movie">Movie</SelectItem>
                    <SelectItem value="series">Series</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select 
                  value={formData.category} 
                  onValueChange={(value) => handleSelectChange('category', value)}
                >
                  <SelectTrigger className="bg-zinc-800 border-gray-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Hausa Movies">Hausa Movies</SelectItem>
                    <SelectItem value="Hausa Series">Hausa Series</SelectItem>
                    <SelectItem value="Comedy">Comedy</SelectItem>
                    <SelectItem value="Drama">Drama</SelectItem>
                    <SelectItem value="Action">Action</SelectItem>
                    <SelectItem value="Kannywood">Kannywood</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Select 
                  value={formData.language} 
                  onValueChange={(value) => handleSelectChange('language', value)}
                >
                  <SelectTrigger className="bg-zinc-800 border-gray-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Hausa">Hausa</SelectItem>
                    <SelectItem value="English">English</SelectItem>
                    <SelectItem value="Hausa/English">Hausa/English</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Video Upload */}
              <div className="space-y-2">
                <Label htmlFor="video_url">Video</Label>
                <div className="flex items-center gap-2">
                  <Input 
                    id="video_url" 
                    name="video_url" 
                    value={formData.video_url} 
                    onChange={handleInputChange}
                    placeholder="https://example.com/video.mp4"
                    className="bg-zinc-800 border-gray-700"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRefVideo.current?.click()}
                    disabled={uploadingVideo}
                    className="whitespace-nowrap"
                  >
                    {uploadingVideo ? 'Uploading...' : <><Upload size={16} className="mr-2" /> Upload</>}
                  </Button>
                  <input
                    type="file"
                    ref={fileInputRefVideo}
                    onChange={handleUploadVideo}
                    accept="video/*"
                    className="hidden"
                  />
                </div>
              </div>

              {/* Thumbnail Upload */}
              <div className="space-y-2">
                <Label htmlFor="thumbnail_url">Thumbnail</Label>
                <div className="flex items-center gap-2">
                  <Input 
                    id="thumbnail_url" 
                    name="thumbnail_url" 
                    value={formData.thumbnail_url} 
                    onChange={handleInputChange}
                    placeholder="https://example.com/thumbnail.jpg"
                    className="bg-zinc-800 border-gray-700"
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
                <Label htmlFor="release_year">Release Year</Label>
                <Input 
                  id="release_year" 
                  name="release_year" 
                  type="number"
                  value={formData.release_year} 
                  onChange={handleInputChange}
                  placeholder="Release year"
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
                  placeholder="Content description"
                  className="bg-zinc-800 border-gray-700"
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
                <Label htmlFor="is_featured">Featured Content</Label>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>
              <Button type="submit" className="bg-kannyflix-green">
                {editingContent ? 'Update Content' : 'Add Content'}
              </Button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-zinc-900 rounded-lg border border-gray-800 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]">Content</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Views</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  Loading content...
                </TableCell>
              </TableRow>
            ) : filteredContent.length > 0 ? (
              filteredContent.map((item) => (
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
                        <div className="w-12 h-8 bg-gray-700 rounded flex items-center justify-center">
                          <Play size={16} />
                        </div>
                      )}
                      <div>
                        <div className="font-medium">{item.title}</div>
                        <div className="text-xs text-gray-400">{item.release_year}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{item.type === 'movie' ? 'Movie' : 'Series'}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>{formatDuration(item.duration)}</TableCell>
                  <TableCell>{item.views.toLocaleString()}</TableCell>
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
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                  No content found. Add your first movie or series to get started.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the content
              "{contentToDelete?.title}" and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => deleteContentMutation.mutate(contentToDelete?.id)}
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

export default ContentManagement;
