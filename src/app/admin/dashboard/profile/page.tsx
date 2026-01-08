"use client";

import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/Dialog";
import { Pencil, Save, Lock, Shield, CreditCard, Calendar, Mail, User, Settings, Activity, TrendingUp, ShieldCheck, CheckCircle2, X, Package, MoreVertical, AlertCircle, Check, Clock, Loader2 } from "lucide-react";
import { useState, useEffect, useRef, ReactElement } from "react";
import { Skeleton } from "@/components/ui/Skeleton";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { useAppDispatch, useAppSelector } from "@/redux/store/hooks";
import { changeAdminPasswordThunk, editAdminProfileThunk } from "@/redux/thunk/profileThunk";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import { clearError, clearSuccessMessage } from "@/redux/slice/profileSlice";
import { changePasswordSchema } from "@/utilities/schema";
import { zodFormikValidate } from "@/utilities/zodFormikValidate";
import { getAllSubscriptionPlansThunk } from "@/redux/thunk/subscriptionPlanThunk";
import { cancelScheduledPlanChangeThunk, changeUserSubscriptionPlanSelfThunk, createCheckoutSessionThunk, getUserSubscriptionSelfThunk, revokeUserSubscriptionSelfThunk } from "@/redux/thunk/subscriptionThunk";
import { getUserByIdThunk } from "@/redux/thunk/userThunk";
import { clearSubscriptionSuccess } from "@/redux/slice/subscriptionSlice";
import { format } from "date-fns";
import { Dropdown, DropdownContent, DropdownItem, DropdownTrigger } from "@/components/ui/Dropdown";
import { Popup } from "@/components/ui/Popup";
import PricingCardSkeleton from "@/components/PricingCardSkeleton";
import ProfilePageSkeleton, { CurrentPlanSkeleton, NoSubscription } from "@/components/ProfileInfoSkeleton";

export default function ProfilePage() {
  const { data: session, update } = useSession();
  const user = session?.user

  const firstNameRef = useRef<HTMLInputElement>(null);
  const lastNameRef = useRef<HTMLInputElement>(null);
  const phoneNoRef = useRef<HTMLInputElement>(null);
  const [isEditProfile, setIsEditProfile] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [subscriptionOpen, setSubscriptionOpen] = useState(false);
  const [billing, setBilling] = useState(false);
  const [cancelConfirmOpen, setCancelConfirmOpen] = useState(false);
  const [scheduleCancelConfirmOpen, setScheduleCancelConfirmOpen] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null);
  const [processingCheckout, setProcessingCheckout] = useState(false);
  const [changingPlan, setChangingPlan] = useState(false);
  const [revokingPlan, setRevokingPlan] = useState(false);
  const [cancellingSchedule, setCancellingSchedule] = useState(false);
  const [twoFAOpen, setTwoFAOpen] = useState(false);
  const [twoFACode, setTwoFACode] = useState("");
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    phoneNo: "",
  });
  const [formValues, setFormValues] = useState({
    firstName: "",
    lastName: "",
    phoneNo: "",
  });

  const dispatch = useAppDispatch();
  const { isLoading, error, successConfirmPassMessage } = useAppSelector(
    (state) => state.profile
  );
  const { userPlans: plans, isLoading: plansLoading } = useAppSelector(
    (state) => state.subscriptionPlan
  );
  const { selectedUser, isLoading: userLoading, error: userError } = useAppSelector((state) => state.user);
  const {
    currentSubscription,
    isLoading: subscriptionLoading,
    error: subscriptionError,
    successMessage,
    checkoutUrl
  } = useAppSelector((state) => state.subscription);

  const formik = useFormik({
    initialValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validate: zodFormikValidate(changePasswordSchema),
    onSubmit: async (values) => {
      try {
        await dispatch(changeAdminPasswordThunk(values)).unwrap();
        formik.resetForm();
        setChangePasswordOpen(false);
      } catch (err: any) {
        toast.error(err?.message || error || "Failed to change password", { theme: "dark" });
      }
    },
  });

  const getUserName = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return user?.email || "User";
  };

  const getUserInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    return user?.email?.[0]?.toUpperCase() || "U";
  };

  const PLAN_TIER_MAP: Record<string, 1 | 2 | 3> = {
    'Free Plan': 1,
    'Yearly Plan': 2,
    'Monthly Plan': 3,
  };

  const PLAN_UI_CONFIG: Record<string, { icon: ReactElement }> = {
    'Free Plan': {
      icon: <Package className="w-6 h-6" />,
    },
    'Monthly Plan': {
      icon: <CreditCard className="w-6 h-6" />,
    },
    'Yearly Plan': {
      icon: <TrendingUp className="w-6 h-6" />,
    },
  };

  const mappedPlans = plans.map((plan) => {
    const uiConfig = PLAN_UI_CONFIG[plan.name];
    const period = plan.duration === 12 ? 'per year' : 'per month';
    const basePrice = Number(plan.price) ?? 0;
    const discountPercent = Number(plan.discountPercent) ?? 0;
    const discountedPrice =
      discountPercent > 0
        ? Number((basePrice * (1 - discountPercent / 100)).toFixed(2))
        : basePrice;

    return {
      id: plan.id,
      name: plan.name,
      description: plan.description ?? '',
      price: discountedPrice,
      originalPrice: plan.price,
      period,
      isTrial: plan.isTrial,
      trialDays: plan.trialDays,
      popular: plan.isRecommended ?? false,
      discountPercent: plan.discountPercent,
      tier: PLAN_TIER_MAP[plan.name] || 1,
      icon: uiConfig?.icon ?? <Package className="w-6 h-6" />,
      features: plan.features.map((feature) => feature.name),
      stripePriceId: plan.stripePriceId,
    };
  });

  const handleCancelPlan = async () => {
    try {
      setRevokingPlan(true);
      await dispatch(revokeUserSubscriptionSelfThunk()).unwrap();
      setCancelConfirmOpen(false);
      toast.success("Subscription cancellation scheduled");
      if (user?.id) {
        await dispatch(getUserSubscriptionSelfThunk());
        await dispatch(getUserByIdThunk(Number(user.id)));
      }
    } catch (err: any) {
      console.error("Failed to cancel subscription:", err);
      toast.error(err?.message || "Failed to cancel subscription", { theme: "dark" });
    } finally {
      setRevokingPlan(false);
    }
  };

  const handleChangePlan = async () => {
    if (!selectedPlanId) return;

    try {
      setChangingPlan(true);
      const result = await dispatch(changeUserSubscriptionPlanSelfThunk({ newPlanId: selectedPlanId })).unwrap();

      toast.success(result?.message || "Plan change scheduled successfully", { theme: "dark" });
      setSubscriptionOpen(false);
      setSelectedPlanId(null);
      if (user?.id) {
        await dispatch(getUserSubscriptionSelfThunk());
        await dispatch(getUserByIdThunk(Number(user.id)));
      }
    } catch (err: any) {
      console.error("Failed to change plan:", err);
      toast.error(err?.message || "Failed to change subscription plan", { theme: "dark" });
    } finally {
      setChangingPlan(false);
    }
  };

  const handleCancelScheduledChange = async () => {
    try {
      setCancellingSchedule(true);
      await dispatch(cancelScheduledPlanChangeThunk()).unwrap();
      setScheduleCancelConfirmOpen(false);
      toast.success("Scheduled plan change cancelled", { theme: "dark" });
      if (user?.id) {
        await dispatch(getUserSubscriptionSelfThunk());
        await dispatch(getUserByIdThunk(Number(user.id)));
      }
    } catch (err: any) {
      console.error("Failed to cancel scheduled change:", err);
      toast.error(err?.message || "Failed to cancel scheduled change", { theme: "dark" });
    } finally {
      setCancellingSchedule(false);
    }
  };

  const handleUpgradePlan = async (planId: number) => {
    try {
      setProcessingCheckout(true);
      await dispatch(createCheckoutSessionThunk(planId)).unwrap();
    } catch (err: any) {
      setProcessingCheckout(false);
      console.error("Failed to create checkout session:", err);
      toast.error(err?.message || "Failed to start checkout. Try again.", { theme: "dark" });
    }
  };

  const fetchUserDetail = async () => {
    try {
      await Promise.allSettled([
        dispatch(getUserByIdThunk(Number(user?.id))),
        dispatch(getUserSubscriptionSelfThunk()),
      ]);
    } catch (err: any) {
      console.error(err.message || "Failed to fetch user details");
    }
  };

  useEffect(() => {
    if (subscriptionOpen) {
      dispatch(getAllSubscriptionPlansThunk());
      setSelectedPlanId(null);
    }
  }, [subscriptionOpen, dispatch]);

  useEffect(() => {
    if (user?.id) {
      fetchUserDetail();
    }
  }, [user?.id, dispatch]);

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage, { theme: "dark" });
      dispatch(clearSubscriptionSuccess());
      if (user?.id) {
        dispatch(getUserSubscriptionSelfThunk());
        dispatch(getUserByIdThunk(Number(user.id)));
      }
    }

    if (subscriptionError) {
      toast.error(subscriptionError, { theme: "dark" });
      dispatch(clearError());
    }
  }, [successMessage, subscriptionError, dispatch, user?.id]);

  useEffect(() => {
    if (checkoutUrl) {
      window.location.href = checkoutUrl;
      setProcessingCheckout(false);
    }
  }, [checkoutUrl]);

  useEffect(() => {
    if (session?.user) {
      const data = {
        firstName: session.user.firstName,
        lastName: session.user.lastName,
        phoneNo: session.user.phoneNo
      };
      setProfile(data);
      setFormValues(data);
    }
  }, [session]);

  useEffect(() => {
    if (successConfirmPassMessage) {
      toast.success(successConfirmPassMessage, { theme: "dark" });
      dispatch(clearSuccessMessage());
    }
    if (error) {
      toast.error(error, { theme: "dark" });
      dispatch(clearError());
    }
  }, [successConfirmPassMessage, error, dispatch]);

  const handleEditProfile = async () => {
    setIsEditProfile(!isEditProfile);
    if (isEditProfile) {
      const isDirty =
        formValues.firstName.trim() !== profile.firstName.trim() ||
        formValues.lastName.trim() !== profile.lastName.trim() ||
        formValues.phoneNo.trim() !== profile.phoneNo.trim();

      if (!isDirty) {
        setIsEditProfile(false);
        toast.info("No changes to save", { theme: "dark" });
        return;
      }

      try {
        setUpdating(true);
        const updatedUser = await dispatch(
          editAdminProfileThunk({
            id: session!.user.id,
            firstName: formValues.firstName.trim(),
            lastName: formValues.lastName.trim(),
            phoneNo: formValues.phoneNo.trim(),
          })
        ).unwrap();

        setProfile({
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          phoneNo: updatedUser.phoneNo || "",
        });

        update({
          user: {
            ...session?.user,
            firstName: updatedUser.firstName,
            lastName: updatedUser.lastName,
            phoneNo: updatedUser.phoneNo,
          },
        });

        setIsEditProfile(false);
        toast.success("Profile updated successfully", { theme: "dark" });
      } catch (err: any) {
        console.error("Failed to update profile:", err);
        toast.error(err?.message || "Failed to update profile", { theme: "dark" });
      } finally {
        setUpdating(false);
      }
    }
  };

  const handleChange =
    (field: keyof typeof formValues) =>
      (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormValues(prev => ({
          ...prev,
          [field]: e.target.value,
        }));
      };

  const handleCancel = () => {
    setFormValues(profile);
    setIsEditProfile(false);
  };

  const isPageLoading = isLoading || userLoading || subscriptionLoading;
  const isPopupLoading = plansLoading || changingPlan || revokingPlan || cancellingSchedule;
  const hasActiveSubscription = Boolean(currentSubscription &&
    (currentSubscription.status === 'ACTIVE' || currentSubscription.status === 'TRIAL'));
  const currentPlanName = currentSubscription?.plan?.name ?? null;
  const currentPlanId = currentPlanName
    ? mappedPlans.find((p) => p.name === currentPlanName)?.id ?? null
    : null;
  const nextPlan = currentSubscription?.nextPlan;
  const hasScheduledChange = Boolean(currentSubscription?.nextPlanId && currentSubscription?.scheduledChangeAt);
  const isPaidUser = currentSubscription?.status === "ACTIVE";
  const hasUsedTrial = selectedUser?.isTrial || isPaidUser;

  const isFreePlan = (plan: any) => {
    if (plan.trialDays > 0) return true;
    if (plan.price === 0) return true;
    const planName = plan.name?.toLowerCase() || '';
    if (planName.includes('free')) return true;
    return false;
  };

  const isPlanDisabled = (plan: any) => {
    const isCurrentPlan = plan.id === currentPlanId;
    const freePlan = isFreePlan(plan);
    if (isCurrentPlan && !hasScheduledChange) return true;
    if (freePlan && hasUsedTrial && !isCurrentPlan) return true;
    return false;
  };

  const calculateDaysRemaining = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const diffTime = end.getTime() - now.getTime();
    const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  };

  const handleManageSubscription = () => {
    if (!hasActiveSubscription) {
      setSubscriptionOpen(true);
    } else {
      setBilling(true);
    }
  };

  const getSubscriptionStatusBadge = (status: string) => {
    const styles = {
      ACTIVE: "bg-green-500/20 text-green-400 border-green-500/30",
      CANCELED: "bg-red-500/20 text-red-400 border-red-500/30",
      EXPIRED: "bg-gray-500/20 text-gray-400 border-gray-500/30",
      REFUNDED: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      TRIAL: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      PAST_DUE: "bg-orange-500/20 text-orange-400 border-orange-500/30",
    };
    return (
      <span
        className={cn(
          "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
          styles[status as keyof typeof styles] || styles.ACTIVE
        )}
      >
        {status.charAt(0).toUpperCase() + status.slice(1).replace("_", " ")}
      </span>
    );
  };

  return (
    <>
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-1 text-text-primary">Profile</h1>
        <p className="text-text-tertiary text-sm">Manage your account settings and preferences</p>
      </div>

      {isPageLoading && !subscriptionOpen && !billing && !cancelConfirmOpen && !scheduleCancelConfirmOpen ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-48 w-full rounded-lg" />
            <Skeleton className="h-64 w-full rounded-lg" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-64 w-full rounded-lg" />
            <Skeleton className="h-48 w-full rounded-lg" />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Information Card */}
            <div className="bg-bg-card border border-border-primary rounded-lg p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-accent-primary/10 border border-accent-primary/20 flex items-center justify-center">
                    <span className="text-xl font-bold text-accent-primary">
                      {getUserInitials()}
                    </span>
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-text-primary mb-1">{getUserName()}</h2>
                    <p className="text-sm text-text-tertiary">{user?.email}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {isEditProfile && (
                    <Button
                      type="text"
                      size="small"
                      danger
                      icon={<X className="w-4 h-4" />}
                      onClick={handleCancel}
                      className="!w-9 !h-9 border border-error"
                    />
                  )}
                  <Button
                    type="primary"
                    size="small"
                    icon={isEditProfile ? <Save className="w-4 h-4" /> : <Pencil className="w-4 h-4" />}
                    onClick={handleEditProfile}
                    className="!w-9 !h-9"
                    loading={updating}
                  />
                </div>
              </div>

              {/* User Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-text-tertiary mb-1.5 block font-medium">First Name</label>
                  {isEditProfile ? (
                    <Input
                      value={formValues.firstName}
                      ref={firstNameRef}
                      size="middle"
                      onChange={handleChange("firstName")}
                    />
                  ) : (
                    <p className="text-sm text-text-primary">{user?.firstName || "N/A"}</p>
                  )}
                </div>
                <div>
                  <label className="text-xs text-text-tertiary mb-1.5 block font-medium">Last Name</label>
                  {isEditProfile ? (
                    <Input
                      value={formValues.lastName}
                      ref={lastNameRef}
                      size="middle"
                      onChange={handleChange("lastName")}
                    />
                  ) : (
                    <p className="text-sm text-text-primary">{user?.lastName || "N/A"}</p>
                  )}
                </div>
                <div>
                  <label className="text-xs text-text-tertiary mb-1.5 block font-medium">Phone Number</label>
                  {isEditProfile ? (
                    <Input
                      value={formValues.phoneNo}
                      ref={phoneNoRef}
                      size="middle"
                      onChange={handleChange("phoneNo")}
                    />
                  ) : (
                    <p className="text-sm text-text-primary">{user?.phoneNo || "N/A"}</p>
                  )}
                </div>
                <div>
                  <label className="text-xs text-text-tertiary mb-1.5 block font-medium">Email</label>
                  <p className="text-sm text-text-primary">{user?.email || "N/A"}</p>
                </div>
                <div>
                  <label className="text-xs text-text-tertiary mb-1.5 block font-medium">Role</label>
                  <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-accent-primary/10 text-accent-primary border border-accent-primary/20">
                    {user?.role || "USER"}
                  </span>
                </div>
                <div>
                  <label className="text-xs text-text-tertiary mb-1.5 block font-medium">Subscription Plan</label>
                  <p className="text-sm text-text-primary">{currentSubscription?.plan?.name || "N/A"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Current Plan */}
            {subscriptionLoading && !subscriptionOpen && !billing ? (
              <div className="bg-bg-card border border-border-primary rounded-lg p-6">
                <CurrentPlanSkeleton />
              </div>
            ) : subscriptionError || userError ? (
              <div className="bg-bg-card border border-red-500/30 rounded-lg p-6">
                <div className="flex flex-col items-center justify-center text-center space-y-4 py-6">
                  <AlertCircle className="w-8 h-8 text-red-400" />
                  <div>
                    <h3 className="text-lg font-semibold text-text-primary mb-2">Failed to Load Subscription</h3>
                    <p className="text-sm text-text-tertiary mb-1">
                      {subscriptionError || userError || "We couldn't load your subscription details."}
                    </p>
                    <Button
                      type="primary"
                      onClick={fetchUserDetail}
                      className="mt-4 !w-fit"
                    >
                      Retry
                    </Button>
                  </div>
                </div>
              </div>
            ) : !currentSubscription ? (
              <div className="bg-bg-card border border-border-primary rounded-lg p-6">
                <NoSubscription />
              </div>
            ) : (
              <div className="bg-bg-card border border-border-primary rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-accent-primary" />
                    <span className="text-sm font-medium text-text-primary">Current Plan</span>
                  </div>
                  <Dropdown>
                    <DropdownTrigger
                      className="!w-8 !h-8 !p-0 !bg-transparent !border-border-primary hover:!bg-bg-secondary"
                      icon={<MoreVertical className="w-4 h-4 text-text-tertiary" />}
                      disabled={changingPlan || revokingPlan}
                    />
                    <DropdownContent className="!bg-bg-card !border-border-primary">
                      <DropdownItem
                        onClick={() => setSubscriptionOpen(true)}
                        disabled={changingPlan || revokingPlan}
                      >
                        Change plan
                      </DropdownItem>
                      <DropdownItem
                        danger
                        onClick={() => setCancelConfirmOpen(true)}
                        disabled={currentSubscription.status === 'CANCELED' || revokingPlan || changingPlan}
                      >
                        Cancel plan
                      </DropdownItem>
                    </DropdownContent>
                  </Dropdown>
                </div>

                {hasScheduledChange && nextPlan && (
                  <div className="mb-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2 flex-1">
                        <Clock className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                        <div className="text-sm">
                          <p className="text-blue-400 font-medium">Plan Change Scheduled</p>
                          <p className="text-blue-300">
                            Changing to <span className="font-semibold">{nextPlan.name}</span> on{' '}
                            {format(new Date(currentSubscription.scheduledChangeAt!), 'MMM dd, yyyy')}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => setScheduleCancelConfirmOpen(true)}
                        className="p-1 rounded-md text-blue-400 hover:text-blue-300 hover:bg-blue-400/10 transition"
                        disabled={cancellingSchedule}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {currentSubscription.status === 'CANCELED' && (
                  <div className="mb-4 p-3 bg-orange-500/10 border border-orange-500/30 rounded-lg">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                      <div className="text-sm">
                        <p className="text-orange-400 font-medium">Cancellation Scheduled</p>
                        <p className="text-orange-300">
                          Your subscription will end on{' '}
                          {format(new Date(currentSubscription.endDate), 'MMM dd, yyyy')}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <h3 className="text-2xl font-bold text-accent-primary mb-2">
                  {currentSubscription.plan.name}
                  {hasScheduledChange && (
                    <span className="text-sm text-text-tertiary ml-2">
                      → {nextPlan?.name}
                    </span>
                  )}
                </h3>
                <p className="text-sm text-text-tertiary mb-4">
                  {currentSubscription.plan.description}
                </p>
                <div className="mb-6">
                  <span className="text-3xl font-bold text-accent-primary">
                    ${currentSubscription.plan.price.toFixed(2)}
                  </span>
                  <span className="text-sm text-text-tertiary ml-1">
                    {currentSubscription.plan.duration === 12 ? '/year' : '/month'}
                  </span>

                  {hasActiveSubscription && (
                    <div className="mt-2 flex items-center gap-2 text-sm text-text-tertiary">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {calculateDaysRemaining(currentSubscription.endDate)} days remaining
                      </span>
                    </div>
                  )}
                </div>
                <div className="pt-4 border-t border-border-primary">
                  <h4 className="text-xs font-semibold text-text-primary uppercase tracking-wider mb-4">
                    Included Features
                  </h4>
                  <div className="space-y-3">
                    {currentSubscription.plan.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <Check className="w-4 h-4 text-accent-primary" />
                        <span className="text-sm text-text-primary">{feature.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Account Actions */}
            <div className="bg-bg-card border border-border-primary rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-text-primary">Account Actions</h3>
              </div>
              <div className="space-y-3">
                <button
                  onClick={() => setChangePasswordOpen(true)}
                  className="w-full flex items-center gap-3 p-3 text-left rounded-lg border border-border-primary bg-bg-secondary hover:bg-bg-tertiary transition-colors group disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={changingPlan || revokingPlan}
                >
                  <div className="w-10 h-10 rounded-lg bg-accent-primary/10 flex items-center justify-center group-hover:bg-accent-primary/20 transition-colors">
                    <Lock className="w-5 h-5 text-accent-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-text-primary">Change Password</p>
                    <p className="text-xs text-text-tertiary">Update your account password</p>
                  </div>
                </button>

                <button
                  onClick={handleManageSubscription}
                  className="w-full flex items-center gap-3 p-3 text-left rounded-lg border border-border-primary bg-bg-secondary hover:bg-bg-tertiary transition-colors group disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={changingPlan || revokingPlan}
                >
                  <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center group-hover:bg-purple-500/20 transition-colors">
                    <CreditCard className="w-5 h-5 text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-text-primary">Billing & Subscription</p>
                    <p className="text-xs text-text-tertiary">
                      {hasActiveSubscription
                        ? "Manage your subscription"
                        : "No active subscription"}
                    </p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Change Password Dialog */}
      <Dialog open={changePasswordOpen} onOpenChange={setChangePasswordOpen}>
        <DialogContent showCloseButton className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>
              Update your account password. Make sure to use a strong password.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={formik.handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-text-primary mb-2 block">
                Current Password
              </label>
              <Input
                type="password"
                name="currentPassword"
                value={formik.values.currentPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter current password"
              />
              {formik.touched.currentPassword && formik.errors.currentPassword && (
                <p className="mt-1 text-xs text-red-400">{formik.errors.currentPassword}</p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium text-text-primary mb-2 block">
                New Password
              </label>
              <Input
                type="password"
                name="newPassword"
                value={formik.values.newPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter new password"
              />
              {formik.touched.newPassword && formik.errors.newPassword && (
                <p className="mt-1 text-xs text-red-400">{formik.errors.newPassword}</p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium text-text-primary mb-2 block">
                Confirm New Password
              </label>
              <Input
                type="password"
                name="confirmPassword"
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Confirm new password"
              />
              {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                <p className="mt-1 text-xs text-red-400">{formik.errors.confirmPassword}</p>
              )}
            </div>
            <DialogFooter className="flex justify-end">
              <Button type="text" className="!w-fit border border-error" danger onClick={() => { formik.resetForm(); setChangePasswordOpen(false); }}>
                Cancel
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                className="!w-fit"
                disabled={isLoading}
              >
                {isLoading ? "Updating..." : "Change Password"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Change Plan Popup */}
      {subscriptionOpen && (
        <Popup
          open={subscriptionOpen}
          contentClassName="!max-h-[80vh] !w-[90vw] lg:!w-5xl"
          onOpenChange={(open) => {
            setSubscriptionOpen(open);
            if (!open) {
              setSelectedPlanId(null);
            }
          }}
          title="Manage Subscription"
          description={hasActiveSubscription
            ? "Change your subscription plan. Changes take effect at the end of your current billing period."
            : "Choose a subscription plan to get started."
          }
          footer={
            <div className="flex flex-col-reverse sm:flex-row justify-end items-center gap-3 w-full">
              <Button
                className="!w-full sm:!w-fit"
                onClick={() => {
                  setSubscriptionOpen(false);
                  setSelectedPlanId(null);
                }}
                disabled={changingPlan || processingCheckout}
              >
                Cancel
              </Button>
              {hasActiveSubscription ? (
                <Button
                  type="primary"
                  className="!w-full sm:!w-fit"
                  onClick={handleChangePlan}
                  disabled={!selectedPlanId || hasScheduledChange || changingPlan}
                  loading={changingPlan}
                >
                  {changingPlan ? "Processing..." : "Schedule Change"}
                </Button>
              ) : selectedPlanId ? (
                <Button
                  type="primary"
                  className="!w-full sm:!w-fit"
                  onClick={() => handleUpgradePlan(selectedPlanId)}
                  loading={processingCheckout}
                  disabled={processingCheckout || changingPlan}
                >
                  Subscribe Now
                </Button>
              ) : null}
            </div>
          }
        >
          <div className="pt-4">
            {isPopupLoading ? (
              <PricingCardSkeleton />
            ) : (
              <div className="space-y-4">
                {hasActiveSubscription && currentSubscription && (
                  <div className="p-4 bg-accent-primary/10 border border-accent-primary/30 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-accent-primary">Current Plan</p>
                        <p className="text-lg font-bold text-text-primary">{currentSubscription.plan.name}</p>
                        <p className="text-sm text-text-tertiary">
                          Active until {format(new Date(currentSubscription.endDate), 'MMM dd, yyyy')}
                          {hasScheduledChange && (
                            <span className="ml-2 text-blue-400">
                              (Change to {nextPlan?.name} scheduled)
                            </span>
                          )}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-text-tertiary">Remaining</p>
                        <p className="text-lg font-bold text-text-primary">
                          {calculateDaysRemaining(currentSubscription.endDate)} days
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {mappedPlans.map((plan) => {
                    const isCurrentPlan = plan.id === currentPlanId;
                    const isSelected = selectedPlanId === plan.id;
                    const freePlan = isFreePlan(plan);
                    const isDisabled = isPlanDisabled(plan);
                    const isScheduledNextPlan = hasScheduledChange && plan.id === currentSubscription?.nextPlanId;

                    return (
                      <div
                        key={plan.id}
                        onClick={() => {
                          if (!isDisabled) {
                            setSelectedPlanId(plan.id);
                          }
                        }}
                        className={cn(
                          "relative p-6 rounded-xl border cursor-pointer transition-all duration-300",
                          isCurrentPlan
                            ? "bg-accent-primary/10 border-accent-primary/50"
                            : isSelected
                              ? "bg-accent-primary/10 border-accent-primary shadow-lg"
                              : "bg-bg-secondary border-border-primary hover:border-accent-primary/30 hover:bg-bg-tertiary",
                          isDisabled && "cursor-not-allowed opacity-50"
                        )}
                      >
                        {isCurrentPlan && (
                          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                            <span className="px-3 py-1 rounded-full text-xs font-bold shadow-lg bg-accent-primary text-white">
                              Current Plan
                            </span>
                          </div>
                        )}

                        {isScheduledNextPlan && (
                          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                            <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                              Scheduled Change
                            </span>
                          </div>
                        )}

                        {hasUsedTrial && freePlan && !isCurrentPlan && (
                          <div className="absolute -top-3 right-3 z-10">
                            <span className="bg-gray-700 text-gray-200 px-3 py-1 rounded-full text-xs font-semibold">
                              Trial already used
                            </span>
                          </div>
                        )}

                        {isSelected && !isCurrentPlan && !isScheduledNextPlan && (
                          <div className="absolute top-3 right-3">
                            <div className="w-6 h-6 rounded-full bg-accent-primary flex items-center justify-center">
                              <Check className="w-4 h-4 text-white" />
                            </div>
                          </div>
                        )}

                        {isCurrentPlan && !hasScheduledChange && (
                          <div className="absolute top-3 right-3">
                            <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                              <Check className="w-4 h-4 text-white" />
                            </div>
                          </div>
                        )}

                        <div className="mb-4">
                          <div className="w-12 h-12 rounded-xl bg-accent-primary/10 flex items-center justify-center text-accent-primary mb-3">
                            {plan.icon}
                          </div>
                          <h3 className="text-xl font-bold text-text-primary mb-1">{plan.name}</h3>
                          {plan.description && (
                            <p className="text-text-tertiary text-sm">{plan.description}</p>
                          )}
                        </div>

                        <div className="mb-4">
                          {plan.trialDays ? (
                            <p className="text-2xl font-extrabold text-accent-primary">
                              {plan.trialDays}-day Free Trial
                            </p>
                          ) : (
                            <div className="flex items-baseline gap-1">
                              <span className="text-3xl font-extrabold text-accent-primary">
                                ${plan.price}
                              </span>
                              <span className="text-text-tertiary text-sm">{plan.period}</span>
                            </div>
                          )}
                        </div>

                        <div className="space-y-2 mb-4">
                          {plan.features.slice(0, 3).map((feature, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <Check className="w-4 h-4 text-green-400" />
                              <span className="text-sm text-text-secondary">{feature}</span>
                            </div>
                          ))}
                        </div>

                        {isCurrentPlan ? (
                          <div className="text-center p-2 rounded-lg text-sm font-medium bg-green-500/20 text-green-400">
                            Current Plan
                          </div>
                        ) : isScheduledNextPlan ? (
                          <div className="text-center p-2 bg-blue-500/20 text-blue-400 rounded-lg text-sm">
                            Scheduled Change
                          </div>
                        ) : isDisabled ? (
                          <div className="text-center p-2 bg-gray-500/20 text-gray-400 rounded-lg text-sm">
                            {freePlan && hasUsedTrial ? "Trial Already Used" : "Not Available"}
                          </div>
                        ) : (
                          <div className={cn(
                            "text-center p-2 rounded-lg text-sm font-medium",
                            isSelected
                              ? "bg-accent-primary text-white"
                              : "bg-bg-secondary text-text-primary hover:bg-bg-tertiary"
                          )}>
                            {isSelected
                              ? "Selected"
                              : hasActiveSubscription
                                ? "Select to Change"
                                : "Select to Subscribe"}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </Popup>
      )}

      {/* Cancel Plan Confirmation */}
      {cancelConfirmOpen && (
        <Popup
          open={cancelConfirmOpen}
          onOpenChange={setCancelConfirmOpen}
          title="Cancel current plan?"
          description={
            currentSubscription?.status === "CANCELED"
              ? "Your subscription is already scheduled for cancellation."
              : "Your plan will stay active until it expires. No further billing will occur."
          }
          contentClassName="!max-h-[80vh] !w-[60vw] lg:!w-lg sm:max-w-sm"
          footer={
            <div className="flex justify-end gap-3 w-full">
              <Button
                onClick={() => setCancelConfirmOpen(false)}
                className="!w-fit"
                disabled={revokingPlan}
              >
                Keep Plan
              </Button>
              {currentSubscription?.status !== "CANCELED" && (
                <Button
                  type="primary"
                  danger
                  loading={revokingPlan}
                  onClick={handleCancelPlan}
                  className="!w-fit"
                  disabled={revokingPlan}
                >
                  {revokingPlan ? "Cancelling..." : "Confirm Cancel"}
                </Button>
              )}
            </div>
          }
        >
          <div className="space-y-4">
            {currentSubscription && (
              <div className="p-3 bg-bg-secondary rounded-lg">
                <p className="text-sm text-text-primary">
                  <strong>Current Plan:</strong> {currentSubscription.plan.name}
                </p>
                <p className="text-sm text-text-primary mt-1">
                  <strong>Active until:</strong>{" "}
                  {format(new Date(currentSubscription.endDate), "MMM dd, yyyy")}
                </p>
                {hasScheduledChange && (
                  <p className="text-sm text-blue-400 mt-2 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    You have a scheduled change to {nextPlan?.name}. Cancelling will remove this change.
                  </p>
                )}
              </div>
            )}
          </div>
        </Popup>
      )}

      {/* Cancel Scheduled Change Confirmation */}
      {scheduleCancelConfirmOpen && (
        <Popup
          open={scheduleCancelConfirmOpen}
          onOpenChange={setScheduleCancelConfirmOpen}
          title="Cancel scheduled plan change?"
          description="Your subscription will remain on the current plan. The scheduled upgrade or downgrade will be removed."
          contentClassName="!max-h-[80vh] !w-[60vw] lg:!w-lg sm:max-w-sm"
          footer={
            <div className="flex justify-end gap-3 w-full">
              <Button
                onClick={() => setScheduleCancelConfirmOpen(false)}
                className="!w-fit"
                disabled={cancellingSchedule}
              >
                Keep Change
              </Button>
              <Button
                type="primary"
                danger
                loading={cancellingSchedule}
                onClick={handleCancelScheduledChange}
                className="!w-fit"
                disabled={cancellingSchedule}
              >
                {cancellingSchedule ? "Cancelling..." : "Confirm Cancel"}
              </Button>
            </div>
          }
        >
          <div className="space-y-4">
            <div className="p-3 bg-bg-secondary rounded-lg space-y-2">
              <p className="text-sm text-text-primary">
                <strong>Current Plan:</strong> {currentSubscription?.plan.name}
              </p>
              <p className="text-sm text-blue-400 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                Scheduled to change to <strong>{nextPlan?.name}</strong>
              </p>
              <p className="text-sm text-text-primary">
                <strong>Change Date:</strong>{" "}
                {currentSubscription?.scheduledChangeAt && format(new Date(currentSubscription.scheduledChangeAt), "MMM dd, yyyy")}
              </p>
            </div>
          </div>
        </Popup>
      )}

      {/* Billing Details Dialog */}
      {billing && (
        <Popup
          open={billing}
          onOpenChange={setBilling}
          title="Subscription Details"
          description={
            hasActiveSubscription
              ? "View your current subscription plan and billing information."
              : "You don't have an active subscription."
          }
          contentClassName="!max-h-[80vh] !w-[40vw] lg:!w-lg sm:max-w-sm"
        >
          {subscriptionLoading ? (
            <CurrentPlanSkeleton />
          ) : !currentSubscription ? (
            <div className="text-center py-8">
              <Package className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-text-primary mb-2">
                No Active Subscription
              </h3>
              <p className="text-text-tertiary mb-6">
                Get started with a plan to unlock all features
              </p>
              <Button
                type="primary"
                onClick={() => {
                  setBilling(false);
                  setSubscriptionOpen(true);
                }}
              >
                Browse Plans
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="p-4 rounded-lg bg-bg-secondary border border-border-primary">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-text-primary">
                      {currentSubscription.plan.name}
                      {hasScheduledChange && (
                        <span className="text-sm text-blue-400 ml-2">
                          → {nextPlan?.name}
                        </span>
                      )}
                    </h3>
                    <p className="text-sm text-text-tertiary">
                      {currentSubscription.status.charAt(0).toUpperCase() +
                        currentSubscription.status.slice(1).toLowerCase()}{" "}
                      Subscription
                    </p>
                  </div>
                  {getSubscriptionStatusBadge(currentSubscription.status)}
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-text-tertiary">Plan Price</span>
                    <span className="text-lg font-semibold text-accent-primary">
                      ${currentSubscription.plan.price.toFixed(2)}
                      {currentSubscription.plan.duration === 12 ? "/year" : "/month"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-text-tertiary">Billing Cycle</span>
                    <span className="text-sm text-text-primary">
                      {currentSubscription.plan.duration === 12
                        ? "Yearly"
                        : "Monthly"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-text-tertiary">
                      {currentSubscription.status === "CANCELED"
                        ? "Ends on"
                        : "Next Billing Date"}
                    </span>
                    <span className="text-sm text-text-primary">
                      {format(
                        new Date(currentSubscription.endDate),
                        "MMM dd, yyyy"
                      )}
                    </span>
                  </div>

                  {hasScheduledChange && (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-text-tertiary">
                          Scheduled Change
                        </span>
                        <span className="text-sm text-blue-400">
                          To {nextPlan?.name}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-text-tertiary">
                          Change Date
                        </span>
                        <span className="text-sm text-blue-400">
                          {format(
                            new Date(currentSubscription.scheduledChangeAt!),
                            "MMM dd, yyyy"
                          )}
                        </span>
                      </div>
                    </>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-text-tertiary">Days Remaining</span>
                    <span className="text-sm text-text-primary">
                      {calculateDaysRemaining(currentSubscription.endDate)} days
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-text-primary">Plan Features</h4>
                <div className="space-y-2">
                  {currentSubscription.plan.features?.length ? (
                    currentSubscription.plan.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-accent-primary" />
                        <span className="text-sm text-text-secondary">
                          {feature.name}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-text-tertiary">
                      No features listed.
                    </p>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-border-primary flex flex-col sm:flex-row gap-3">
                {hasActiveSubscription &&
                  currentSubscription.status !== "CANCELED" && (
                    <>
                      <Button
                        type="default"
                        danger
                        className="w-full"
                        onClick={() => {
                          setBilling(false);
                          setCancelConfirmOpen(true);
                        }}
                      >
                        Cancel Subscription
                      </Button>
                      <Button
                        type="primary"
                        className="w-full"
                        onClick={() => {
                          setBilling(false);
                          setSubscriptionOpen(true);
                        }}
                      >
                        Change Plan
                      </Button>
                    </>
                  )}
              </div>
            </div>
          )}
        </Popup>
      )}
    </>
  );
}
