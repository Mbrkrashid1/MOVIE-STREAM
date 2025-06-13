
import { Settings, List, Download, Clock, BookmarkCheck, HelpCircle, Mail, Wifi, WifiOff, User, LogOut, Edit } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import BottomNavigation from "@/components/layout/BottomNavigation";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const ProfileItem = ({ icon, title, to, onClick, rightElement }: { 
  icon: React.ReactNode, 
  title: string, 
  to?: string,
  onClick?: () => void,
  rightElement?: React.ReactNode 
}) => {
  const content = (
    <div className="flex items-center py-4 border-b border-border/20 hover:bg-muted/30 transition-colors rounded-lg px-2">
      <div className="mr-4 text-muted-foreground">
        {icon}
      </div>
      <div className="flex-1">{title}</div>
      {rightElement || <div className="text-muted-foreground">›</div>}
    </div>
  );

  if (to) {
    return <Link to={to} className="block">{content}</Link>;
  }

  return (
    <button onClick={onClick} className="w-full text-left">
      {content}
    </button>
  );
};

const Profile = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [offlineMode, setOfflineMode] = useState(false);
  const [autoDownload, setAutoDownload] = useState(false);

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

  const handleEditProfile = () => {
    toast({
      title: "Edit Profile",
      description: "Profile editing feature coming soon!",
    });
  };

  const handleLogout = () => {
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    // Add actual logout logic here
    navigate("/");
  };

  const handleContactUs = () => {
    toast({
      title: "Contact Support",
      description: "Opening support chat...",
    });
    // Add contact functionality here
  };

  const handleHelp = () => {
    toast({
      title: "Help Center",
      description: "Opening help documentation...",
    });
    // Add help functionality here
  };

  const handleSettings = () => {
    toast({
      title: "Settings",
      description: "Opening app settings...",
    });
    // Navigate to settings or open settings modal
  };

  return (
    <div className="pb-24 bg-zinc-950 min-h-screen">
      <Navbar />
      
      <div className="mt-14 p-4">
        {/* Enhanced Profile header with HausaBox branding */}
        <div className="relative mb-8 p-6 rounded-xl bg-gradient-to-br from-primary/10 via-transparent to-background/5 backdrop-blur-sm border border-primary/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Avatar className="w-16 h-16 mr-4 border-2 border-primary/20">
                <AvatarImage src="" />
                <AvatarFallback className="bg-gradient-to-br from-primary/30 to-primary/10 text-primary">
                  <User size={24} />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-white">HausaBox User</h2>
                <span className="text-muted-foreground text-sm">Free Account</span>
                <p className="text-xs text-muted-foreground mt-1">user@hausabox.com</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleEditProfile}
              className="text-primary hover:bg-primary/10"
            >
              <Edit size={16} />
            </Button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 text-white">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <Link to="/admin" className="block">
              <div className="bg-card/80 backdrop-blur-sm rounded-lg p-4 border border-border/30 hover:border-primary/50 transition-colors text-center">
                <Settings size={24} className="mx-auto mb-2 text-primary" />
                <span className="text-sm text-white">Admin Panel</span>
              </div>
            </Link>
            <button onClick={handleLogout} className="block w-full">
              <div className="bg-card/80 backdrop-blur-sm rounded-lg p-4 border border-border/30 hover:border-destructive/50 transition-colors text-center">
                <LogOut size={24} className="mx-auto mb-2 text-destructive" />
                <span className="text-sm text-white">Logout</span>
              </div>
            </button>
          </div>
        </div>

        {/* Offline & Download Settings */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 text-white">Download & Offline</h3>
          <div className="bg-card/80 backdrop-blur-sm rounded-lg border border-border/30">
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
          <h3 className="text-lg font-semibold mb-4 text-white">Watch History</h3>
          <div className="bg-card/80 backdrop-blur-sm rounded-lg border border-border/30">
            <ProfileItem 
              icon={<Clock size={20} />} 
              title="Continue Watching" 
              to="/history"
            />
            <ProfileItem 
              icon={<List size={20} />} 
              title="Watch History" 
              to="/history"
            />
          </div>
        </div>
        
        {/* Content section */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 text-white">My Content</h3>
          <div className="bg-card/80 backdrop-blur-sm rounded-lg border border-border/30">
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
        
        {/* Settings & Support section */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 text-white">Settings & Support</h3>
          <div className="bg-card/80 backdrop-blur-sm rounded-lg border border-border/30">
            <ProfileItem 
              icon={<Settings size={20} />} 
              title="App Settings" 
              onClick={handleSettings}
            />
            <ProfileItem 
              icon={<HelpCircle size={20} />} 
              title="Help & Support" 
              onClick={handleHelp}
            />
            <ProfileItem 
              icon={<Mail size={20} />} 
              title="Contact Us" 
              onClick={handleContactUs}
            />
          </div>
        </div>

        {/* Account Management */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 text-white">Account</h3>
          <div className="bg-card/80 backdrop-blur-sm rounded-lg border border-border/30">
            <ProfileItem 
              icon={<User size={20} />} 
              title="Edit Profile" 
              onClick={handleEditProfile}
            />
            <ProfileItem 
              icon={<LogOut size={20} />} 
              title="Logout" 
              onClick={handleLogout}
            />
          </div>
        </div>

        {/* HausaBox Info */}
        <div className="text-center text-muted-foreground text-sm mt-8">
          <p>HausaBox - Your Premium Hausa Entertainment Platform</p>
          <p className="mt-1">Version 1.0.0</p>
        </div>
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default Profile;
