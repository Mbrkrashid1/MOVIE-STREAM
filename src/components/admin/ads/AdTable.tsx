
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Edit, Trash2, Eye, Clock } from "lucide-react";

interface AdTableProps {
  ads: any[];
  isLoading: boolean;
  onEdit: (ad: any) => void;
  onDelete: (adId: string) => void;
  formatDuration: (seconds: number) => string;
}

export function AdTable({ ads, isLoading, onEdit, onDelete, formatDuration }: AdTableProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
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
                    onClick={() => onEdit(ad)}
                  >
                    <Edit size={14} />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => onDelete(ad.id)}
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
  );
}
