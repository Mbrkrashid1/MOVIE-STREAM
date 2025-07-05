
import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CommentsToggleProps {
  showComments: boolean;
  onToggle: () => void;
}

export function CommentsToggle({ showComments, onToggle }: CommentsToggleProps) {
  return (
    <div className="px-6 mb-6">
      <Button
        variant="outline"
        onClick={onToggle}
        className="w-full flex items-center justify-center py-3 font-semibold transition-all duration-200"
      >
        <MessageSquare size={18} className="mr-2" />
        {showComments ? "Hide Comments" : `Show Comments & Discussion`}
      </Button>
    </div>
  );
}
