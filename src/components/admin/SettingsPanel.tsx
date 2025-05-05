
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const SettingsPanel = () => {
  const { toast } = useToast();
  const [generalSettings, setGeneralSettings] = useState({
    siteName: "KannyFlix",
    siteDescription: "The home of Kannywood movies and series.",
    enableComments: true,
    enableAutoplay: true,
    maintenanceMode: false,
    analyticsEnabled: true
  });

  const [emailSettings, setEmailSettings] = useState({
    notificationEmail: "admin@kannyflix.com",
    welcomeEmailEnabled: true,
    digestEmailEnabled: false,
    digestFrequency: "weekly"
  });

  const handleGeneralSettingChange = (key: string, value: any) => {
    setGeneralSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleEmailSettingChange = (key: string, value: any) => {
    setEmailSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSaveSettings = (type: string) => {
    toast({
      title: "Settings Saved",
      description: `${type} settings have been updated successfully.`
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Settings</h2>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full md:w-auto md:inline-flex grid-cols-3 md:grid-cols-none">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="api">API Keys</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Manage your site settings and preferences.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="siteName">Site Name</Label>
                <Input 
                  id="siteName" 
                  value={generalSettings.siteName}
                  onChange={(e) => handleGeneralSettingChange("siteName", e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="siteDescription">Site Description</Label>
                <Input 
                  id="siteDescription" 
                  value={generalSettings.siteDescription}
                  onChange={(e) => handleGeneralSettingChange("siteDescription", e.target.value)}
                />
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="enableComments">Enable Comments</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow users to comment on content
                    </p>
                  </div>
                  <Switch 
                    id="enableComments"
                    checked={generalSettings.enableComments}
                    onCheckedChange={(checked) => handleGeneralSettingChange("enableComments", checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="enableAutoplay">Enable Autoplay</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically play videos when a user visits a page
                    </p>
                  </div>
                  <Switch 
                    id="enableAutoplay"
                    checked={generalSettings.enableAutoplay}
                    onCheckedChange={(checked) => handleGeneralSettingChange("enableAutoplay", checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="maintenanceMode" className="text-destructive">Maintenance Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Put the site in maintenance mode (only admins can access)
                    </p>
                  </div>
                  <Switch 
                    id="maintenanceMode"
                    checked={generalSettings.maintenanceMode}
                    onCheckedChange={(checked) => handleGeneralSettingChange("maintenanceMode", checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="analyticsEnabled">Enable Analytics</Label>
                    <p className="text-sm text-muted-foreground">
                      Track user behavior and content performance
                    </p>
                  </div>
                  <Switch 
                    id="analyticsEnabled"
                    checked={generalSettings.analyticsEnabled}
                    onCheckedChange={(checked) => handleGeneralSettingChange("analyticsEnabled", checked)}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => handleSaveSettings("General")}>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="email">
          <Card>
            <CardHeader>
              <CardTitle>Email Settings</CardTitle>
              <CardDescription>
                Configure email notifications and settings.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="notificationEmail">Notification Email</Label>
                <Input 
                  id="notificationEmail" 
                  value={emailSettings.notificationEmail}
                  onChange={(e) => handleEmailSettingChange("notificationEmail", e.target.value)}
                />
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="welcomeEmailEnabled">Welcome Email</Label>
                    <p className="text-sm text-muted-foreground">
                      Send an email when a new user registers
                    </p>
                  </div>
                  <Switch 
                    id="welcomeEmailEnabled"
                    checked={emailSettings.welcomeEmailEnabled}
                    onCheckedChange={(checked) => handleEmailSettingChange("welcomeEmailEnabled", checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="digestEmailEnabled">Weekly Digest</Label>
                    <p className="text-sm text-muted-foreground">
                      Send a weekly content digest to subscribers
                    </p>
                  </div>
                  <Switch 
                    id="digestEmailEnabled"
                    checked={emailSettings.digestEmailEnabled}
                    onCheckedChange={(checked) => handleEmailSettingChange("digestEmailEnabled", checked)}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => handleSaveSettings("Email")}>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="api">
          <Card>
            <CardHeader>
              <CardTitle>API Keys</CardTitle>
              <CardDescription>
                Manage API keys for external services.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="apiKey">API Key</Label>
                <div className="flex space-x-2">
                  <Input 
                    id="apiKey" 
                    value="•••••••••••••••••••••••••••••"
                    readOnly
                  />
                  <Button variant="outline">Copy</Button>
                  <Button variant="outline">Regenerate</Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Last used: 2 days ago
                </p>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <Label htmlFor="webhookUrl">Webhook URL</Label>
                <Input 
                  id="webhookUrl" 
                  placeholder="https://your-service.com/webhook"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => handleSaveSettings("API")}>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPanel;
