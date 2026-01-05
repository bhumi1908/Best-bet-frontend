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
    RotateCcw,
    Hourglass,
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
import { changeUserSubscriptionPlanAdminThunk, getSubscriptionDetailsAdminThunk, refundSubscriptionPaymentAdminThunk, revokeUserSubscriptionAdminThunk } from "@/redux/thunk/subscriptionThunk";
import SubscriptionDetailsSkeleton from "@/components/SubscritionDetailSkeleton";
import { Dropdown, DropdownContent, DropdownItem, DropdownTrigger } from "@/components/ui/Dropdown";
import { getAllSubscriptionPlansAdminThunk } from "@/redux/thunk/subscriptionPlanThunk";
import { Plan } from "@/types/subscription";
import { Feature } from "@/types/subscriptionPlan";

// Types
interface SubscriptionPlan {
    id: number;
    name: string;
    isActive: boolean;
    price?: number | null;
    duration?: number;
    description: string;
    features: Feature[];
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
    const { plans: availablePlans } = useAppSelector((state) => state.subscriptionPlan)

    const fetchSubscriptionDetails = async () => {
        try {
            await dispatch(getSubscriptionDetailsAdminThunk(Number(subscriptionId))).unwrap();
            await dispatch(getAllSubscriptionPlansAdminThunk()).unwrap();
        } catch (error: any) {
            console.error("Failed to fetch subscriptions details:", error.message || error);
        }
    }

    // Handlers
    const handleUpgrade = async () => {
        if (!selectedUpgradePlan) return toast.error("Please select a plan to upgrade to");
        try {

            if (selectedSubscription?.user?.id) {
                await dispatch(
                    changeUserSubscriptionPlanAdminThunk({
                        userId: selectedSubscription.user.id,
                        newPlanId: Number(selectedUpgradePlan),
                    })
                ).unwrap();

                toast.success("Subscription upgraded successfully");
                setUpgradeDialogOpen(false);
                setSelectedUpgradePlan("");
            }
        } catch (err: any) {
            toast.error(err?.message || "Failed to upgrade subscription");
        }
    };

    const handleDowngrade = async () => {
        if (!selectedDowngradePlan) return toast.error("Please select a plan to downgrade to");

        try {
            if (selectedSubscription?.user?.id) {
                await dispatch(
                    changeUserSubscriptionPlanAdminThunk({
                        userId: selectedSubscription.user.id,
                        newPlanId: Number(selectedDowngradePlan),
                    })
                ).unwrap();

                toast.success("Subscription downgrade scheduled at billing cycle end");
                setDowngradeDialogOpen(false);
                setSelectedDowngradePlan("");
            }
        } catch (err: any) {
            toast.error(err?.message || "Failed to downgrade subscription");
        }
    };

    const handleRevoke = async () => {
        try {
            await dispatch(
                revokeUserSubscriptionAdminThunk(selectedSubscription!.user.id)
            ).unwrap();

            toast.success("Subscription revoked successfully");
            setRevokeDialogOpen(false);
        } catch (err: any) {
            toast.error(err?.message || "Failed to revoke subscription");
        }
    };

    const handleRefund = async () => {
        const amount = parseFloat(refundFormData.amount);
        if (!amount || amount <= 0) return toast.error("Enter a valid refund amount");

        try {
            const paymentIntentId = selectedSubscription?.payment?.stripePaymentId;

            if (!paymentIntentId) {
                toast.error("No payment intent found for this subscription");
                return;
            }

            await dispatch(
                refundSubscriptionPaymentAdminThunk({
                    paymentIntentId: paymentIntentId,
                    amount,
                    reason: refundFormData.reason,
                })
            ).unwrap();

            toast.success(`Refund of $${amount.toFixed(2)} processed successfully`);
            setRefundDialogOpen(false);
            setRefundFormData({ amount: "", reason: "" });
        } catch (err: any) {
            toast.error(err?.message || "Failed to process refund");
        }
    };

    const getStatusBadge = (status: string) => {
        const styles = {
            ACTIVE: {
                bg: "bg-green-500/20",
                text: "text-green-400",
                border: "border-green-500/30",
                icon: CheckCircle,
            },
            CANCELED: {
                bg: "bg-red-500/20",
                text: "text-red-400",
                border: "border-red-500/30",
                icon: XCircle,
            },
            EXPIRED: {
                bg: "bg-gray-500/20",
                text: "text-gray-400",
                border: "border-gray-500/30",
                icon: Clock,
            },
            REFUNDED: {
                bg: "bg-yellow-500/20",
                text: "text-yellow-400",
                border: "border-yellow-500/30",
                icon: RotateCcw,
            },
            TRIAL: {
                bg: "bg-blue-500/20",
                text: "text-blue-400",
                border: "border-blue-500/30",
                icon: Hourglass,
            },
        };
        const style = styles[status as keyof typeof styles] || styles.ACTIVE;
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
        const styles = {
            SUCCESS: "bg-green-500/20 text-green-400 border-green-500/30",
            PENDING: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
            FAILED: "bg-red-500/20 text-red-400 border-red-500/30",
            REFUNDED: "bg-gray-500/20 text-gray-400 border-gray-500/30",
            TRIAL: "bg-blue-500/20 text-blue-400 border-blue-500/30",
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
    }, [subscriptionId, dispatch]);

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

    const hasUpgradePlans = availablePlans.some(
        (plan) => plan.isActive && plan.price !== undefined && plan.price > (selectedSubscription.plan.price ?? 0)
    );

    const isValidDowngradePlan = (plan: SubscriptionPlan) => {
        const currentPrice = selectedSubscription.plan.price ?? 0;
        const planPrice = plan.price ?? 0;
        if (!plan.isActive) return false;
        if (plan.id === selectedSubscription.plan.id) return false;
        if (planPrice >= currentPrice) return false;
        if (plan.price === null && selectedSubscription.user.isTrial) return false;

        return true;
    };

    const downgradePlans = availablePlans.filter((plan: SubscriptionPlan) => {
        const currentPrice = selectedSubscription.plan.price ?? 0;
        const planPrice = plan.price ?? 0;

        if (!plan.isActive) return false;
        if (plan.id === selectedSubscription.plan.id) return false;
        if (planPrice >= currentPrice) return false;
        if (plan.price === null && selectedSubscription.user.isTrial) return false;

        return true;
    })

    const hasDowngradePlans = downgradePlans.length > 0;

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
                    disabled={selectedSubscription.status !== "ACTIVE" && selectedSubscription.status !== "TRIAL"}
                    className="!w-fit border border-border-error"
                >
                    Revoke Access
                </Button>
                <Button
                    type="default"
                    icon={<RefreshCw className="w-4 h-4" />}
                    onClick={() => {
                        setRefundFormData({ amount: "", reason: "" });
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
                            {selectedSubscription?.endDate && selectedSubscription.status === "ACTIVE" && (
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
                                <p className="text-base text-text-primary capitalize">{selectedSubscription.status === "TRIAL" ? "Trial" : selectedSubscription.plan.duration === 1 ? 'monthly' : 'yearly'}</p>
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-text-muted mb-2 block tracking-wide uppercase">
                                    Payment Method
                                </label>
                                <p className="text-base text-text-primary flex items-center gap-2">
                                    <CreditCard className="w-4 h-4 text-text-tertiary" />
                                    {selectedSubscription.status !== "TRIAL" ? selectedSubscription.payment?.paymentMethod : "N/A"}
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
                                        disabled={!hasUpgradePlans || (selectedSubscription.status !== "ACTIVE" && selectedSubscription.status !== "TRIAL")}
                                        className={`${!hasUpgradePlans || (selectedSubscription.status !== "ACTIVE" && selectedSubscription.status !== "TRIAL")
                                            ? "text-gray-400 cursor-not-allowed opacity-50"
                                            : "text-text cursor-pointer hover:bg-gray-100"
                                            }`}
                                    >
                                        Upgrade Plan
                                    </DropdownItem>

                                    <DropdownItem
                                        icon={<ArrowDown className="w-4 h-4" />}
                                        onClick={() => setDowngradeDialogOpen(true)}
                                        disabled={!hasDowngradePlans || (selectedSubscription.status !== "ACTIVE" && selectedSubscription.status !== "TRIAL")}
                                        className={`${!hasDowngradePlans ||  (selectedSubscription.status !== "ACTIVE" && selectedSubscription.status !== "TRIAL")
                                            ? "text-gray-400 cursor-not-allowed opacity-50"
                                            : "text-text cursor-pointer hover:bg-gray-100"
                                            }`}
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
                        {selectedSubscription.status !== "TRIAL" && <div className="mb-6">
                            <div className="flex items-baseline gap-1">
                                <span className="text-4xl font-bold text-text-primary">
                                    ${selectedSubscription.plan.price ? selectedSubscription.plan.price.toFixed(2) : "FREE"}
                                </span>
                                <span className="text-text-tertiary">
                                    /{selectedSubscription.plan.duration === 1 ? "month" : "year"}
                                </span>
                            </div>
                        </div>}
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
                                    <SelectValue>
                                        {availablePlans.find(p => p.id.toString() === selectedUpgradePlan)?.name || "Select a plan to upgrade to"}
                                    </SelectValue>

                                </SelectTrigger>
                                <SelectContent>
                                    {availablePlans
                                        .filter((plan) => plan.isActive && plan.price !== undefined && plan.price > (selectedSubscription.plan.price ?? 0))
                                        .map((plan) => (
                                            <SelectItem key={plan.id} value={plan.id.toString()}>
                                                {plan.name} - {plan.price !== undefined ? `$${plan.price.toFixed(2)}${plan.duration === 1 ? '/mo' : '/yr'}` : "Free Trial"}
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
                                    <SelectValue>
                                        {availablePlans.find(p => p.id.toString() === selectedDowngradePlan)?.name || "Select a plan to downgrade to"}
                                    </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                    {availablePlans
                                        .filter(isValidDowngradePlan)
                                        .map((plan) => (
                                            <SelectItem key={plan.id} value={plan.id.toString()}>
                                                {plan.name} - {plan.price ? `$${plan.price.toFixed(2)}${plan.duration === 1 ? '/mo' : '/yr'}` : "Free Trial"}
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

