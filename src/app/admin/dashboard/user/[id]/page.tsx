"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, DollarSign, Pencil, Ban, TrendingUp, CreditCard, Clock } from "lucide-react";
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
import { Skeleton } from "@/components/ui/Skeleton";
import { UserTicket, UserGameHistory } from "@/types/user";
import { useAppDispatch, useAppSelector } from "@/redux/store/hooks";
import { getUserByIdThunk, updateUserThunk } from "@/redux/thunk/userThunk";
import { toast } from "react-toastify";
import { UserRole } from "@/types/auth";
import { useFormik } from "formik";
import { updateAdminSchema } from "@/utilities/schema";
import { zodFormikValidate } from "@/utilities/zodFormikValidate";
import UserDetailSkeleton from "@/components/userDetailsSkeleton";


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
  const { id } = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { selectedUser, isLoading } = useAppSelector((state) => state.user);

  const [editing, setEditing] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNo: "",
    role: "USER",
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      firstName: selectedUser?.firstName ?? "",
      lastName: selectedUser?.lastName ?? "",
      phoneNo: selectedUser?.phoneNo ?? "",
      role: selectedUser?.role ?? "USER",
    },
    validate: zodFormikValidate(updateAdminSchema),
    onSubmit: async (values) => {
      if (!selectedUser) return;

      try {
        setUpdating(true);

        await dispatch(
          updateUserThunk({
            id: selectedUser.id,
            ...values,
          })
        ).unwrap();

        toast.success("User updated successfully 🎉");
        setEditing(false);
      } catch (e: any) {
        toast.error(e?.message || "Update failed");
      } finally {
        setUpdating(false);
      }
    },
  });


  const fetchUserDetail = async () => {
    try {
      await dispatch(getUserByIdThunk(Number(id)));

    } catch (err: any) {
      console.error(err.message || "Failed to fetch user details")
    }
  }

  useEffect(() => {
    if (id) {
      fetchUserDetail();
    }
  }, [id, dispatch, updating]);

  useEffect(() => {
    if (selectedUser) {
      setFormData({
        firstName: selectedUser.firstName ?? "",
        lastName: selectedUser.lastName ?? "",
        phoneNo: selectedUser.phoneNo ?? "",
        role: selectedUser.role ?? "USER",
      });
    }
  }, [selectedUser]);

  const handleSave = async () => {
    if (!selectedUser) return;

    try {
      setUpdating(true);

      await dispatch(
        updateUserThunk({
          id: selectedUser.id,
          firstName: formData.firstName || undefined,
          lastName: formData.lastName || undefined,
          phoneNo: formData.phoneNo || undefined,
          role: formData.role as UserRole,
        })
      ).unwrap();

      toast.success("User updated successfully");
      setEditing(false);
    } catch (e: any) {
      toast.error(e?.message || "Update failed");
    } finally {
      setUpdating(false);
    }
  };

  const handleToggleActive = async () => {
    if (!selectedUser) return;

    try {
      setUpdating(true);

      await dispatch(
        updateUserThunk({
          id: selectedUser.id,
          isInactive: !selectedUser.isInactive,
        })
      ).unwrap();

      toast.success(
        selectedUser.isInactive ? "User activated" : "User deactivated"
      );
    } catch (e: any) {
      toast.error(e?.message || "Action failed");
    } finally {
      setUpdating(false);
      setDialogOpen(false);
    }
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

  const isUnchanged =
    formik.values.firstName === (selectedUser?.firstName ?? "") &&
    formik.values.lastName === (selectedUser?.lastName ?? "") &&
    formik.values.phoneNo === (selectedUser?.phoneNo ?? "") &&
    formik.values.role === (selectedUser?.role ?? "USER");


  const gameHistoryData = getDummyGameHistory()
  const supportTicket = getDummyTickets();

  if (isLoading) {
    return (
      <UserDetailSkeleton />
    )
  }


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
        {!isLoading && selectedUser && (
          <div className="flex gap-3">
            {!editing && <Button onClick={() => setEditing(true)} icon={<Pencil className="w-4 h-4 text-text-tertiary cursor-pointer" />}>Edit</Button>}
            <Button
              onClick={() => setDialogOpen(true)}
              className={`${!selectedUser.isInactive ? "!bg-error" : "!bg-success"}`}
              disabled={updating}
              icon={<Ban className="w-4 h-4 cursor-pointer" />}
            >
              {!selectedUser.isInactive ? "Deactivate" : "Activate"}
            </Button>
          </div>
        )}
      </div>



      {!isLoading && !selectedUser && (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-text-muted">User not found</div>
        </div>
      )}

      {!isLoading && selectedUser && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Details */}
          <div className="lg:col-span-3 space-y-6">
            {/* User Info */}
            <form noValidate>
              <div className="bg-bg-card border border-border-primary rounded-lg p-6 relative">
                <div className="absolute top-4 right-4 ">
                  {getStatusBadge(!selectedUser.isInactive ? "active" : "inactive")}
                </div>
                <h2 className="text-lg font-semibold text-text-primary mb-4">User Information</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-text-muted mb-1 block">First Name</label>
                      {editing ? (
                        <>
                          <Input
                            name="firstName"
                            value={formik.values.firstName}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                          />
                          {formik.touched.firstName && formik.errors.firstName && (
                            <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
                              {formik.errors.firstName}
                            </p>
                          )}
                        </>
                      ) : (
                        <p className="text-text-primary">{selectedUser.firstName || "N/A"}</p>
                      )}
                    </div>
                    <div>
                      <label className="text-xs text-text-muted mb-1 block">Last Name</label>
                      {editing ? (
                        <>
                          <Input
                            name="lastName"
                            value={formik.values.lastName}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                          />
                          {formik.touched.lastName && formik.errors.lastName && (
                            <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
                              {formik.errors.lastName}
                            </p>
                          )}
                        </>
                      ) : (
                        <p className="text-text-primary">{selectedUser.lastName || "N/A"}</p>
                      )}
                    </div>
                    <div>
                      <label className="text-xs text-text-muted mb-1 block">Phone Number</label>
                      {editing ? (
                        <>
                          <Input
                            name="phoneNo"
                            value={formik.values.phoneNo}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                          />
                          {formik.touched.phoneNo && formik.errors.phoneNo && (
                            <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
                              {formik.errors.phoneNo}
                            </p>
                          )}
                        </>
                      ) : (
                        <p className="text-text-primary">{selectedUser.phoneNo || "N/A"}</p>
                      )}
                    </div>
                    <div>
                      <label className="text-xs text-text-muted mb-1 block">Email</label>
                      <p className="text-text-primary">{selectedUser.email}</p>
                      {editing && (
                        <p className="text-xs text-text-muted mt-1">Email cannot be changed</p>
                      )}
                    </div>
                    <div>
                      <label className="text-xs text-text-muted mb-1 block">Role</label>
                      {editing ? (
                        <Select
                          value={formik.values.role}
                          onValueChange={(val) => formik.setFieldValue("role", val)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="USER">USER</SelectItem>
                            <SelectItem value="ADMIN">ADMIN</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <p className="text-text-primary capitalize!">{selectedUser.role}</p>
                      )}
                    </div>
                  </div>
                  {editing && (
                    <div className="flex gap-2 pt-4 border-t border-border-primary justify-end">
                      <Button
                        type="primary"
                        className='!w-fit'
                        htmlType="submit"
                        onClick={(e) => {
                          e.stopPropagation();
                          formik.handleSubmit();
                        }}
                        disabled={isUnchanged}
                      >
                        {updating ? "Saving..." : "Save Changes"}
                      </Button>
                      <Button
                        type="default"
                        className="!w-fit"
                        onClick={() => {
                          formik.resetForm();
                          setEditing(false);
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </form>
            {/* Subscriptions */}
            {selectedUser.allSubscriptions && selectedUser.allSubscriptions.length > 0 && (
              <div className="bg-bg-card border border-border-primary rounded-lg p-6">
                <h2 className="text-lg font-semibold text-text-primary mb-4">Subscriptions</h2>
                <div className="space-y-3">
                  {selectedUser.currentSubscription && <div
                    className="flex flex-col gap-2 p-3 bg-bg-secondary rounded-lg border-2 border-border-accent"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-md font-medium text-accent-primary">{selectedUser.currentSubscription?.planName}</p>
                      <p className="text-sm font-medium text-accent-primary">
                        ${selectedUser.currentSubscription.price ? selectedUser.currentSubscription?.price.toFixed(2) : '0.00'}
                      </p>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs text-gray-300">
                        <span className="text-text-muted">Subscription Date: </span>
                        {new Date(selectedUser.currentSubscription.startDate).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                      <p className="text-xs text-gray-300">
                        <span className="text-text-muted">Subscription End Date: </span>
                        {new Date(selectedUser.currentSubscription.endDate).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                      <p className="text-xs text-gray-300">
                        <span className="text-text-muted">Payment Method: </span>
                        {selectedUser.currentSubscription.paymentMethod}
                      </p>
                    </div>
                  </div>}
                  {/* Subscription Statistics Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    {/* Total Payments Card */}
                    <div className="group relative bg-gradient-to-br from-yellow-500/10 via-bg-secondary to-bg-secondary border border-border-primary rounded-lg p-4 hover:border-yellow-500/50 transition-all duration-300 overflow-hidden">
                      <div className="absolute top-0 right-0 w-20 h-20 bg-yellow-500/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative z-10">
                        <div className="flex items-center justify-between mb-3">
                          <div className="w-10 h-10 rounded-lg bg-yellow-500/20 border border-yellow-500/30 flex items-center justify-center">
                            <CreditCard className="w-5 h-5 text-yellow-400" />
                          </div>
                        </div>
                        <p className="text-xs text-text-muted mb-1 uppercase tracking-wide font-medium">Total Payments</p>
                        <p className="text-2xl font-bold text-text-primary">{selectedUser.allSubscriptions.length}</p>
                        <p className="text-xs text-text-tertiary mt-1">Active subscriptions</p>
                      </div>
                    </div>

                    {/* Total Paid Card */}
                    <div className="group relative bg-gradient-to-br from-yellow-500/10 via-bg-secondary to-bg-secondary border border-border-primary rounded-lg p-4 hover:border-yellow-500/50 transition-all duration-300 overflow-hidden">
                      <div className="absolute top-0 right-0 w-20 h-20 bg-yellow-500/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative z-10">
                        <div className="flex items-center justify-between mb-3">
                          <div className="w-10 h-10 rounded-lg bg-yellow-500/20 border border-yellow-500/30 flex items-center justify-center">
                            <DollarSign className="w-5 h-5 text-yellow-400" />
                          </div>
                        </div>
                        <p className="text-xs text-text-muted mb-1 uppercase tracking-wide font-medium">Total Paid</p>
                        <p className="text-2xl font-bold text-accent-primary">
                          ${selectedUser.totalPayments.toFixed(2)}
                        </p>
                        <p className="text-xs text-text-tertiary mt-1">Lifetime value</p>
                      </div>
                    </div>

                    {/* Current Amount Card */}
                    <div className="group relative bg-gradient-to-br from-yellow-500/10 via-bg-secondary to-bg-secondary border border-border-primary rounded-lg p-4 hover:border-yellow-500/50 transition-all duration-300 overflow-hidden">
                      <div className="absolute top-0 right-0 w-20 h-20 bg-yellow-500/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative z-10">
                        <div className="flex items-center justify-between mb-3">
                          <div className="w-10 h-10 rounded-lg bg-yellow-500/20 border border-yellow-500/30 flex items-center justify-center">
                            <TrendingUp className="w-5 h-5 text-yellow-400" />
                          </div>
                        </div>
                        <p className="text-xs text-text-muted mb-1 uppercase tracking-wide font-medium">Current Amount</p>
                        <p className="text-2xl font-bold text-text-primary">
                          ${selectedUser.currentSubscription?.price ? selectedUser.currentSubscription.price.toFixed(2) : "0.00"}
                        </p>
                        <p className="text-xs text-text-tertiary mt-1">Monthly recurring</p>
                      </div>
                    </div>

                    {/* Subscription Age Card */}
                    <div className="group relative bg-gradient-to-br from-yellow-500/10 via-bg-secondary to-bg-secondary border border-border-primary rounded-lg p-4 hover:border-yellow-500/50 transition-all duration-300 overflow-hidden">
                      <div className="absolute top-0 right-0 w-20 h-20 bg-yellow-500/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative z-10">
                        <div className="flex items-center justify-between mb-3">
                          <div className="w-10 h-10 rounded-lg bg-yellow-500/20 border border-yellow-500/30 flex items-center justify-center">
                            <Clock className="w-5 h-5 text-yellow-400" />
                          </div>
                        </div>
                        <p className="text-xs text-text-muted mb-1 uppercase tracking-wide font-medium">Subscription Age</p>
                        <p className="text-2xl font-bold text-text-primary">
                          {/* {user.subscriptions.length > 0 ? Math.floor(
                            (new Date().getTime() - new Date(user.subscriptions[0].date).getTime()) /
                            (1000 * 60 * 60 * 24)
                          ) : 0} */}
                          {selectedUser.subscriptionAgeDays}
                        </p>
                        <p className="text-xs text-text-tertiary mt-1">Days active</p>
                      </div>
                    </div>
                  </div>
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
                        {selectedUser.allSubscriptions.map((subscription) => (
                          <TableRow key={subscription.id}>
                            <TableCell className="text-text-primary font-medium">
                              {subscription.planName}
                            </TableCell>
                            <TableCell>
                              <span
                                className={cn(
                                  "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                                )}
                              >
                                {getSubscriptionStatusBadge(subscription.status)}
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
                              {subscription.status === "TRIAL"
                                ? "FREE"
                                : `$${subscription.price.toFixed(2)}`}
                            </TableCell>
                            <TableCell className="text-text-tertiary">
                              {subscription.paymentMethod}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>
            )}


            {/* Game History */}
            <div className="bg-bg-card border border-border-primary rounded-lg p-6">
              <h2 className="text-lg font-semibold text-text-primary mb-4">Game History</h2>
              <div className="space-y-3">
                {gameHistoryData && gameHistoryData.length > 0 && gameHistoryData.map((game) => (
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
                    {new Date(selectedUser.createdAt).toLocaleDateString("en-US", {
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
                    {new Date(selectedUser.updatedAt).toLocaleDateString("en-US", {
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
                    {new Date(selectedUser.updatedAt).toLocaleDateString("en-US", {
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
                    {selectedUser.allSubscriptions?.length || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-text-muted">Support Tickets</span>
                  <span className="text-sm font-medium text-text-primary">
                    {supportTicket?.length || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-text-muted">Games Played</span>
                  <span className="text-sm font-medium text-text-primary">
                    {gameHistoryData?.length || 0}
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
              {selectedUser && (
                <>
                  {selectedUser.isInactive
                    ? "This will activate the user"
                    : "This will deactivate the user"}{" "}
                  <span className="font-medium text-text-primary">
                    {selectedUser.firstName || selectedUser.lastName
                      ? `${selectedUser.firstName ?? ""} ${selectedUser.lastName ?? ""}`.trim()
                      : selectedUser.email}
                  </span>
                  {selectedUser.email && (
                    <>
                      {" "}(<span className="font-medium text-text-primary">{selectedUser.email}</span>).
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
                onClick={() => setDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="primary"
                danger={!selectedUser?.isInactive}
                onClick={handleToggleActive}
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

