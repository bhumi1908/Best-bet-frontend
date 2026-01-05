"use client";

import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/Dialog";
import { Pencil, Save, Lock, Shield, CreditCard, Mail, User, Activity, X, Package, Check, MoreVertical, Target, Star, Award, CheckCircle2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";
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
import { motion } from "framer-motion";
import { Dropdown, DropdownContent, DropdownItem, DropdownTrigger } from "@/components/ui/Dropdown";
import { Popup } from "@/components/ui/Popup";
import { getAllSubscriptionPlansThunk } from "@/redux/thunk/subscriptionPlanThunk";
import { createCheckoutSessionThunk } from "@/redux/thunk/subscriptionThunk";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { ApiCurrentSubscription } from "@/types/user";
import { getUserByIdThunk } from "@/redux/thunk/userThunk";

export default function ProfilePage() {
  const { data: session, update } = useSession();
  const user = session?.user

  const [isEditProfile, setIsEditProfile] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [loading, setLoading] = useState(true);

  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [subscriptionOpen, setSubscriptionOpen] = useState(false);
  const [billing, setBilling] = useState(false)
  const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null);
  const [changingPlan, setChangingPlan] = useState(false);


  const dispatch = useAppDispatch();
  const { isLoading, error, successConfirmPassMessage } = useAppSelector(
    (state) => state.profile
  );
  const { userPlans: plans, isLoading: plansLoading } = useAppSelector(
    (state) => state.subscriptionPlan
  );
  const { selectedUser, isLoading: userLoading } = useAppSelector((state) => state.user);

  const getSubscriptionStatusBadge = (status: string) => {
    const styles = {
      ACTIVE: "bg-green-500/20 text-green-400 border-green-500/30",
      CANCELED: "bg-red-500/20 text-red-400 border-red-500/30",
      EXPIRED: "bg-gray-500/20 text-gray-400 border-gray-500/30",
      REFUNDED: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      TRIAL: "bg-blue-500/20 text-blue-400 border-blue-500/30",

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


  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

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
          })
        ).unwrap();

        // Update NextAuth session
        await update({
          user: {
            ...session.user,
            firstName: updatedUser.firstName,
            lastName: updatedUser.lastName,
            phoneNo: updatedUser.phoneNo,
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


  const recentActivity = [
    { action: "Password changed", time: "2 hours ago", type: "security" },
    { action: "Profile updated", time: "1 day ago", type: "profile" },
    { action: "Login from new device", time: "3 days ago", type: "security" },
    { action: "Email verified", time: "1 week ago", type: "profile" },
  ];


  // Plan mapping configuration
  const PLAN_TIER_MAP: Record<string, 1 | 2 | 3> = {
    'Free Plan': 1,
    'Yearly Plan': 2,
    'Monthly Plan': 3,
  };

  const PLAN_UI_CONFIG: Record<string, { icon: React.ReactElement }> = {
    'Basic Plan': {
      icon: <Target className="w-6 h-6" />,
    },
    'Premium Plan': {
      icon: <Star className="w-6 h-6" />,
    },
    'VIP Plan': {
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
      trialDays: plan.trialDays,
      popular: plan.isRecommended ?? false,
      discountPercent: plan.discountPercent,
      tier: PLAN_TIER_MAP[plan.name] || 1,
      icon: uiConfig?.icon ?? <Target className="w-6 h-6" />,
      features: plan.features.map((feature) => feature.name),
    };
  });

  // Get current plan ID - match by plan name from the displayed plan name
  // You may need to get this from user session or API in the future
  // For now, matching by the plan name shown in the UI ("Premium Plan")
  const currentPlanName = "Premium Plan"; // This should come from user's subscription data
  const currentPlanId = mappedPlans.find(p => p.name === currentPlanName)?.id || null;


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

  // Fetch plans when subscription popup opens
  useEffect(() => {
    if (subscriptionOpen) {
      dispatch(getAllSubscriptionPlansThunk());
      // Set current plan as selected initially (assuming user has a plan)
      // You may need to get this from user session or API
      setSelectedPlanId(null);
    }
  }, [subscriptionOpen, dispatch]);

  // Handle plan change
  const handleChangePlan = async () => {
    if (!selectedPlanId) {
      toast.error("Please select a plan", { theme: "dark" });
      return;
    }

    setChangingPlan(true);
    try {
      const payload = await dispatch(
        createCheckoutSessionThunk(selectedPlanId)
      ).unwrap();

      if (payload.message && !payload.trialActivated && !payload.url) {
        toast.error(payload.message, { theme: "dark" });
        return;
      }

      if (payload.trialActivated) {
        toast.success(payload.message ?? "Plan changed successfully!", { theme: "dark" });
        setSubscriptionOpen(false);
        setSelectedPlanId(null);
        // Refresh session or redirect
        return;
      }

      if (payload.url) {
        toast.info("Redirecting to Stripe for payment...", { theme: "dark" });
        window.location.href = payload.url;
        return;
      }
    } catch (error: any) {
      toast.error(error?.message || "Failed to change plan. Please try again.", { theme: "dark" });
    } finally {
      setChangingPlan(false);
    }
  };

  const fetchUserDetail = async () => {
    try {
      await dispatch(getUserByIdThunk(Number(user.id)));

    } catch (err: any) {
      console.error(err.message || "Failed to fetch user details")
    }
  }

  useEffect(() => {
    if (user?.id) {
      fetchUserDetail();
    }
  }, [user?.id, dispatch]);

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
        <section className="relative px-4 py-4 pb-24">
          <div className="max-w-7xl mx-auto">

            {loading ? (
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
              <motion.div
                className="grid grid-cols-1 lg:grid-cols-3 gap-6"
                variants={staggerContainer}
                initial="initial"
                animate="animate"
              >
                {/* Left Column - Main Content */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Profile Information Card */}
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
                              onClick={handleSaveClick} loading={updating}
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
                          <p className="text-sm text-white">Pro Plan</p>
                        </div>
                        <div>
                          <label className="text-xs text-gray-400 mb-1.5 block font-medium">Subscribed On</label>
                          <p className="text-sm text-white">Dec 12, 2025</p>
                        </div>
                      </div>


                    </form>
                  </motion.div>


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

                  {/* Recent Activity */}
                  {!userLoading && selectedUser && <motion.div
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
                              <TableHead className="min-w-[120px] bg-white/5">Plan</TableHead>
                              <TableHead className="min-w-[100px] bg-white/5">Status</TableHead>
                              <TableHead className="min-w-[120px] bg-white/5">Start Date</TableHead>
                              <TableHead className="min-w-[120px] bg-white/5">End Date</TableHead>
                              <TableHead className="min-w-[100px] bg-white/5">Amount</TableHead>
                              <TableHead className="min-w-[100px] bg-white/5">Payment Method</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {selectedUser.allSubscriptions.map((subscription: ApiCurrentSubscription) => (
                              <TableRow key={subscription.id}>
                                <TableCell className="text-text-primary font-medium bg-white/5 ">
                                  {subscription.planName}
                                </TableCell>
                                <TableCell className="text-text-primary font-medium bg-white/5 ">
                                  <span
                                    className={cn(
                                      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium "
                                    )}
                                  >
                                    {getSubscriptionStatusBadge(subscription.status)}
                                  </span>
                                </TableCell>
                                <TableCell className="text-text-primary font-medium bg-white/5">
                                  {new Date(subscription.startDate).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  })}
                                </TableCell>
                                <TableCell className="text-text-primary font-medium bg-white/5">
                                  {new Date(subscription.endDate).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  })}
                                </TableCell>
                                <TableCell className="text-accent-primary font-medium bg-white/5 font-medium">
                                  {subscription.status === "TRIAL"
                                    ? "FREE"
                                    : `$${subscription.price.toFixed(2)}`}
                                </TableCell>
                                <TableCell className="text-text-tertiary font-medium bg-white/5">
                                  {subscription.paymentMethod}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  </motion.div>}
                </div>

                {/* Right Column - Sidebar */}
                {!userLoading && selectedUser &&<div className="space-y-6">
                  {/* Current Plan */}
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
                        />
                        <DropdownContent className="!bg-white/10 !backdrop-blur-md !border-white/20">
                          <DropdownItem
                            onClick={() => {
                              setSubscriptionOpen(true);
                            }}
                          >
                            Change plan
                          </DropdownItem>
                          <DropdownItem
                            danger
                            onClick={() => {
                              // Handle cancel plan action
                              console.log("Cancel plan clicked");
                            }}
                          >
                            Cancel plan
                          </DropdownItem>
                        </DropdownContent>
                      </Dropdown>
                    </div>

                    <h3 className="text-2xl font-bold text-yellow-300 mb-2">{selectedUser.currentSubscription?.planName}</h3>
                    <p className="text-sm text-gray-400 mb-4">{selectedUser.currentSubscription?.description}</p>

                    <div className="mb-6">
                      <span className="text-3xl font-bold text-yellow-400">${selectedUser.currentSubscription?.price ? selectedUser.currentSubscription?.price.toFixed(2) : "FREE"}</span>
                      <span className="text-sm text-gray-400 ml-1">${selectedUser.currentSubscription?.duration === 1 ? '/month' : '/year'}</span>
                    </div>

                    <div className="pt-4 border-t border-white/10">
                      <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">Included Features</h4>
                      <div className="space-y-3">
                        {[
                          "Daily Pick 3 Predictions",
                          "Access to All States",
                          "Full Draw History",
                          "Priority Email Support",
                          "Advanced Hit Tracker",
                          "Weekly Performance Reports",
                          "Early Access to New Features",
                        ].map((feature, index) => (
                          <div key={index} className="flex items-center gap-3">
                            <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0">
                              <Check className="w-3 h-3 text-yellow-400" />
                            </div>
                            <span className="text-sm text-white">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>

                  {/* Account Actions */}
                  <motion.div
                    className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 hover:border-yellow-400/50 transition-all duration-300"
                    variants={staggerItem}
                    whileHover={{ scale: 1.01, y: -2 }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-white">Account Actions</h3>
                      <div className="flex items-center gap-2 py-1 px-3 rounded-lg bg-white/5 border border-yellow-400/30">
                        <span className="text-xs font-medium text-yellow-400">Coming Soon...</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <button
                        onClick={() => setChangePasswordOpen(true)}
                        className="w-full flex items-center gap-3 p-3 text-left rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-colors group"
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
                        onClick={() => setBilling(true)}
                        className="w-full flex items-center gap-3 p-3 text-left rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-colors group"
                      >
                        <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center group-hover:bg-purple-500/20 transition-colors">
                          <CreditCard className="w-5 h-5 text-purple-400" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-white">Billing & Subscription</p>
                          <p className="text-xs text-gray-400">Manage your subscription</p>
                        </div>
                      </button>
                    </div>
                  </motion.div>

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
                </div>}
              </motion.div>
            )}
          </div>
        </section>

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
                <label className="text-sm font-medium text-white mb-2 block">
                  Current Password
                </label>
                <div className="relative">
                  <Input
                    type="password"
                    name="currentPassword"
                    value={formik.values.currentPassword}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Enter current password"
                  />

                  {formik.touched.currentPassword && formik.errors.currentPassword && (
                    <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {formik.errors.currentPassword}
                    </p>
                  )}

                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-white mb-2 block">
                  New Password
                </label>
                <div className="relative">
                  <Input
                    type="password"
                    name="newPassword"
                    value={formik.values.newPassword}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Enter new password"
                  />

                  {formik.touched.newPassword && formik.errors.newPassword && (
                    <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {formik.errors.newPassword}
                    </p>
                  )}

                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-white mb-2 block">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Input
                    type="password"
                    name="confirmPassword"
                    value={formik.values.confirmPassword}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Confirm new password"
                  />

                  {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                    <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {formik.errors.confirmPassword}
                    </p>
                  )}

                </div>
              </div>

              <DialogFooter className="flex justify-end">
                <Button type="text" className="!w-fit border border-error" danger onClick={() => { formik.resetForm(), setChangePasswordOpen(false) }}>
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
          description="Manage your subscription and billing information."
          footer={
            <div className="flex flex-col-reverse sm:flex-row justify-end items-center gap-3 w-full">
              <Button
                className="!w-full sm:!w-fit"
                onClick={() => {
                  setSubscriptionOpen(false);
                  setSelectedPlanId(null);
                }}
                disabled={changingPlan}
              >
                Cancel
              </Button>
              <Button
                type="primary"
                className="!w-full sm:!w-fit"
                onClick={handleChangePlan}
                loading={changingPlan}
                disabled={!selectedPlanId || selectedPlanId === currentPlanId}
              >
                Proceed
              </Button>
            </div>
          }
        >
          {plansLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-gray-400">Loading plans...</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mappedPlans.map((plan) => {
                const isCurrentPlan = plan.id === currentPlanId;
                const isSelected = selectedPlanId === plan.id;
                const isDisabled = isCurrentPlan;

                return (
                  <div
                    key={plan.id}
                    onClick={() => {
                      if (!isDisabled) {
                        setSelectedPlanId(plan.id);
                      }
                    }}
                    className={cn(
                      "relative p-6 rounded-xl border-2 cursor-pointer transition-all duration-300",
                      isCurrentPlan
                        ? "bg-yellow-400/10 border-yellow-400/50"
                        : isSelected
                          ? "bg-yellow-400/20 border-yellow-400 shadow-lg shadow-yellow-400/20"
                          : "bg-white/5 border-white/10 hover:border-yellow-400/30 hover:bg-white/10",
                      isDisabled && "cursor-not-allowed opacity-75"
                    )}
                  >
                    {/* Current Plan Badge */}
                    {isCurrentPlan && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                        <span className="bg-yellow-400 text-black px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                          Current Plan
                        </span>
                      </div>
                    )}

                    {/* Selected Indicator */}
                    {isSelected && !isCurrentPlan && (
                      <div className="absolute top-3 right-3">
                        <div className="w-6 h-6 rounded-full bg-yellow-400 flex items-center justify-center">
                          <Check className="w-4 h-4 text-black" />
                        </div>
                      </div>
                    )}

                    {/* Current Plan Check Icon */}
                    {isCurrentPlan && (
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
                            ${plan.price}
                          </span>
                          <span className="text-gray-400 text-sm">{plan.period}</span>
                        </div>
                      )}
                      {(plan.discountPercent ?? 0) > 0 && (
                        <div className="flex items-baseline gap-1 mt-1">
                          <span className="text-gray-500 text-lg line-through">
                            ${plan.originalPrice?.toFixed(2)}
                          </span>
                          <span className="text-gray-400 text-sm">{plan.period}</span>
                        </div>
                      )}
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </Popup>

        {/* Subscription Details Dialog */}
        <Dialog open={billing} onOpenChange={setBilling}>
          <DialogContent showCloseButton className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Subscription Details</DialogTitle>
              <DialogDescription>
                View your current subscription plan and billing information.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white">Pro Plan</h3>
                    <p className="text-sm text-gray-400">Active Subscription</p>
                  </div>
                  <span className="px-3 py-1 rounded-md text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                    Active
                  </span>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Plan Price</span>
                    <span className="text-lg font-semibold text-yellow-400">$29.99/month</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Billing Cycle</span>
                    <span className="text-sm text-white">Monthly</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Next Billing Date</span>
                    <span className="text-sm text-white">Jan 12, 2026</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Payment Method</span>
                    <span className="text-sm text-white">•••• •••• •••• 4242</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-white">Plan Features</h4>
                <div className="space-y-2">
                  {[
                    "Unlimited game predictions",
                    "Advanced analytics dashboard",
                    "Priority customer support",
                    "Email notifications",
                    "API access",
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full  flex items-center justify-center">
                        <Check className="w-4 h-4 text-accent-primary" />
                      </div>
                      <span className="text-sm text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-border-primary">
                <Button type="primary" className="w-full" onClick={() => { setBilling(false), setSubscriptionOpen(true) }} >
                  Manage Subscription
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </motion.div>
  );
}
