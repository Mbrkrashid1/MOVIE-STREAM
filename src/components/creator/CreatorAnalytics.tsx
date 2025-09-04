import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  Eye, 
  Clock, 
  ThumbsUp, 
  MessageCircle, 
  TrendingUp,
  Calendar,
  Globe
} from 'lucide-react';

interface CreatorAnalyticsProps {
  creatorId: string;
}

interface AnalyticsData {
  daily_views: any[];
  video_performance: any[];
  audience_retention: any[];
  earnings_trend: any[];
  top_videos: any[];
  demographics: any;
}

export function CreatorAnalytics({ creatorId }: CreatorAnalyticsProps) {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');

  useEffect(() => {
    fetchAnalytics();
  }, [creatorId, timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);

      // Calculate date range
      const endDate = new Date();
      const startDate = new Date();
      
      switch (timeRange) {
        case '7d':
          startDate.setDate(endDate.getDate() - 7);
          break;
        case '30d':
          startDate.setDate(endDate.getDate() - 30);
          break;
        case '90d':
          startDate.setDate(endDate.getDate() - 90);
          break;
        case '1y':
          startDate.setFullYear(endDate.getFullYear() - 1);
          break;
      }

      // Fetch video analytics data
      const { data: analyticsData } = await supabase
        .from('video_analytics')
        .select(`
          *,
          videos!inner(
            id,
            title,
            category,
            language,
            creator_id
          )
        `)
        .eq('videos.creator_id', creatorId)
        .gte('date', startDate.toISOString().split('T')[0])
        .lte('date', endDate.toISOString().split('T')[0])
        .order('date', { ascending: true });

      // Fetch video performance data
      const { data: videosData } = await supabase
        .from('videos')
        .select('*')
        .eq('creator_id', creatorId)
        .order('view_count', { ascending: false });

      // Process daily views data
      const dailyViews = processDateRangeData(analyticsData || [], startDate, endDate, 'views');
      
      // Process earnings trend
      const earningsTrend = processDateRangeData(analyticsData || [], startDate, endDate, 'ad_revenue_naira');

      // Get top performing videos
      const topVideos = (videosData || []).slice(0, 10).map(video => ({
        title: video.title.length > 30 ? video.title.substring(0, 30) + '...' : video.title,
        views: video.view_count,
        likes: video.like_count,
        comments: video.comment_count,
        watchTime: video.watch_time_minutes
      }));

      // Generate mock demographics data (in real app, this would come from user analytics)
      const demographics = {
        age_groups: [
          { name: '18-24', value: 35 },
          { name: '25-34', value: 40 },
          { name: '35-44', value: 15 },
          { name: '45+', value: 10 }
        ],
        locations: [
          { name: 'Lagos', value: 25 },
          { name: 'Kano', value: 20 },
          { name: 'Abuja', value: 15 },
          { name: 'Kaduna', value: 12 },
          { name: 'Others', value: 28 }
        ]
      };

      setAnalytics({
        daily_views: dailyViews,
        video_performance: topVideos,
        audience_retention: [], // Would be calculated from detailed viewing data
        earnings_trend: earningsTrend,
        top_videos: topVideos,
        demographics
      });

    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const processDateRangeData = (data: any[], startDate: Date, endDate: Date, field: string) => {
    const result = [];
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const dateStr = currentDate.toISOString().split('T')[0];
      const dayData = data.filter(item => item.date === dateStr);
      
      result.push({
        date: dateStr,
        value: dayData.reduce((sum, item) => sum + (Number(item[field]) || 0), 0),
        formattedDate: currentDate.toLocaleDateString('en-GB', { 
          month: 'short', 
          day: 'numeric' 
        })
      });
      
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return result;
  };

  const formatNaira = (value: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6'];

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <Card key={i} className="bg-streaming-card border-streaming-border">
            <CardContent className="p-6">
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-streaming-border rounded w-1/4"></div>
                <div className="h-32 bg-streaming-border rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!analytics) return null;

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-streaming-text">Analytics Dashboard</h2>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-32 bg-streaming-card border-streaming-border">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-streaming-card border-streaming-border">
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
            <SelectItem value="1y">Last year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 bg-streaming-card">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="audience">Audience</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Views Chart */}
          <Card className="bg-streaming-card border-streaming-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-streaming-text">
                <Eye className="w-5 h-5" />
                Views Over Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={analytics.daily_views}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    dataKey="formattedDate" 
                    stroke="#9ca3af"
                    fontSize={12}
                  />
                  <YAxis stroke="#9ca3af" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1f2937', 
                      border: '1px solid #374151',
                      color: '#f9fafb'
                    }}
                    formatter={(value) => [value.toLocaleString(), 'Views']}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#ef4444" 
                    fill="#ef4444"
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-streaming-card border-streaming-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-600/20 rounded-lg">
                    <Eye className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-streaming-muted">Total Views</p>
                    <p className="text-xl font-bold text-streaming-text">
                      {analytics.daily_views.reduce((sum, day) => sum + day.value, 0).toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-streaming-card border-streaming-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-600/20 rounded-lg">
                    <ThumbsUp className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm text-streaming-muted">Avg. Likes</p>
                    <p className="text-xl font-bold text-streaming-text">
                      {Math.round(analytics.top_videos.reduce((sum, v) => sum + v.likes, 0) / analytics.top_videos.length || 0)}
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
                      {Math.round(analytics.top_videos.reduce((sum, v) => sum + v.watchTime, 0) / 60)}h
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-streaming-card border-streaming-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-600/20 rounded-lg">
                    <MessageCircle className="w-5 h-5 text-orange-400" />
                  </div>
                  <div>
                    <p className="text-sm text-streaming-muted">Comments</p>
                    <p className="text-xl font-bold text-streaming-text">
                      {analytics.top_videos.reduce((sum, v) => sum + v.comments, 0)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="content">
          {/* Top Performing Videos */}
          <Card className="bg-streaming-card border-streaming-border">
            <CardHeader>
              <CardTitle className="text-streaming-text">Top Performing Videos</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={analytics.top_videos.slice(0, 6)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    dataKey="title" 
                    stroke="#9ca3af"
                    fontSize={12}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis stroke="#9ca3af" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1f2937', 
                      border: '1px solid #374151',
                      color: '#f9fafb'
                    }}
                    formatter={(value) => [value.toLocaleString(), 'Views']}
                  />
                  <Bar 
                    dataKey="views" 
                    fill="#ef4444"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audience">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Age Demographics */}
            <Card className="bg-streaming-card border-streaming-border">
              <CardHeader>
                <CardTitle className="text-streaming-text">Age Demographics</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={analytics.demographics.age_groups}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {analytics.demographics.age_groups.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Top Locations */}
            <Card className="bg-streaming-card border-streaming-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-streaming-text">
                  <Globe className="w-5 h-5" />
                  Top Locations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analytics.demographics.locations.map((location, index) => (
                    <div key={location.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span className="text-streaming-text">{location.name}</span>
                      </div>
                      <span className="text-streaming-muted">{location.value}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="revenue">
          {/* Revenue Trend */}
          <Card className="bg-streaming-card border-streaming-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-streaming-text">
                <TrendingUp className="w-5 h-5" />
                Revenue Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analytics.earnings_trend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    dataKey="formattedDate" 
                    stroke="#9ca3af"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="#9ca3af" 
                    fontSize={12}
                    tickFormatter={(value) => `₦${value}`}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1f2937', 
                      border: '1px solid #374151',
                      color: '#f9fafb'
                    }}
                    formatter={(value) => [formatNaira(Number(value)), 'Revenue']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#22c55e" 
                    strokeWidth={2}
                    dot={{ fill: '#22c55e', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}