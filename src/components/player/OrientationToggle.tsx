
import { RotateCcw, Smartphone, MonitorSpeaker } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OrientationToggleProps {
  userPreference: 'auto' | 'portrait' | 'landscape';
  onToggle: () => void;
  className?: string;
}

export function OrientationToggle({ userPreference, onToggle, className }: OrientationToggleProps) {
  const getIcon = () => {
    switch (userPreference) {
      case 'auto':
        return <RotateCcw size={16} />;
      case 'portrait':
        return <Smartphone size={16} />;
      case 'landscape':
        return <MonitorSpeaker size={16} />;
    }
  };

  const getLabel = () => {
    switch (userPreference) {
      case 'auto':
        return 'Auto';
      case 'portrait':
        return 'Portrait';
      case 'landscape':
        return 'Landscape';
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onToggle}
      className={`text-white hover:bg-black/20 ${className}`}
      title={`Orientation: ${getLabel()}`}
    >
      {getIcon()}
    </Button>
  );
}
