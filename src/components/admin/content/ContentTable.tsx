
import { Pencil, Trash2, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow 
} from "@/components/ui/table";

interface ContentTableProps {
  content: any[];
  isLoading: boolean;
  onEdit: (item: any) => void;
  onDelete: (item: any) => void;
  formatDuration: (seconds: number) => string;
}

export function ContentTable({ content, isLoading, onEdit, onDelete, formatDuration }: ContentTableProps) {
  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
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
                      <div className="w-12 h-8 bg-muted rounded flex items-center justify-center">
                        <Play size={16} />
                      </div>
                    )}
                    <div>
                      <div className="font-medium">{item.title}</div>
                      <div className="text-xs text-muted-foreground">{item.release_year}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{item.type === 'movie' ? 'Movie' : 'Series'}</TableCell>
                <TableCell>{item.category}</TableCell>
                <TableCell>{formatDuration(item.duration)}</TableCell>
                <TableCell>{item.views?.toLocaleString() || '0'}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => onEdit(item)}
                    >
                      <Pencil size={16} />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => onDelete(item)}
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
                No content found. Add your first movie or series to get started.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
