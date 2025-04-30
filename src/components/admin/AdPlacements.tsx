import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
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

export function AdPlacements() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    content_id: '',
    ad_id: '',
    placement_type: 'pre-roll',
    time_offset: '0'
  });

  // Fetch ad placements with content and ad details
  const { data: adPlacements, isLoading: loadingPlacements } = useQuery({
    queryKey: ['adPlacements'],
    queryFn: async () => {
      // First, fetch the ad placements
      const { data: placementsData, error: placementsError } = await supabase
        .from('ad_placements')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (placementsError) throw placementsError;
      
      // If we have placements, fetch the content and ad details
      if (placementsData && placementsData.length > 0) {
        const enhancedPlacements = await Promise.all(
          placementsData.map(async (placement) => {
            // Fetch content details
            const { data: contentData } = await supabase
              .from('content')
              .select('id, title, type')
              .eq('id', placement.content_id)
              .single();
            
            // Fetch ad details
            const { data: adData } = await supabase
              .from('ads')
              .select('id, title')
              .eq('id', placement.ad_id)
              .single();
              
            return {
              ...placement,
              content: contentData || { title: 'Unknown', type: 'Unknown' },
              ad: adData || { title: 'Unknown' }
            };
          })
        );
        
        return enhancedPlacements;
      }
      
      return [];
    }
  });

  // Fetch content for dropdown
  const { data: contentList } = useQuery({
    queryKey: ['content'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('content')
        .select('id, title, type')
        .order('title');
        
      if (error) throw error;
      return data || [];
    }
  });

  // Fetch ads for dropdown
  const { data: adsList } = useQuery({
    queryKey: ['ads'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ads')
        .select('id, title')
        .order('title');
        
      if (error) throw error;
      return data || [];
    }
  });

  // Add new ad placement
  const createPlacementMutation = useMutation({
    mutationFn: async (newPlacement: any) => {
      const { data, error } = await supabase
        .from('ad_placements')
        .insert(newPlacement)
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adPlacements'] });
      resetForm();
      toast({
        title: "Ad placement created",
        description: "The ad placement has been created successfully."
      });
    },
    onError: (error) => {
      console.error("Error creating ad placement:", error);
      toast({
        title: "Error",
        description: "Failed to create ad placement. Please try again.",
        variant: "destructive"
      });
    }
  });

  // Delete ad placement
  const deletePlacementMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('ad_placements')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return id;
    },
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: ['adPlacements'] });
      toast({
        title: "Ad placement deleted",
        description: "The ad placement has been deleted successfully."
      });
    },
    onError: (error) => {
      console.error("Error deleting ad placement:", error);
      toast({
        title: "Error",
        description: "Failed to delete ad placement. Please try again.",
        variant: "destructive"
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const payload = {
      content_id: formData.content_id,
      ad_id: formData.ad_id,
      placement_type: formData.placement_type,
      time_offset: formData.placement_type === 'mid-roll' 
        ? parseInt(formData.time_offset) 
        : null
    };

    createPlacementMutation.mutate(payload);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
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
      content_id: '',
      ad_id: '',
      placement_type: 'pre-roll',
      time_offset: '0'
    });
    setIsCreating(false);
  };

  const formatPlacementType = (type: string, offset?: number) => {
    if (type === 'pre-roll') return 'Pre-roll';
    if (type === 'post-roll') return 'Post-roll';
    if (type === 'mid-roll') return `Mid-roll (${offset}s)`;
    return type;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Ad Placements</h2>
        <Button 
          onClick={() => setIsCreating(!isCreating)} 
          className={isCreating ? "bg-gray-600" : "bg-kannyflix-green"}
        >
          {isCreating ? "Cancel" : <><Plus size={18} className="mr-2" /> Add New Placement</>}
        </Button>
      </div>

      {isCreating && (
        <div className="bg-zinc-900 p-6 rounded-lg border border-gray-800 mb-6">
          <h3 className="text-lg font-medium mb-4">Add Ad Placement</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="content_id">Content</Label>
                <Select 
                  value={formData.content_id} 
                  onValueChange={(value) => handleSelectChange('content_id', value)}
                  required
                >
                  <SelectTrigger className="bg-zinc-800 border-gray-700">
                    <SelectValue placeholder="Select content" />
                  </SelectTrigger>
                  <SelectContent>
                    {contentList?.map(content => (
                      <SelectItem key={content.id} value={content.id}>
                        {content.title} ({content.type})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="ad_id">Ad</Label>
                <Select 
                  value={formData.ad_id} 
                  onValueChange={(value) => handleSelectChange('ad_id', value)}
                  required
                >
                  <SelectTrigger className="bg-zinc-800 border-gray-700">
                    <SelectValue placeholder="Select ad" />
                  </SelectTrigger>
                  <SelectContent>
                    {adsList?.map(ad => (
                      <SelectItem key={ad.id} value={ad.id}>
                        {ad.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="placement_type">Placement Type</Label>
                <Select 
                  value={formData.placement_type} 
                  onValueChange={(value) => handleSelectChange('placement_type', value)}
                >
                  <SelectTrigger className="bg-zinc-800 border-gray-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pre-roll">Pre-roll</SelectItem>
                    <SelectItem value="mid-roll">Mid-roll</SelectItem>
                    <SelectItem value="post-roll">Post-roll</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {formData.placement_type === 'mid-roll' && (
                <div className="space-y-2">
                  <Label htmlFor="time_offset">Time Offset (seconds)</Label>
                  <Input 
                    id="time_offset" 
                    name="time_offset" 
                    type="number"
                    value={formData.time_offset} 
                    onChange={handleInputChange}
                    placeholder="Time in seconds"
                    required
                    className="bg-zinc-800 border-gray-700"
                  />
                </div>
              )}
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>
              <Button type="submit" className="bg-kannyflix-green">
                Add Placement
              </Button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-zinc-900 rounded-lg border border-gray-800 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Content</TableHead>
              <TableHead>Ad</TableHead>
              <TableHead>Placement</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loadingPlacements ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8">
                  Loading ad placements...
                </TableCell>
              </TableRow>
            ) : adPlacements && adPlacements.length > 0 ? (
              adPlacements.map((placement) => (
                <TableRow key={placement.id}>
                  <TableCell className="font-medium">
                    {placement.content?.title} ({placement.content?.type})
                  </TableCell>
                  <TableCell>{placement.ad?.title}</TableCell>
                  <TableCell>
                    {formatPlacementType(placement.placement_type, placement.time_offset)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => {
                        if (window.confirm(`Are you sure you want to delete this placement?`)) {
                          deletePlacementMutation.mutate(placement.id);
                        }
                      }}
                      className="text-red-500 hover:text-red-600"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                  No ad placements found. Add your first placement to get started.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default AdPlacements;
