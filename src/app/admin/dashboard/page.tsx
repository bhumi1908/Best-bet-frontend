"use client";

import { useState, useEffect } from "react";
import {
  Users,
  DollarSign,
  Gamepad2,
  MapPin,
  Ticket,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  TrendingUp,
  Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, RadialBarChart, RadialBar } from 'recharts';
import { Skeleton } from "@/components/ui/Skeleton";
import { useSession } from "next-auth/react";

interface SubscriptionPurchase {
  id: string;
  userName: string;
  purchaseDate: string;
  planName: string;
}

interface DashboardStats {
  users: {
    total: number;
    newThisWeek: number;
    growth: number;
    active: {
      daily: number;
      monthly: number;
    };
  };
  revenue: {
    mrr: number;
    arr: number;
    subscriptions: number;
    growth: number;
  };
  games: {
    total: number;
    thisWeek: number;
    avgWinRate: number;
    growth: number;
  };
  missouri: {
    records: number;
    pageViews: number;
    users: number;
  };
  support: {
    openTickets: number;
    avgResponseTime: number;
  };
  recentSubscriptions?: SubscriptionPurchase[];
}

// Weekly data for AreaChart
const weeklyData = [
  { day: 'Mon', visits: 320 },
  { day: 'Tue', visits: 380 },
  { day: 'Wed', visits: 350 },
  { day: 'Thu', visits: 420 },
  { day: 'Fri', visits: 390 },
  { day: 'Sat', visits: 450 },
  { day: 'Sun', visits: 410 },
];

// Revenue data for BarChart
const revenueWeeklyData = [
  { day: 'Mon', revenue: 8500 },
  { day: 'Tue', revenue: 9200 },
  { day: 'Wed', revenue: 10100 },
  { day: 'Thu', revenue: 11200 },
  { day: 'Fri', revenue: 11800 },
  { day: 'Sat', revenue: 12200 },
  { day: 'Sun', revenue: 12500 },
];

// Mock chart data
const userGrowthData = [45, 52, 48, 61, 55, 67, 45];
const revenueData = [8500, 9200, 10100, 11200, 11800, 12200, 12500];
const gamesData = [120, 135, 145, 160, 155, 170, 180];

// Simple Bar Chart Component
const SimpleBarChart = ({ data, color = "#fbbf24" }: { data: number[]; color?: string }) => {
  const max = Math.max(...data);
  const barWidth = 100 / data.length;

  return (
    <div className="w-full h-20 flex items-end justify-between gap-1">
      {data.map((value, index) => {
        const height = (value / max) * 100;
        return (
          <div
            key={index}
            className="flex-1 bg-accent-primary/30 rounded-t transition-all duration-300"
            style={{
              height: `${height}%`,
              backgroundColor: `${color}30`,
            }}
          />
        );
      })}
    </div>
  );
};

// Simple Progress Ring
const ProgressRing = ({ value, max = 100, size = 60, strokeWidth = 4, color = "#fbbf24", hideLabel = false }: {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  hideLabel?: boolean;
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / max) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-500"
        />
      </svg>
      {!hideLabel && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-medium text-text-primary">{value}%</span>
        </div>
      )}
    </div>
  );
};

export default function DashboardPage() {
     const { data: session } = useSession();
     const user =session?.user
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboardStats = async () => {
    try {
      // Replace with your actual API endpoint
      // const response = await apiClient.get<DashboardStats>("/dashboard/stats");
      // setStats(response.data);

      // Mock data for now
      const now = Date.now();
      const recentSubscriptions: SubscriptionPurchase[] = [
        { id: "1", userName: "John Smith", purchaseDate: new Date(now - 2 * 3600000).toISOString(), planName: "Premium Plan" },
        { id: "2", userName: "Sarah Johnson", purchaseDate: new Date(now - 5 * 3600000).toISOString(), planName: "VIP Plan" },
        { id: "3", userName: "Michael Brown", purchaseDate: new Date(now - 8 * 3600000).toISOString(), planName: "Basic Plan" },
        { id: "4", userName: "Emily Davis", purchaseDate: new Date(now - 12 * 3600000).toISOString(), planName: "Premium Plan" },
      ];

      setStats({
        users: {
          total: 1250,
          newThisWeek: 45,
          growth: 12.5,
          active: {
            daily: 320,
            monthly: 890,
          },
        },
        revenue: {
          mrr: 12500,
          arr: 150000,
          subscriptions: 450,
          growth: 8.2,
        },
        games: {
          total: 15420,
          thisWeek: 890,
          avgWinRate: 62,
          growth: 15.3,
        },
        missouri: {
          records: 1250,
          pageViews: 3450,
          users: 280,
        },
        support: {
          openTickets: 12,
          avgResponseTime: 4.5,
        },
        recentSubscriptions,
      });
    } catch (error) {
      console.error("Failed to fetch dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const getUserName = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return user?.email?.split("@")[0] || "User";
  };

  const StatCard = ({
    title,
    value,
    subtitle,
    icon: Icon,
    trend,
    chartData,
    className,
  }: {
    title: string;
    value: string | number;
    subtitle?: string;
    icon: any;
    trend?: { value: number; isPositive: boolean };
    chartData?: number[];
    className?: string;
  }) => (
    <div
      className={cn(
        "bg-bg-card border border-border-primary rounded-lg p-6",
        className
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <p className="text-xs font-semibold text-text-muted mb-1 tracking-wide">
            {title}
          </p>
          <p className="text-3xl font-light text-text-primary mb-1">{value}</p>
          {subtitle && (
            <p className="text-xs text-text-muted mt-1">{subtitle}</p>
          )}
        </div>
        <div className="ml-4">
          <Icon className="w-5 h-5 text-accent-primary" />
        </div>
      </div>
      {trend && (
        <div
          className={cn(
            "flex items-center gap-1 text-xs font-medium mt-3",
            trend.isPositive ? "text-green-400" : "text-red-400"
          )}
        >
          {trend.isPositive ? (
            <ArrowUpRight className="w-3 h-3" />
          ) : (
            <ArrowDownRight className="w-3 h-3" />
          )}
          <span>{Math.abs(trend.value)}%</span>
        </div>
      )}
    </div>
  );

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-4xl font-bold mb-2 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text text-transparent">
          Dashboard
        </h1>
        <p className="text-text-tertiary text-sm sm:text-base">
          Welcome back, {getUserName()}!
        </p>
      </div>

      {loading ? (
        <>
          {/* Key Metrics Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-bg-card border border-border-primary rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <Skeleton className="h-3 w-24 mb-2" />
                    <Skeleton className="h-9 w-20 mb-2" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                  <Skeleton className="h-5 w-5" />
                </div>
                <div className="flex items-center gap-1 mt-3">
                  <Skeleton className="h-3 w-3" />
                  <Skeleton className="h-3 w-8" />
                </div>
              </div>
            ))}
          </div>

          {/* Charts Section Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* User Growth Chart Skeleton */}
            <div className="bg-bg-card border border-border-primary rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <Skeleton className="h-6 w-32 mb-1" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-5 w-5" />
              </div>
              <Skeleton className="h-32 w-full mb-4" />
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-border-primary">
                <div>
                  <Skeleton className="h-3 w-20 mb-1" />
                  <Skeleton className="h-5 w-12" />
                </div>
                <div className="text-right">
                  <Skeleton className="h-3 w-16 mb-1" />
                  <Skeleton className="h-5 w-12" />
                </div>
              </div>
            </div>

            {/* Revenue Chart Skeleton */}
            <div className="bg-bg-card border border-border-primary rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <Skeleton className="h-6 w-32 mb-1" />
                  <Skeleton className="h-3 w-40" />
                </div>
                <Skeleton className="h-5 w-5" />
              </div>
              <Skeleton className="h-32 w-full mb-4" />
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-border-primary">
                <div>
                  <Skeleton className="h-3 w-12 mb-1" />
                  <Skeleton className="h-5 w-20" />
                </div>
                <div className="text-right">
                  <Skeleton className="h-3 w-16 mb-1" />
                  <Skeleton className="h-5 w-12" />
                </div>
              </div>
            </div>
          </div>

          {/* Secondary Metrics Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* User Analytics Skeleton */}
            <div className="bg-bg-card border border-border-primary rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-4" />
              </div>
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <Skeleton className="h-3 w-32" />
                    <Skeleton className="h-3 w-3" />
                  </div>
                  <div className="space-y-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center gap-2">
                        <Skeleton className="flex-1 h-2 rounded-full" />
                        <Skeleton className="h-3 w-12" />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3 pt-4 border-t border-border-primary">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="text-center">
                      <Skeleton className="h-3 w-12 mb-1 mx-auto" />
                      <Skeleton className="h-5 w-8 mx-auto" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Subscriptions Skeleton */}
            <div className="bg-bg-card border border-border-primary rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-4 w-4" />
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border-primary">
                      <th className="text-left py-2 px-2">
                        <Skeleton className="h-3 w-12" />
                      </th>
                      <th className="text-left py-2 px-2">
                        <Skeleton className="h-3 w-12" />
                      </th>
                      <th className="text-right py-2 px-2">
                        <Skeleton className="h-3 w-12 ml-auto" />
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {[1, 2, 3, 4, 5].map((i) => (
                      <tr key={i} className="border-b border-border-primary/50">
                        <td className="py-2.5 px-2">
                          <Skeleton className="h-3 w-24" />
                        </td>
                        <td className="py-2.5 px-2">
                          <Skeleton className="h-3 w-20" />
                        </td>
                        <td className="py-2.5 px-2 text-right">
                          <Skeleton className="h-3 w-16 ml-auto" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Game Performance Skeleton */}
            <div className="bg-bg-card border border-border-primary rounded-lg p-6 w-full">
              <div className="flex items-center justify-between mb-6">
                <Skeleton className="h-6 w-36" />
                <Skeleton className="h-4 w-4" />
              </div>
              <div className="flex items-center gap-8">
                <div className="flex-shrink-0 p-4">
                  <Skeleton className="h-[150px] w-[150px] rounded-full" />
                </div>
                <div className="flex-1 space-y-4 min-w-[200px]">
                  <div>
                    <Skeleton className="h-3 w-24 mb-1" />
                    <Skeleton className="h-6 w-32 mb-1" />
                    <Skeleton className="h-3 w-28" />
                  </div>
                  <div className="pt-2 border-t border-border-primary">
                    <div className="flex items-center gap-2 mb-2">
                      <Skeleton className="h-4 w-4" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                    <Skeleton className="h-5 w-12 mb-1" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                  <div className="pt-2 border-t border-border-primary">
                    <Skeleton className="h-3 w-32 mb-1" />
                    <Skeleton className="h-4 w-28" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Total Users"
              value={stats?.users.total.toLocaleString() || "0"}
              subtitle={`${stats?.users.active.daily || 0} active today`}
              icon={Users}
              trend={{ value: stats?.users.growth || 0, isPositive: true }}
              chartData={userGrowthData}
            />
            <StatCard
              title="Monthly Revenue"
              value={`$${((stats?.revenue.mrr || 0) / 1000).toFixed(0)}k`}
              subtitle={`${stats?.revenue.subscriptions || 0} subscriptions`}
              icon={DollarSign}
              trend={{ value: stats?.revenue.growth || 0, isPositive: true }}
              chartData={revenueData}
            />
            <StatCard
              title="Games Played"
              value={stats?.games.total.toLocaleString() || "0"}
              subtitle={`${stats?.games.avgWinRate || 0}% avg win rate`}
              icon={Gamepad2}
              trend={{ value: stats?.games.growth || 0, isPositive: true }}
              chartData={gamesData}
            />
            <StatCard
              title="Open Tickets"
              value={stats?.support.openTickets || 0}
              subtitle={`${stats?.support.avgResponseTime || 0}h avg response`}
              icon={Ticket}
            />
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* User Growth Chart */}
            <div className="bg-bg-card border border-border-primary rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-text-primary tracking-wide mb-1">
                    User Growth
                  </h2>
                  <p className="text-xs text-text-muted">Last 7 days</p>
                </div>
                <div className="flex gap-6">
                  <div className="flex flex-col">
                    <p className="text-lg font-medium text-text-primary">{stats?.users.newThisWeek || 0}</p>
                    <p className="text-xs text-text-muted">New Users</p>
                  </div>
                  <div className="flex flex-col">
                    <p className="text-lg font-medium text-green-400">+{stats?.users.growth || 0}%</p>
                    <p className="text-xs text-text-muted">Growth</p>
                  </div>
                </div>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={weeklyData}>
                    <defs>
                      <linearGradient id="visitGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#fbbf24" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="day" stroke="#64748b" fontSize={12} />
                    <YAxis stroke="#64748b" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1a1a1a',
                        border: '1px solid #6b7280',
                        borderRadius: '12px',
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="visits"
                      stroke="#fbbf24"
                      strokeWidth={2}
                      fill="url(#visitGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Revenue Chart */}
            <div className="bg-bg-card border border-border-primary rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-text-primary tracking-wide mb-1">
                    Revenue Trend
                  </h2>
                  <p className="text-xs text-text-muted">Monthly recurring revenue</p>
                </div>

                <div className="flex gap-6">
                  <div className="flex flex-col">
                    <p className="text-lg font-medium text-accent-primary">
                      ${(stats?.revenue.mrr || 0).toLocaleString()}
                    </p>
                    <p className="text-xs text-text-muted">MRR</p>
                  </div>
                  <div className="flex flex-col">
                    <p className="text-lg font-medium text-green-400">+{stats?.revenue.growth || 0}%</p>
                    <p className="text-xs text-text-muted">Growth</p>
                  </div>
                </div>  </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueWeeklyData}>
                    <defs>
                      <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#fbbf24" stopOpacity={0.3} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="day" stroke="#64748b" fontSize={12} />
                    <YAxis stroke="#64748b" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1a1a1a',
                        border: '1px solid #6b7280',
                        borderRadius: '12px',
                      }}
                      formatter={(value: number | undefined) => [`$${(value || 0).toLocaleString()}`, 'Revenue']}
                    />
                    <Bar
                      dataKey="revenue"
                      fill="url(#revenueGradient)"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Secondary Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* User Analytics */}
            <div className="bg-bg-card border border-border-primary rounded-lg p-6 flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-text-primary tracking-wide">
                  User Analytics
                </h2>
                <Users className="w-4 h-4 text-accent-primary" />
              </div>
              <div className="flex flex-col gap-6 flex-1">
                {/* Activity Timeline */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-text-muted">Activity Distribution</span>
                    <Activity className="w-3 h-3 text-accent-primary" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-border-primary rounded-full h-2 overflow-hidden">
                        <div
                          className="h-full bg-accent-primary rounded-full transition-all duration-500"
                          style={{ width: `${((stats?.users.active.daily || 0) / (stats?.users.total || 1)) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium text-text-primary w-12 text-right">
                        {stats?.users.active.daily || 0}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-border-primary rounded-full h-2 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-accent-primary to-yellow-500 rounded-full transition-all duration-500"
                          style={{ width: `${((stats?.users.active.monthly || 0) / (stats?.users.total || 1)) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium text-text-primary w-12 text-right">
                        {stats?.users.active.monthly || 0}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-border-primary rounded-full h-2 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full transition-all duration-500"
                          style={{ width: `${((stats?.users.newThisWeek || 0) / (stats?.users.total || 1)) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium text-text-primary w-12 text-right">
                        {stats?.users.newThisWeek || 0}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-3 gap-3 pt-4 border-t border-border-primary mt-auto">
                  <div className="text-center">
                    <p className="text-xs text-text-muted mb-1">Daily</p>
                    <p className="text-lg font-semibold text-accent-primary">
                      {stats?.users.active.daily || 0}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-text-muted mb-1">Monthly</p>
                    <p className="text-lg font-semibold text-accent-primary">
                      {stats?.users.active.monthly || 0}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-text-muted mb-1">New</p>
                    <p className="text-lg font-semibold text-green-400">
                      +{stats?.users.newThisWeek || 0}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Revenue Analytics */}
            <div className="bg-bg-card border border-border-primary rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-text-primary tracking-wide">
                  Recent Subscriptions
                </h2>
                <DollarSign className="w-4 h-4 text-accent-primary" />
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border-primary">
                      <th className="text-left py-2 px-2 text-xs font-semibold text-text-muted">User</th>
                      <th className="text-left py-2 px-2 text-xs font-semibold text-text-muted">Plan</th>
                      <th className="text-right py-2 px-2 text-xs font-semibold text-text-muted">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats?.recentSubscriptions?.slice(0, 10).map((subscription, index) => {
                      const date = new Date(subscription.purchaseDate);
                      const timeAgo = date.getTime() > Date.now() - 86400000
                        ? `${Math.floor((Date.now() - date.getTime()) / 3600000)}h ago`
                        : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

                      return (
                        <tr
                          key={subscription.id}
                          className="border-b border-border-primary/50 hover:bg-border-primary/20 transition-colors"
                        >
                          <td className="py-2.5 px-2">
                            <span className="text-xs font-medium text-text-primary">
                              {subscription.userName}
                            </span>
                          </td>
                          <td className="py-2.5 px-2">
                            <span className="text-xs text-accent-primary font-medium">
                              {subscription.planName}
                            </span>
                          </td>
                          <td className="py-2.5 px-2 text-right">
                            <span className="text-xs text-text-muted">
                              {timeAgo}
                            </span>
                          </td>
                        </tr>
                      );
                    }) || (
                        <tr>
                          <td colSpan={3} className="py-4 text-center text-xs text-text-muted">
                            No recent subscriptions
                          </td>
                        </tr>
                      )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Game Performance */}
            <div className="bg-bg-card border border-border-primary rounded-lg p-6 w-full">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-text-primary tracking-wide">
                  Game Performance
                </h2>
                <Gamepad2 className="w-4 h-4 text-accent-primary" />
              </div>

              <div className="flex items-center gap-8">
                {/* Left - Circle Chart */}
                <div className="flex-shrink-0 p-4">
                  <div className="relative">
                    <ProgressRing
                      value={stats?.games.avgWinRate || 0}
                      size={150}
                      strokeWidth={8}
                      color="#fbbf24"
                      hideLabel={true}
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-2xl font-bold text-accent-primary">
                        {stats?.games.avgWinRate || 0}%
                      </span>
                      <span className="text-xs text-text-muted mt-0.5">Win Rate</span>
                    </div>
                  </div>
                </div>

                {/* Right - Text Information */}
                <div className="flex-1 space-y-4 min-w-[200px]">
                  <div>
                    <p className="text-xs text-text-muted mb-1">Total Games</p>
                    <p className="text-xl font-semibold text-text-primary">
                      {(stats?.games.total || 0).toLocaleString()}
                    </p>
                    <p className="text-xs text-text-muted mt-1">
                      {stats?.games.thisWeek || 0} this week
                    </p>
                  </div>

                  <div className="pt-2 border-t border-border-primary">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-4 h-4 text-green-400" />
                      <p className="text-xs text-text-muted">Performance Growth</p>
                    </div>
                    <p className="text-lg font-semibold text-green-400">
                      +{stats?.games.growth || 0}%
                    </p>
                    <p className="text-xs text-text-muted">vs last period</p>
                  </div>

                  <div className="pt-2 border-t border-border-primary">
                    <p className="text-xs text-text-muted mb-1">Average Performance</p>
                    <p className="text-sm font-medium text-accent-primary">
                      Across all games
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );

}
