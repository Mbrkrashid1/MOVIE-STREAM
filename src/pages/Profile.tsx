
import { Settings, List, Download, Clock, BookmarkCheck, HelpCircle, Mail, Wifi, WifiOff, User, CreditCard } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import BottomNavigation from "@/components/layout/BottomNavigation";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

const ProfileItem = ({ icon, title, to, onClick, rightElement }: { 
  icon: React.ReactNode, 
  title: string, 
  to?: string,
  onClick?: () => void,
  rightElement?: React.ReactNode 
}) => {
  const content = (
    <div className="flex items-center py-4 border-b border-border">
      <div className="mr-4 text-muted-foreground">
        {icon}
      </div>
      <div className="flex-1">{title}</div>
      {rightElement || <div className="text-muted-foreground">›</div>}
    </div>
  );

  if (to) {
    return <Link to={to}>{content}</Link>;
  }

  return (
    <button onClick={onClick} className="w-full text-left">
      {content}
    </button>
  );
};

const Profile = () => {
  const { toast } = useToast();
  const [offlineMode, setOfflineMode] = useState(false);
  const [autoDownload, setAutoDownload] = useState(false);
  const [dataUsage, setDataUsage] = useState('wifi-only');

  const handleOfflineModeToggle = (enabled: boolean) => {
    setOfflineMode(enabled);
    toast({
      title: enabled ? "Offline mode enabled" : "Offline mode disabled",
      description: enabled 
        ? "Content will be available for offline viewing"
        : "Offline content access disabled",
    });
  };

  const handleAutoDownloadToggle = (enabled: boolean) => {
    setAutoDownload(enabled);
    toast({
      title: enabled ? "Auto-download enabled" : "Auto-download disabled",
      description: enabled 
        ? "New episodes will download automatically when on WiFi"
        : "Manual downloads only",
    });
  };

  const handleUpgradeToVIP = () => {
    toast({
      title: "VIP Upgrade",
      description: "Redirecting to subscription page...",
    });
  };

  return (
    <div className="pb-24 bg-background min-h-screen">
      <Navbar />
      
      <div className="mt-14 p-4">
        {/* Profile header */}
        <div className="flex items-center mb-8">
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mr-4 border-2 border-primary/30">
            <User size={24} className="text-primary" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold">HausaBox User</h2>
            <div className="flex items-center">
              <span className="text-muted-foreground text-sm">Free user</span>
              <Button
                onClick={handleUpgradeToVIP}
                size="sm"
                className="ml-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs"
              >
                <CreditCard size={12} className="mr-1" />
                Upgrade to VIP
              </Button>
            </div>
          </div>
        </div>
        
        {/* VIP banner */}
        <div className="bg-card rounded-lg mb-8 p-4 border border-border">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <div className="text-amber-500 mr-2">💎</div>
              <span className="font-semibold">VIP Premium</span>
              <span className="ml-2 px-2 py-0.5 bg-red-600 text-white text-xs rounded">24% OFF</span>
            </div>
            <span className="text-muted-foreground text-sm">Not activated</span>
          </div>
          <p className="text-sm text-muted-foreground mb-3">
            Unlock ad-free viewing, HD quality, and exclusive Hausa content
          </p>
          <div className="flex justify-end">
            <Button 
              onClick={handleUpgradeToVIP}
              className="bg-amber-500/20 text-amber-500 hover:bg-amber-500/30 border border-amber-500/50"
              variant="outline"
            >
              Activate Now
            </Button>
          </div>
        </div>

        {/* Offline & Download Settings */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Download & Offline</h3>
          <div className="bg-card rounded-lg border border-border">
            <ProfileItem 
              icon={offlineMode ? <WifiOff size={20} /> : <Wifi size={20} />} 
              title="Offline Mode" 
              rightElement={
                <Switch 
                  checked={offlineMode}
                  onCheckedChange={handleOfflineModeToggle}
                />
              }
            />
            <ProfileItem 
              icon={<Download size={20} />} 
              title="Auto-download new episodes" 
              rightElement={
                <Switch 
                  checked={autoDownload}
                  onCheckedChange={handleAutoDownloadToggle}
                />
              }
            />
            <ProfileItem 
              icon={<Download size={20} />} 
              title="Downloaded Content" 
              to="/downloads"
            />
          </div>
        </div>
        
        {/* Watch History */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Watch History</h3>
          <div className="bg-card rounded-lg p-4 border border-border">
            <Link to="/history" className="flex items-center justify-between">
              <div className="flex items-center">
                <Clock size={20} className="text-muted-foreground mr-3" />
                <span>Continue Watching</span>
              </div>
              <span className="text-muted-foreground">›</span>
            </Link>
            
            <div className="mt-4 flex space-x-3 overflow-x-auto scrollbar-none pb-2">
              {[1, 2, 3].map((item) => (
                <div key={item} className="min-w-[100px] w-[100px]">
                  <img 
                    src={`https://images.unsplash.com/photo-150067392298${item}-e212871fec22`} 
                    alt="Movie thumbnail" 
                    className="w-full h-[56px] object-cover rounded border border-border"
                  />
                  <p className="mt-1 text-xs text-muted-foreground truncate">Hausa Movie {item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Content section */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">My Content</h3>
          <div className="bg-card rounded-lg border border-border">
            <ProfileItem 
              icon={<BookmarkCheck size={20} />} 
              title="My Watchlist" 
              to="/my-list"
            />
            <ProfileItem 
              icon={<Download size={20} />} 
              title="Downloads" 
              to="/downloads"
            />
            <ProfileItem 
              icon={<Clock size={20} />} 
              title="Watch History" 
              to="/history"
            />
          </div>
        </div>
        
        {/* Preferences section */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Settings & Support</h3>
          <div className="bg-card rounded-lg border border-border">
            <ProfileItem 
              icon={<Settings size={20} />} 
              title="App Settings" 
              to="/settings"
            />
            <ProfileItem 
              icon={<HelpCircle size={20} />} 
              title="Help & Support" 
              to="/help"
            />
            <ProfileItem 
              icon={<Mail size={20} />} 
              title="Contact Us" 
              to="/contact"
            />
          </div>
        </div>
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default Profile;
