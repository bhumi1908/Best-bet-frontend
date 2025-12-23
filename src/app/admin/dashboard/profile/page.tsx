"use client";

import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/Dialog";
import { Pencil, Save, Lock, Shield, CreditCard, Calendar, Mail, User, Settings, Activity, TrendingUp, ShieldCheck, CheckCircle2 } from "lucide-react";
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/Skeleton";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";

export default function ProfilePage() {
  const [isEditProfile, setIsEditProfile] = useState(false);
  const [loading, setLoading] = useState(true);
     const { data: session } = useSession();
    const user =session?.user
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");

  // Dialog states
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [subscriptionOpen, setSubscriptionOpen] = useState(false);
  const [twoFAOpen, setTwoFAOpen] = useState(false);

  // Change Password form state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // 2FA state
  const [twoFACode, setTwoFACode] = useState("");
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

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

  const handleEditProfile = () => {
    setIsEditProfile(!isEditProfile);
  };

  const handleChangePassword = () => {
    setPasswordError("");
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("All fields are required");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      return;
    }
    // Handle password change logic here
    setChangePasswordOpen(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleEnable2FA = () => {
    if (twoFACode.length !== 6) {
      return;
    }
    // Handle 2FA enable logic here
    setTwoFAEnabled(true);
    setTwoFAOpen(false);
    setTwoFACode("");
  };

  const handleDisable2FA = () => {
    setTwoFAEnabled(false);
    setTwoFACode("");
  };

  // Dummy data for stats and activity
  const stats = [
    { label: "Total Logins", value: "1,247", icon: Activity, change: "+12%" },
    { label: "Active Sessions", value: "3", icon: Shield, change: "Current" },
    { label: "Last Login", value: "2 hours ago", icon: Calendar, change: "Today" },
    { label: "Account Age", value: "2.5 years", icon: TrendingUp, change: "Active" },
  ];

  const recentActivity = [
    { action: "Password changed", time: "2 hours ago", type: "security" },
    { action: "Profile updated", time: "1 day ago", type: "profile" },
    { action: "Login from new device", time: "3 days ago", type: "security" },
    { action: "Email verified", time: "1 week ago", type: "profile" },
  ];

  return (
    <>
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-1 text-text-primary">Profile</h1>
        <p className="text-text-tertiary text-sm">Manage your account settings and preferences</p>
      </div>

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
                <Button
                  type="text"
                  size="small"
                  icon={isEditProfile ? <Save className="w-4 h-4" /> : <Pencil className="w-4 h-4" />}
                  onClick={handleEditProfile}
                  className="!w-9 !h-9"
                />
              </div>

              {/* User Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-text-tertiary mb-1.5 block font-medium">First Name</label>
                  {isEditProfile ? (
                    <Input
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      size="middle"
                    />
                  ) : (
                    <p className="text-sm text-text-primary">{firstName || "N/A"}</p>
                  )}
                </div>
                <div>
                  <label className="text-xs text-text-tertiary mb-1.5 block font-medium">Last Name</label>
                  {isEditProfile ? (
                    <Input
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      size="middle"
                    />
                  ) : (
                    <p className="text-sm text-text-primary">{lastName || "N/A"}</p>
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
                  <p className="text-sm text-text-primary">Pro Plan</p>
                </div>
                <div>
                  <label className="text-xs text-text-tertiary mb-1.5 block font-medium">Subscribed On</label>
                  <p className="text-sm text-text-primary">Dec 12, 2025</p>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-bg-card border border-border-primary rounded-lg p-6">
              <h3 className="text-lg font-semibold text-text-primary mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {recentActivity.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-bg-secondary rounded-lg border border-border-primary/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center",
                        activity.type === "security" ? "bg-blue-500/10" : "bg-accent-primary/10"
                      )}>
                        {activity.type === "security" ? (
                          <Shield className="w-4 h-4 text-blue-400" />
                        ) : (
                          <User className="w-4 h-4 text-accent-primary" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-text-primary">{activity.action}</p>
                        <p className="text-xs text-text-tertiary">{activity.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Account Actions */}
            <div className="bg-bg-card border border-border-primary rounded-lg p-6">
              <h3 className="text-lg font-semibold text-text-primary mb-4">Account Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => setChangePasswordOpen(true)}
                  className="w-full flex items-center gap-3 p-3 text-left rounded-lg border border-border-primary bg-bg-secondary hover:bg-bg-tertiary transition-colors group"
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
                  onClick={() => setSubscriptionOpen(true)}
                  className="w-full flex items-center gap-3 p-3 text-left rounded-lg border border-border-primary bg-bg-secondary hover:bg-bg-tertiary transition-colors group"
                >
                  <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center group-hover:bg-purple-500/20 transition-colors">
                    <CreditCard className="w-5 h-5 text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-text-primary">Billing & Subscription</p>
                    <p className="text-xs text-text-tertiary">Manage your subscription</p>
                  </div>
                </button>

                <button
                  onClick={() => setTwoFAOpen(true)}
                  className="w-full flex items-center gap-3 p-3 text-left rounded-lg border border-border-primary bg-bg-secondary hover:bg-bg-tertiary transition-colors group"
                >
                  <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center group-hover:bg-green-500/20 transition-colors">
                    <ShieldCheck className="w-5 h-5 text-green-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-text-primary">Set 2FA</p>
                    <p className="text-xs text-text-tertiary">Manage your 2FA</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Quick Info */}
            <div className="bg-bg-card border border-border-primary rounded-lg p-6">
              <h3 className="text-lg font-semibold text-text-primary mb-4">Quick Info</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-text-tertiary" />
                    <span className="text-sm text-text-tertiary">Email Status</span>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-md bg-green-500/10 text-green-400 border border-green-500/20">
                    Verified
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-text-tertiary" />
                    <span className="text-sm text-text-tertiary">2FA Status</span>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-md bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
                    Not Enabled
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-text-tertiary" />
                    <span className="text-sm text-text-tertiary">Account Status</span>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-md bg-green-500/10 text-green-400 border border-green-500/20">
                    Active
                  </span>
                </div>
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
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-text-primary mb-2 block">
                Current Password
              </label>
              <div className="relative">
                <Input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  className="pr-10"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-text-primary mb-2 block">
                New Password
              </label>
              <div className="relative">
                <Input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="pr-10"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-text-primary mb-2 block">
                Confirm New Password
              </label>
              <div className="relative">
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="pr-10"
                />
              </div>
            </div>
            {passwordError && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                <p className="text-sm text-red-400">{passwordError}</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="text" onClick={() => setChangePasswordOpen(false)}>
              Cancel
            </Button>
            <Button type="primary" onClick={handleChangePassword}>
              Change Password
            </Button>
          </DialogFooter>
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
            <div className="p-4 rounded-lg bg-bg-secondary border border-border-primary">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-text-primary">Pro Plan</h3>
                  <p className="text-sm text-text-tertiary">Active Subscription</p>
                </div>
                <span className="px-3 py-1 rounded-md text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                  Active
                </span>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-tertiary">Plan Price</span>
                  <span className="text-lg font-semibold text-accent-primary">$29.99/month</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-tertiary">Billing Cycle</span>
                  <span className="text-sm text-text-primary">Monthly</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-tertiary">Next Billing Date</span>
                  <span className="text-sm text-text-primary">Jan 12, 2026</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-tertiary">Payment Method</span>
                  <span className="text-sm text-text-primary">•••• •••• •••• 4242</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-text-primary">Plan Features</h4>
              <div className="space-y-2">
                {[
                  "Unlimited game predictions",
                  "Advanced analytics dashboard",
                  "Priority customer support",
                  "Email notifications",
                  "API access",
                ].map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
                    <span className="text-sm text-text-secondary">{feature}</span>
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

      {/* 2FA Setup Dialog */}
      {/* <Dialog open={twoFAOpen} onOpenChange={setTwoFAOpen}>
        <DialogContent showCloseButton className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Two-Factor Authentication</DialogTitle>
            <DialogDescription>
              {twoFAEnabled
                ? "Manage your two-factor authentication settings."
                : "Enable two-factor authentication to add an extra layer of security to your account."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            {twoFAEnabled ? (
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                  <div className="flex items-center gap-3 mb-2">
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                    <span className="text-sm font-medium text-green-400">2FA is Enabled</span>
                  </div>
                  <p className="text-xs text-text-tertiary">
                    Your account is protected with two-factor authentication.
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-text-primary mb-2 block">
                    Enter 6-digit code to disable
                  </label>
                  <Input
                    type="text"
                    value={twoFACode}
                    onChange={(e) => setTwoFACode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    placeholder="000000"
                    maxLength={6}
                    className="text-center text-lg tracking-widest"
                  />
                </div>
                <Button
                  type="primary"
                  danger
                  onClick={handleDisable2FA}
                  className="w-full"
                  disabled={twoFACode.length !== 6}
                >
                  Disable 2FA
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-bg-secondary border border-border-primary">
                  <h4 className="text-sm font-semibold text-text-primary mb-3">
                    Setup Instructions
                  </h4>
                  <ol className="space-y-2 text-sm text-text-secondary list-decimal list-inside">
                    <li>Download an authenticator app (Google Authenticator, Authy, etc.)</li>
                    <li>Scan the QR code or enter the secret key</li>
                    <li>Enter the 6-digit code from your app</li>
                    <li>Click "Enable 2FA" to complete setup</li>
                  </ol>
                </div>
                <div className="p-4 rounded-lg bg-bg-secondary border border-border-primary text-center">
                  <img src="https://user-images.githubusercontent.com/34850610/38338922-a156bc90-3839-11e8-8226-e91a57bfd6a2.png" alt="QR Code" className="w-48 h-48 mx-auto bg-white rounded-lg flex items-center justify-center mb-3" />
                  <p className="text-xs text-text-tertiary mb-2">Secret Key:</p>
                  <p className="text-sm font-mono text-text-primary bg-bg-tertiary p-2 rounded border border-border-primary">
                    JBSWY3DPEHPK3PXP
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-text-primary mb-2 block">
                    Enter 6-digit code from your app
                  </label>
                  <Input
                    type="text"
                    value={twoFACode}
                    onChange={(e) => setTwoFACode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    placeholder="000000"
                    maxLength={6}
                    className="text-center text-lg tracking-widest"
                  />
                </div>
                <Button
                  type="primary"
                  onClick={handleEnable2FA}
                  className="w-full"
                  disabled={twoFACode.length !== 6}
                >
                  Enable 2FA
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog> */}
    </>
  );
}
