"use client";

import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/Dialog";
import { Pencil, Save, Lock, Shield, CreditCard, Mail, User, Activity, X, Package, Check, MoreVertical, Target, Star, Award, CheckCircle2, AlertCircle, Calendar, Loader2, Clock } from "lucide-react";
import { useState, useEffect, useRef, ReactElement } from "react";
import { Skeleton } from "@/components/ui/Skeleton";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { useAppDispatch, useAppSelector } from "@/redux/store/hooks";
import { changeAdminPasswordThunk, editAdminProfileThunk } from "@/redux/thunk/profileThunk";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import { clearError, clearSuccessMessage } from "@/redux/slice/profileSlice";
import { changePasswordSchema, updateUserSchema } from "@/utilities/schema";
import { zodFormikValidate } from "@/utilities/zodFormikValidate";
import { getAllStatesThunk } from "@/redux/thunk/statesThunk";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { motion } from "framer-motion";
import { Dropdown, DropdownContent, DropdownItem, DropdownTrigger } from "@/components/ui/Dropdown";
import { Popup } from "@/components/ui/Popup";
import { getAllSubscriptionPlansThunk } from "@/redux/thunk/subscriptionPlanThunk";
import { cancelScheduledPlanChangeThunk, changeUserSubscriptionPlanSelfThunk, createCheckoutSessionThunk, getUserSubscriptionSelfThunk, revokeUserSubscriptionSelfThunk } from "@/redux/thunk/subscriptionThunk";
import { refreshSubscriptionStatus } from "@/utilities/auth/refreshSubscription";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { ApiCurrentSubscription, ApiCurrentSubscriptionTable } from "@/types/user";
import { getUserByIdThunk } from "@/redux/thunk/userThunk";
import ProfilePageSkeleton, { NoSubscription, SubscriptionTableSkeleton, ProfileInfoSkeleton, CurrentPlanSkeleton } from "@/components/ProfileInfoSkeleton";
import { clearSubscriptionSuccess } from "@/redux/slice/subscriptionSlice";
import { useRouter } from "next/navigation";
import PricingCardSkeleton from "@/components/PricingCardSkeleton";
import {
  getSubscriptionStatusBadge,
  formatDateShort,
  formatDateWithPattern,
  formatPrice,
  formatPriceWithPeriod,
  formatCurrency,
} from "@/utilities/formatting";

export default function ProfilePage() {
  const { data: session, update } = useSession();
  const user = session?.user
  const router = useRouter();

  const [isEditProfile, setIsEditProfile] = useState(false);
  const [updating, setUpdating] = useState(false);

  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [subscriptionOpen, setSubscriptionOpen] = useState(false);
  const [billing, setBilling] = useState(false)
  const [cancelConfirmOpen, setCancelConfirmOpen] = useState(false)
  const [pendingCancellation, setPendingCancellation] = useState(false)
  const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null);
  const [processingCheckout, setProcessingCheckout] = useState(false);
  const [cancellingSchedule, setCancellingSchedule] = useState(false);
  const [scheduleCancelConfirmOpen, setScheduleCancelConfirmOpen] = useState(false)
  const [changingPlan, setChangingPlan] = useState(false);
  const [revokingPlan, setRevokingPlan] = useState(false);

  const dispatch = useAppDispatch();
  const { isLoading, error, successConfirmPassMessage } = useAppSelector(
    (state) => state.profile
  );
  const { userPlans: plans, isLoading: plansLoading } = useAppSelector(
    (state) => state.subscriptionPlan
  );
  const { selectedUser, isLoading: userLoading, error: userError } = useAppSelector((state) => state.user);
  const { states } = useAppSelector((state) => state.states);
  const {
    currentSubscription,
    isLoading: subscriptionLoading,
    error: subscriptionError,
    successMessage,
    checkoutUrl
  } = useAppSelector((state) => state.subscription);

  // Fetch states on mount
  useEffect(() => {
    if (states.length === 0) {
      dispatch(getAllStatesThunk());
    }
  }, [dispatch, states.length]);


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
      } catch {
        toast.error(error, { theme: "dark" });
      }
    },
  });

  const profileFormik = useFormik({
    enableReinitialize: true,
    initialValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      phoneNo: user?.phoneNo || "",
      stateId: user?.stateId ? String(user.stateId) : "",
    },
    validate: zodFormikValidate(updateUserSchema),
    onSubmit: async (values) => {
      if (!user) return;
      try {
        setUpdating(true);

        const updatedUser = await dispatch(
          editAdminProfileThunk({
            id: user.id,
            firstName: values.firstName.trim(),
            lastName: values.lastName.trim(),
            phoneNo: values.phoneNo.trim(),
            stateId: values.stateId ? parseInt(values.stateId, 10) : undefined,
          })
        ).unwrap();

        // Update NextAuth session
        await update({
          user: {
            ...session.user,
            firstName: updatedUser.firstName,
            lastName: updatedUser.lastName,
            phoneNo: updatedUser.phoneNo,
            stateId: updatedUser.stateId,
            state: updatedUser.state,
          },
        });

        toast.success("Profile updated successfully");
        setIsEditProfile(false);
      } catch (err: any) {
        console.error(err);
        toast.error(err?.message || "Failed to update profile");
      } finally {
        setUpdating(false);
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

  // Plan mapping configuration
  const PLAN_TIER_MAP: Record<string, 1 | 2 | 3> = {
    'Free Plan': 1,
    'Yearly Plan': 2,
    'Monthly Plan': 3,
  };

  const PLAN_UI_CONFIG: Record<string, { icon: ReactElement }> = {
    'Free Plan': {
      icon: <Target className="w-6 h-6" />,
    },
    'Monthly Plan': {
      icon: <Star className="w-6 h-6" />,
    },
    'Yearly Plan': {
      icon: <Award className="w-6 h-6" />,
    },
  };

  // Map plans for display
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
      icon: uiConfig?.icon ?? <Target className="w-6 h-6" />,
      features: plan.features.map((feature) => feature.name),
      stripePriceId: plan.stripePriceId,
    };
  });

  // Animation variants
  const staggerContainer = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const staggerItem = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
  };

  const handleSaveClick = () => {
    profileFormik.setTouched({
      firstName: true,
      lastName: true,
      phoneNo: true,
    });
    profileFormik.handleSubmit();
  };

  const handleCancelPlan = async () => {
    try {
      setRevokingPlan(true);
      await dispatch(revokeUserSubscriptionSelfThunk()).unwrap();
      setCancelConfirmOpen(false);
      setPendingCancellation(true);

      // Immediately refresh NextAuth session to update subscription status
      // This ensures middleware and game routes reflect the change immediately
      // Fetch subscription status from API with retries, then update session ONCE
      const accessToken = (session as any)?.accessToken;
      if (accessToken) {
        await refreshSubscriptionStatus(
          update,
          accessToken,
        );
      }
    } catch (err: any) {
      console.error("Failed to cancel subscription:", err);
      toast.error(err?.message || "Failed to cancel subscription");
    } finally {
      setRevokingPlan(false);
    }
  };

  const handleChangePlan = async () => {
    if (!selectedPlanId) return;

    try {
      setChangingPlan(true);
      if (isFreePlan(currentSubscription?.plan)) {
        await dispatch(createCheckoutSessionThunk(selectedPlanId)).unwrap();
        await refreshSubscriptionStatus(update);
        return;
      }

      const result = await dispatch(changeUserSubscriptionPlanSelfThunk({ newPlanId: selectedPlanId })).unwrap();

      if (selectedPlanId === currentPlanId) {
        toast.success(result.message || "Scheduled change cancelled successfully");
      } else {
        toast.success(result.message || "Plan change scheduled successfully");
      }
      setSubscriptionOpen(false);
      setSelectedPlanId(null);

      // Refresh subscription data
      if (user?.id) {
        await dispatch(getUserSubscriptionSelfThunk());
        await dispatch(getUserByIdThunk(Number(user.id)));
      }

      // Immediately refresh NextAuth session to update subscription status
      // This ensures middleware and game routes reflect the change immediately
      await refreshSubscriptionStatus(update);
    } catch (err: any) {
      console.error("Failed to change plan:", err);
      toast.error(err?.message || "Failed to change subscription plan");
    } finally {
      setChangingPlan(false);
    }
  };

  const handleCancelScheduledChange = async () => {
    try {
      setCancellingSchedule(true);
      await dispatch(cancelScheduledPlanChangeThunk()).unwrap();
      setScheduleCancelConfirmOpen(false)
      toast.success("Scheduled plan change cancelled");

      // Refresh subscription data
      if (user?.id) {
        await dispatch(getUserSubscriptionSelfThunk());
      }

      // Immediately refresh NextAuth session to update subscription status
      await refreshSubscriptionStatus(update);
    } catch (err: any) {
      console.error("Failed to cancel scheduled change:", err);
      toast.error(err.message || "Failed to cancel scheduled change");
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
      toast.error(err.message || "Failed to start checkout. Try again.");
    }
  };

  const fetchUserDetail = async () => {
    try {
      await Promise.allSettled([
        dispatch(getUserByIdThunk(Number(user?.id))),
        dispatch(getUserSubscriptionSelfThunk()),
      ]);
    } catch (err: any) {
      console.error(err.message || "Failed to fetch user details")
    }
  }

  // Fetch plans when subscription popup opens
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


  // Handle subscription success/error messages
  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage, { theme: "dark" });
      dispatch(clearSubscriptionSuccess());

      // Refresh subscription data
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

  // Handle checkout URL redirect
  useEffect(() => {
    if (checkoutUrl) {
      window.location.href = checkoutUrl;
      setProcessingCheckout(false);
    }
  }, [checkoutUrl]);

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

  const hasUsedTrial = selectedUser?.isTrial || isPaidUser

  const isFreePlan = (plan: any) => {
    if (plan.trialDays > 0) return true;
    if (plan.price === 0) return true;
    const planName = plan.name?.toLowerCase() || '';
    if (planName.includes('free')) return true;
    return false;
  }

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
  return (
    <motion.div
      className="min-h-screen bg-black text-white overflow-hidden"
      initial="initial"
      animate="animate"
    >
      {/* Animated Background Gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-black via-gray-900 to-black">
        <motion.div
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-yellow-900/20 via-transparent to-transparent"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 8, repeat: Infinity }}
        ></motion.div>
        <motion.div
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-yellow-800/10 via-transparent to-transparent"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 10, repeat: Infinity, delay: 1 }}
        ></motion.div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 pt-20">
        {/* ==================== HERO SECTION ==================== */}
        <section className="relative px-4 py-16">
          <div className="max-w-7xl mx-auto">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Badge */}
              <motion.div
                className="inline-block px-4 py-2 mb-6 rounded-full bg-yellow-400/10 border border-yellow-400/30"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <span className="text-yellow-400 text-sm font-semibold">PROFILE</span>
              </motion.div>

              {/* Main Heading */}
              <motion.h1
                className="text-4xl md:text-5xl lg:text-6xl 2xl:text-7xl font-black mb-6 leading-tight"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                Your <span className="bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400 bg-clip-text text-transparent">Profile</span>
              </motion.h1>

              {/* Subheading */}
              <motion.p
                className="text-xl md:text-2xl text-gray-400 mb-8 max-w-3xl mx-auto leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Manage your account settings and preferences
              </motion.p>
            </motion.div>
          </div>
        </section>

        {/* ==================== PROFILE CONTENT SECTION ==================== */}
        {/* {isPageLoading && !subscriptionOpen && !billing && !cancelConfirmOpen && !scheduleCancelConfirmOpen ? (
          <ProfilePageSkeleton />
        ) : ( */}
        <section className="relative px-4 py-4 pb-24">
          <div className="max-w-7xl mx-auto">

            <motion.div
              className="grid grid-cols-1 lg:grid-cols-3 gap-6"
              variants={staggerContainer}
              initial="initial"
              animate="animate"
            >
              {/* Left Column - Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Profile Information Card */}
                {userLoading ? (
                  <ProfileInfoSkeleton />
                ) : userError ? (
                  <motion.div
                    variants={staggerItem}
                    className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-red-500/30 hover:border-red-500/50 transition-all duration-300"
                  >
                    <div className="flex flex-col items-center justify-center text-center space-y-4">
                      <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-2">
                        <AlertCircle className="w-8 h-8 text-red-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-2">Failed to Load Profile</h3>
                        <p className="text-sm text-gray-400 mb-1">
                          {userError || "We couldn't load your profile details."}
                        </p>
                        <p className="text-xs text-gray-500">
                          Please check your connection and try again.
                        </p>
                      </div>
                      <Button
                        type="primary"
                        onClick={fetchUserDetail}
                        className="mt-4 !w-fit"
                      >
                        <Activity className="w-4 h-4 mr-2" />
                        Retry
                      </Button>
                    </div>
                  </motion.div>
                ) : (

                  <motion.div
                    variants={staggerItem}
                    className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 hover:border-yellow-400/50 transition-all duration-300"
                  >
                    <form noValidate>
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center">
                            <span className="text-xl font-bold text-black">{getUserInitials()}</span>
                          </div>
                          <div>
                            <h2 className="text-xl font-semibold text-white mb-1">{getUserName()}</h2>
                            <p className="text-sm text-gray-400">{user?.email}</p>
                          </div>
                        </div>

                        {/* Edit / Save */}

                        <div className="flex gap-2">
                          {isEditProfile && (
                            <div className="flex justify-end">
                              <Button
                                type="default"
                                onClick={() => {
                                  profileFormik.resetForm();
                                  setIsEditProfile(false);
                                }}
                              >
                                Cancel
                              </Button>
                            </div>
                          )}

                          {isEditProfile ? (
                            <Button
                              onClick={handleSaveClick}
                              loading={updating}
                            >
                              Save Changes
                            </Button>
                          ) : (
                            <Button
                              type="primary"
                              onClick={() => setIsEditProfile(true)}
                            >
                              Edit Profile
                            </Button>
                          )}
                        </div>
                      </div>

                      {/* Form Fields */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* First Name */}
                        <div>
                          <label className="text-xs text-gray-400 mb-1.5 block font-medium">First Name</label>
                          {isEditProfile ? (
                            <>
                              <Input
                                name="firstName"
                                value={profileFormik.values.firstName}
                                onChange={profileFormik.handleChange}
                                onBlur={profileFormik.handleBlur}
                              />
                              {profileFormik.touched.firstName && profileFormik.errors.firstName && (
                                <p className="text-xs text-red-400 mt-1">{profileFormik.errors.firstName}</p>
                              )}
                            </>
                          ) : (
                            <p className="text-sm text-white">{user?.firstName || "N/A"}</p>
                          )}
                        </div>

                        {/* Last Name */}
                        <div>
                          <label className="text-xs text-gray-400 mb-1.5 block font-medium">Last Name</label>
                          {isEditProfile ? (
                            <>
                              <Input
                                name="lastName"
                                value={profileFormik.values.lastName}
                                onChange={profileFormik.handleChange}
                                onBlur={profileFormik.handleBlur}
                              />
                              {profileFormik.touched.lastName && profileFormik.errors.lastName && (
                                <p className="text-xs text-red-400 mt-1">{profileFormik.errors.lastName}</p>
                              )}
                            </>
                          ) : (
                            <p className="text-sm text-white">{user?.lastName || "N/A"}</p>
                          )}
                        </div>

                        {/* Phone Number */}
                        <div>
                          <label className="text-xs text-gray-400 mb-1.5 block font-medium">Phone Number</label>
                          {isEditProfile ? (
                            <>
                              <Input
                                name="phoneNo"
                                value={profileFormik.values.phoneNo}
                                onChange={profileFormik.handleChange}
                                onBlur={profileFormik.handleBlur}
                              />
                              {profileFormik.touched.phoneNo && profileFormik.errors.phoneNo && (
                                <p className="text-xs text-red-400 mt-1">{profileFormik.errors.phoneNo}</p>
                              )}
                            </>
                          ) : (
                            <p className="text-sm text-white">{user?.phoneNo || "N/A"}</p>
                          )}
                        </div>
                        <div>
                          <label className="text-xs text-gray-400 mb-1.5 block font-medium">State</label>
                          {isEditProfile ? (
                            <>
                              <Select
                                value={profileFormik.values.stateId}
                                onValueChange={(val) => profileFormik.setFieldValue("stateId", val)}
                              >
                                <SelectTrigger>
                                  <SelectValue>
                                    {profileFormik.values.stateId
                                      ? states.find(
                                        (state) => String(state.id) === String(profileFormik.values.stateId)
                                      )?.state_name
                                      : <p className='text-text-muted'>Select your state </p>}
                                  </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                  {states.map((state) => (
                                    <SelectItem key={state.id} value={String(state.id)}>
                                      {state.state_name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              {profileFormik.touched.stateId && profileFormik.errors.stateId && (
                                <p className="text-xs text-red-400 mt-1">{profileFormik.errors.stateId}</p>
                              )}
                            </>
                          ) : (
                            <p className="text-sm text-white">{user?.state?.name || "N/A"}</p>
                          )}
                        </div>
                        <div>
                          <label className="text-xs text-gray-400 mb-1.5 block font-medium">Email</label>
                          <p className="text-sm text-white">{user?.email || "N/A"}</p>
                        </div>
                        <div>
                          <label className="text-xs text-gray-400 mb-1.5 block font-medium">Role</label>
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-yellow-400/10 text-yellow-400 border border-yellow-400/20">
                            {user?.role || "USER"}
                          </span>
                        </div>
                        <div>
                          <label className="text-xs text-gray-400 mb-1.5 block font-medium">Subscription Plan</label>
                          <p className="text-sm text-white">{currentSubscription?.plan.name || "N/A"}</p>
                        </div>
                        <div>
                          <label className="text-xs text-gray-400 mb-1.5 block font-medium">Subscribed On</label>
                          <p className="text-sm text-white">Dec 12, 2025</p>
                        </div>
                      </div>


                    </form>
                  </motion.div>
                )}


                {/* Recent Activity */}
                {/* <motion.div
                    className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 hover:border-yellow-400/50 transition-all duration-300"
                    variants={staggerItem}
                    whileHover={{ scale: 1.01, y: -2 }}
                  >
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-semibold text-white">Recent Activity</h3>
                      <div className="flex items-center gap-2 py-1 px-3 rounded-lg bg-white/5 border border-yellow-400/30">
                        <span className="text-xs font-medium text-yellow-400">Coming Soon...</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {recentActivity.map((activity, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10"
                        >
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              "w-8 h-8 rounded-lg flex items-center justify-center",
                              activity.type === "security" ? "bg-blue-500/10" : "bg-yellow-400/10"
                            )}>
                              {activity.type === "security" ? (
                                <Shield className="w-4 h-4 text-blue-400" />
                              ) : (
                                <User className="w-4 h-4 text-yellow-400" />
                              )}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-white">{activity.action}</p>
                              <p className="text-xs text-gray-400">{activity.time}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div> */}

                {/* Recent Activity (Subscription Table) */}
                {userLoading ? (
                  <SubscriptionTableSkeleton />
                ) : userError ? (
                  <motion.div
                    variants={staggerItem}
                    className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-red-500/30 hover:border-red-500/50 transition-all duration-300"
                  >
                    <div className="flex flex-col items-center justify-center text-center space-y-4">
                      <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-2">
                        <AlertCircle className="w-8 h-8 text-red-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-2">Failed to Load Subscriptions</h3>
                        <p className="text-sm text-gray-400 mb-1">
                          {userError || "We couldn't load your subscription history."}
                        </p>
                        <p className="text-xs text-gray-500">
                          Please check your connection and try again.
                        </p>
                      </div>
                      <Button
                        type="primary"
                        onClick={fetchUserDetail}
                        className="mt-4 !w-fit"
                      >
                        <Activity className="w-4 h-4 mr-2" />
                        Retry
                      </Button>
                    </div>
                  </motion.div>
                ) : selectedUser && selectedUser.allSubscriptions && selectedUser.allSubscriptions.length > 0 ? (
                  <motion.div
                    className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 hover:border-yellow-400/50 transition-all duration-300"
                    variants={staggerItem}
                    whileHover={{ scale: 1.01, y: -2 }}
                  >
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-semibold text-white">Subscriptions</h3>

                    </div>
                    <div className="space-y-3">
                      <div className="overflow-x-auto">
                        <Table className="w-full rounded-lg overflow-hidden bg-white/2 border border-white/10">
                          <TableHeader>
                            <TableRow className="bg-white/5">
                              <TableHead className="min-w-[120px] bg-white/10 pl-8">Plan</TableHead>
                              <TableHead className="min-w-[100px] bg-white/10 pl-8">Status</TableHead>
                              <TableHead className="min-w-[120px] bg-white/10">Start Date</TableHead>
                              <TableHead className="min-w-[120px] bg-white/10">End Date</TableHead>
                              <TableHead className="min-w-[100px] bg-white/10">Amount</TableHead>
                              <TableHead className="min-w-[100px] bg-white/10">Payment Method</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {selectedUser.allSubscriptions.map((subscription: ApiCurrentSubscriptionTable) => (
                              <TableRow key={subscription.id} className="bg-white/5">
                                <TableCell className="text-text-primary font-medium">
                                  {subscription.planName}
                                </TableCell>
                                <TableCell className="text-text-primary font-medium">
                                  <span
                                    className={cn(
                                      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium "
                                    )}
                                  >
                                    {getSubscriptionStatusBadge(subscription.status)}
                                  </span>
                                </TableCell>
                                <TableCell className="text-text-primary font-medium">
                                  {formatDateShort(subscription.startDate)}
                                </TableCell>
                                <TableCell className="text-text-primary font-medium">
                                  {formatDateShort(subscription.endDate)}
                                </TableCell>
                                <TableCell className="text-text-primary font-medium">
                                  {subscription.status === "TRIAL"
                                    ? "FREE"
                                    : subscription.price != null
                                      ? formatPrice(subscription.price)
                                      : "N/A"}
                                </TableCell>
                                <TableCell className="text-text-tertiary font-medium">
                                  {subscription.paymentMethod}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <NoSubscription />
                )}
              </div>

              {/* Right Column - Sidebar */}
              <div className="space-y-6">
                {/* Current Plan */}
                {/* Loading/Error/Empty State for Current Plan */}
                {subscriptionLoading && !subscriptionOpen && !billing ? (
                  <motion.div
                    className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-yellow-400/30 hover:border-yellow-400/50 transition-all duration-300"
                    variants={staggerItem}
                    whileHover={{ scale: 1.02, y: -3 }}
                  >
                    <CurrentPlanSkeleton />
                  </motion.div>
                ) : subscriptionError || userError ? (
                  <motion.div
                    className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-red-500/30 hover:border-red-500/50 transition-all duration-300"
                    variants={staggerItem}
                  >
                    <div className="flex flex-col items-center justify-center text-center space-y-4 py-6">
                      <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-2">
                        <AlertCircle className="w-8 h-8 text-red-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-2">Failed to Load Subscription</h3>
                        <p className="text-sm text-gray-400 mb-1">
                          {subscriptionError || userError || "We couldn't load your subscription details."}
                        </p>
                        <p className="text-xs text-gray-500">
                          Please check your connection and try again.
                        </p>
                        {subscriptionError && <Button
                          type="primary"
                          onClick={fetchUserDetail}
                          className="mt-4 !w-fit"
                        >
                          <Activity className="w-4 h-4 mr-2" />
                          Retry
                        </Button>
                        }
                      </div>
                    </div>
                  </motion.div>
                ) : !currentSubscription ? (
                  <NoSubscription />
                ) : (
                  <motion.div
                    className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-yellow-400/30 hover:border-yellow-400/50 transition-all duration-300"
                    variants={staggerItem}
                    whileHover={{ scale: 1.02, y: -3 }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-yellow-400" />
                        <span className="text-sm font-medium text-white">Current Plan</span>
                      </div>
                      <Dropdown>
                        <DropdownTrigger
                          className="!w-8 !h-8 !p-0 !bg-transparent !border-white/10 hover:!bg-white/10 hover:!border-yellow-400/30"
                          icon={<MoreVertical className="w-4 h-4 text-gray-400" />}
                          disabled={changingPlan || revokingPlan || cancellingSchedule}
                        />
                        <DropdownContent className="!bg-white/10 !backdrop-blur-md !border-white/20">
                          <DropdownItem
                            onClick={() => {
                              setSubscriptionOpen(true);
                            }}
                            disabled={changingPlan || revokingPlan}
                          >
                            Change plan
                          </DropdownItem>
                          <DropdownItem
                            danger
                            onClick={() => {
                              setCancelConfirmOpen(true);
                            }}
                            disabled={currentSubscription.status === 'CANCELED' || revokingPlan || changingPlan}
                          >
                            Cancel plan
                          </DropdownItem>
                        </DropdownContent>
                      </Dropdown>
                    </div>

                    {/* Scheduled Change Notice with Cancel Button */}
                    {hasScheduledChange && nextPlan && (
                      <div className="mb-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-start gap-2 flex-1">
                            <Clock className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                            <div className="text-sm">
                              <p className="text-blue-400 font-medium">Plan Change Scheduled</p>
                              <p className="text-blue-300">
                                Changing to <span className="font-semibold">{nextPlan.name}</span> on{' '}
                                {formatDateWithPattern(currentSubscription.scheduledChangeAt!, 'MMM dd, yyyy')}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => setScheduleCancelConfirmOpen(true)}
                            className="p-1 rounded-md text-blue-400 hover:text-blue-300 hover:bg-blue-400/10 transition"
                            aria-label="Cancel scheduled change"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Pending Cancellation Notice */}
                    {currentSubscription.status === 'CANCELED' && (
                      <div className="mb-4 p-3 bg-orange-500/10 border border-orange-500/30 rounded-lg">
                        <div className="flex items-start gap-2">
                          <AlertCircle className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                          <div className="text-sm">
                            <p className="text-orange-400 font-medium">Cancellation Scheduled</p>
                            <p className="text-orange-300">
                              Your subscription will end on{' '}
                              {formatDateWithPattern(currentSubscription.endDate, 'MMM dd, yyyy')}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    <h3 className="text-2xl font-bold text-yellow-300 mb-2">
                      {currentSubscription.plan.name}
                      {hasScheduledChange && (
                        <span className="text-sm text-gray-400 ml-2">
                          → {nextPlan?.name}
                        </span>
                      )}
                    </h3>
                    <p className="text-sm text-gray-400 mb-4">
                      {currentSubscription.plan.description}
                    </p>
                    <div className="mb-6">
                      <span className="text-3xl font-bold text-yellow-400">
                        {formatPrice(currentSubscription.plan.price, '0.00')}
                      </span>
                      <span className="text-sm text-gray-400 ml-1">
                        {currentSubscription.plan.duration === 12 ? '/year' : '/month'}
                      </span>

                      {hasActiveSubscription && (
                        <div className="mt-2 flex items-center gap-2 text-sm text-gray-400">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {calculateDaysRemaining(currentSubscription.endDate)} days remaining
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="pt-4 border-t border-white/10">
                      <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">
                        Included Features
                      </h4>
                      <div className="space-y-3">
                        {currentSubscription.plan.features.map((feature, index) => (
                          <div key={index} className="flex items-center gap-3">
                            <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0">
                              <Check className="w-3 h-3 text-yellow-400" />
                            </div>
                            <span className="text-sm text-white">{feature.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Account Actions */}
                {userError ? (
                  <motion.div
                    className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-red-500/30 hover:border-red-500/50 transition-all duration-300"
                    variants={staggerItem}
                    whileHover={{ scale: 1.01, y: -2 }}
                  >
                    <div className="flex flex-col items-center justify-center text-center space-y-4 py-6">
                      <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-2">
                        <AlertCircle className="w-8 h-8 text-red-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-2">Failed to Load Account</h3>
                        <p className="text-sm text-gray-400 mb-1">
                          {userError || "We couldn't load your account information."}
                        </p>
                        <p className="text-xs text-gray-500">
                          Please check your connection and try again.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 hover:border-yellow-400/50 transition-all duration-300"
                    variants={staggerItem}
                    whileHover={{ scale: 1.01, y: -2 }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-white">Account Actions</h3>
                    </div>
                    <div className="space-y-3">
                      <button
                        onClick={() => setChangePasswordOpen(true)}
                        className="w-full flex items-center gap-3 p-3 text-left rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-colors group disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={changingPlan || revokingPlan}
                      >
                        <div className="w-10 h-10 rounded-lg bg-yellow-400/10 flex items-center justify-center group-hover:bg-yellow-400/20 transition-colors">
                          <Lock className="w-5 h-5 text-yellow-400" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-white">Change Password</p>
                          <p className="text-xs text-gray-400">Update your account password</p>
                        </div>
                      </button>

                      <button
                        onClick={handleManageSubscription}
                        className="w-full flex items-center gap-3 p-3 text-left rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-colors group disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={changingPlan || revokingPlan}
                      >
                        <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center group-hover:bg-purple-500/20 transition-colors">
                          <CreditCard className="w-5 h-5 text-purple-400" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-white">Billing & Subscription</p>
                          <p className="text-xs text-gray-400">
                            {hasActiveSubscription
                              ? "Manage your subscription"
                              : "No active subscription"}
                          </p>
                        </div>
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Quick Info */}
                {/* <motion.div
                    className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 hover:border-yellow-400/50 transition-all duration-300"
                    variants={staggerItem}
                    whileHover={{ scale: 1.01, y: -2 }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-white">Quick Info</h3>
                      <div className="flex items-center gap-2 py-1 px-3 rounded-lg bg-white/5 border border-yellow-400/30">
                        <span className="text-xs font-medium text-yellow-400">Coming Soon...</span>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-400">Email Status</span>
                        </div>
                        <span className="text-xs px-2 py-1 rounded-md bg-green-500/10 text-green-400 border border-green-500/20">
                          Verified
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Activity className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-400">Account Status</span>
                        </div>
                        <span className="text-xs px-2 py-1 rounded-md bg-green-500/10 text-green-400 border border-green-500/20">
                          Active
                        </span>
                      </div>
                    </div>
                  </motion.div> */}
              </div>
            </motion.div>
          </div>
        </section>
        {/* )} */}

        {/* Change Password Dialog */}
        {changePasswordOpen && (
          <Popup
            open={changePasswordOpen}
            onOpenChange={(open) => {
              setChangePasswordOpen(open);
              if (!open) {
                formik.resetForm();
              }
            }}
            title="Change Password"
            description="Update your account password. Make sure to use a strong password."
            contentClassName="!max-h-[80vh] !w-[60vw] lg:!w-xl sm:max-w-md"
            footer={
              <div className="flex justify-end gap-3 w-full">
                <Button
                  className="!w-fit border border-error"
                  danger
                  onClick={() => {
                    formik.resetForm();
                    setChangePasswordOpen(false);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  className="!w-fit"
                  type="primary"
                  htmlType="submit"
                  form="change-password-form"
                  disabled={isLoading}
                >
                  {isLoading ? "Updating..." : "Change Password"}
                </Button>
              </div>
            }
          >
            <form
              id="change-password-form"
              onSubmit={formik.handleSubmit}
              className="space-y-4"
            >
              {/* Current Password */}
              <div>
                <label className="text-sm font-medium text-white mb-2 block">
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
                  <p className="mt-1 text-xs text-red-400">
                    {formik.errors.currentPassword}
                  </p>
                )}
              </div>

              {/* New Password */}
              <div>
                <label className="text-sm font-medium text-white mb-2 block">
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
                  <p className="mt-1 text-xs text-red-400">
                    {formik.errors.newPassword}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="text-sm font-medium text-white mb-2 block">
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
                  <p className="mt-1 text-xs text-red-400">
                    {formik.errors.confirmPassword}
                  </p>
                )}
              </div>
            </form>
          </Popup>
        )}

        {/* Change Plan Popup */}
        {subscriptionOpen && <Popup
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
                {/* Current Plan Info */}
                {hasActiveSubscription && currentSubscription && (
                  <div className="p-4 bg-yellow-400/10 border border-yellow-400/30 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-yellow-400">Current Plan</p>
                        <p className="text-lg font-bold text-white">{currentSubscription.plan.name}</p>
                        <p className="text-sm text-gray-400">
                          Active until {formatDateWithPattern(currentSubscription.endDate, 'MMM dd, yyyy')}
                          {hasScheduledChange && (
                            <span className="ml-2 text-blue-400">
                              (Change to {nextPlan?.name} scheduled)
                            </span>
                          )}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-400">Remaining</p>
                        <p className="text-lg font-bold text-white">
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
                            ? "bg-yellow-400/10 border-yellow-400/50"
                            : isSelected
                              ? "bg-yellow-400/10 border-yellow-500 shadow-lg shadow-yellow-400/20"
                              : "bg-white/5 border-white/10 hover:border-yellow-400/30 hover:bg-white/10",
                          isDisabled && "cursor-not-allowed opacity-75"
                        )}
                      >
                        {/* Current Plan Badge */}
                        {isCurrentPlan && (
                          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                            <span className={cn(
                              "px-3 py-1 rounded-full text-xs font-bold shadow-lg bg-yellow-400 text-black"
                            )}>
                              Current Plan
                            </span>
                          </div>
                        )}

                        {/* Scheduled Next Plan Badge */}
                        {isScheduledNextPlan && (
                          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                            <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                              Scheduled Change
                            </span>
                          </div>
                        )}

                        {/* Free Trial Already Used Badge */}
                        {hasUsedTrial && freePlan && !isCurrentPlan && (
                          <div className="absolute -top-3 right-3 z-10">
                            <span className="bg-gray-700 text-gray-200 px-3 py-1 rounded-full text-xs font-semibold">
                              Trial already used
                            </span>
                          </div>
                        )}

                        {/* Selected Indicator */}
                        {isSelected && !isCurrentPlan && !isScheduledNextPlan && (
                          <div className="absolute top-3 right-3">
                            <div className="w-6 h-6 rounded-full bg-yellow-400 flex items-center justify-center">
                              <Check className="w-4 h-4 text-black" />
                            </div>
                          </div>
                        )}

                        {/* Current Plan Check Icon */}
                        {isCurrentPlan && !hasScheduledChange && (
                          <div className="absolute top-3 right-3">
                            <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                              <Check className="w-4 h-4 text-white" />
                            </div>
                          </div>
                        )}

                        {/* Discount Badge */}
                        {(plan.discountPercent ?? 0) > 0 && (
                          <div className="absolute -top-2 -right-2 z-10">
                            <span className="bg-gradient-to-r from-green-500 to-green-600 text-black px-2 py-1 rounded-lg text-xs font-bold">
                              {plan.discountPercent}% OFF
                            </span>
                          </div>
                        )}

                        {/* Plan Icon */}
                        <div className="mb-4">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-black mb-3">
                            {plan.icon}
                          </div>
                          <h3 className="text-xl font-bold text-white mb-1">{plan.name}</h3>
                          {plan.description && (
                            <p className="text-gray-400 text-sm">{plan.description}</p>
                          )}
                        </div>

                        {/* Price */}
                        <div className="mb-4">
                          {plan.trialDays ? (
                            <p className="text-2xl font-extrabold text-yellow-400">
                              {plan.trialDays}-day Free Trial
                            </p>
                          ) : (
                            <div className="flex items-baseline gap-1">
                              <span className="text-3xl font-extrabold text-yellow-400">
                                ${plan.price != null ? plan.price.toFixed(2) : '0.00'}
                              </span>
                              <span className="text-gray-400 text-sm">{plan.period}</span>
                            </div>
                          )}
                          {(plan.discountPercent ?? 0) > 0 && (
                            <div className="flex items-baseline gap-1 mt-1">
                              <span className="text-gray-500 text-lg line-through">
                                {formatPrice(plan.originalPrice, 'N/A')}
                              </span>
                              <span className="text-gray-400 text-sm">{plan.period}</span>
                            </div>
                          )}
                        </div>

                        {/* Features */}
                        <div className="space-y-2 mb-4">
                          {plan.features.slice(0, 3).map((feature, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <Check className="w-4 h-4 text-green-400" />
                              <span className="text-sm text-gray-300">{feature}</span>
                            </div>
                          ))}
                          {plan.features.length > 3 && (
                            <p className="text-xs text-gray-500">
                              +{plan.features.length - 3} more features
                            </p>
                          )}
                        </div>

                        {/* Action Button */}
                        {isCurrentPlan ? (
                          <div className={cn(
                            "text-center p-2 rounded-lg text-sm font-medium bg-green-500/20 text-green-400"
                          )}>
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
                              ? "bg-yellow-400 text-black"
                              : "bg-white/10 text-white hover:bg-white/20"
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
        </Popup>}


        {cancelConfirmOpen && (
          <Popup
            open={cancelConfirmOpen}
            onOpenChange={(open) => {
              setCancelConfirmOpen(open);
            }}
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
                <div className="p-3 bg-white/5 rounded-lg">
                  <p className="text-sm text-gray-300">
                    <strong>Current Plan:</strong> {currentSubscription.plan.name}
                  </p>

                  <p className="text-sm text-gray-300 mt-1">
                    <strong>Active until:</strong>{" "}
                    {formatDateWithPattern(currentSubscription.endDate, "MMM dd, yyyy")}
                  </p>

                  {hasScheduledChange && (
                    <p className="text-sm text-blue-300 mt-2 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      You have a scheduled change to {nextPlan?.name}. Cancelling will remove this change.
                    </p>
                  )}
                </div>
              )}
            </div>
          </Popup>
        )}



        {/* Subscription Details Dialog */}
        {billing && (
          <Popup
            open={billing}
            onOpenChange={(open) => {
              setBilling(open);
            }}
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
                <h3 className="text-lg font-semibold text-white mb-2">
                  No Active Subscription
                </h3>
                <p className="text-gray-400 mb-6">
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
                {/* Current Plan Card */}
                <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        {currentSubscription.plan.name}
                        {hasScheduledChange && (
                          <span className="text-sm text-blue-400 ml-2">
                            → {nextPlan?.name}
                          </span>
                        )}
                      </h3>
                      <p className="text-sm text-gray-400">
                        {currentSubscription.status.charAt(0).toUpperCase() +
                          currentSubscription.status.slice(1).toLowerCase()}{" "}
                        Subscription
                      </p>
                    </div>
                    {getSubscriptionStatusBadge(currentSubscription.status)}
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">Plan Price</span>
                      <span className="text-lg font-semibold text-yellow-400">
                        {formatPriceWithPeriod(
                          currentSubscription.plan.price,
                          currentSubscription.plan.duration === 12 ? "year" : "month",
                          '0.00'
                        )}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">Billing Cycle</span>
                      <span className="text-sm text-white">
                        {currentSubscription.plan.duration === 12
                          ? "Yearly"
                          : "Monthly"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">
                        {currentSubscription.status === "CANCELED"
                          ? "Ends on"
                          : "Next Billing Date"}
                      </span>
                      <span className="text-sm text-white">
                        {formatDateWithPattern(currentSubscription.endDate, "MMM dd, yyyy")}
                      </span>
                    </div>

                    {hasScheduledChange && (
                      <>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-400">
                            Scheduled Change
                          </span>
                          <span className="text-sm text-blue-400">
                            To {nextPlan?.name}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-400">
                            Change Date
                          </span>
                          <span className="text-sm text-blue-400">
                            {formatDateWithPattern(currentSubscription.scheduledChangeAt!, "MMM dd, yyyy")}
                          </span>
                        </div>
                      </>
                    )}

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">Days Remaining</span>
                      <span className="text-sm text-white">
                        {calculateDaysRemaining(currentSubscription.endDate)} days
                      </span>
                    </div>

                    {currentSubscription.lastPayment && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">Last Payment</span>
                        <span className="text-sm text-white">
                          {formatPrice(currentSubscription.lastPayment.amount, '0.00')} on{" "}
                          {formatDateWithPattern(currentSubscription.lastPayment.createdAt, "MMM dd, yyyy")}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-white">Plan Features</h4>
                  <div className="space-y-2">
                    {currentSubscription.plan.features?.length ? (
                      currentSubscription.plan.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-full flex items-center justify-center">
                            <Check className="w-4 h-4 text-accent-primary" />
                          </div>
                          <span className="text-sm text-gray-300">
                            {feature.name}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-400">
                        No features listed.
                      </p>
                    )}
                  </div>
                </div>

                {/* Actions */}
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
              <div className="p-3 bg-white/5 rounded-lg space-y-2">
                <p className="text-sm text-gray-300">
                  <strong>Current Plan:</strong> {currentSubscription?.plan.name}
                </p>

                <p className="text-sm text-blue-300 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  Scheduled to change to <strong>{nextPlan?.name}</strong>
                </p>

                <p className="text-sm text-gray-300">
                  <strong>Change Date:</strong>{" "}
                  {formatDateWithPattern(currentSubscription!.scheduledChangeAt!, "MMM dd, yyyy")}
                </p>
              </div>
            </div>
          </Popup>
        )}


      </div>
    </motion.div>
  );
}
