
import { useState } from "react";
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Mock data for demonstration
const contentViewsData = [
  { name: "Mon", views: 4000 },
  { name: "Tue", views: 3000 },
  { name: "Wed", views: 5000 },
  { name: "Thu", views: 2780 },
  { name: "Fri", views: 1890 },
  { name: "Sat", views: 6390 },
  { name: "Sun", views: 3490 }
];

const adPerformanceData = [
  { name: "Ad 1", impressions: 4000, clicks: 2400 },
  { name: "Ad 2", impressions: 3000, clicks: 1398 },
  { name: "Ad 3", impressions: 2000, clicks: 980 },
  { name: "Ad 4", impressions: 2780, clicks: 1908 },
  { name: "Ad 5", impressions: 1890, clicks: 800 }
];

const audienceData = [
  { name: "18-24", value: 25 },
  { name: "25-34", value: 35 },
  { name: "35-44", value: 20 },
  { name: "45-54", value: 12 },
  { name: "55+", value: 8 }
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

const AnalyticsDashboard = () => {
  const [timeRange, setTimeRange] = useState("7days");

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Analytics Dashboard</h2>
        <Select defaultValue={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="24hours">Last 24 hours</SelectItem>
            <SelectItem value="7days">Last 7 days</SelectItem>
            <SelectItem value="30days">Last 30 days</SelectItem>
            <SelectItem value="90days">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Views</CardTitle>
            <CardDescription>Content views in the selected period</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">24,891</div>
            <p className="text-green-500 text-sm">↑ 12% from previous period</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Ad Impressions</CardTitle>
            <CardDescription>Total ad views</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">18,472</div>
            <p className="text-green-500 text-sm">↑ 8% from previous period</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>User Engagement</CardTitle>
            <CardDescription>Average watch time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">14:26</div>
            <p className="text-red-500 text-sm">↓ 3% from previous period</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="content">
        <TabsList className="mb-6">
          <TabsTrigger value="content">Content Performance</TabsTrigger>
          <TabsTrigger value="ads">Ad Performance</TabsTrigger>
          <TabsTrigger value="audience">Audience</TabsTrigger>
        </TabsList>
        
        <TabsContent value="content" className="bg-zinc-900 p-6 rounded-lg">
          <h3 className="text-xl font-medium mb-4">Content Views</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={contentViewsData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="views" 
                  stroke="#10B981" 
                  activeDot={{ r: 8 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </TabsContent>
        
        <TabsContent value="ads" className="bg-zinc-900 p-6 rounded-lg">
          <h3 className="text-xl font-medium mb-4">Ad Impressions & Clicks</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={adPerformanceData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="impressions" fill="#8884d8" />
                <Bar dataKey="clicks" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </TabsContent>
        
        <TabsContent value="audience" className="bg-zinc-900 p-6 rounded-lg">
          <h3 className="text-xl font-medium mb-4">Audience Demographics</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={audienceData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {audienceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsDashboard;
