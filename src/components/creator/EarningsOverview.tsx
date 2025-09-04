import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DollarSign, 
  TrendingUp, 
  Eye, 
  Calendar,
  Banknote,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { PayoutRequestModal } from './PayoutRequestModal';

interface EarningsOverviewProps {
  creatorId: string;
  detailed?: boolean;
}

interface EarningsData {
  total_earnings: number;
  pending_earnings: number;
  paid_earnings: number;
  this_month_earnings: number;
  last_month_earnings: number;
  total_views: number;
  avg_cpm: number;
}

interface RecentEarning {
  id: string;
  amount_naira: number;
  earning_type: string;
  date: string;
  description: string;
  status: string;
}

export function EarningsOverview({ creatorId, detailed = false }: EarningsOverviewProps) {
  const [earnings, setEarnings] = useState<EarningsData | null>(null);
  const [recentEarnings, setRecentEarnings] = useState<RecentEarning[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPayoutModal, setShowPayoutModal] = useState(false);

  useEffect(() => {
    fetchEarningsData();
  }, [creatorId]);

  const fetchEarningsData = async () => {
    try {
      setLoading(true);
      
      // Fetch aggregate earnings data
      const { data: earningsData } = await supabase
        .from('creator_earnings')
        .select('amount_naira, status, date')
        .eq('creator_id', creatorId);

      // Fetch platform settings for CPM
      const { data: settings } = await supabase
        .from('platform_settings')
        .select('setting_key, setting_value')
        .in('setting_key', ['default_cpm_rate', 'minimum_payout_threshold']);

      // Fetch recent earnings
      const { data: recentData } = await supabase
        .from('creator_earnings')
        .select('*')
        .eq('creator_id', creatorId)
        .order('created_at', { ascending: false })
        .limit(10);

      // Calculate metrics
      const totalEarnings = earningsData?.reduce((sum, item) => sum + Number(item.amount_naira), 0) || 0;
      const pendingEarnings = earningsData?.filter(item => item.status === 'pending')
        .reduce((sum, item) => sum + Number(item.amount_naira), 0) || 0;
      const paidEarnings = earningsData?.filter(item => item.status === 'paid')
        .reduce((sum, item) => sum + Number(item.amount_naira), 0) || 0;

      // Calculate this month vs last month
      const now = new Date();
      const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

      const thisMonthEarnings = earningsData?.filter(item => {
        const itemDate = new Date(item.date);
        return itemDate >= thisMonthStart;
      }).reduce((sum, item) => sum + Number(item.amount_naira), 0) || 0;

      const lastMonthEarnings = earningsData?.filter(item => {
        const itemDate = new Date(item.date);
        return itemDate >= lastMonthStart && itemDate <= lastMonthEnd;
      }).reduce((sum, item) => sum + Number(item.amount_naira), 0) || 0;

      // Get default CPM from settings
      const cpmSetting = settings?.find(s => s.setting_key === 'default_cpm_rate');
      const avgCpm = Number(cpmSetting?.setting_value) || 50;

      setEarnings({
        total_earnings: totalEarnings,
        pending_earnings: pendingEarnings,
        paid_earnings: paidEarnings,
        this_month_earnings: thisMonthEarnings,
        last_month_earnings: lastMonthEarnings,
        total_views: 0, // This would come from video analytics
        avg_cpm: avgCpm
      });

      setRecentEarnings(recentData || []);

    } catch (error) {
      console.error('Error fetching earnings data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatNaira = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const getMonthGrowth = () => {
    if (!earnings || earnings.last_month_earnings === 0) return 0;
    return ((earnings.this_month_earnings - earnings.last_month_earnings) / earnings.last_month_earnings) * 100;
  };

  if (loading) {
    return (
      <Card className="bg-streaming-card border-streaming-border">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-streaming-border rounded w-1/4"></div>
            <div className="h-8 bg-streaming-border rounded w-1/2"></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="h-16 bg-streaming-border rounded"></div>
              <div className="h-16 bg-streaming-border rounded"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!earnings) return null;

  const monthGrowth = getMonthGrowth();
  const canRequestPayout = earnings.pending_earnings >= 5000; // Minimum threshold

  return (
    <div className="space-y-4">
      <Card className="bg-streaming-card border-streaming-border">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg text-streaming-text">Earnings Overview</CardTitle>
          {earnings.pending_earnings >= 5000 && (
            <Button 
              onClick={() => setShowPayoutModal(true)}
              size="sm"
              className="bg-green-600 hover:bg-green-700"
            >
              <Banknote className="w-4 h-4 mr-2" />
              Request Payout
            </Button>
          )}
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Main Earnings Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-green-400" />
                <span className="text-sm text-streaming-muted">Total Earnings</span>
              </div>
              <p className="text-xl font-bold text-streaming-text">
                {formatNaira(earnings.total_earnings)}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-streaming-muted">This Month</span>
              </div>
              <p className="text-xl font-bold text-streaming-text">
                {formatNaira(earnings.this_month_earnings)}
              </p>
              {monthGrowth !== 0 && (
                <div className="flex items-center gap-1">
                  {monthGrowth > 0 ? (
                    <ArrowUpRight className="w-3 h-3 text-green-400" />
                  ) : (
                    <ArrowDownRight className="w-3 h-3 text-red-400" />
                  )}
                  <span className={`text-xs ${monthGrowth > 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {Math.abs(monthGrowth).toFixed(1)}%
                  </span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-yellow-400" />
                <span className="text-sm text-streaming-muted">Pending</span>
              </div>
              <p className="text-xl font-bold text-yellow-400">
                {formatNaira(earnings.pending_earnings)}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Banknote className="w-4 h-4 text-green-400" />
                <span className="text-sm text-streaming-muted">Paid Out</span>
              </div>
              <p className="text-xl font-bold text-green-400">
                {formatNaira(earnings.paid_earnings)}
              </p>
            </div>
          </div>

          {/* Payout Eligibility Notice */}
          {earnings.pending_earnings < 5000 && (
            <div className="p-3 bg-yellow-600/20 border border-yellow-600/30 rounded-lg">
              <p className="text-sm text-yellow-300">
                You need {formatNaira(5000 - earnings.pending_earnings)} more in pending earnings to request a payout.
              </p>
            </div>
          )}

          {/* Average CPM */}
          <div className="p-3 bg-streaming-darker rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-sm text-streaming-muted">Average CPM Rate</span>
              <span className="font-medium text-streaming-text">{formatNaira(earnings.avg_cpm)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Earnings (shown in detailed view) */}
      {detailed && (
        <Card className="bg-streaming-card border-streaming-border">
          <CardHeader>
            <CardTitle className="text-streaming-text">Recent Earnings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentEarnings.length === 0 ? (
                <p className="text-center text-streaming-muted py-8">
                  No earnings yet. Upload videos and start earning!
                </p>
              ) : (
                recentEarnings.map((earning) => (
                  <div key={earning.id} className="flex items-center justify-between p-3 rounded-lg bg-streaming-darker/50">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-streaming-text capitalize">
                          {earning.earning_type.replace('_', ' ')}
                        </span>
                        <Badge 
                          variant={earning.status === 'paid' ? 'default' : 'secondary'}
                          className={earning.status === 'paid' ? 'bg-green-600' : ''}
                        >
                          {earning.status}
                        </Badge>
                      </div>
                      {earning.description && (
                        <p className="text-xs text-streaming-muted mt-1">
                          {earning.description}
                        </p>
                      )}
                      <p className="text-xs text-streaming-muted">
                        {new Date(earning.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-streaming-text">
                        {formatNaira(Number(earning.amount_naira))}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Payout Request Modal */}
      {showPayoutModal && (
        <PayoutRequestModal 
          creatorId={creatorId}
          availableAmount={earnings.pending_earnings}
          onClose={() => setShowPayoutModal(false)}
          onSuccess={() => {
            setShowPayoutModal(false);
            fetchEarningsData();
          }}
        />
      )}
    </div>
  );
}