
import { useState } from "react";
import { Plus, Pencil, Trash2, Play } from "lucide-react";
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
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function ContentManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCreating, setIsCreating] = useState(false);
  const [editingContent, setEditingContent] = useState<any>(null);
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
    is_featured: false
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
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: ['content'] });
      toast({
        title: "Content deleted",
        description: "The content has been deleted successfully."
      });
    },
    onError: (error) => {
      console.error("Error deleting content:", error);
      toast({
        title: "Error",
        description: "Failed to delete content. Please try again.",
        variant: "destructive"
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const payload = {
      ...formData,
      duration: parseInt(formData.duration) || null,
      release_year: parseInt(formData.release_year) || null
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
      is_featured: item.is_featured || false
    });
    setIsCreating(true);
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
      is_featured: false
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
            ) : content && content.length > 0 ? (
              content.map((item) => (
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
                        onClick={() => {
                          if (window.confirm(`Are you sure you want to delete "${item.title}"?`)) {
                            deleteContentMutation.mutate(item.id);
                          }
                        }}
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
    </div>
  );
}

export default ContentManagement;
