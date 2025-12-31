"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Plus,
  Edit,
  Trash2,
  DollarSign,
  Users,
  CreditCard,
  TrendingUp,
  Check,
  AlertCircle,
  RefreshCw,
  FileText,
  Eye,
  MoreVertical,
  X,
  TrendingDown,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { DateTimePicker } from "@/components/ui/DateTimePicker";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { TableSkeleton } from "@/components/ui/TableSkeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import { Popup } from "@/components/ui/Popup";
import { Switch } from "@/components/ui/Switch";
import { Tabs, TabPane } from "@/components/ui/Tabs";
import { cn } from "@/lib/utils";
import { toast } from "react-toastify";
import { routes } from "@/utilities/routes";
import { Dropdown, DropdownContent, DropdownItem, DropdownTrigger } from "@/components/ui/Dropdown";
import { AreaChart, Area, ResponsiveContainer, Tooltip } from "recharts";
import { useAppDispatch, useAppSelector } from "@/redux/store/hooks";
import { createSubscriptionPlanThunk, deleteSubscriptionPlanThunk, getAllSubscriptionPlansAdminThunk, getSubscriptionPlansByIdAdminThunk, updateSubscriptionPlanThunk } from "@/redux/thunk/subscriptionPlanThunk";
import PricingCardSkeleton from "@/components/PricingCardSkeleton";
import { zodFormikValidate } from "@/utilities/zodFormikValidate";
import { createSubscriptionPlanSchema } from "@/utilities/schema";
import { useFormik } from "formik";
import { getStripeIntegrationStatusThunk } from "@/redux/thunk/stripeThunk";
import { StatusBadge } from "@/components/ui/StatusBadge";
import StripeIntegrationSkeleton from "@/components/stripeIntegrationSkeleton";
import StripeIntegrationWrapper from "@/components/subscriptionManagment/StripeIntegrationWrapper";
import SubscriptionPlansWrapper from "@/components/subscriptionManagment/SubscriptionPlansWrapper";
import SubscriptionsWrapper from "@/components/subscriptionManagment/SubscriptionsWrapper";


interface Subscription {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  planId: string;
  planName: string;
  status: "active" | "cancelled" | "expired" | "past_due";
  amount: number;
  billingCycle: "monthly" | "yearly";
  startDate: string;
  endDate: string;
  nextBillingDate?: string;
  paymentMethod: string;
  stripeSubscriptionId?: string;
  stripeCustomerId?: string;
  createdAt: string;
}

interface Payment {
  id: string;
  subscriptionId: string;
  amount: number;
  status: "succeeded" | "pending" | "failed" | "refunded";
  paymentMethod: string;
  transactionId: string;
  date: string;
  refundedAmount?: number;
}

type SortOrder = "ascend" | "descend" | null;
type SortColumn = "userName" | "planName" | "status" | "amount" | "startDate" | "endDate" | null;

// Chart data for mini area charts (last 7 days)
const revenueChartData = [
  { value: 95.50 },
  { value: 105.30 },
  { value: 112.75 },
  { value: 118.20 },
  { value: 125.45 },
  { value: 132.10 },
  { value: 139.97 },
];

const subscriptionsChartData = [
  { value: 11 },
  { value: 10 },
  { value: 9 },
  { value: 9 },
  { value: 8 },
  { value: 8 },
  { value: 8 },
];

const monthlyRevenueChartData = [
  { value: 105.20 },
  { value: 110.50 },
  { value: 115.30 },
  { value: 118.75 },
  { value: 122.60 },
  { value: 126.40 },
  { value: 129.98 },
];

export default function SubscriptionPage() {
  const router = useRouter();
  // State
  const [loading, setLoading] = useState(true);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [planFilter, setPlanFilter] = useState<string>("all");
  const [startDateFilter, setStartDateFilter] = useState<Date | undefined>(undefined);
  const [sortedColumn, setSortedColumn] = useState<SortColumn>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [activeTab, setActiveTab] = useState("subscriptions");

  // Dialog states
  // const [deletePlanDialogOpen, setDeletePlanDialogOpen] = useState(false);
  // const [deletePlan, setDeletePlan] = useState<DeletePlan | null>(null);

  const dispatch = useAppDispatch();
  const { error, isLoading, plans: subscriptionPlan, planById } = useAppSelector((state) => state.subscriptionPlan)

  // Stats
  const stats = useMemo(() => {
    const activeSubscriptions = subscriptions.filter((s) => s.status === "active");
    const totalRevenue = payments
      .filter((p) => p.status === "succeeded" && !p.refundedAmount)
      .reduce((sum, p) => sum + p.amount, 0);
    const monthlyRevenue = payments
      .filter(
        (p) =>
          p.status === "succeeded" &&
          !p.refundedAmount &&
          new Date(p.date).getMonth() === new Date().getMonth()
      )
      .reduce((sum, p) => sum + p.amount, 0);

    return {
      totalSubscriptions: subscriptions.length,
      activeSubscriptions: activeSubscriptions.length,
      totalRevenue,
      monthlyRevenue,
      totalPlans: subscriptionPlan.length,
      activePlans: subscriptionPlan.filter((p) => p.isActive).length,
    };
  }, [subscriptions, payments, subscriptionPlan]);

  // Fetch data
  // TODO: Remove dummy
  const fetchDummyData = useCallback(async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API calls
      // Simulated data for now
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock subscriptions
      const mockSubscriptions: Subscription[] = [
        {
          id: "sub_1",
          userId: "user_1",
          userName: "John Doe",
          userEmail: "john@example.com",
          planId: "1",
          planName: "Basic Plan",
          status: "active",
          amount: 9.99,
          billingCycle: "monthly",
          startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          paymentMethod: "Credit Card",
          stripeSubscriptionId: "sub_stripe_1",
          stripeCustomerId: "cus_stripe_1",
          createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: "sub_2",
          userId: "user_2",
          userName: "Jane Smith",
          userEmail: "jane@example.com",
          planId: "2",
          planName: "Premium Plan",
          status: "active",
          amount: 29.99,
          billingCycle: "monthly",
          startDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
          endDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
          nextBillingDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
          paymentMethod: "UPI",
          stripeSubscriptionId: "sub_stripe_2",
          stripeCustomerId: "cus_stripe_2",
          createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: "sub_3",
          userId: "user_3",
          userName: "Bob Johnson",
          userEmail: "bob@example.com",
          planId: "3",
          planName: "Enterprise Plan",
          status: "active",
          amount: 99.99,
          billingCycle: "monthly",
          startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          endDate: new Date(Date.now() + 23 * 24 * 60 * 60 * 1000).toISOString(),
          nextBillingDate: new Date(Date.now() + 23 * 24 * 60 * 60 * 1000).toISOString(),
          paymentMethod: "UPI",
          stripeSubscriptionId: "sub_stripe_3",
          stripeCustomerId: "cus_stripe_3",
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: "sub_4",
          userId: "user_4",
          userName: "Alice Brown",
          userEmail: "alice@example.com",
          planId: "1",
          planName: "Basic Plan",
          status: "cancelled",
          amount: 9.99,
          billingCycle: "monthly",
          startDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
          endDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          paymentMethod: "Debit Card",
          stripeSubscriptionId: "sub_stripe_4",
          stripeCustomerId: "cus_stripe_4",
          createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: "sub_5",
          userId: "user_5",
          userName: "Charlie Davis",
          userEmail: "charlie@example.com",
          planId: "2",
          planName: "Premium Plan",
          status: "expired",
          amount: 29.99,
          billingCycle: "monthly",
          startDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
          endDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          paymentMethod: "Debit Card",
          stripeSubscriptionId: "sub_stripe_5",
          stripeCustomerId: "cus_stripe_5",
          createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: "sub_6",
          userId: "user_6",
          userName: "David Wilson",
          userEmail: "david@example.com",
          planId: "3",
          planName: "VIP Plan",
          status: "active",
          amount: 99.99,
          billingCycle: "monthly",
          startDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
          endDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          paymentMethod: "UPI",
          stripeSubscriptionId: "sub_stripe_6",
          stripeCustomerId: "cus_stripe_6",
          createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: "sub_7",
          userId: "user_7",
          userName: "Eve Green",
          userEmail: "eve@example.com",
          planId: "1",
          planName: "Basic Plan",
          status: "active",
          amount: 9.99,
          billingCycle: "monthly",
          startDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
          endDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          paymentMethod: "Credit Card",
          stripeSubscriptionId: "sub_stripe_7",
          stripeCustomerId: "cus_stripe_7",
          createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: "sub_8",
          userId: "user_8",
          userName: "Frank Brown",
          userEmail: "frank@example.com",
          planId: "2",
          planName: "Premium Plan",
          status: "cancelled",
          amount: 29.99,
          billingCycle: "monthly",
          startDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
          endDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          paymentMethod: "UPI",
          stripeSubscriptionId: "sub_stripe_8",
          stripeCustomerId: "cus_stripe_8",
          createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: "sub_9",
          userId: "user_9",
          userName: "Grace White",
          userEmail: "grace@example.com",
          planId: "3",
          planName: "VIP Plan",
          status: "active",
          amount: 99.99,
          billingCycle: "monthly",
          startDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
          endDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          paymentMethod: "UPI",
          stripeSubscriptionId: "sub_stripe_9",
          stripeCustomerId: "cus_stripe_9",
          createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: "sub_10",
          userId: "user_10",
          userName: "Henry Green",
          userEmail: "henry@example.com",
          planId: "1",
          planName: "Basic Plan",
          status: "active",
          amount: 9.99,
          billingCycle: "monthly",
          startDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
          endDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          paymentMethod: "Credit Card",
          stripeSubscriptionId: "sub_stripe_10",
          stripeCustomerId: "cus_stripe_10",
          createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: "sub_11",
          userId: "user_11",
          userName: "Ivy Black",
          userEmail: "ivy@example.com",
          planId: "2",
          planName: "Premium Plan",
          status: "active",
          amount: 29.99,
          billingCycle: "monthly",
          startDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
          endDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          paymentMethod: "UPI",
          stripeSubscriptionId: "sub_stripe_11",
          stripeCustomerId: "cus_stripe_11",
          createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
        },
      ];

      // Mock payments
      const mockPayments: Payment[] = [
        {
          id: "pay_1",
          subscriptionId: "sub_1",
          amount: 9.99,
          status: "succeeded",
          paymentMethod: "card",
          transactionId: "txn_123",
          date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: "pay_2",
          subscriptionId: "sub_2",
          amount: 29.99,
          status: "succeeded",
          paymentMethod: "card",
          transactionId: "txn_456",
          date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: "pay_3",
          subscriptionId: "sub_3",
          amount: 99.99,
          status: "succeeded",
          paymentMethod: "card",
          transactionId: "txn_789",
          date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        },
      ];

      // setPlans(mockPlans);
      setSubscriptions(mockSubscriptions);
      setPayments(mockPayments);
    } catch (error: any) {
      console.error("Failed to fetch data:", error);
      toast.error(error?.message || "Failed to fetch subscription data");
    } finally {
      setLoading(false);
    }
  }, []);


  // TODO: Remove dummy
  useEffect(() => {
    fetchDummyData();
  }, [fetchDummyData]);



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
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Total Revenue Card with Chart */}
        <div className="bg-bg-card border border-border-primary rounded-lg p-6 overflow-hidden">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <p className="text-xs font-semibold text-text-muted mb-1 tracking-wide">Total Revenue</p>
              <p className="text-3xl font-light text-text-primary mb-1">
                ${stats.totalRevenue.toFixed(2)}
              </p>
              <p className="text-xs text-text-muted">All time</p>
            </div>
            <DollarSign className="w-5 h-5 text-accent-primary" />
          </div>
          {/* Growth Indicator */}
          <div className="flex justify-between items-start gap-2">
            <div className="flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-green-400" />
              <span className="text-xs font-medium text-green-400">+ 20%</span>
            </div>
            {/* Mini Area Chart */}
            <div className="w-32 h-16 -mt-8">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueChartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1a1a1a',
                      border: '1px solid #10b981',
                      borderRadius: '8px',
                      padding: '4px 8px',
                    }}
                    formatter={(value: any) => [`$${value}`, 'Revenue']}
                    cursor={{ stroke: '#10b981', strokeWidth: 1, strokeDasharray: '3 3' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#10b981"
                    strokeWidth={2}
                    fill="url(#revenueGradient)"
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
                {stats.activeSubscriptions}
              </p>
              <p className="text-xs text-text-muted">of {stats.totalSubscriptions} total</p>
            </div>
            <Users className="w-5 h-5 text-accent-primary" />
          </div>
          {/* Growth Indicator */}
          <div className="flex justify-between gap-2">
            <div className="flex items-center gap-1">
              <TrendingDown className="w-3 h-3 text-red-400" />
              <span className="text-xs font-medium text-red-400">- 15%</span>
            </div>
            {/* Mini Area Chart */}
            <div className="w-32 h-16 -mt-8">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={subscriptionsChartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="subsGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f87171" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#f87171" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1a1a1a',
                      border: '1px solid #f87171',
                      borderRadius: '8px',
                      padding: '4px 8px',
                    }}
                    formatter={(value: any) => [value, 'Subscriptions']}
                    cursor={{ stroke: '#f87171', strokeWidth: 1, strokeDasharray: '3 3' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#f87171"
                    strokeWidth={2}
                    fill="url(#subsGradient)"
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
                ${stats.monthlyRevenue.toFixed(2)}
              </p>
              <p className="text-xs text-text-muted">This month</p>
            </div>
            <TrendingUp className="w-5 h-5 text-accent-primary" />
          </div>
          {/* Growth Indicator */}
          <div className="flex justify-between gap-2">
            <div className="flex items-center gap-1 mb-3">
              <TrendingUp className="w-3 h-3 text-green-400" />
              <span className="text-xs font-medium text-green-400">+ 8.2%</span>
            </div>
            {/* Mini Area Chart */}
            <div className="w-32 h-16 -mt-8">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyRevenueChartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="monthlyGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1a1a1a',
                      border: '1px solid #10b981',
                      borderRadius: '8px',
                      padding: '4px 8px',
                    }}
                    formatter={(value: any) => [`$${value}`, 'Revenue']}
                    cursor={{ stroke: '#10b981', strokeWidth: 1, strokeDasharray: '3 3' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#10b981"
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
                {stats.activePlans}
              </p>
              <p className="text-xs text-text-muted mt-1">of {stats.totalPlans} total</p>
            </div>
            <FileText className="w-5 h-5 text-accent-primary" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs activeKey={activeTab} onChange={setActiveTab} defaultActiveKey="subscriptions">
        {/* Active Subscriptions Tab */}
        <TabPane tab="Subscriptions" tabKey="subscriptions">
         <SubscriptionsWrapper/>
        </TabPane>

        {/* Subscription Plans Tab */}
        <TabPane tab="Subscription Plans" tabKey="plans">
          <SubscriptionPlansWrapper/>
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
