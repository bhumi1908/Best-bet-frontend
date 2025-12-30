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
import { createSubscriptionPlanThunk, getAllSubscriptionPlansAdminThunk, updateSubscriptionPlanThunk } from "@/redux/thunk/subscriptionPlanThunk";
import PricingCardSkeleton from "@/components/PricingCardSkeleton";
import { zodFormikValidate } from "@/utilities/zodFormikValidate";
import { createSubscriptionPlanSchema } from "@/utilities/schema";
import { useFormik } from "formik";
import SubscriptionPlansWrapper from "@/components/subscriptionManagment/SubscriptionPlansWrapper";

type PlanDuration = "monthly" | "yearly"

interface Feature {
  id?: string;
  name: string;
}

interface SubscriptionPlan {
  id?: string;
  name: string;
  description: string;
  price: number;
  duration: PlanDuration;
  features: Feature[];
  isActive: boolean;
  isRecommended: boolean;
}


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
  const [plans, setPlans] = useState<any[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [planFilter, setPlanFilter] = useState<string>("all");
  const [startDateFilter, setStartDateFilter] = useState<Date | undefined>(undefined);
  const [billingMode, setBillingMode] = useState<"monthly" | "annual">("monthly");
  const [sortedColumn, setSortedColumn] = useState<SortColumn>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [activeTab, setActiveTab] = useState("subscriptions");

  // Dialog states
  const [createPlanDialogOpen, setCreatePlanDialogOpen] = useState(false);
  const [editPlanDialogOpen, setEditPlanDialogOpen] = useState(false);
  const [deletePlanDialogOpen, setDeletePlanDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);

  const dispatch = useAppDispatch();
  const { error, isLoading, plans: subscriptionPlan } = useAppSelector((state) => state.subscriptionPlan)

  // Form states
  const [planFormData, setPlanFormData] = useState({
    name: "",
    description: "",
    price: "",
    billingCycle: "monthly" as "monthly" | "yearly",
    features: [""],
    isActive: true,
    isRecommended: false,
  });

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

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: selectedPlan?.name || "",
      description: selectedPlan?.description || "",
      price: selectedPlan?.price || 0.0,
      duration: selectedPlan?.duration || "monthly",
      features: selectedPlan?.features?.map(f => ({ name: f.name })) || [{ name: "" }],
      isActive: selectedPlan?.isActive ?? true,
      isRecommended: selectedPlan?.isRecommended ?? false,
    },
    validate: zodFormikValidate(createSubscriptionPlanSchema),
    onSubmit: async (values, { resetForm }) => {
      try {
        const payload = {
          ...values,
          duration: values.duration === "monthly" ? 1 : 12,
          features: values.features.map((f) => ({
            name: f.name,
          })),
        };
        if (selectedPlan) {
          // EDIT mode
          await dispatch(
            updateSubscriptionPlanThunk({
              id: selectedPlan.id!,
              payload,
            })
          ).unwrap();
          setEditPlanDialogOpen(false);
        } else {
          // CREATE mode
          await dispatch(createSubscriptionPlanThunk(payload)).unwrap();
          setCreatePlanDialogOpen(false);
        }

        resetForm();
        setSelectedPlan(null);
      } catch (err) {
        console.error(err);
      }
    },
  });


  const fetchData = useCallback(async () => {
    try {
      await dispatch(getAllSubscriptionPlansAdminThunk()).unwrap();
    } catch (error) {
      console.error("Failed to fetch subscription plans", error);
    }
  }, [dispatch]);

  // TODO: Remove dummy
  useEffect(() => {
    fetchDummyData();
  }, [fetchData]);

  useEffect(() => {
    fetchData();
  }, []);

  // Filtered and sorted subscriptions
  const filteredSubscriptions = useMemo(() => {
    let filtered = subscriptions;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (sub) =>
          sub.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          sub.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
          sub.planName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((sub) => sub.status === statusFilter);
    }

    // Plan filter
    if (planFilter !== "all") {
      filtered = filtered.filter((sub) => sub.planId === planFilter);
    }

    // Start date filter
    if (startDateFilter) {
      filtered = filtered.filter((sub) => {
        const subStartDate = new Date(sub.startDate);
        const filterDate = new Date(startDateFilter);
        // Reset time to compare only dates
        subStartDate.setHours(0, 0, 0, 0);
        filterDate.setHours(0, 0, 0, 0);
        return subStartDate >= filterDate;
      });
    }

    // Sorting
    if (sortedColumn && sortOrder) {
      filtered = [...filtered].sort((a, b) => {
        let aValue: any = a[sortedColumn as keyof Subscription];
        let bValue: any = b[sortedColumn as keyof Subscription];

        if (sortedColumn === "startDate" || sortedColumn === "endDate") {
          aValue = new Date(aValue).getTime();
          bValue = new Date(bValue).getTime();
        }

        if (typeof aValue === "string") {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }

        if (sortOrder === "ascend") {
          return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
        } else {
          return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
        }
      });
    }

    return filtered;
  }, [subscriptions, searchTerm, statusFilter, planFilter, startDateFilter, sortedColumn, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(filteredSubscriptions.length / pageSize);
  const paginatedSubscriptions = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredSubscriptions.slice(start, start + pageSize);
  }, [filteredSubscriptions, currentPage, pageSize]);

  // Handlers
  const handleSort = (column: SortColumn) => {
    if (sortedColumn === column) {
      if (sortOrder === "ascend") {
        setSortOrder("descend");
      } else if (sortOrder === "descend") {
        setSortOrder(null);
        setSortedColumn(null);
      } else {
        setSortOrder("ascend");
      }
    } else {
      setSortedColumn(column);
      setSortOrder("ascend");
    }
    setCurrentPage(1);
  };

  // const handleCreatePlan = async () => {
  //   try {
  //     // TODO: Implement API call
  //     const newPlan: SubscriptionPlan = {
  //       id: Date.now().toString(),
  //       name: planFormData.name,
  //       description: planFormData.description,
  //       price: parseFloat(planFormData.price),
  //       billingCycle: planFormData.billingCycle,
  //       features: planFormData.features.filter((f) => f.trim()),
  //       isActive: planFormData.isActive,
  //       popular: planFormData.popular,
  //       createdAt: new Date().toISOString(),
  //       updatedAt: new Date().toISOString(),
  //     };

  //     setPlans([...plans, newPlan]);
  //     setCreatePlanDialogOpen(false);
  //     setPlanFormData({
  //       name: "",
  //       description: "",
  //       price: "",
  //       billingCycle: "monthly",
  //       features: [""],
  //       isActive: true,
  //       popular: false,
  //     });
  //     toast.success("Plan created successfully");
  //   } catch (error: any) {
  //     toast.error(error?.message || "Failed to create plan");
  //   }
  // };

  const handleEditPlan = async () => {
    if (!selectedPlan) return;

    try {
      // TODO: Implement API call
      const updatedPlans = plans.map((p) =>
        p.id === selectedPlan.id
          ? {
            ...p,
            name: planFormData.name,
            description: planFormData.description,
            price: parseFloat(planFormData.price),
            billingCycle: planFormData.billingCycle,
            features: planFormData.features.filter((f) => f.trim()),
            isActive: planFormData.isActive,
            isRecommended: planFormData.isRecommended,
            updatedAt: new Date().toISOString(),
          }
          : p
      );

      setPlans(updatedPlans);
      setEditPlanDialogOpen(false);
      setPlanFormData({
        name: "",
        description: "",
        price: "",
        billingCycle: "monthly",
        features: [""],
        isActive: true,
        isRecommended: false,
      });
      toast.success("Plan updated successfully");
    } catch (error: any) {
      toast.error(error?.message || "Failed to update plan");
    }
  };

  const handleDeletePlan = async () => {
    if (!selectedPlan) return;

    try {
      // TODO: Implement API call
      setPlans(plans.filter((p) => p.id !== selectedPlan.id));
      setDeletePlanDialogOpen(false);
      toast.success("Plan deleted successfully");
    } catch (error: any) {
      toast.error(error?.message || "Failed to delete plan");
    }
  };

  // const openEditPlanDialog = (plan: SubscriptionPlan) => {
  //   setSelectedPlan(plan);
  //   setPlanFormData({
  //     name: plan.name,
  //     description: plan.description,
  //     price: plan.price.toString(),
  //     billingCycle: plan.billingCycle,
  //     features: plan.features.length > 0 ? plan.features : [""],
  //     isActive: plan.isActive,
  //     popular: plan.popular || false,
  //   });
  //   setEditPlanDialogOpen(true);
  // };

  const openDeletePlanDialog = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan);
    setDeletePlanDialogOpen(true);
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      active: "bg-green-500/20 text-green-400 border-green-500/30",
      cancelled: "bg-red-500/20 text-red-400 border-red-500/30",
      expired: "bg-gray-500/20 text-gray-400 border-gray-500/30",
      past_due: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    };
    return (
      <span
        className={cn(
          "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
          styles[status as keyof typeof styles] || styles.active
        )}
      >
        {status.charAt(0).toUpperCase() + status.slice(1).replace("_", " ")}
      </span>
    );
  };

  const { values,
    handleChange,
    handleBlur,
    handleSubmit,
    touched,
    errors,
    setFieldValue,
    resetForm,
    isSubmitting, } = formik

  console.log('errors', errors)
  console.log('values', values)
  console.log('touched', touched)


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
          <div className="">
            <div className="p-2 border-b border-border-primary">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-text-primary">Subscriptions</h2>
                  <p className="text-sm text-text-tertiary mt-1">Manage customer subscriptions</p>
                </div>
              </div>

              {/* Filters */}
              <div className="flex flex-col lg:flex-row gap-4 justify-start lg:justify-between">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-tertiary z-10" />
                  <Input
                    type="text"
                    placeholder="Search by name, email, or plan..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="pl-10"
                    size="middle"
                  />
                </div>
                <div className="flex gap-4">
                  <DateTimePicker
                    value={startDateFilter}
                    onChange={(date) => {
                      setStartDateFilter(date);
                      setCurrentPage(1);
                    }}
                    placeholder="Filter by start date"
                    className="w-full sm:w-[200px]"
                    showDate={true}
                    showTime={false}
                  />
                  <Select value={statusFilter} onValueChange={(value) => {
                    setStatusFilter(value);
                    setCurrentPage(1);
                  }}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                      <SelectItem value="expired">Expired</SelectItem>
                      <SelectItem value="past_due">Past Due</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={planFilter} onValueChange={(value) => {
                    setPlanFilter(value);
                    setCurrentPage(1);
                  }}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder="Filter by plan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Plans</SelectItem>
                      {subscriptionPlan.map((plan) => (
                        <SelectItem key={plan.id} value={plan.id.toString()}>
                          {plan.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    type="primary"
                    className="!w-fit !px-3 "
                    icon={<RefreshCw className="w-4 h-4" />}
                    onClick={fetchData}
                  >
                  </Button>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto -mx-1 sm:mx-0">
              <div className="min-w-[1000px] p-4">
                <Table className="">
                  <TableHeader>
                    <TableRow>
                      <TableHead
                        className="cursor-pointer select-none hover:bg-bg-tertiary min-w-[150px]"
                        onClick={() => handleSort("userName")}
                      >
                        <div className="flex items-center gap-2">
                          <span>User</span>
                          {sortedColumn === "userName" && (
                            <span className="flex flex-col">
                              <ChevronUp
                                className={cn(
                                  "w-3 h-3",
                                  sortOrder === "ascend" ? "text-accent-primary" : "text-text-muted"
                                )}
                              />
                              <ChevronDown
                                className={cn(
                                  "w-3 h-3 -mt-1",
                                  sortOrder === "descend" ? "text-accent-primary" : "text-text-muted"
                                )}
                              />
                            </span>
                          )}
                        </div>
                      </TableHead>
                      <TableHead
                        className="cursor-pointer select-none hover:bg-bg-tertiary min-w-[150px]"
                        onClick={() => handleSort("planName")}
                      >
                        <div className="flex items-center gap-2">
                          <span>Plan</span>
                          {sortedColumn === "planName" && (
                            <span className="flex flex-col">
                              <ChevronUp
                                className={cn(
                                  "w-3 h-3",
                                  sortOrder === "ascend" ? "text-accent-primary" : "text-text-muted"
                                )}
                              />
                              <ChevronDown
                                className={cn(
                                  "w-3 h-3 -mt-1",
                                  sortOrder === "descend" ? "text-accent-primary" : "text-text-muted"
                                )}
                              />
                            </span>
                          )}
                        </div>
                      </TableHead>
                      <TableHead
                        className="cursor-pointer select-none hover:bg-bg-tertiary min-w-[100px]"
                        onClick={() => handleSort("status")}
                      >
                        <div className="flex items-center gap-2">
                          <span>Status</span>
                          {sortedColumn === "status" && (
                            <span className="flex flex-col">
                              <ChevronUp
                                className={cn(
                                  "w-3 h-3",
                                  sortOrder === "ascend" ? "text-accent-primary" : "text-text-muted"
                                )}
                              />
                              <ChevronDown
                                className={cn(
                                  "w-3 h-3 -mt-1",
                                  sortOrder === "descend" ? "text-accent-primary" : "text-text-muted"
                                )}
                              />
                            </span>
                          )}
                        </div>
                      </TableHead>
                      <TableHead
                        className="cursor-pointer select-none hover:bg-bg-tertiary min-w-[100px]"
                        onClick={() => handleSort("amount")}
                      >
                        <div className="flex items-center gap-2">
                          <span>Amount</span>
                          {sortedColumn === "amount" && (
                            <span className="flex flex-col">
                              <ChevronUp
                                className={cn(
                                  "w-3 h-3",
                                  sortOrder === "ascend" ? "text-accent-primary" : "text-text-muted"
                                )}
                              />
                              <ChevronDown
                                className={cn(
                                  "w-3 h-3 -mt-1",
                                  sortOrder === "descend" ? "text-accent-primary" : "text-text-muted"
                                )}
                              />
                            </span>
                          )}
                        </div>
                      </TableHead>
                      <TableHead
                        className="cursor-pointer select-none hover:bg-bg-tertiary min-w-[120px]"
                        onClick={() => handleSort("startDate")}
                      >
                        <div className="flex items-center gap-2">
                          <span>Start Date</span>
                          {sortedColumn === "startDate" && (
                            <span className="flex flex-col">
                              <ChevronUp
                                className={cn(
                                  "w-3 h-3",
                                  sortOrder === "ascend" ? "text-accent-primary" : "text-text-muted"
                                )}
                              />
                              <ChevronDown
                                className={cn(
                                  "w-3 h-3 -mt-1",
                                  sortOrder === "descend" ? "text-accent-primary" : "text-text-muted"
                                )}
                              />
                            </span>
                          )}
                        </div>
                      </TableHead>
                      <TableHead
                        className="cursor-pointer select-none hover:bg-bg-tertiary min-w-[120px]"
                        onClick={() => handleSort("endDate")}
                      >
                        <div className="flex items-center gap-2">
                          <span>End Date</span>
                          {sortedColumn === "endDate" && (
                            <span className="flex flex-col">
                              <ChevronUp
                                className={cn(
                                  "w-3 h-3",
                                  sortOrder === "ascend" ? "text-accent-primary" : "text-text-muted"
                                )}
                              />
                              <ChevronDown
                                className={cn(
                                  "w-3 h-3 -mt-1",
                                  sortOrder === "descend" ? "text-accent-primary" : "text-text-muted"
                                )}
                              />
                            </span>
                          )}
                        </div>
                      </TableHead>
                      <TableHead className="min-w-[140px]">Payment Method</TableHead>
                      <TableHead className="!text-center min-w-[140px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableSkeleton columns={8} />
                    ) : paginatedSubscriptions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8 text-text-tertiary">
                          No subscriptions found
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedSubscriptions.map((subscription) => (
                        <TableRow key={subscription.id}>
                          <TableCell className="font-medium text-text-primary">
                            <div>
                              <div className="font-medium">{subscription.userName}</div>
                              <div className="text-xs text-text-tertiary">{subscription.userEmail}</div>
                            </div>
                          </TableCell>
                          <TableCell className="text-text-primary">{subscription.planName}</TableCell>
                          <TableCell>{getStatusBadge(subscription.status)}</TableCell>
                          <TableCell className="text-accent-primary font-medium">
                            ${subscription.amount.toFixed(2)}
                            <span className="text-xs text-text-tertiary ml-1">
                              /{subscription.billingCycle === "monthly" ? "mo" : "yr"}
                            </span>
                          </TableCell>
                          <TableCell className="text-text-primary">
                            {new Date(subscription.startDate).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </TableCell>
                          <TableCell className="text-text-primary">
                            {new Date(subscription.endDate).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </TableCell>
                          <TableCell className="text-text-tertiary">{subscription.paymentMethod}</TableCell>
                          <TableCell className="text-center">
                            <Button
                              type="text"
                              size="small"
                              icon={<ChevronRight className="w-4 h-4" />}
                              onClick={(e) => {
                                e.stopPropagation();
                                router.push(`${routes.admin.subscriptions}/${subscription.id}`);
                              }}
                              className="!p-1 !h-auto !w-fit hover:bg-bg-tertiary transition-colors"
                            />
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-4 py-3 border-t border-border-primary bg-bg-secondary flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="text-sm text-text-tertiary whitespace-nowrap">
                  Showing {(currentPage - 1) * pageSize + 1} to{" "}
                  {Math.min(currentPage * pageSize, filteredSubscriptions.length)} of{" "}
                  {filteredSubscriptions.length} entries
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
                  <Select
                    value={pageSize.toString()}
                    onValueChange={(value) => {
                      setPageSize(Number(value));
                      setCurrentPage(1);
                    }}
                  >
                    <SelectTrigger className="w-full sm:w-[120px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {["10", "20", "50", "100"].map((size) => (
                        <SelectItem key={size} value={size}>
                          {size} / page
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="p-1 rounded hover:bg-bg-tertiary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4 text-text-primary" />
                    </button>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }

                        return (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            className={cn(
                              "px-2 sm:px-3 py-1 rounded text-sm transition-colors",
                              currentPage === pageNum
                                ? "bg-accent-primary text-black font-semibold"
                                : "text-text-primary hover:bg-bg-tertiary"
                            )}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>
                    <button
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="p-1 rounded hover:bg-bg-tertiary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronRight className="w-4 h-4 text-text-primary" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </TabPane>

        {/* Subscription Plans Tab */}
        <TabPane tab="Subscription Plans" tabKey="plans">
          <SubscriptionPlansWrapper />
        </TabPane>

        {/* Stripe Integration Tab */}
        <TabPane tab="Stripe Integration" tabKey="stripe">
          <div className="bg-bg-card border border-border-primary rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-text-primary flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-accent-primary" />
                  Stripe Payment Integration
                </h2>
                <p className="text-sm text-text-tertiary mt-1">
                  Manage your Stripe payment gateway settings and connection
                </p>
              </div>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30">
                <Check className="w-3 h-3 mr-1" />
                Connected
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-bg-secondary border border-border-primary rounded-lg p-4">
                <h3 className="text-sm font-semibold text-text-primary mb-3">Connection Status</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-text-tertiary">API Status</span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30">
                      Active
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-text-tertiary">Webhook Status</span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30">
                      Active
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-text-tertiary">Mode</span>
                    <span className="text-sm text-text-primary font-medium">Live</span>
                  </div>
                </div>
              </div>

              <div className="bg-bg-secondary border border-border-primary rounded-lg p-4">
                <h3 className="text-sm font-semibold text-text-primary mb-3">Payment Methods</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-text-tertiary">Credit Cards</span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-accent-primary/20 text-accent-primary border border-border-accent">
                      Enabled
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-text-tertiary">Bank Transfers</span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-500/20 text-gray-400 border border-gray-500/30">
                      Disabled
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-text-tertiary">Digital Wallets</span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-accent-primary/20 text-accent-primary border border-border-accent">
                      Enabled
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-border-primary">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-text-primary mb-1">Stripe Dashboard</h3>
                  <p className="text-xs text-text-tertiary">
                    Access your Stripe dashboard to view detailed payment information, manage customers, and configure advanced settings.
                  </p>
                </div>
                <Button
                  type="default"
                  icon={<CreditCard className="w-4 h-4" />}
                  onClick={() => window.open("https://dashboard.stripe.com", "_blank")}
                  className="!w-fit rounded-lg"
                >
                  Open Stripe Dashboard
                </Button>
              </div>
            </div>

            <div className="mt-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-yellow-400 mt-0.5 shrink-0" />
              <div className="flex-1">
                <p className="text-xs font-medium text-yellow-400 mb-1">Integration Information:</p>
                <p className="text-xs text-yellow-200">
                  All subscription payments, refunds, and cancellations are processed through Stripe.
                  Webhooks are configured to automatically sync subscription status changes with your platform.
                </p>
              </div>
            </div>
          </div>
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
