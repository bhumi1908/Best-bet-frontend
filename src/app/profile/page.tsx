"use client";

import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/Dialog";
import { Pencil, Save, Lock, Shield, CreditCard, Mail, User, Activity, X, Package, Check } from "lucide-react";
import { useState, useEffect, useRef } from "react";
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
import { motion } from "framer-motion";

export default function ProfilePage() {
  const { data: session, update } = useSession();
  const user = session?.user

  const firstNameRef = useRef<HTMLInputElement>(null);
  const lastNameRef = useRef<HTMLInputElement>(null);
  const [isEditProfile, setIsEditProfile] = useState(false);
  const [loading, setLoading] = useState(true);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [subscriptionOpen, setSubscriptionOpen] = useState(false);
  // 2FA state
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
  });
  const [formValues, setFormValues] = useState({
    firstName: "",
    lastName: "",
  });

  const dispatch = useAppDispatch();
  const { isLoading, error, successConfirmPassMessage } = useAppSelector(
    (state) => state.profile
  );

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

  const handleCancel = () => {
    setFormValues(profile);
    setIsEditProfile(false);
  };


  const handleEditProfile = async () => {
    setIsEditProfile(!isEditProfile)
    if (isEditProfile) {

      const isDirty =
        formValues.firstName.trim() !== profile.firstName.trim() ||
        formValues.lastName.trim() !== profile.lastName.trim();

      if (!isDirty) {
        setIsEditProfile(false);
        toast.info("No changes to save");
        return;
      }

      try {
        const updatedUser = await dispatch(
          editAdminProfileThunk({
            id: session!.user.id,
            firstName: formValues.firstName.trim(),
            lastName: formValues.lastName.trim(),
          })
        ).unwrap();

        setProfile({
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
        });

        update({
          user: {
            ...session?.user,
            firstName: updatedUser.firstName,
            lastName: updatedUser.lastName,
          },
        });

        setIsEditProfile(false);
        toast.success("Profile updated successfully", {
          theme: "dark",
        });
      } catch (err: any) {
        console.error("Failed to update profile:", err);
        toast.error(err?.message || "Failed to update profile", {
          theme: "dark",
        });
      }
    } else {
      setIsEditProfile(true);
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

  const recentActivity = [
    { action: "Password changed", time: "2 hours ago", type: "security" },
    { action: "Profile updated", time: "1 day ago", type: "profile" },
    { action: "Login from new device", time: "3 days ago", type: "security" },
    { action: "Email verified", time: "1 week ago", type: "profile" },
  ];

  useEffect(() => {
    if (session?.user) {
      const data = {
        firstName: session.user.firstName,
        lastName: session.user.lastName,
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
                    className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 hover:border-yellow-400/50 transition-all duration-300"
                    variants={staggerItem}
                    whileHover={{ scale: 1.01, y: -2 }}
                  >
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 border border-yellow-400/30 flex items-center justify-center shadow-lg shadow-yellow-400/20">
                          <span className="text-xl font-bold text-black">
                            {getUserInitials()}
                          </span>
                        </div>
                        <div>
                          <h2 className="text-xl font-semibold text-white mb-1">{getUserName()}</h2>
                          <p className="text-sm text-gray-400">{user?.email}</p>
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
                        />
                      </div>
                    </div>

                    {/* User Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-gray-400 mb-1.5 block font-medium">First Name</label>
                        {isEditProfile ? (
                          <Input
                            defaultValue={user?.firstName}
                            ref={firstNameRef}
                            size="middle"
                            onChange={handleChange("firstName")}
                          />
                        ) : (
                          <p className="text-sm text-white">{user?.firstName || "N/A"}</p>
                        )}
                      </div>
                      <div>
                        <label className="text-xs text-gray-400 mb-1.5 block font-medium">Last Name</label>
                        {isEditProfile ? (
                          <Input
                            defaultValue={user?.lastName}
                            ref={lastNameRef}
                            size="middle"
                            onChange={handleChange("lastName")}
                          />
                        ) : (
                          <p className="text-sm text-white">{user?.lastName || "N/A"}</p>
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
                  </motion.div>

                  {/* Recent Activity */}
                  <motion.div
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
                  </motion.div>
                </div>

                {/* Right Column - Sidebar */}
                <div className="space-y-6">
                  {/* Current Plan */}
                  <motion.div
                    className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-yellow-400/30 hover:border-yellow-400/50 transition-all duration-300"
                    variants={staggerItem}
                    whileHover={{ scale: 1.02, y: -3 }}
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <Package className="w-4 h-4 text-yellow-400" />
                      <span className="text-sm font-medium text-white">Current Plan</span>
                    </div>

                    <h3 className="text-2xl font-bold text-yellow-300 mb-2">Premium Plan</h3>
                    <p className="text-sm text-gray-400 mb-4">Best value for serious players</p>

                    <div className="mb-6">
                      <span className="text-3xl font-bold text-yellow-400">$19.99</span>
                      <span className="text-sm text-gray-400 ml-1">/month</span>
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
                        onClick={() => setSubscriptionOpen(true)}
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
                  <motion.div
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
                  </motion.div>
                </div>
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

        {/* Subscription Details Dialog */}
        <Dialog open={subscriptionOpen} onOpenChange={setSubscriptionOpen}>
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
                <Button type="primary" className="w-full">
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
