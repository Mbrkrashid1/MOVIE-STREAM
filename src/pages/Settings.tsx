
import { ArrowLeft, Palette, Volume2, Globe, Shield, Smartphone, Wifi } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const SettingsItem = ({ icon, title, description, children }: {
  icon: React.ReactNode;
  title: string;
  description?: string;
  children: React.ReactNode;
}) => {
  return (
    <div className="flex items-center justify-between py-4 border-b border-border/20">
      <div className="flex items-start space-x-3">
        <div className="text-muted-foreground mt-1">
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="text-white font-medium">{title}</h3>
          {description && (
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          )}
        </div>
      </div>
      <div className="ml-4">
        {children}
      </div>
    </div>
  );
};

const Settings = () => {
  const { toast } = useToast();
  const [darkMode, setDarkMode] = useState(true);
  const [autoPlay, setAutoPlay] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [dataCompression, setDataCompression] = useState(false);
  const [volume, setVolume] = useState([80]);
  const [language, setLanguage] = useState("en");
  const [videoQuality, setVideoQuality] = useState("auto");

  const handleSettingChange = (setting: string, value: any) => {
    toast({
      title: "Settings Updated",
      description: `${setting} has been updated successfully.`,
    });
  };

  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="sticky top-0 z-40 bg-black/90 backdrop-blur-sm border-b border-border/20">
        <div className="flex items-center p-4">
          <Link to="/profile">
            <Button variant="ghost" size="sm" className="mr-3">
              <ArrowLeft size={20} />
            </Button>
          </Link>
          <h1 className="text-xl font-bold text-white">Settings</h1>
        </div>
      </div>

      <div className="p-4 space-y-8">
        {/* Appearance */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-4">Appearance</h2>
          <div className="bg-card/80 backdrop-blur-sm rounded-lg border border-border/30 px-4">
            <SettingsItem
              icon={<Palette size={20} />}
              title="Dark Mode"
              description="Switch between light and dark themes"
            >
              <Switch
                checked={darkMode}
                onCheckedChange={(checked) => {
                  setDarkMode(checked);
                  handleSettingChange("Dark Mode", checked);
                }}
              />
            </SettingsItem>
          </div>
        </div>

        {/* Playback */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-4">Playback</h2>
          <div className="bg-card/80 backdrop-blur-sm rounded-lg border border-border/30 px-4">
            <SettingsItem
              icon={<Volume2 size={20} />}
              title="Volume"
              description="Default playback volume"
            >
              <div className="w-24">
                <Slider
                  value={volume}
                  onValueChange={(value) => {
                    setVolume(value);
                    handleSettingChange("Volume", value[0]);
                  }}
                  max={100}
                  step={1}
                />
              </div>
            </SettingsItem>
            
            <SettingsItem
              icon={<Smartphone size={20} />}
              title="Auto-play"
              description="Automatically play next episode"
            >
              <Switch
                checked={autoPlay}
                onCheckedChange={(checked) => {
                  setAutoPlay(checked);
                  handleSettingChange("Auto-play", checked);
                }}
              />
            </SettingsItem>

            <SettingsItem
              icon={<Smartphone size={20} />}
              title="Video Quality"
              description="Default video quality setting"
            >
              <Select value={videoQuality} onValueChange={(value) => {
                setVideoQuality(value);
                handleSettingChange("Video Quality", value);
              }}>
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto">Auto</SelectItem>
                  <SelectItem value="1080p">1080p</SelectItem>
                  <SelectItem value="720p">720p</SelectItem>
                  <SelectItem value="480p">480p</SelectItem>
                </SelectContent>
              </Select>
            </SettingsItem>
          </div>
        </div>

        {/* Language & Region */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-4">Language & Region</h2>
          <div className="bg-card/80 backdrop-blur-sm rounded-lg border border-border/30 px-4">
            <SettingsItem
              icon={<Globe size={20} />}
              title="Language"
              description="Choose your preferred language"
            >
              <Select value={language} onValueChange={(value) => {
                setLanguage(value);
                handleSettingChange("Language", value);
              }}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="ha">Hausa</SelectItem>
                  <SelectItem value="yo">Yoruba</SelectItem>
                  <SelectItem value="ig">Igbo</SelectItem>
                </SelectContent>
              </Select>
            </SettingsItem>
          </div>
        </div>

        {/* Data & Storage */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-4">Data & Storage</h2>
          <div className="bg-card/80 backdrop-blur-sm rounded-lg border border-border/30 px-4">
            <SettingsItem
              icon={<Wifi size={20} />}
              title="Data Compression"
              description="Reduce data usage when streaming"
            >
              <Switch
                checked={dataCompression}
                onCheckedChange={(checked) => {
                  setDataCompression(checked);
                  handleSettingChange("Data Compression", checked);
                }}
              />
            </SettingsItem>
          </div>
        </div>

        {/* Privacy & Security */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-4">Privacy & Security</h2>
          <div className="bg-card/80 backdrop-blur-sm rounded-lg border border-border/30 px-4">
            <SettingsItem
              icon={<Shield size={20} />}
              title="Push Notifications"
              description="Receive updates and recommendations"
            >
              <Switch
                checked={notifications}
                onCheckedChange={(checked) => {
                  setNotifications(checked);
                  handleSettingChange("Notifications", checked);
                }}
              />
            </SettingsItem>
          </div>
        </div>

        {/* App Info */}
        <div className="text-center text-muted-foreground text-sm mt-8 pb-8">
          <p>HausaBox Settings</p>
          <p className="mt-1">Version 1.0.0</p>
        </div>
      </div>
    </div>
  );
};

export default Settings;
