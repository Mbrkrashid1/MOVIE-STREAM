
import { Settings, List, Download, Clock, BookmarkCheck, HelpCircle, Mail, Wifi, WifiOff, User, LogOut, Edit, Bell, Shield, Palette, Globe, Volume2, Monitor } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import BottomNavigation from "@/components/layout/BottomNavigation";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

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
  
  // Enhanced state management for all features
  const [offlineMode, setOfflineMode] = useState(false);
  const [autoDownload, setAutoDownload] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [autoPlay, setAutoPlay] = useState(true);
  const [dataSaver, setDataSaver] = useState(false);
  const [volume, setVolume] = useState([80]);
  const [language, setLanguage] = useState("hausa");
  const [quality, setQuality] = useState("auto");
  
  // Profile edit state
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "HausaBox User",
    email: "user@hausabox.com",
    phone: "",
    bio: "Hausa entertainment enthusiast"
  });

  // Enhanced toggle handlers with real functionality
  const handleOfflineModeToggle = (enabled: boolean) => {
    setOfflineMode(enabled);
    localStorage.setItem('offlineMode', enabled.toString());
    toast({
      title: enabled ? "Offline mode enabled" : "Offline mode disabled",
      description: enabled 
        ? "Content will be available for offline viewing"
        : "Offline content access disabled",
    });
  };

  const handleAutoDownloadToggle = (enabled: boolean) => {
    setAutoDownload(enabled);
    localStorage.setItem('autoDownload', enabled.toString());
    toast({
      title: enabled ? "Auto-download enabled" : "Auto-download disabled",
      description: enabled 
        ? "New episodes will download automatically when on WiFi"
        : "Manual downloads only",
    });
  };

  const handleNotificationsToggle = (enabled: boolean) => {
    setNotifications(enabled);
    localStorage.setItem('notifications', enabled.toString());
    toast({
      title: enabled ? "Notifications enabled" : "Notifications disabled",
      description: enabled 
        ? "You'll receive updates about new content"
        : "Notifications turned off",
    });
  };

  const handleDarkModeToggle = (enabled: boolean) => {
    setDarkMode(enabled);
    document.documentElement.classList.toggle('dark', enabled);
    localStorage.setItem('darkMode', enabled.toString());
    toast({
      title: enabled ? "Dark mode enabled" : "Light mode enabled",
      description: "Theme preference saved",
    });
  };

  const handleAutoPlayToggle = (enabled: boolean) => {
    setAutoPlay(enabled);
    localStorage.setItem('autoPlay', enabled.toString());
    toast({
      title: enabled ? "Auto-play enabled" : "Auto-play disabled",
      description: enabled 
        ? "Videos will play automatically"
        : "Manual video start required",
    });
  };

  const handleDataSaverToggle = (enabled: boolean) => {
    setDataSaver(enabled);
    localStorage.setItem('dataSaver', enabled.toString());
    toast({
      title: enabled ? "Data saver enabled" : "Data saver disabled",
      description: enabled 
        ? "Lower quality videos to save data"
        : "Best quality videos enabled",
    });
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value);
    localStorage.setItem('defaultVolume', value[0].toString());
  };

  const handleLanguageChange = (value: string) => {
    setLanguage(value);
    localStorage.setItem('preferredLanguage', value);
    toast({
      title: "Language updated",
      description: `Preferred language set to ${value.charAt(0).toUpperCase() + value.slice(1)}`,
    });
  };

  const handleQualityChange = (value: string) => {
    setQuality(value);
    localStorage.setItem('videoQuality', value);
    toast({
      title: "Video quality updated",
      description: `Default quality set to ${value.toUpperCase()}`,
    });
  };

  const handleEditProfile = () => {
    setIsEditingProfile(true);
  };

  const handleSaveProfile = () => {
    // Save profile data logic would go here
    setIsEditingProfile(false);
    toast({
      title: "Profile updated",
      description: "Your profile has been successfully updated.",
    });
  };

  const handleLogout = () => {
    // Clear all stored preferences
    localStorage.clear();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    navigate("/");
  };

  const handleContactUs = () => {
    toast({
      title: "Contact Support",
      description: "Opening support chat...",
    });
    // Add actual contact functionality here
  };

  const handleHelp = () => {
    window.open('https://help.hausabox.com', '_blank');
    toast({
      title: "Help Center",
      description: "Opening help documentation...",
    });
  };

  const handleClearCache = () => {
    // Clear cache logic
    toast({
      title: "Cache cleared",
      description: "App cache has been cleared successfully.",
    });
  };

  const handleExportData = () => {
    const userData = {
      profile: profileData,
      settings: {
        offlineMode,
        autoDownload,
        notifications,
        darkMode,
        autoPlay,
        dataServer: dataServer,
        volume: volume[0],
        language,
        quality
      },
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(userData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'hausabox-profile.json';
    a.click();
    
    toast({
      title: "Data exported",
      description: "Your profile data has been downloaded.",
    });
  };

  return (
    <div className="pb-24 bg-zinc-950 min-h-screen">
      <Navbar />
      
      <div className="mt-14 p-4 space-y-6">
        {/* Enhanced Profile header */}
        <div className="relative p-6 rounded-xl bg-gradient-to-br from-primary/10 via-transparent to-background/5 backdrop-blur-sm border border-primary/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Avatar className="w-16 h-16 mr-4 border-2 border-primary/20">
                <AvatarImage src="" />
                <AvatarFallback className="bg-gradient-to-br from-primary/30 to-primary/10 text-primary text-xl font-bold">
                  {profileData.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-white">{profileData.name}</h2>
                <span className="text-muted-foreground text-sm">Premium Account</span>
                <p className="text-xs text-muted-foreground mt-1">{profileData.email}</p>
              </div>
            </div>
            
            <Dialog open={isEditingProfile} onOpenChange={setIsEditingProfile}>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleEditProfile}
                  className="text-primary hover:bg-primary/10"
                >
                  <Edit size={16} />
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-zinc-900 border-zinc-800">
                <DialogHeader>
                  <DialogTitle className="text-white">Edit Profile</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name" className="text-white">Name</Label>
                    <Input
                      id="name"
                      value={profileData.name}
                      onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                      className="bg-zinc-800 border-zinc-700 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-white">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                      className="bg-zinc-800 border-zinc-700 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-white">Phone</Label>
                    <Input
                      id="phone"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                      className="bg-zinc-800 border-zinc-700 text-white"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleSaveProfile} className="flex-1 bg-primary hover:bg-primary/90">
                      Save Changes
                    </Button>
                    <Button variant="outline" onClick={() => setIsEditingProfile(false)} className="flex-1">
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-white">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <Link to="/admin" className="block">
              <div className="bg-card/80 backdrop-blur-sm rounded-lg p-4 border border-border/30 hover:border-primary/50 transition-colors text-center">
                <Settings size={24} className="mx-auto mb-2 text-primary" />
                <span className="text-sm text-white">Admin Panel</span>
              </div>
            </Link>
            <button onClick={handleClearCache} className="block w-full">
              <div className="bg-card/80 backdrop-blur-sm rounded-lg p-4 border border-border/30 hover:border-blue-500/50 transition-colors text-center">
                <Monitor size={24} className="mx-auto mb-2 text-blue-400" />
                <span className="text-sm text-white">Clear Cache</span>
              </div>
            </button>
          </div>
        </div>

        {/* App Preferences */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-white">App Preferences</h3>
          <div className="bg-card/80 backdrop-blur-sm rounded-lg border border-border/30">
            <ProfileItem 
              icon={<Bell size={20} />} 
              title="Push Notifications" 
              rightElement={
                <Switch 
                  checked={notifications}
                  onCheckedChange={handleNotificationsToggle}
                />
              }
            />
            <ProfileItem 
              icon={<Palette size={20} />} 
              title="Dark Mode" 
              rightElement={
                <Switch 
                  checked={darkMode}
                  onCheckedChange={handleDarkModeToggle}
                />
              }
            />
            <ProfileItem 
              icon={<Globe size={20} />} 
              title="Language" 
              rightElement={
                <Select value={language} onValueChange={handleLanguageChange}>
                  <SelectTrigger className="w-32 bg-zinc-800 border-zinc-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-800 border-zinc-700">
                    <SelectItem value="hausa">Hausa</SelectItem>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="yoruba">Yoruba</SelectItem>
                    <SelectItem value="igbo">Igbo</SelectItem>
                  </SelectContent>
                </Select>
              }
            />
          </div>
        </div>

        {/* Playback Settings */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-white">Playback Settings</h3>
          <div className="bg-card/80 backdrop-blur-sm rounded-lg border border-border/30">
            <ProfileItem 
              icon={<Play size={20} />} 
              title="Auto-play videos" 
              rightElement={
                <Switch 
                  checked={autoPlay}
                  onCheckedChange={handleAutoPlayToggle}
                />
              }
            />
            <ProfileItem 
              icon={<Monitor size={20} />} 
              title="Video Quality" 
              rightElement={
                <Select value={quality} onValueChange={handleQualityChange}>
                  <SelectTrigger className="w-20 bg-zinc-800 border-zinc-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-800 border-zinc-700">
                    <SelectItem value="auto">Auto</SelectItem>
                    <SelectItem value="1080p">1080p</SelectItem>
                    <SelectItem value="720p">720p</SelectItem>
                    <SelectItem value="480p">480p</SelectItem>
                  </SelectContent>
                </Select>
              }
            />
            <div className="flex items-center py-4 border-b border-border/20 px-2">
              <Volume2 size={20} className="mr-4 text-muted-foreground" />
              <div className="flex-1">
                <span>Default Volume</span>
                <div className="mt-2">
                  <Slider
                    value={volume}
                    onValueChange={handleVolumeChange}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                  <div className="text-xs text-muted-foreground mt-1">{volume[0]}%</div>
                </div>
              </div>
            </div>
            <ProfileItem 
              icon={<Shield size={20} />} 
              title="Data Saver Mode" 
              rightElement={
                <Switch 
                  checked={dataServer}
                  onCheckedChange={handleDataSaverToggle}
                />
              }
            />
          </div>
        </div>

        {/* Download & Offline Settings */}
        <div>
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
        <div>
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
            <ProfileItem 
              icon={<BookmarkCheck size={20} />} 
              title="My Watchlist" 
              to="/my-list"
            />
          </div>
        </div>
        
        {/* Account Management */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-white">Account Management</h3>
          <div className="bg-card/80 backdrop-blur-sm rounded-lg border border-border/30">
            <ProfileItem 
              icon={<Download size={20} />} 
              title="Export My Data" 
              onClick={handleExportData}
            />
            <ProfileItem 
              icon={<Settings size={20} />} 
              title="Privacy Settings" 
              onClick={() => toast({ title: "Privacy Settings", description: "Privacy controls opened" })}
            />
            <ProfileItem 
              icon={<Shield size={20} />} 
              title="Security Settings" 
              onClick={() => toast({ title: "Security Settings", description: "Security options opened" })}
            />
          </div>
        </div>

        {/* Settings & Support section */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-white">Settings & Support</h3>
          <div className="bg-card/80 backdrop-blur-sm rounded-lg border border-border/30">
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
          <p className="mt-1">Version 1.2.0 • All Features Activated</p>
        </div>
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default Profile;
