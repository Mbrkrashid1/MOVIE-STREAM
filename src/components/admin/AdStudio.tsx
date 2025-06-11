
import { useState } from "react";
import { Plus, TrendingUp, DollarSign, Eye, Clock, Target, Play, Pause, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";

const AdStudio = () => {
  const [selectedCampaign, setSelectedCampaign] = useState<string | null>(null);

  const campaignStats = [
    {
      id: 1,
      title: "Hausa Movie Promo - Sai Wata Rana",
      status: "Active",
      budget: "$500.00",
      spent: "$347.82",
      impressions: "45,670",
      clicks: "2,340",
      ctr: "5.1%",
      cpm: "$7.62",
      progress: 69,
      startDate: "Dec 1, 2024",
      endDate: "Dec 31, 2024",
      targeting: "Hausa speakers, 18-45, Nigeria"
    },
    {
      id: 2,
      title: "Kannywood Series - Gidan Badamasi",
      status: "Paused",
      budget: "$300.00",
      spent: "$156.90",
      impressions: "28,450",
      clicks: "1,120",
      ctr: "3.9%",
      cpm: "$14.02",
      progress: 52,
      startDate: "Nov 15, 2024",
      endDate: "Jan 15, 2025",
      targeting: "Kannywood fans, 25-55, West Africa"
    },
    {
      id: 3,
      title: "HausaBox Premium Subscription",
      status: "Active",
      budget: "$1,000.00",
      spent: "$823.45",
      impressions: "156,780",
      clicks: "8,940",
      ctr: "5.7%",
      cpm: "$9.21",
      progress: 82,
      startDate: "Oct 1, 2024",
      endDate: "Dec 31, 2024",
      targeting: "All users, frequent viewers, Nigeria"
    }
  ];

  const totalStats = {
    totalSpent: "$1,328.17",
    totalImpressions: "230,900",
    totalClicks: "12,400",
    averageCTR: "5.4%",
    activeCampaigns: 2,
    totalCampaigns: 3
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-500";
      case "Paused":
        return "bg-yellow-500";
      case "Completed":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Ad Studio</h1>
          <p className="text-gray-400 mt-1">Manage your advertising campaigns like a pro</p>
        </div>
        <Button className="bg-red-600 hover:bg-red-700">
          <Plus className="mr-2" size={16} />
          Create Campaign
        </Button>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-zinc-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Total Spent</CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{totalStats.totalSpent}</div>
            <p className="text-xs text-gray-400">+12% from last month</p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Impressions</CardTitle>
            <Eye className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{totalStats.totalImpressions}</div>
            <p className="text-xs text-gray-400">+23% from last month</p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Clicks</CardTitle>
            <Target className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{totalStats.totalClicks}</div>
            <p className="text-xs text-gray-400">+18% from last month</p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Average CTR</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{totalStats.averageCTR}</div>
            <p className="text-xs text-gray-400">+0.8% from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Campaign Management */}
      <Tabs defaultValue="campaigns" className="space-y-4">
        <TabsList className="bg-zinc-900 border border-gray-800">
          <TabsTrigger value="campaigns" className="data-[state=active]:bg-zinc-800">
            Active Campaigns
          </TabsTrigger>
          <TabsTrigger value="performance" className="data-[state=active]:bg-zinc-800">
            Performance
          </TabsTrigger>
          <TabsTrigger value="audiences" className="data-[state=active]:bg-zinc-800">
            Audiences
          </TabsTrigger>
        </TabsList>

        <TabsContent value="campaigns">
          <Card className="bg-zinc-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Campaign Overview</CardTitle>
              <CardDescription className="text-gray-400">
                Manage and monitor your advertising campaigns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-800">
                    <TableHead className="text-gray-300">Campaign</TableHead>
                    <TableHead className="text-gray-300">Status</TableHead>
                    <TableHead className="text-gray-300">Budget</TableHead>
                    <TableHead className="text-gray-300">Performance</TableHead>
                    <TableHead className="text-gray-300">CTR</TableHead>
                    <TableHead className="text-gray-300">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {campaignStats.map((campaign) => (
                    <TableRow key={campaign.id} className="border-gray-800 hover:bg-zinc-800">
                      <TableCell>
                        <div>
                          <div className="font-medium text-white">{campaign.title}</div>
                          <div className="text-sm text-gray-400">{campaign.targeting}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          className={`${getStatusColor(campaign.status)} text-white`}
                        >
                          {campaign.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-white">
                          <div>{campaign.spent} / {campaign.budget}</div>
                          <Progress value={campaign.progress} className="w-16 mt-1" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-white">
                          <div className="text-sm">{campaign.impressions} impressions</div>
                          <div className="text-sm text-gray-400">{campaign.clicks} clicks</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-white">{campaign.ctr}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="ghost">
                            {campaign.status === "Active" ? <Pause size={14} /> : <Play size={14} />}
                          </Button>
                          <Button size="sm" variant="ghost">
                            <BarChart3 size={14} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance">
          <Card className="bg-zinc-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Performance Analytics</CardTitle>
              <CardDescription className="text-gray-400">
                Detailed performance metrics for your campaigns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Top Performing Campaigns</h3>
                  <div className="space-y-3">
                    {campaignStats.slice(0, 3).map((campaign) => (
                      <div key={campaign.id} className="flex items-center justify-between p-3 bg-zinc-800 rounded-lg">
                        <div>
                          <div className="font-medium text-white text-sm">{campaign.title}</div>
                          <div className="text-xs text-gray-400">CTR: {campaign.ctr}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-green-500 font-semibold">{campaign.spent}</div>
                          <div className="text-xs text-gray-400">{campaign.clicks} clicks</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Audience Insights</h3>
                  <div className="space-y-3">
                    <div className="p-3 bg-zinc-800 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-white">Nigeria</span>
                        <span className="text-gray-400">65%</span>
                      </div>
                      <Progress value={65} className="w-full" />
                    </div>
                    <div className="p-3 bg-zinc-800 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-white">Niger Republic</span>
                        <span className="text-gray-400">20%</span>
                      </div>
                      <Progress value={20} className="w-full" />
                    </div>
                    <div className="p-3 bg-zinc-800 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-white">Other Countries</span>
                        <span className="text-gray-400">15%</span>
                      </div>
                      <Progress value={15} className="w-full" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audiences">
          <Card className="bg-zinc-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Audience Management</CardTitle>
              <CardDescription className="text-gray-400">
                Create and manage custom audiences for better targeting
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Target className="mx-auto h-12 w-12 text-gray-600 mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">Advanced Targeting</h3>
                <p className="text-gray-400 mb-4">
                  Create custom audiences based on viewing behavior, demographics, and interests
                </p>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Create Custom Audience
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdStudio;
