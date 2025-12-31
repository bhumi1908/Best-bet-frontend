"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    ArrowLeft,
    User,
    Mail,
    CreditCard,
    Calendar,
    DollarSign,
    Check,
    ArrowUp,
    ArrowDown,
    Ban,
    RefreshCw,
    AlertCircle,
    CheckCircle,
    XCircle,
    Clock,
    FileText,
    Shield,
    Package,
    Activity,
    MoreVertical,
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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/Dialog";
import { cn } from "@/lib/utils";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "@/redux/store/hooks";
import { getSubscriptionDetailsAdminThunk } from "@/redux/thunk/subscriptionThunk";
import SubscriptionDetailsSkeleton from "@/components/SubscritionDetailSkeleton";
import { Dropdown, DropdownContent, DropdownItem, DropdownTrigger } from "@/components/ui/Dropdown";

// Types
interface SubscriptionPlan {
    id: string;
    name: string;
    description: string;
    price: number;
    billingCycle: "monthly" | "yearly";
    features: string[];
    isActive: boolean;
    annualPrice?: number;
}

interface Subscription {
    id: string;
    userId: string;
    userName: string;
    userEmail: string;
    userPhone?: string;
    userJoinDate: string;
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
    autoRenewal: boolean;
    totalPaid: number;
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
    description?: string;
}

const formatDate = (date?: string | Date) =>
    date
        ? new Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        }).format(new Date(date))
        : "-";


export default function SubscriptionDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const subscriptionId = params.id as string;

    // State
    const [loading, setLoading] = useState(true);
    const [subscription, setSubscription] = useState<Subscription | null>(null);
    const [currentPlan, setCurrentPlan] = useState<SubscriptionPlan | null>(null);
    const [availablePlans, setAvailablePlans] = useState<SubscriptionPlan[]>([]);
    const [payments, setPayments] = useState<Payment[]>([]);

    // Dialog states
    const [upgradeDialogOpen, setUpgradeDialogOpen] = useState(false);
    const [downgradeDialogOpen, setDowngradeDialogOpen] = useState(false);
    const [revokeDialogOpen, setRevokeDialogOpen] = useState(false);
    const [refundDialogOpen, setRefundDialogOpen] = useState(false);

    // Form states
    const [selectedUpgradePlan, setSelectedUpgradePlan] = useState<string>("");
    const [selectedDowngradePlan, setSelectedDowngradePlan] = useState<string>("");
    const [refundFormData, setRefundFormData] = useState({
        amount: "",
        reason: "",
    });

    const dispatch = useAppDispatch();
    const { selectedSubscription, isLoading } = useAppSelector((state) => state.subscription)

    console.log('selectedSubscription', selectedSubscription)

    const fetchSubscriptionDetails = async () => {
        try {
            dispatch(getSubscriptionDetailsAdminThunk(Number(subscriptionId))).unwrap();
        } catch (error: any) {
            console.error("Failed to fetch subscriptions details:", error.message || error);
        }
    }

    // Fetch data
    useEffect(() => {
        const fetchSubscriptionDetails = async () => {
            try {
                setLoading(true);
                // TODO: Replace with actual API call
                await new Promise((resolve) => setTimeout(resolve, 1000));

                // Mock subscription data
                const mockSubscription: Subscription = {
                    id: subscriptionId,
                    userId: "user_123",
                    userName: "John Doe",
                    userEmail: "john.doe@example.com",
                    userPhone: "+1 (555) 123-4567",
                    userJoinDate: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
                    planId: "2",
                    planName: "Premium Plan",
                    status: "active",
                    amount: 19.99,
                    billingCycle: "monthly",
                    startDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
                    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
                    nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
                    paymentMethod: "Credit Card (****4242)",
                    stripeSubscriptionId: "sub_1234567890",
                    stripeCustomerId: "cus_1234567890",
                    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
                    autoRenewal: true,
                    totalPaid: 39.98,
                };

                // Mock plan data
                const mockPlan: SubscriptionPlan = {
                    id: "2",
                    name: "Premium Plan",
                    description: "Best value for serious players",
                    price: 19.99,
                    annualPrice: 199.99,
                    billingCycle: "monthly",
                    features: [
                        "Daily Pick 3 Predictions",
                        "Access to All States",
                        "Full Draw History",
                        "Priority Email Support",
                        "Advanced Hit Tracker",
                        "Weekly Performance Reports",
                        "Early Access to New Features",
                    ],
                    isActive: true,
                };

                // Mock available plans
                const mockPlans: SubscriptionPlan[] = [
                    {
                        id: "1",
                        name: "Basic Plan",
                        description: "Perfect for getting started",
                        price: 9.99,
                        annualPrice: 99.99,
                        billingCycle: "monthly",
                        features: [
                            "Daily Pick 3 Predictions",
                            "Access to 1 State",
                            "Draw History (Last 30 Days)",
                            "Email Support",
                            "Basic Hit Tracker",
                        ],
                        isActive: true,
                    },
                    {
                        id: "3",
                        name: "VIP Plan",
                        description: "Ultimate experience for maximum success",
                        price: 39.99,
                        annualPrice: 399.99,
                        billingCycle: "monthly",
                        features: [
                            "Everything in Premium",
                            "Real-time Predictions",
                            "24/7 Priority Support",
                            "Custom Prediction Requests",
                            "Monthly Strategy Consultation",
                            "Exclusive VIP Community Access",
                            "Money-Back Guarantee",
                            "Advanced Pattern Recognition",
                        ],
                        isActive: true,
                    },
                ];

                // Mock payment history
                const mockPayments: Payment[] = [
                    {
                        id: "pay_1",
                        subscriptionId: subscriptionId,
                        amount: 19.99,
                        status: "succeeded",
                        paymentMethod: "Credit Card",
                        transactionId: "txn_1234567890",
                        date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
                        description: "Monthly subscription payment",
                    },
                ];

                setSubscription(mockSubscription);
                setCurrentPlan(mockPlan);
                setAvailablePlans(mockPlans);
                setPayments(mockPayments);
            } catch (error: any) {
                console.error("Failed to fetch subscription details:", error);
                toast.error(error?.message || "Failed to fetch subscription details");
            } finally {
                setLoading(false);
            }
        };

        fetchSubscriptionDetails();
    }, [subscriptionId]);

    // Handlers
    const handleUpgrade = async () => {
        if (!selectedUpgradePlan) {
            toast.error("Please select a plan to upgrade to");
            return;
        }

        try {
            // TODO: Implement Stripe subscription upgrade API call
            const selectedPlan = availablePlans.find((p) => p.id === selectedUpgradePlan);
            toast.success(`Subscription upgraded to ${selectedPlan?.name || "selected plan"} successfully`);
            setUpgradeDialogOpen(false);
            setSelectedUpgradePlan("");
            // Refresh data
            window.location.reload();
        } catch (error: any) {
            toast.error(error?.message || "Failed to upgrade subscription");
        }
    };

    const handleDowngrade = async () => {
        if (!selectedDowngradePlan) {
            toast.error("Please select a plan to downgrade to");
            return;
        }

        try {
            // TODO: Implement Stripe subscription downgrade API call
            const selectedPlan = availablePlans.find((p) => p.id === selectedDowngradePlan);
            toast.success(`Subscription will be downgraded to ${selectedPlan?.name || "selected plan"} at the end of the billing cycle`);
            setDowngradeDialogOpen(false);
            setSelectedDowngradePlan("");
            // Refresh data
            window.location.reload();
        } catch (error: any) {
            toast.error(error?.message || "Failed to downgrade subscription");
        }
    };

    const handleRevoke = async () => {
        try {
            // TODO: Implement Stripe subscription cancellation API call
            toast.success("Subscription revoked successfully");
            setRevokeDialogOpen(false);
            // Refresh data
            window.location.reload();
        } catch (error: any) {
            toast.error(error?.message || "Failed to revoke subscription");
        }
    };

    const handleRefund = async () => {
        try {
            // TODO: Implement Stripe refund API call
            const refundAmount = parseFloat(refundFormData.amount);
            toast.success(`Refund of $${refundAmount.toFixed(2)} processed successfully`);
            setRefundDialogOpen(false);
            setRefundFormData({ amount: "", reason: "" });
            // Refresh data
            window.location.reload();
        } catch (error: any) {
            toast.error(error?.message || "Failed to process refund");
        }
    };

    const getStatusBadge = (status: string) => {
        const styles = {
            active: {
                bg: "bg-green-500/20",
                text: "text-green-400",
                border: "border-green-500/30",
                icon: CheckCircle,
            },
            cancelled: {
                bg: "bg-red-500/20",
                text: "text-red-400",
                border: "border-red-500/30",
                icon: XCircle,
            },
            expired: {
                bg: "bg-gray-500/20",
                text: "text-gray-400",
                border: "border-gray-500/30",
                icon: Clock,
            },
            past_due: {
                bg: "bg-yellow-500/20",
                text: "text-yellow-400",
                border: "border-yellow-500/30",
                icon: AlertCircle,
            },
        };
        const style = styles[status as keyof typeof styles] || styles.active;
        const Icon = style.icon;

        return (
            <span
                className={cn(
                    "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border",
                    style.bg,
                    style.text,
                    style.border
                )}
            >
                <Icon className="w-4 h-4" />
                {status.charAt(0).toUpperCase() + status.slice(1).replace("_", " ")}
            </span>
        );
    };

    const getPaymentStatusBadge = (status: string) => {
        console.log('status', status)
        const styles = {
            SUCCESS: "bg-green-500/20 text-green-400 border-green-500/30",
            PENDING: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
            FAILED: "bg-red-500/20 text-red-400 border-red-500/30",
            REFUNDED: "bg-gray-500/20 text-gray-400 border-gray-500/30",
        };
        return (
            <span
                className={cn(
                    "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border",
                    styles[status as keyof typeof styles] || styles.SUCCESS
                )}
            >
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    useEffect(() => {
        if (subscriptionId) fetchSubscriptionDetails();
    }, [subscriptionId]);

    if (isLoading) {
        return (
            <SubscriptionDetailsSkeleton />
        )
    }

    if (!selectedSubscription) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-text-primary mb-2">Subscription Not Found</h2>
                    <p className="text-text-tertiary mb-4">The subscription you're looking for doesn't exist.</p>
                    <Button type="primary" onClick={() => router.push("/admin/dashboard/subscription")}>
                        Back to Subscriptions
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-8">
            {/* Page Header */}
            <div className="flex gap-2 w-fit">
                <Button size="small" className="!w-fit !p-2 h-fit mt-2.5" icon={<ArrowLeft className="w-5 h-5" />} onClick={() => router.back()}>
                </Button>
                <div>
                    <h1 className="text-2xl sm:text-4xl font-bold mt-2 mb-2 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text text-transparent">
                        Subscription Details
                    </h1>
                    <p className="text-text-tertiary text-sm sm:text-base">Comprehensive view of subscription #{selectedSubscription.subscriptionId}</p>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 justify-end">
                <Button
                    danger
                    icon={<Ban className="w-4 h-4" />}
                    onClick={() => setRevokeDialogOpen(true)}
                    disabled={selectedSubscription.status !== "ACTIVE"}
                    className="!w-fit border border-border-error"
                >
                    Revoke Access
                </Button>
                <Button
                    type="default"
                    icon={<RefreshCw className="w-4 h-4" />}
                    onClick={() => {
                        setRefundFormData({ amount: selectedSubscription.plan.price.toString(), reason: "" });
                        setRefundDialogOpen(true);
                    }}
                    disabled={selectedSubscription.status !== "ACTIVE"}
                    className="!w-fit"
                >
                    Process Refund
                </Button>

            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - User & Subscription Info */}
                <div className="lg:col-span-2 space-y-6">
                    {/* User Details Card */}
                    <div className="bg-bg-card border border-border-primary rounded-lg p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-lg bg-accent-primary/20 border border-border-accent flex items-center justify-center">
                                <User className="w-5 h-5 text-accent-primary" />
                            </div>
                            <h2 className="text-xl font-semibold text-text-primary">User Information</h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <label className="text-xs font-semibold text-text-muted mb-2 block tracking-wide uppercase">
                                    Full Name
                                </label>
                                <p className="text-base text-text-primary font-medium">{selectedSubscription.user.name}</p>
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-text-muted mb-2 block tracking-wide uppercase">
                                    Email Address
                                </label>
                                <p className="text-base text-text-primary flex items-center gap-2">
                                    <Mail className="w-4 h-4 text-text-tertiary" />
                                    {selectedSubscription?.user.email}
                                </p>
                            </div>
                            {selectedSubscription?.user.phoneNo && (
                                <div>
                                    <label className="text-xs font-semibold text-text-muted mb-2 block tracking-wide uppercase">
                                        Phone Number
                                    </label>
                                    <p className="text-base text-text-primary">{selectedSubscription.user.phoneNo}</p>
                                </div>
                            )}
                            <div>
                                <label className="text-xs font-semibold text-text-muted mb-2 block tracking-wide uppercase">
                                    User ID
                                </label>
                                <p className="text-base text-text-primary font-mono text-sm">{selectedSubscription.user.id}</p>
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-text-muted mb-2 block tracking-wide uppercase">
                                    Member Since
                                </label>
                                <p className="text-base text-text-primary">
                                    {formatDate(selectedSubscription.user.createdAt)}
                                </p>
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-text-muted mb-2 block tracking-wide uppercase">
                                    Stripe Customer ID
                                </label>
                                <p className="text-base text-text-primary font-mono text-sm">
                                    {selectedSubscription.user.stripeCustomerId || "N/A"}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Subscription Details Card */}
                    <div className="bg-bg-card border border-border-primary rounded-lg p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-lg bg-accent-primary/20 border border-border-accent flex items-center justify-center">
                                <Activity className="w-5 h-5 text-accent-primary" />
                            </div>
                            <h2 className="text-xl font-semibold text-text-primary">Subscription Details</h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <label className="text-xs font-semibold text-text-muted mb-2 block tracking-wide uppercase">
                                    Subscription ID
                                </label>
                                <p className="text-base text-text-primary font-mono text-sm">{selectedSubscription.subscriptionId}</p>
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-text-muted mb-2 block tracking-wide uppercase">
                                    Status
                                </label>
                                <div>{getStatusBadge(selectedSubscription!.status)}</div>
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-text-muted mb-2 block tracking-wide uppercase">
                                    Start Date
                                </label>
                                <p className="text-base text-text-primary flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-text-tertiary" />

                                    {formatDate(selectedSubscription.startDate)}
                                </p>
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-text-muted mb-2 block tracking-wide uppercase">
                                    End Date
                                </label>
                                <p className="text-base text-text-primary flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-text-tertiary" />
                                    {formatDate(selectedSubscription.endDate)}
                                </p>
                            </div>
                            {subscription?.endDate && selectedSubscription.status === "ACTIVE" && (
                                <div>
                                    <label className="text-xs font-semibold text-text-muted mb-2 block tracking-wide uppercase">
                                        Next Billing Date
                                    </label>
                                    <p className="text-base text-accent-primary font-medium flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        {formatDate(selectedSubscription.endDate)}
                                    </p>
                                </div>
                            )}
                            <div>
                                <label className="text-xs font-semibold text-text-muted mb-2 block tracking-wide uppercase">
                                    Billing Cycle
                                </label>
                                <p className="text-base text-text-primary capitalize">{selectedSubscription.plan.duration === 1 ? 'monthly' : 'yearly'}</p>
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-text-muted mb-2 block tracking-wide uppercase">
                                    Payment Method
                                </label>
                                <p className="text-base text-text-primary flex items-center gap-2">
                                    <CreditCard className="w-4 h-4 text-text-tertiary" />
                                    {selectedSubscription.payment?.paymentMethod}
                                </p>
                            </div>
                            {selectedSubscription.payment?.stripePaymentId && (
                                <div>
                                    <label className="text-xs font-semibold text-text-muted mb-2 block tracking-wide uppercase">
                                        Stripe Subscription ID
                                    </label>
                                    <p className="text-base text-text-primary font-mono text-sm">
                                        {selectedSubscription.payment?.stripePaymentId}
                                    </p>
                                </div>
                            )}
                            {selectedSubscription.payment?.stripePaymentId && (
                                <div>
                                    <label className="text-xs font-semibold text-text-muted mb-2 block tracking-wide uppercase">
                                        Stripe Payment ID
                                    </label>
                                    <p className="text-base text-text-primary font-mono text-sm">
                                        {selectedSubscription.payment.stripePaymentId}
                                    </p>
                                </div>
                            )}

                        </div>
                    </div>

                    {/* Payment History Card */}
                    <div className="bg-bg-card border border-border-primary rounded-lg p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-lg bg-accent-primary/20 border border-border-accent flex items-center justify-center">
                                <FileText className="w-5 h-5 text-accent-primary" />
                            </div>
                            <h2 className="text-xl font-semibold text-text-primary">Payment History</h2>
                        </div>
                        <div className="space-y-3">
                            {!selectedSubscription.payment ? (
                                <p className="text-text-tertiary text-center py-8">No payment history available</p>
                            ) : (
                                <div
                                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-bg-secondary border border-border-primary rounded-lg hover:border-border-accent transition-colors"
                                >
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <p className="font-medium text-text-primary">
                                                ${selectedSubscription.payment.amount.toFixed(2)}
                                            </p>
                                            {getPaymentStatusBadge(selectedSubscription.payment.status)}
                                        </div>
                                        {selectedSubscription.plan.duration && (
                                            <p className="text-sm text-text-tertiary">{selectedSubscription.plan.duration === 1 ? 'Monthly subscription payment' : 'Yearly subscription payment'}</p>
                                        )}
                                        <p className="text-xs text-text-muted mt-1">
                                            Transaction ID: {selectedSubscription.payment.stripePaymentId}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="text-right">
                                            <p className="text-sm text-text-primary">
                                                {formatDate(selectedSubscription.payment.createdAt)}
                                            </p>
                                            <p className="text-xs text-text-tertiary">{selectedSubscription.payment.paymentMethod}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column - Plan Details */}
                <div className="space-y-6">
                    {/* Current Plan Card */}
                    <div className="bg-gradient-to-br from-accent-primary/10 via-bg-card to-bg-card border-2 border-accent-primary/30 rounded-lg p-6 shadow-lg">
                        <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-accent-primary/20 border border-border-accent flex items-center justify-center">
                                <Package className="w-5 h-5 text-accent-primary" />
                            </div>
                            <h2 className="text-xl font-semibold text-text-primary">Current Plan</h2>
                        </div>
                          <Dropdown>
                                <DropdownTrigger className="!w-fit !p-2 border-none bg-transparent hover:bg-bg-secondary rounded-lg">
                                    <MoreVertical className="w-5 h-5 text-text-tertiary" />
                                </DropdownTrigger>

                                <DropdownContent className="!w-50 !min-w-0">
                                    <DropdownItem
                                        icon={<ArrowUp className="w-4 h-4" />}
                                        onClick={() => setUpgradeDialogOpen(true)}
                                        disabled={selectedSubscription.status !== "ACTIVE"}
                                    >
                                        Upgrade Plan
                                    </DropdownItem>

                                    <DropdownItem
                                        icon={<ArrowDown className="w-4 h-4" />}
                                        onClick={() => setDowngradeDialogOpen(true)}
                                        disabled={selectedSubscription.status !== "ACTIVE"}
                                        danger
                                    >
                                        Downgrade Plan
                                    </DropdownItem>
                                </DropdownContent>
                            </Dropdown>
                        </div>
                        <div className="mb-4">
                            <h3 className="text-2xl font-bold text-accent-primary mb-1">{selectedSubscription.plan.name}</h3>
                            <p className="text-sm text-text-tertiary">{selectedSubscription.plan.description}</p>
                        </div>
                        <div className="mb-6">
                            <div className="flex items-baseline gap-1">
                                <span className="text-4xl font-bold text-text-primary">
                                    ${selectedSubscription.plan.price.toFixed(2)}
                                </span>
                                <span className="text-text-tertiary">
                                    /{selectedSubscription.plan.duration === 1 ? "month" : "year"}
                                </span>
                            </div>
                        </div>
                        <div className="space-y-3 mb-6">
                            <p className="text-xs font-semibold text-text-muted tracking-wide uppercase">
                                Included Features
                            </p>
                            {selectedSubscription.plan.features.map((feature, idx) => (
                                <div key={idx} className="flex items-start gap-3">
                                    <div className="w-5 h-5 rounded-full bg-accent-primary/15 border border-border-accent flex items-center justify-center shrink-0 mt-0.5">
                                        <Check className="w-3.5 h-3.5 text-accent-primary" />
                                    </div>
                                    <span className="text-sm text-text-primary">{feature.name}</span>
                                </div>
                            ))}

                        </div>
                    </div>

                    {/* Quick Actions Info Card */}
                    <div className="bg-bg-card border border-border-primary rounded-lg p-6">
                        <div className="flex items-start gap-3 mb-4">
                            <Shield className="w-5 h-5 text-accent-primary mt-0.5" />
                            <div>
                                <h3 className="text-sm font-semibold text-text-primary mb-2">Admin Actions</h3>
                                <p className="text-xs text-text-tertiary leading-relaxed">
                                    Use the action buttons above to manage this subscription. All changes are processed
                                    through Stripe and will be reflected immediately.
                                </p>
                            </div>
                        </div>
                        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 flex items-start gap-2 mt-4">
                            <AlertCircle className="w-4 h-4 text-yellow-400 mt-0.5 shrink-0" />
                            <p className="text-xs text-yellow-400">
                                Be cautious when revoking or refunding subscriptions as these actions may impact user
                                experience.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Upgrade Dialog */}
            <Dialog open={upgradeDialogOpen} onOpenChange={setUpgradeDialogOpen}>
                <DialogContent showCloseButton>
                    <DialogHeader>
                        <DialogTitle>Upgrade Subscription</DialogTitle>
                        <DialogDescription>
                            Upgrade {selectedSubscription.user.name}'s subscription from {selectedSubscription.plan.name} to a higher
                            tier plan.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <label className="text-xs text-text-muted mb-1 block">Select New Plan</label>
                            <Select value={selectedUpgradePlan} onValueChange={setSelectedUpgradePlan}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a plan to upgrade to" />
                                </SelectTrigger>
                                <SelectContent>
                                    {availablePlans
                                        // .filter((plan) => plan.isActive && plan.price > subscription.amount)
                                        .map((plan) => (
                                            <SelectItem key={plan.id} value={plan.id}>
                                                {plan.name} - ${plan.price.toFixed(2)}/mo
                                            </SelectItem>
                                        ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 flex items-start gap-2">
                            <AlertCircle className="w-4 h-4 text-yellow-400 mt-0.5 shrink-0" />
                            <p className="text-xs text-yellow-400">
                                The subscription will be upgraded immediately. The user will be charged the prorated
                                difference for the current billing cycle.
                            </p>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="default" onClick={() => setUpgradeDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="primary" onClick={handleUpgrade}>
                            Upgrade Subscription
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Downgrade Dialog */}
            <Dialog open={downgradeDialogOpen} onOpenChange={setDowngradeDialogOpen}>
                <DialogContent showCloseButton>
                    <DialogHeader>
                        <DialogTitle>Downgrade Subscription</DialogTitle>
                        <DialogDescription>
                            Downgrade {selectedSubscription.user.name}'s subscription from {selectedSubscription.plan.name} to a lower
                            tier plan.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <label className="text-xs text-text-muted mb-1 block">Select New Plan</label>
                            <Select value={selectedDowngradePlan} onValueChange={setSelectedDowngradePlan}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a plan to downgrade to" />
                                </SelectTrigger>
                                <SelectContent>
                                    {availablePlans
                                        // .filter((plan) => plan.isActive && plan.price < subscription.amount)
                                        .map((plan) => (
                                            <SelectItem key={plan.id} value={plan.id}>
                                                {plan.name} - ${plan.price.toFixed(2)}/mo
                                            </SelectItem>
                                        ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 flex items-start gap-2">
                            <AlertCircle className="w-4 h-4 text-yellow-400 mt-0.5 shrink-0" />
                            <p className="text-xs text-yellow-400">
                                The subscription will be downgraded at the end of the current billing cycle. The user
                                will retain access to premium features until then.
                            </p>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="default" onClick={() => setDowngradeDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="primary" onClick={handleDowngrade}>
                            Downgrade Subscription
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Revoke Dialog */}
            <Dialog open={revokeDialogOpen} onOpenChange={setRevokeDialogOpen}>
                <DialogContent showCloseButton>
                    <DialogHeader>
                        <DialogTitle>Revoke Subscription</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to revoke the subscription for {selectedSubscription.user.name}? This will
                            cancel the subscription immediately and the user will lose access to premium features.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                        <div>
                            <p className="text-xs text-red-400 font-medium mb-1">Warning: This action is immediate</p>
                            <p className="text-xs text-red-300">
                                This will cancel the subscription through Stripe. The user will be notified and will not
                                be charged for future billing cycles.
                            </p>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="default" onClick={() => setRevokeDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="primary" danger onClick={handleRevoke}>
                            Revoke Subscription
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Refund Dialog */}
            <Dialog open={refundDialogOpen} onOpenChange={setRefundDialogOpen}>
                <DialogContent showCloseButton>
                    <DialogHeader>
                        <DialogTitle>Process Refund</DialogTitle>
                        <DialogDescription>
                            Process a refund for {selectedSubscription.user.name}'s subscription payment.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <label className="text-xs text-text-muted mb-1 block">Refund Amount ($)</label>
                            <Input
                                type="number"
                                step="0.01"
                                value={refundFormData.amount}
                                onChange={(e) => setRefundFormData({ ...refundFormData, amount: e.target.value })}
                                placeholder="0.00"
                            />
                            <p className="text-xs text-text-muted mt-1">
                                {/* Maximum refundable: ${subscription.amount.toFixed(2)} */}
                            </p>
                        </div>
                        <div>
                            <label className="text-xs text-text-muted mb-1 block">Reason (optional)</label>
                            <textarea
                                value={refundFormData.reason}
                                onChange={(e) => setRefundFormData({ ...refundFormData, reason: e.target.value })}
                                placeholder="Reason for refund..."
                                className="w-full min-h-[80px] px-3 py-2 text-sm bg-bg-primary border border-border-primary rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-border-accent"
                            />
                        </div>
                        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 flex items-start gap-2">
                            <AlertCircle className="w-4 h-4 text-yellow-400 mt-0.5 shrink-0" />
                            <p className="text-xs text-yellow-400">
                                This will process the refund through Stripe. The refund will be issued to the original
                                payment method within 5-10 business days.
                            </p>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="default" onClick={() => setRefundDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="primary" onClick={handleRefund}>
                            Process Refund
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

