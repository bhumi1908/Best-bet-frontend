"use client";

import { useState, useEffect, useCallback } from "react";
import {
  DollarSign,
  Users,
  TrendingUp,
  FileText,
  TrendingDown,
  Minus,
} from "lucide-react";

import { Tabs, TabPane } from "@/components/ui/Tabs";
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis, BarChart, Bar } from "recharts";
import { useAppDispatch, useAppSelector } from "@/redux/store/hooks";

import StripeIntegrationWrapper from "@/components/subscriptionManagment/StripeIntegrationWrapper";
import SubscriptionPlansWrapper from "@/components/subscriptionManagment/SubscriptionPlansWrapper";
import SubscriptionsWrapper from "@/components/subscriptionManagment/SubscriptionsWrapper";
import { getSubscriptionDashboardAdminThunk } from "@/redux/thunk/subscriptionThunk";
import SubscriptionDashboardStatsSkeleton from "@/components/SubscriptionDashboardStatsSkeleton";

export default function SubscriptionPage() {
  const [activeTab, setActiveTab] = useState("subscriptions");

  const dispatch = useAppDispatch();
  const { charts, stats, isLoading } = useAppSelector((state) => state.subscription)

  // Yearly Revenue
  const yearlyRevenueChartData = charts?.yearlyRevenueChartData ?? []
  const yearlyRevenue = stats?.yearlyRevenue ?? 0
  const yearlyRevenueGrowth = stats?.yearlyRevenueGrowth ?? 0

  // Active Subscriptions
  const subscriptionsChartData = charts?.subscriptionsChartData ?? []
  const activeSubscriptions = stats?.activeSubscriptions ?? 0
  const totalSubscriptions = stats?.totalSubscriptions ?? 0
  const subscriptionsGrowth = stats?.activeSubscriptionsGrowth ?? 0
  const activeSubscriptionsPercentage = totalSubscriptions > 0 
    ? Math.round((activeSubscriptions / totalSubscriptions) * 100) 
    : 0

  // Monthly Revenue
  const monthlyRevenue = stats?.monthlyRevenue ?? 0
  const monthlyRevenueGrowth = stats?.monthlyRevenueGrowth ?? 0
  const monthlyRevenueChartData = charts?.monthlyRevenueChartData ?? []

  // Active Plans
  const activePlans = stats?.activePlans ?? 0
  const totalPlans = stats?.totalPlans ?? 0

  // Growth indicators for yearly revenue
  const yearlyIsPositive = yearlyRevenueGrowth > 0
  const yearlyIsNegative = yearlyRevenueGrowth < 0
  const yearlyGrowthColor = yearlyIsPositive
    ? 'text-green-400'
    : yearlyIsNegative
      ? 'text-red-400'
      : 'text-text-muted'
  const yearlyStrokeColor = yearlyIsPositive ? '#10b981' : yearlyIsNegative ? '#f87171' : '#9ca3af'
  const YearlyGrowthIcon = yearlyIsPositive
    ? TrendingUp
    : yearlyIsNegative
      ? TrendingDown
      : Minus

  // Growth indicators for monthly revenue
  const monthlyIsPositive = monthlyRevenueGrowth > 0
  const monthlyIsNegative = monthlyRevenueGrowth < 0
  const monthlyGrowthColor = monthlyIsPositive
    ? 'text-green-400'
    : monthlyIsNegative
      ? 'text-red-400'
      : 'text-text-muted'
  const monthlyStrokeColor = monthlyIsPositive ? '#10b981' : monthlyIsNegative ? '#f87171' : '#9ca3af'
  const MonthlyGrowthIcon = monthlyIsPositive
    ? TrendingUp
    : monthlyIsNegative
      ? TrendingDown
      : Minus

  const getGrowthUI = (growth: number) => {
    const safeGrowth = Math.max(0, growth)
    return safeGrowth;
  }

  // Custom Tooltip Component with performance-based colors
  const CustomTooltip = ({ active, payload, labelText, isPositive, isCurrency = true, value }: any) => {
    if (!active || !payload || !payload.length) return null;

    const tooltipValue = value ?? payload[0].value;
    // Determine color based on value performance (positive growth = green, no change = gray)
    const dotColor = isPositive ? '#10b981' : tooltipValue === 0 ? '#9ca3af' : '#f87171';
    const formattedValue = isCurrency
      ? `$${typeof tooltipValue === 'number' ? tooltipValue.toFixed(2) : tooltipValue}`
      : tooltipValue;

    return (
      <div
        style={{
          backgroundColor: '#000000',
          border: '1px solid #6b7280',
          borderRadius: '4px',
          padding: '4px 8px',
          fontSize: '11px',
          lineHeight: '1.2',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#ffffff' }}>
          <div
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: dotColor,
            }}
          />
          <span>{labelText}: {formattedValue}</span>
        </div>
      </div>
    );
  };

  // Custom Tooltip for Active Subscriptions (monthly breakdown)
  const ActiveSubscriptionsTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) return null;

    const count = payload[0].value ?? 0;

    return (
      <div
        style={{
          backgroundColor: '#000000',
          border: '1px solid #6b7280',
          borderRadius: '4px',
          padding: '6px 10px',
          fontSize: '11px',
          lineHeight: '1.4',
        }}
      >
        <div style={{ color: '#ffffff', marginBottom: '2px' }}>
          <strong>{label}</strong>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#ffffff' }}>
          <div
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: '#10b981',
            }}
          />
          <span>Subscriptions: {count}</span>
        </div>
      </div>
    );
  };

  const fetchSubscriptionsDashboard = useCallback(async () => {
    try {
      await dispatch(getSubscriptionDashboardAdminThunk()).unwrap();

    } catch (error: any) {
      console.error(error.message || "Failed to fetch subscriptions dashbaord")
    }
  }, [dispatch])


  useEffect(() => {
    fetchSubscriptionsDashboard();
  }, [])


  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-4xl font-bold mb-2 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text text-transparent">
          Subscription Management
        </h1>
        <p className="text-text-tertiary text-sm sm:text-base">
          Manage subscription plans, payments, and customer subscriptions
        </p>
      </div>

      {/* Stats Cards */}
      {isLoading ? <SubscriptionDashboardStatsSkeleton /> : <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Yearly Revenue Card with Chart */}
        <div className="bg-bg-card border border-border-primary rounded-lg p-6 overflow-hidden">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <p className="text-xs font-semibold text-text-muted mb-1 tracking-wide">Yearly Revenue</p>
              <p className="text-3xl font-light text-text-primary mb-1">
                ${yearlyRevenue.toFixed(2)}
              </p>
              <p className="text-xs text-text-muted">Jan 1 - Dec 31, {new Date().getFullYear()}</p>
            </div>
            <DollarSign className="w-5 h-5 text-accent-primary" />
          </div>
          {/* Growth Indicator */}
          <div className="flex justify-between items-start gap-2">
            <div className="flex items-center gap-1">
              <YearlyGrowthIcon className={`w-3 h-3 ${yearlyGrowthColor}`} />

              <span className={`text-xs font-medium ${yearlyGrowthColor}`}>
                {yearlyRevenueGrowth > 0 && '+'}
                {getGrowthUI(yearlyRevenueGrowth)}%
              </span>
            </div>
            {/* Mini Area Chart */}
            <div className="w-32 h-16 -mt-8">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={yearlyRevenueChartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="yearlyRevenueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={yearlyStrokeColor} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={yearlyStrokeColor} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1a1a1a',
                      border: `1px solid ${yearlyStrokeColor}`,
                      borderRadius: '8px',
                      padding: '4px 8px',
                    }}
                    content={<CustomTooltip labelText="Quarterly Revenue" isPositive={yearlyIsPositive} isCurrency={true} />}
                    cursor={{ stroke: yearlyStrokeColor, strokeWidth: 1, strokeDasharray: '3 3' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke={yearlyStrokeColor}
                    strokeWidth={2}
                    fill="url(#yearlyRevenueGradient)"
                    animationDuration={800}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Active Subscriptions Card with Chart */}
        <div className="bg-bg-card border border-border-primary rounded-lg p-6 overflow-hidden">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <p className="text-xs font-semibold text-text-muted mb-1 tracking-wide">Active Subscriptions</p>
              <p className="text-3xl font-light text-text-primary mb-1">
                {activeSubscriptions}
              </p>
              <p className="text-xs text-text-muted">
                Active subscriptions
              </p>
            </div>
            <Users className="w-5 h-5 text-accent-primary" />
          </div>
          {/* Growth Indicator */}
          <div className="flex justify-end gap-2">
            {/* <div className="flex items-center gap-1 mb-3">
              <TrendingUp className={`w-3 h-3 ${subscriptionsGrowth > 0 ? 'text-green-400' : subscriptionsGrowth < 0 ? 'text-red-400' : 'text-text-muted'}`} />

              <span className={`text-xs font-medium ${subscriptionsGrowth > 0 ? 'text-green-400' : subscriptionsGrowth < 0 ? 'text-red-400' : 'text-text-muted'}`}>
                {subscriptionsGrowth > 0 && '+'}
                {subscriptionsGrowth}%
              </span>
            </div> */}
            {/* Mini Area Chart - Monthly Active Subscriptions */}
            <div className="w-32 h-16 -mt-8">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={subscriptionsChartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="activeSubscriptionsGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="label" hide />
                  <Tooltip
                    content={<ActiveSubscriptionsTooltip />}
                    cursor={{ stroke: '#10b981', strokeWidth: 1, strokeDasharray: '3 3' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#10b981"
                    strokeWidth={2}
                    fill="url(#activeSubscriptionsGradient)"
                    animationDuration={800}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Monthly Revenue Card with Chart */}
        <div className="bg-bg-card border border-border-primary rounded-lg p-6 overflow-hidden">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <p className="text-xs font-semibold text-text-muted mb-1 tracking-wide">Monthly Revenue</p>
              <p className="text-3xl font-light text-text-primary mb-1">
                ${monthlyRevenue.toFixed(2)}
              </p>
              <p className="text-xs text-text-muted">
                {new Date().toLocaleString('default', { month: 'long' })} 1 - {new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate()}
              </p>
            </div>
            <TrendingUp className="w-5 h-5 text-accent-primary" />
          </div>
          {/* Growth Indicator */}
          <div className="flex justify-between gap-2">
            <div className="flex items-center gap-1 mb-3">
              <MonthlyGrowthIcon className={`w-3 h-3 ${monthlyGrowthColor}`} />

              <span className={`text-xs font-medium ${monthlyGrowthColor}`}>
                {monthlyRevenueGrowth > 0 && '+'}
                {getGrowthUI(monthlyRevenueGrowth)}%
              </span>
            </div>
            {/* Mini Area Chart */}
            <div className="w-32 h-16 -mt-8">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyRevenueChartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="monthlyGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={monthlyStrokeColor} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={monthlyStrokeColor} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1a1a1a',
                      border: `1px solid ${monthlyStrokeColor}`,
                      borderRadius: '8px',
                      padding: '4px 8px',
                    }}
                    content={<CustomTooltip labelText="Weekly Revenue" isPositive={monthlyIsPositive} isCurrency={true} />}
                    cursor={{
                      stroke: monthlyStrokeColor,
                      strokeWidth: 1, strokeDasharray: '3 3'
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke={monthlyStrokeColor}
                    strokeWidth={2}
                    fill="url(#monthlyGradient)"
                    animationDuration={800}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Active Plans Card (no chart) */}
        <div className="bg-bg-card border border-border-primary rounded-lg p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <p className="text-xs font-semibold text-text-muted mb-1 tracking-wide">Active Plans</p>
              <p className="text-3xl font-light text-text-primary mb-1">
                {activePlans}
              </p>
              <p className="text-xs text-text-muted mt-1">of {totalPlans} total</p>
            </div>
            <FileText className="w-5 h-5 text-accent-primary" />
          </div>
        </div>
      </div>}

      {/* Tabs */}
      <Tabs activeKey={activeTab} onChange={setActiveTab} defaultActiveKey="subscriptions">
        {/* Active Subscriptions Tab */}
        <TabPane tab="Subscriptions" tabKey="subscriptions">
          <SubscriptionsWrapper />
        </TabPane>

        {/* Subscription Plans Tab */}
        <TabPane tab="Subscription Plans" tabKey="plans">
          <SubscriptionPlansWrapper />
        </TabPane>

        {/* Stripe Integration Tab */}
        <TabPane tab="Stripe Integration" tabKey="stripe">
          <StripeIntegrationWrapper />
        </TabPane>
      </Tabs>

      {/* Delete Plan Dialog */}
      {/* <Popup
        open={deletePlanDialogOpen}
        onOpenChange={setDeletePlanDialogOpen}
        title="Delete Subscription Plan"
        description={`Are you sure you want to delete the plan "${deletePlan?.name}"? This action cannot be undone. Existing subscriptions using this plan will not be affected.`}
        footer={
          <div className="flex flex-col-reverse sm:flex-row justify-end items-center gap-3 w-full">
            <Button className="!w-full sm:!w-fit" onClick={() => setDeletePlanDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="primary" danger className="!w-full sm:!w-fit" onClick={handleDeletePlan}>
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Deleting...
                </span>
              ) : (
                "Delete Plan"
              )}
            </Button>
          </div>
        }


      >
        <div className="p-4 bg-bg-tertiary rounded-lg">
          <p className="text-sm text-text-primary">
            This will permanently delete the <span className="font-semibold text-accent-primary">{deletePlan?.name}</span> plan from the system.
          </p>
        </div>
      </Popup> */}

    </div>
  );
}
