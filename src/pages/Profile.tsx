
import { useState, useEffect } from "react";
import { User, Settings, Download, Shield, Bell, Moon, Sun, Smartphone, Wifi, Database, Play, Pause } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import BottomNavigation from "@/components/layout/BottomNavigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

const Profile = () => {
  const { toast } = useToast();
  
  // Profile state
  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "",
    bio: "",
  });

  // App preferences state
  const [appPreferences, setAppPreferences] = useState({
    theme: "dark",
    language: "english",
    notifications: true,
    autoPlay: true,
    dataUsage: "standard",
  });

  // Playback preferences state
  const [playbackPreferences, setPlaybackPreferences] = useState({
    quality: "auto",
    subtitles: true,
    autoNext: true,
    skipIntro: false,
    volume: 80,
  });

  // Download settings state
  const [downloadSettings, setDownloadSettings] = useState({
    downloadQuality: "hd",
    wifiOnly: true,
    maxDownloads: 5,
    autoDelete: true,
    dataSaver: false,
  });

  // Account settings state
  const [accountSettings, setAccountSettings] = useState({
    twoFactor: false,
    loginAlerts: true,
    dataSharing: false,
    analytics: true,
  });

  // Load settings from localStorage on component mount
  useEffect(() => {
    const savedAppPrefs = localStorage.getItem('appPreferences');
    const savedPlaybackPrefs = localStorage.getItem('playbackPreferences');
    const savedDownloadSettings = localStorage.getItem('downloadSettings');
    const savedAccountSettings = localStorage.getItem('accountSettings');
    const savedProfile = localStorage.getItem('userProfile');

    if (savedAppPrefs) setAppPreferences(JSON.parse(savedAppPrefs));
    if (savedPlaybackPrefs) setPlaybackPreferences(JSON.parse(savedPlaybackPrefs));
    if (savedDownloadSettings) setDownloadSettings(JSON.parse(savedDownloadSettings));
    if (savedAccountSettings) setAccountSettings(JSON.parse(savedAccountSettings));
    if (savedProfile) setProfile(JSON.parse(savedProfile));
  }, []);

  // Save settings to localStorage
  const saveSettings = (key: string, data: any) => {
    localStorage.setItem(key, JSON.stringify(data));
    toast({
      title: "Settings Updated",
      description: "Your preferences have been saved successfully.",
    });
  };

  const handleProfileUpdate = () => {
    saveSettings('userProfile', profile);
  };

  const handleAppPreferencesUpdate = (key: string, value: any) => {
    const updated = { ...appPreferences, [key]: value };
    setAppPreferences(updated);
    saveSettings('appPreferences', updated);
  };

  const handlePlaybackPreferencesUpdate = (key: string, value: any) => {
    const updated = { ...playbackPreferences, [key]: value };
    setPlaybackPreferences(updated);
    saveSettings('playbackPreferences', updated);
  };

  const handleDownloadSettingsUpdate = (key: string, value: any) => {
    const updated = { ...downloadSettings, [key]: value };
    setDownloadSettings(updated);
    saveSettings('downloadSettings', updated);
  };

  const handleAccountSettingsUpdate = (key: string, value: any) => {
    const updated = { ...accountSettings, [key]: value };
    setAccountSettings(updated);
    saveSettings('accountSettings', updated);
  };

  const handleLogout = () => {
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };

  const handleDeleteAccount = () => {
    toast({
      title: "Account Deletion",
      description: "Please contact support to delete your account.",
      variant: "destructive"
    });
  };

  return (
    <div className="pb-24 bg-background min-h-screen">
      <Navbar />
      
      <div className="mt-14 px-4 py-6 max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <User size={40} className="text-primary" />
          </div>
          <h1 className="text-2xl font-bold">{profile.name}</h1>
          <p className="text-muted-foreground">{profile.email}</p>
        </div>

        <div className="space-y-8">
          {/* Profile Settings */}
          <div className="bg-card rounded-lg p-6 border">
            <div className="flex items-center mb-4">
              <User className="mr-3" size={20} />
              <h2 className="text-xl font-semibold">Profile Information</h2>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    placeholder="Enter your email"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  placeholder="Enter your phone number"
                />
              </div>
              
              <div>
                <Label htmlFor="bio">Bio</Label>
                <Input
                  id="bio"
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  placeholder="Tell us about yourself"
                />
              </div>
              
              <Button onClick={handleProfileUpdate} className="w-full md:w-auto">
                Update Profile
              </Button>
            </div>
          </div>

          {/* App Preferences */}
          <div className="bg-card rounded-lg p-6 border">
            <div className="flex items-center mb-4">
              <Settings className="mr-3" size={20} />
              <h2 className="text-xl font-semibold">App Preferences</h2>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {appPreferences.theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
                  <div>
                    <Label>Theme</Label>
                    <p className="text-sm text-muted-foreground">Choose your preferred theme</p>
                  </div>
                </div>
                <Select
                  value={appPreferences.theme}
                  onValueChange={(value) => handleAppPreferencesUpdate('theme', value)}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Smartphone size={20} />
                  <div>
                    <Label>Language</Label>
                    <p className="text-sm text-muted-foreground">Select your preferred language</p>
                  </div>
                </div>
                <Select
                  value={appPreferences.language}
                  onValueChange={(value) => handleAppPreferencesUpdate('language', value)}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="hausa">Hausa</SelectItem>
                    <SelectItem value="yoruba">Yoruba</SelectItem>
                    <SelectItem value="igbo">Igbo</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Bell size={20} />
                  <div>
                    <Label>Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive updates about new content</p>
                  </div>
                </div>
                <Switch
                  checked={appPreferences.notifications}
                  onCheckedChange={(checked) => handleAppPreferencesUpdate('notifications', checked)}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Play size={20} />
                  <div>
                    <Label>Auto Play</Label>
                    <p className="text-sm text-muted-foreground">Automatically play next video</p>
                  </div>
                </div>
                <Switch
                  checked={appPreferences.autoPlay}
                  onCheckedChange={(checked) => handleAppPreferencesUpdate('autoPlay', checked)}
                />
              </div>
            </div>
          </div>

          {/* Playback Preferences */}
          <div className="bg-card rounded-lg p-6 border">
            <div className="flex items-center mb-4">
              <Play className="mr-3" size={20} />
              <h2 className="text-xl font-semibold">Playback Settings</h2>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Video Quality</Label>
                  <p className="text-sm text-muted-foreground">Default playback quality</p>
                </div>
                <Select
                  value={playbackPreferences.quality}
                  onValueChange={(value) => handlePlaybackPreferencesUpdate('quality', value)}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="auto">Auto</SelectItem>
                    <SelectItem value="hd">HD (1080p)</SelectItem>
                    <SelectItem value="sd">SD (720p)</SelectItem>
                    <SelectItem value="low">Low (480p)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label>Subtitles</Label>
                  <p className="text-sm text-muted-foreground">Show subtitles by default</p>
                </div>
                <Switch
                  checked={playbackPreferences.subtitles}
                  onCheckedChange={(checked) => handlePlaybackPreferencesUpdate('subtitles', checked)}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label>Auto Next Episode</Label>
                  <p className="text-sm text-muted-foreground">Automatically play next episode in series</p>
                </div>
                <Switch
                  checked={playbackPreferences.autoNext}
                  onCheckedChange={(checked) => handlePlaybackPreferencesUpdate('autoNext', checked)}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label>Skip Intro</Label>
                  <p className="text-sm text-muted-foreground">Automatically skip intro sequences</p>
                </div>
                <Switch
                  checked={playbackPreferences.skipIntro}
                  onCheckedChange={(checked) => handlePlaybackPreferencesUpdate('skipIntro', checked)}
                />
              </div>
            </div>
          </div>

          {/* Download Settings */}
          <div className="bg-card rounded-lg p-6 border">
            <div className="flex items-center mb-4">
              <Download className="mr-3" size={20} />
              <h2 className="text-xl font-semibold">Download & Offline</h2>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Download Quality</Label>
                  <p className="text-sm text-muted-foreground">Quality for downloaded content</p>
                </div>
                <Select
                  value={downloadSettings.downloadQuality}
                  onValueChange={(value) => handleDownloadSettingsUpdate('downloadQuality', value)}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hd">HD (1080p)</SelectItem>
                    <SelectItem value="sd">SD (720p)</SelectItem>
                    <SelectItem value="low">Low (480p)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Wifi size={20} />
                  <div>
                    <Label>WiFi Only Downloads</Label>
                    <p className="text-sm text-muted-foreground">Only download over WiFi connection</p>
                  </div>
                </div>
                <Switch
                  checked={downloadSettings.wifiOnly}
                  onCheckedChange={(checked) => handleDownloadSettingsUpdate('wifiOnly', checked)}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Database size={20} />
                  <div>
                    <Label>Data Saver Mode</Label>
                    <p className="text-sm text-muted-foreground">Reduce data usage for streaming</p>
                  </div>
                </div>
                <Switch
                  checked={downloadSettings.dataSaver}
                  onCheckedChange={(checked) => handleDownloadSettingsUpdate('dataSaver', checked)}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label>Max Downloads</Label>
                  <p className="text-sm text-muted-foreground">Maximum number of simultaneous downloads</p>
                </div>
                <Select
                  value={downloadSettings.maxDownloads.toString()}
                  onValueChange={(value) => handleDownloadSettingsUpdate('maxDownloads', parseInt(value))}
                >
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="3">3</SelectItem>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label>Auto Delete Downloads</Label>
                  <p className="text-sm text-muted-foreground">Delete downloads after watching</p>
                </div>
                <Switch
                  checked={downloadSettings.autoDelete}
                  onCheckedChange={(checked) => handleDownloadSettingsUpdate('autoDelete', checked)}
                />
              </div>
            </div>
          </div>

          {/* Account Settings */}
          <div className="bg-card rounded-lg p-6 border">
            <div className="flex items-center mb-4">
              <Shield className="mr-3" size={20} />
              <h2 className="text-xl font-semibold">Account & Security</h2>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">Add extra security to your account</p>
                </div>
                <Switch
                  checked={accountSettings.twoFactor}
                  onCheckedChange={(checked) => handleAccountSettingsUpdate('twoFactor', checked)}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label>Login Alerts</Label>
                  <p className="text-sm text-muted-foreground">Get notified of new login attempts</p>
                </div>
                <Switch
                  checked={accountSettings.loginAlerts}
                  onCheckedChange={(checked) => handleAccountSettingsUpdate('loginAlerts', checked)}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label>Data Sharing</Label>
                  <p className="text-sm text-muted-foreground">Share usage data for improvements</p>
                </div>
                <Switch
                  checked={accountSettings.dataSharing}
                  onCheckedChange={(checked) => handleAccountSettingsUpdate('dataSharing', checked)}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label>Analytics</Label>
                  <p className="text-sm text-muted-foreground">Help improve the app with usage analytics</p>
                </div>
                <Switch
                  checked={accountSettings.analytics}
                  onCheckedChange={(checked) => handleAccountSettingsUpdate('analytics', checked)}
                />
              </div>
            </div>
          </div>

          {/* Account Actions */}
          <div className="bg-card rounded-lg p-6 border">
            <h2 className="text-xl font-semibold mb-4">Account Actions</h2>
            <div className="space-y-4">
              <Button variant="outline" onClick={handleLogout} className="w-full">
                Sign Out
              </Button>
              <Button variant="destructive" onClick={handleDeleteAccount} className="w-full">
                Delete Account
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default Profile;
