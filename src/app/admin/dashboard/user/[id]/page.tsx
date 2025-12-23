"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, User, Mail, Shield, DollarSign, Pencil, Ban } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/Dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/Accordion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { useUserContext } from "@/components/providers/UserContextProvider";
import { Skeleton } from "@/components/ui/Skeleton";
import { UserDetail, UserFormData, userToUIUser, UserSubscription, UserTicket, UserGameHistory } from "@/types/user";
import { useAppDispatch } from "@/redux/store/hooks";
import { getUserByIdThunk, updateUserThunk } from "@/redux/thunk/userThunk";
import { toast } from "react-toastify";

// Static dummy data for subscriptions, tickets, and gameHistory
const getDummySubscriptions = (): UserSubscription[] => [
  {
    id: "1",
    plan: "Premium Plan",
    status: "active",
    date: new Date(Date.now() - 8 * 86400000).toISOString(),
    amount: 29.99,
  },
];

const getDummyTickets = (): UserTicket[] => [
  {
    id: "1",
    subject: "Payment issue",
    status: "open",
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
];

const getDummyGameHistory = (): UserGameHistory[] => [
  {
    id: "1",
    gameType: "Pick 3",
    outcome: "win",
    date: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
];

export default function UserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { selectedUser } = useUserContext();
  const userId = params.id as string;
  const [user, setUser] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [userToDisable, setUserToDisable] = useState<UserDetail | null>(null);
  const [updating, setUpdating] = useState(false);

  const [formData, setFormData] = useState<UserFormData>({
    firstName: "",
    lastName: "",
    email: "",
    role: "USER",
    isActive: true,
  });

  const fetchUser = useCallback(async () => {
    try {
      setLoading(true);
      const userIdNum = parseInt(userId, 10);

      if (isNaN(userIdNum)) {
        setLoading(false);
        return;
      }

      // Fetch user from API
      const result = await dispatch(getUserByIdThunk(userIdNum)).unwrap();

      // Convert backend User to UI UserDetail format
      const uiUser = userToUIUser(result);
      const userData: UserDetail = {
        id: uiUser.id,
        email: uiUser.email,
        firstName: uiUser.firstName || undefined,
        lastName: uiUser.lastName || undefined,
        name: uiUser.name,
        role: uiUser.role,
        createdAt: result.createdAt,
        updatedAt: result.updatedAt,
        isActive: !result.isInactive,
        // Add static dummy data for subscriptions, tickets, and gameHistory
        // (These are not returned from the API, so we use static data)
        subscriptions: getDummySubscriptions(),
        tickets: getDummyTickets(),
        gameHistory: getDummyGameHistory(),
      };

      setUser(userData);
      setFormData({
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        email: userData.email,
        role: userData.role,
        isActive: userData.isActive,
      });
    } catch (error: any) {
      console.error("Failed to fetch user:", error);
      toast.error(error?.message || "Failed to fetch user details");

      // Fallback to selectedUser from context or show error
      if (selectedUser && selectedUser.id === userId) {
        const userData: UserDetail = {
          id: selectedUser.id,
          email: selectedUser.email,
          firstName: selectedUser.firstName,
          lastName: selectedUser.lastName,
          name: selectedUser.name,
          role: selectedUser.role,
          createdAt: selectedUser.createdAt || new Date(Date.now() - 30 * 86400000).toISOString(),
          updatedAt: selectedUser.updatedAt || new Date(Date.now() - 17 * 86400000).toISOString(),
          isActive: selectedUser.isActive ?? true,
          subscriptions: getDummySubscriptions(),
          tickets: getDummyTickets(),
          gameHistory: getDummyGameHistory(),
        };
        setUser(userData);
        setFormData({
          firstName: userData.firstName || "",
          lastName: userData.lastName || "",
          email: userData.email,
          role: userData.role,
          isActive: userData.isActive,
        });
      }
    } finally {
      setLoading(false);
    }
  }, [userId, selectedUser, dispatch]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const handleSave = async () => {
    if (!user) return;

    // Check if any changes were made
    const hasChanges =
      (formData.firstName || "") !== (user.firstName || "") ||
      (formData.lastName || "") !== (user.lastName || "") ||
      formData.role !== user.role;

    // If no changes, just close editing mode without calling API
    if (!hasChanges) {
      setEditing(false);
      toast.info("No changes to save");
      return;
    }

    try {
      setUpdating(true);
      const userIdNum = parseInt(userId, 10);

      if (isNaN(userIdNum)) {
        toast.error("Invalid user ID");
        return;
      }

      // Prepare update payload (only send fields that can be updated)
      // Note: Email cannot be updated via this endpoint
      const updatePayload = {
        id: userIdNum,
        firstName: formData.firstName || undefined,
        lastName: formData.lastName || undefined,
        role: formData.role,
        // Note: isInactive is not updated here, only via toggle active button
      };

      // Call update API
      const updatedUser = await dispatch(updateUserThunk(updatePayload)).unwrap();

      // Convert backend User to UI UserDetail format
      const uiUser = userToUIUser(updatedUser);
      const updatedUserData: UserDetail = {
        id: uiUser.id,
        email: uiUser.email,
        firstName: uiUser.firstName || undefined,
        lastName: uiUser.lastName || undefined,
        name: uiUser.name,
        role: uiUser.role,
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt,
        isActive: !updatedUser.isInactive,
        // Keep existing dummy data for subscriptions, tickets, and gameHistory
        subscriptions: user.subscriptions || getDummySubscriptions(),
        tickets: user.tickets || getDummyTickets(),
        gameHistory: user.gameHistory || getDummyGameHistory(),
      };

      setUser(updatedUserData);
      setEditing(false);
      toast.success("User updated successfully");
    } catch (error: any) {
      console.error("Failed to update user:", error);
      toast.error(error?.message || "Failed to update user");
    } finally {
      setUpdating(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email,
        role: user.role,
        isActive: user.isActive,
      });
    }
    setEditing(false);
  };

  const handleToggleActive = async () => {
    setUserToDisable(user);
    setDialogOpen(true);
  };

  const getRoleBadge = (role: string) => {
    return (
      <span
        className={cn(
          "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border",
          role === "ADMIN"
            ? "bg-accent-primary/20 text-accent-primary border-border-accent"
            : "bg-bg-tertiary text-text-tertiary border-border-primary"
        )}
      >
        {role}
      </span>
    );
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      active: "bg-green-500/20 text-green-400 border-green-500/30",
      inactive: "bg-red-500/20 text-red-400 border-red-500/30",
    };
    return (
      <span
        className={cn(
          "inline-flex items-center px-3 py-1 rounded-full text-md font-medium border",
          styles[status as keyof typeof styles] || styles.active
        )}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2 w-fit">
          <Button size="small" className="!w-fit !p-2 h-fit mt-2.5" icon={<ArrowLeft className="w-5 h-5" />} onClick={() => router.back()}>
          </Button>
          <div>
            <h1 className="text-2xl sm:text-4xl font-bold mt-2 mb-2 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text text-transparent">
              User Details
            </h1>
            <p className="text-text-tertiary text-sm sm:text-base">View and manage user information</p>
          </div>
        </div>
        {!loading && !editing && user && (
          <div className="flex gap-3">
            <Button onClick={() => setEditing(true)} icon={<Pencil className="w-4 h-4 text-text-tertiary cursor-pointer" />}>Edit</Button>
            <Button
              onClick={handleToggleActive}
              className={`${!user.isActive ? "!bg-success" : "!bg-error"}`}
              disabled={updating}
              icon={<Ban className="w-4 h-4 cursor-pointer" />}
            >
              {user.isActive ? "Deactivate" : "Activate"}
            </Button>
          </div>
        )}
      </div>

      {loading && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Details Skeleton */}
          <div className="lg:col-span-3 space-y-6">
            {/* User Info Card Skeleton */}
            <div className="bg-bg-card border border-border-primary rounded-lg p-6">
              <Skeleton className="h-6 w-40 mb-4" />
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i}>
                      <Skeleton className="h-3 w-20 mb-2" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Subscriptions Card Skeleton */}
            <div className="bg-bg-card border border-border-primary rounded-lg p-6">
              <Skeleton className="h-6 w-32 mb-4" />
              <div className="space-y-3">
                {[1, 2].map((i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 bg-bg-secondary rounded-lg border border-border-primary"
                  >
                    <div className="flex flex-col gap-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                    <div className="text-right flex flex-col gap-2">
                      <Skeleton className="h-6 w-16" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Game History Card Skeleton */}
            <div className="bg-bg-card border border-border-primary rounded-lg p-6">
              <Skeleton className="h-6 w-32 mb-4" />
              <div className="space-y-3">
                {[1, 2].map((i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 bg-bg-secondary rounded-lg border border-border-primary"
                  >
                    <div>
                      <Skeleton className="h-4 w-24 mb-2" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-6 w-16 rounded-full" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Skeleton */}
          <div className="space-y-6">
            {/* Important Dates Card Skeleton */}
            <div className="bg-bg-card border border-border-primary rounded-lg p-6">
              <Skeleton className="h-6 w-36 mb-4" />
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i}>
                    <Skeleton className="h-3 w-24 mb-2" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats Card Skeleton */}
            <div className="bg-bg-card border border-border-primary rounded-lg p-6">
              <Skeleton className="h-6 w-28 mb-4" />
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex justify-between items-center">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-4 w-8" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {!loading && !user && (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-text-muted">User not found</div>
        </div>
      )}

      {!loading && user && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Details */}
          <div className="lg:col-span-3 space-y-6">
            {/* User Info */}
            <div className="bg-bg-card border border-border-primary rounded-lg p-6 relative">
              <div className="absolute top-4 right-4 ">
                {getStatusBadge(user.isActive ? "active" : "inactive")}
              </div>
              <h2 className="text-lg font-semibold text-text-primary mb-4">User Information</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-text-muted mb-1 block">First Name</label>
                    {editing ? (
                      <Input
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        className="w-full"
                      />
                    ) : (
                      <p className="text-text-primary">{user.firstName || "N/A"}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-xs text-text-muted mb-1 block">Last Name</label>
                    {editing ? (
                      <Input
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        className="w-full"
                      />
                    ) : (
                      <p className="text-text-primary">{user.lastName || "N/A"}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-xs text-text-muted mb-1 block">Email</label>
                    <p className="text-text-primary">{user.email}</p>
                    {editing && (
                      <p className="text-xs text-text-muted mt-1">Email cannot be changed</p>
                    )}
                  </div>
                  <div>
                    <label className="text-xs text-text-muted mb-1 block">Role</label>
                    {editing ? (
                      <Select
                        value={formData.role}
                        onValueChange={(value) => setFormData({ ...formData, role: value as any })}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USER">USER</SelectItem>
                          <SelectItem value="ADMIN">ADMIN</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <p className="text-text-primary capitalize!">{user.role}</p>
                    )}
                  </div>
                </div>
                {editing && (
                  <div className="flex gap-2 pt-4 border-t border-border-primary justify-end">
                    <Button
                      type="primary"
                      className="!w-fit"
                      onClick={handleSave}
                      disabled={updating}
                    >
                      {updating ? "Saving..." : "Save Changes"}
                    </Button>
                    <Button
                      type="default"
                      className="!w-fit"
                      onClick={handleCancel}
                      disabled={updating}
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Subscriptions */}
            {user.subscriptions && user.subscriptions.length > 0 && (
              <div className="bg-bg-card border border-border-primary rounded-lg p-6">
                <h2 className="text-lg font-semibold text-text-primary mb-4">Subscriptions</h2>
                <div className="space-y-3">
                  {user.subscriptions.map((subscription) => (
                    <div
                      key={subscription.id}
                      className="flex flex-col gap-2 p-3 bg-bg-secondary rounded-lg border border-border-primary"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-medium text-accent-primary">{subscription.plan}</p>
                        <p className="text-sm font-medium text-accent-primary">
                          ${subscription.amount.toFixed(2)}
                        </p>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs text-gray-300">
                          <span className="text-text-muted">Subscription Date: </span>
                          {new Date(subscription.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                        <p className="text-xs text-gray-300">
                          <span className="text-text-muted">Subscription End Date: </span>
                          {new Date(new Date(subscription.date).getTime() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                        <p className="text-xs text-gray-300">
                          <span className="text-text-muted">Payment Method: </span>
                          Credit Card
                        </p>
                      </div>
                    </div>
                  ))}
                  <div className="px-3 bg-bg-secondary rounded-lg border border-border-primary">
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="subscription-history">
                        <AccordionTrigger>
                          <h2 className="text-md font-semibold text-gray-300">Subscription History</h2>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="overflow-x-auto">
                            <Table className="w-full rounded-lg overflow-hidden">
                              <TableHeader>
                                <TableRow>
                                  <TableHead className="min-w-[120px]">Plan</TableHead>
                                  <TableHead className="min-w-[100px]">Status</TableHead>
                                  <TableHead className="min-w-[120px]">Start Date</TableHead>
                                  <TableHead className="min-w-[120px]">End Date</TableHead>
                                  <TableHead className="min-w-[100px]">Amount</TableHead>
                                  <TableHead className="min-w-[100px]">Payment Method</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {[
                                  {
                                    id: "2",
                                    plan: "Premium Plan",
                                    status: "Expired",
                                    startDate: new Date(Date.now() - 90 * 86400000).toISOString(),
                                    endDate: new Date(Date.now() - 60 * 86400000).toISOString(),
                                    amount: 19.99,
                                    paymentMethod: "Credit Card",
                                  },
                                  {
                                    id: "3",
                                    plan: "Basic Plan",
                                    status: "Expired",
                                    startDate: new Date(Date.now() - 120 * 86400000).toISOString(),
                                    endDate: new Date(Date.now() - 90 * 86400000).toISOString(),
                                    amount: 9.99,
                                    paymentMethod: "PayPal",
                                  },
                                  {
                                    id: "4",
                                    plan: "Premium Plan",
                                    status: "Cancelled",
                                    startDate: new Date(Date.now() - 150 * 86400000).toISOString(),
                                    endDate: new Date(Date.now() - 120 * 86400000).toISOString(),
                                    amount: 19.99,
                                    paymentMethod: "Credit Card",
                                  },
                                  {
                                    id: "5",
                                    plan: "Basic Plan",
                                    status: "Expired",
                                    startDate: new Date(Date.now() - 180 * 86400000).toISOString(),
                                    endDate: new Date(Date.now() - 150 * 86400000).toISOString(),
                                    amount: 9.99,
                                    paymentMethod: "Credit Card",
                                  },
                                ].map((subscription) => (
                                  <TableRow key={subscription.id}>
                                    <TableCell className="text-text-primary font-medium">
                                      {subscription.plan}
                                    </TableCell>
                                    <TableCell>
                                      <span
                                        className={cn(
                                          "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
                                          subscription.status === "Active"
                                            ? "bg-green-500/20 text-green-400 border-green-500/30"
                                            : subscription.status === "Expired"
                                              ? "bg-gray-500/20 text-gray-400 border-gray-500/30"
                                              : "bg-red-500/20 text-red-400 border-red-500/30"
                                        )}
                                      >
                                        {subscription.status}
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
                                    <TableCell className="text-accent-primary font-medium">
                                      ${subscription.amount.toFixed(2)}
                                    </TableCell>
                                    <TableCell className="text-text-tertiary">
                                      {subscription.paymentMethod}
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                </div>
              </div>
            )}
            {/* Game History */}
            <div className="bg-bg-card border border-border-primary rounded-lg p-6">
              <h2 className="text-lg font-semibold text-text-primary mb-4">Game History</h2>
              <div className="space-y-3">
                {user.gameHistory && user.gameHistory.length > 0 && user.gameHistory.map((game) => (
                  <div
                    key={game.id}
                    className="flex items-center justify-between p-3 bg-bg-secondary rounded-lg border border-border-primary"
                  >
                    <div>
                      <p className="text-sm font-medium text-text-primary">{game.gameType}</p>
                      <p className="text-xs text-text-muted">
                        {new Date(game.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
                          game.outcome === "win"
                            ? "bg-green-500/20 text-green-400 border-green-500/30"
                            : game.outcome === "loss"
                              ? "bg-red-500/20 text-red-400 border-red-500/30"
                              : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                        )}
                      >
                        {game.outcome.charAt(0).toUpperCase() + game.outcome.slice(1)}
                      </span>
                    </div>
                  </div>
                ))}
                <div className="px-3 bg-bg-secondary rounded-lg border border-border-primary">
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="game-history">
                      <AccordionTrigger>
                        <h2 className="text-md font-semibold text-gray-300">Game History</h2>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="overflow-x-auto">
                          <Table className="w-full rounded-lg overflow-hidden">
                            <TableHeader>
                              <TableRow>
                                <TableHead className="min-w-[120px]">Game Type</TableHead>
                                <TableHead className="min-w-[100px]">Status</TableHead>
                                <TableHead className="min-w-[120px]">Date</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {[
                                {
                                  id: "2",
                                  gameType: "Pick 3",
                                  status: "Win",
                                  date: new Date(Date.now() - 90 * 86400000).toISOString(),
                                },
                                {
                                  id: "3",
                                  gameType: "Pick 4",
                                  status: "Loss",
                                  date: new Date(Date.now() - 120 * 86400000).toISOString(),
                                },
                                {
                                  id: "4",
                                  gameType: "Pick 5",
                                  status: "Win",
                                  date: new Date(Date.now() - 150 * 86400000).toISOString(),
                                },
                                {
                                  id: "5",
                                  gameType: "Mega Millions",
                                  status: "Pending",
                                  date: new Date(Date.now() - 180 * 86400000).toISOString(),
                                },
                              ].map((game) => (
                                <TableRow key={game.id}>
                                  <TableCell className="text-text-primary font-medium">
                                    {game.gameType}
                                  </TableCell>
                                  <TableCell>
                                    <span
                                      className={cn(
                                        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
                                        game.status === "Win"
                                          ? "bg-green-500/20 text-green-400 border-green-500/30"
                                          : game.status === "Pending"
                                            ? "bg-gray-500/20 text-gray-400 border-gray-500/30"
                                            : "bg-red-500/20 text-red-400 border-red-500/30"
                                      )}
                                    >
                                      {game.status}
                                    </span>
                                  </TableCell>
                                  <TableCell className="text-text-primary">
                                    {new Date(game.date).toLocaleDateString("en-US", {
                                      year: "numeric",
                                      month: "short",
                                      day: "numeric",
                                    })}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Important Dates */}
            <div className="bg-bg-card border border-border-primary rounded-lg p-6">
              <h2 className="text-lg font-semibold text-text-primary mb-4">Important Dates</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-text-muted mb-1">Created At</p>
                  <p className="text-sm text-text-primary">
                    {new Date(user.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-text-muted mb-1">Last Updated</p>
                  <p className="text-sm text-text-primary">
                    {new Date(user.updatedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-text-muted mb-1">Recent Login</p>
                  <p className="text-sm text-text-primary">
                    {new Date(user.updatedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-bg-card border border-border-primary rounded-lg p-6">
              <h2 className="text-lg font-semibold text-text-primary mb-4">Quick Stats</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-text-muted">Subscriptions</span>
                  <span className="text-sm font-medium text-text-primary">
                    {user.subscriptions?.length || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-text-muted">Support Tickets</span>
                  <span className="text-sm font-medium text-text-primary">
                    {user.tickets?.length || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-text-muted">Games Played</span>
                  <span className="text-sm font-medium text-text-primary">
                    {user.gameHistory?.length || 0}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toggle Active Status Confirmation Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              {userToDisable && (
                <>
                  {userToDisable.isActive
                    ? "This will deactivate the user"
                    : "This will activate the user"}{" "}
                  <span className="font-medium text-text-primary">
                    {userToDisable.name ||
                      `${userToDisable.firstName || ""} ${userToDisable.lastName || ""}`.trim() ||
                      userToDisable.email}
                  </span>
                  {userToDisable.email && (
                    <>
                      {" "}(<span className="font-medium text-text-primary">{userToDisable.email}</span>).
                    </>
                  )}
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <div className="flex justify-end gap-3 mt-6">
              <Button
                type="default"
                onClick={() => {
                  setDialogOpen(false);
                  setUserToDisable(null);
                }}
              >
                Cancel
              </Button>
              <Button
                type="primary"
                danger={userToDisable?.isActive}
                onClick={async () => {
                  if (userToDisable) {
                    try {
                      setUpdating(true);
                      const userIdNum = parseInt(userToDisable.id, 10);

                      if (isNaN(userIdNum)) {
                        toast.error("Invalid user ID");
                        return;
                      }

                      const newIsActive = !userToDisable.isActive;

                      // Call update API to toggle active status
                      // If activating (newIsActive = true), set isInactive = false
                      // If deactivating (newIsActive = false), set isInactive = true
                      const updatePayload = {
                        id: userIdNum,
                        isInactive: !newIsActive,
                      };

                      const updatedUser = await dispatch(updateUserThunk(updatePayload)).unwrap();

                      // Convert backend User to UI UserDetail format
                      const uiUser = userToUIUser(updatedUser);
                      const updatedUserData: UserDetail = {
                        id: uiUser.id,
                        email: uiUser.email,
                        firstName: uiUser.firstName || undefined,
                        lastName: uiUser.lastName || undefined,
                        name: uiUser.name,
                        role: uiUser.role,
                        createdAt: updatedUser.createdAt,
                        updatedAt: updatedUser.updatedAt,
                        isActive: !updatedUser.isInactive,
                        // Keep existing dummy data
                        subscriptions: userToDisable.subscriptions || getDummySubscriptions(),
                        tickets: userToDisable.tickets || getDummyTickets(),
                        gameHistory: userToDisable.gameHistory || getDummyGameHistory(),
                      };

                      setUser(updatedUserData);
                      setFormData((prevFormData) => ({
                        ...prevFormData,
                        isActive: newIsActive,
                      }));

                      toast.success(`User ${newIsActive ? "activated" : "deactivated"} successfully`);
                    } catch (error: any) {
                      console.error(`Failed to ${userToDisable.isActive ? "deactivate" : "activate"} user:`, error);
                      toast.error(error?.message || `Failed to ${userToDisable.isActive ? "deactivate" : "activate"} user`);
                    } finally {
                      setUpdating(false);
                    }
                  }
                  setDialogOpen(false);
                  setUserToDisable(null);
                }}
                disabled={updating}
              >
                Continue
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

