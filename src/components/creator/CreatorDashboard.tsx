import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Upload, 
  PlayCircle, 
  Eye, 
  Users, 
  DollarSign, 
  TrendingUp,
  Clock,
  ThumbsUp,
  MessageCircle
} from 'lucide-react';
import { VideoUploadForm } from './VideoUploadForm';
import { CreatorAnalytics } from './CreatorAnalytics';
import { EarningsOverview } from './EarningsOverview';
import { useToast } from '@/hooks/use-toast';

interface CreatorProfile {
  id: string;
  channel_name: string;
  channel_description: string;
  kyc_status: string;
  monetization_enabled: boolean;
  subscriber_count: number;
  total_views: number;
  total_watch_time_minutes: number;
}

interface Video {
  id: string;
  title: string;
  view_count: number;
  like_count: number;
  comment_count: number;
  upload_date: string;
  status: string;
  monetization_enabled: boolean;
}

export function CreatorDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [creatorProfile, setCreatorProfile] = useState<CreatorProfile | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [showUploadForm, setShowUploadForm] = useState(false);

  useEffect(() => {
    if (user) {
      fetchCreatorProfile();
      fetchVideos();
    }
  }, [user]);

  const fetchCreatorProfile = async () => {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (profile?.user_role !== 'creator') {
        // Check if user needs to become a creator
        return;
      }

      const { data: creatorData } = await supabase
        .from('creator_profiles')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      setCreatorProfile(creatorData);
    } catch (error) {
      console.error('Error fetching creator profile:', error);
    }
  };

  const fetchVideos = async () => {
    try {
      const { data } = await supabase
        .from('videos')
        .select('*')
        .order('upload_date', { ascending: false });

      setVideos(data || []);
    } catch (error) {
      console.error('Error fetching videos:', error);
    } finally {
      setLoading(false);
    }
  };

  const becomeCreator = async () => {
    try {
      // Update user role
      await supabase
        .from('profiles')
        .update({ user_role: 'creator' })
        .eq('id', user?.id);

      // Create creator profile
      const { error } = await supabase
        .from('creator_profiles')
        .insert({
          user_id: user?.id,
          channel_name: `${user?.email?.split('@')[0]} Channel`,
          channel_description: 'Welcome to my channel!'
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Creator profile created! You can now upload videos."
      });

      fetchCreatorProfile();
    } catch (error) {
      console.error('Error creating creator profile:', error);
      toast({
        title: "Error",
        description: "Failed to create creator profile",
        variant: "destructive"
      });
    }
  };

  const formatNaira = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(amount);
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-streaming-darker">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-streaming-accent"></div>
      </div>
    );
  }

  if (!creatorProfile) {
    return (
      <div className="min-h-screen bg-streaming-darker text-streaming-text flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-streaming-card border-streaming-border">
          <CardHeader className="text-center">
            <CardTitle className="text-streaming-text">Become a Creator</CardTitle>
            <p className="text-streaming-muted text-sm">
              Join thousands of creators sharing Hausa content and earning in Naira
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2 text-sm text-streaming-muted">
              <div className="flex items-center gap-2">
                <Upload className="w-4 h-4" />
                <span>Upload unlimited videos</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                <span>Earn money from views and ads</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                <span>Detailed analytics and insights</span>
              </div>
            </div>
            <Button onClick={becomeCreator} className="w-full bg-streaming-accent hover:bg-streaming-accent/90">
              Create Creator Profile
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-streaming-darker text-streaming-text">
      <div className="container mx-auto p-4 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-streaming-text">Creator Studio</h1>
            <p className="text-streaming-muted">Welcome back, {creatorProfile.channel_name}</p>
          </div>
          
          <div className="flex items-center gap-3">
            <Badge 
              variant={creatorProfile.kyc_status === 'approved' ? 'default' : 'secondary'}
              className="capitalize"
            >
              KYC: {creatorProfile.kyc_status}
            </Badge>
            
            {creatorProfile.monetization_enabled && (
              <Badge className="bg-green-600">
                Monetization Enabled
              </Badge>
            )}

            <Button 
              onClick={() => setShowUploadForm(true)} 
              className="bg-streaming-accent hover:bg-streaming-accent/90"
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload Video
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-streaming-card border-streaming-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-600/20 rounded-lg">
                  <Eye className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-streaming-muted">Total Views</p>
                  <p className="text-xl font-bold text-streaming-text">
                    {creatorProfile.total_views.toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-streaming-card border-streaming-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-600/20 rounded-lg">
                  <Users className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-streaming-muted">Subscribers</p>
                  <p className="text-xl font-bold text-streaming-text">
                    {creatorProfile.subscriber_count.toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-streaming-card border-streaming-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-600/20 rounded-lg">
                  <Clock className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-streaming-muted">Watch Time</p>
                  <p className="text-xl font-bold text-streaming-text">
                    {formatDuration(creatorProfile.total_watch_time_minutes)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-streaming-card border-streaming-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-600/20 rounded-lg">
                  <PlayCircle className="w-5 h-5 text-orange-400" />
                </div>
                <div>
                  <p className="text-sm text-streaming-muted">Videos</p>
                  <p className="text-xl font-bold text-streaming-text">
                    {videos.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 bg-streaming-card">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="videos">Videos</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="earnings">Earnings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-streaming-card border-streaming-border">
                <CardHeader>
                  <CardTitle className="text-streaming-text">Recent Videos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {videos.slice(0, 5).map((video) => (
                      <div key={video.id} className="flex items-center gap-3 p-2 rounded-lg bg-streaming-darker/50">
                        <div className="w-12 h-8 bg-streaming-border rounded flex items-center justify-center">
                          <PlayCircle className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-streaming-text truncate">
                            {video.title}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-streaming-muted">
                            <span className="flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              {video.view_count}
                            </span>
                            <span className="flex items-center gap-1">
                              <ThumbsUp className="w-3 h-3" />
                              {video.like_count}
                            </span>
                            <span className="flex items-center gap-1">
                              <MessageCircle className="w-3 h-3" />
                              {video.comment_count}
                            </span>
                          </div>
                        </div>
                        <Badge variant={video.status === 'published' ? 'default' : 'secondary'}>
                          {video.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <EarningsOverview creatorId={creatorProfile.id} />
            </div>
          </TabsContent>

          <TabsContent value="videos">
            <Card className="bg-streaming-card border-streaming-border">
              <CardHeader>
                <CardTitle className="text-streaming-text">Your Videos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {videos.map((video) => (
                    <div key={video.id} className="flex items-center gap-4 p-4 rounded-lg bg-streaming-darker/50">
                      <div className="w-20 h-12 bg-streaming-border rounded flex items-center justify-center">
                        <PlayCircle className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-streaming-text">{video.title}</h3>
                        <div className="flex items-center gap-4 text-sm text-streaming-muted mt-1">
                          <span>Views: {video.view_count.toLocaleString()}</span>
                          <span>Uploaded: {new Date(video.upload_date).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={video.status === 'published' ? 'default' : 'secondary'}>
                          {video.status}
                        </Badge>
                        {video.monetization_enabled && (
                          <Badge className="bg-green-600">₦</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <CreatorAnalytics creatorId={creatorProfile.id} />
          </TabsContent>

          <TabsContent value="earnings">
            <EarningsOverview creatorId={creatorProfile.id} detailed={true} />
          </TabsContent>
        </Tabs>
      </div>

      {/* Upload Modal */}
      {showUploadForm && (
        <VideoUploadForm 
          creatorId={creatorProfile.id}
          onClose={() => setShowUploadForm(false)}
          onSuccess={() => {
            setShowUploadForm(false);
            fetchVideos();
          }}
        />
      )}
    </div>
  );
}