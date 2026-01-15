"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useAppSelector, useAppDispatch } from "@/redux/store/hooks";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { TableSkeleton } from "@/components/ui/TableSkeleton";
import { Search, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, User, X } from "lucide-react";
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
import { routes } from "@/utilities/routes";
import { useRouter } from "next/navigation";
import { useUserContext } from "@/components/providers/UserContextProvider";
import { getAllUsersThunk } from "@/redux/thunk/userThunk";
import { addUserToList, setFilters, setPagination } from "@/redux/slice/userSlice";
import {
  UIUser,
  userToUIUser,
  uiUserToContextUser,
} from "@/types/user";
import { useSession } from "next-auth/react";
import { useFormik } from "formik";
import { zodFormikValidate } from "@/utilities/zodFormikValidate";
import { registerSchema } from "@/utilities/schema";
import apiClient from "@/utilities/axios/instance";
import { toast } from "react-toastify";
import { Popup } from "@/components/ui/Popup";
import { UserRole } from "@/types/auth";

type SortOrder = "ascend" | "descend" | null;
type SortColumn = "name" | "email" | "phoneNo" | "role" | "isActive" | "createdAt" | null;

const getUserInitials = (user: UIUser) => {
  if (user?.firstName && user?.lastName) {
    return `${user.firstName?.[0]}${user.lastName?.[0]}`.toUpperCase();
  }
  return user?.email?.[0]?.toUpperCase() || "U";
};


export default function UserPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { data: session } = useSession();
  const user = session?.user
  const { setSelectedUser } = useUserContext();

  // Redux state
  const { users: reduxUsers, pagination: reduxPagination, filters, isLoading, error } = useAppSelector(
    (state) => state.user
  );
  // Local UI state

  // Search state (local for debouncing, synced with Redux)
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  // Sorting state (local, synced with Redux filters)
  const [sortedColumn, setSortedColumn] = useState<SortColumn>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>(null);


  // Formik form for creating user
  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      role: 'USER' as UserRole,
      phoneNo: '',
      password: '',
      confirmPassword: '',
      terms: true,
      stateId: null,
    },
    validate: zodFormikValidate(registerSchema),
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        const res = await apiClient.post(routes.api.auth.register, values);

        if (res.status === 201) {
          toast.success('User created successfully!', { theme: 'dark' });
          dispatch(addUserToList(res.data.data.user));
          setDialogOpen(false);
          resetForm();
          fetchUsers();
        }
      } catch (error: any) {
        toast.error(
          error.response?.data?.message || 'User creation failed. Please try again.',
          { theme: 'dark' }
        );
      } finally {
        setSubmitting(false);
      }
    },
  });

  // Map Redux users to UI format (convert isInactive to isActive)
  const users: UIUser[] = useMemo(() => {
    return reduxUsers.map(userToUIUser);
  }, [reduxUsers]);


  // Fetch users using Redux thunk
  const fetchUsers = useCallback(async () => {
    const sortByMap: Record<string, string> = {
      name: "firstName", // Backend doesn't have name, use firstName
      email: "email",
      phoneNo: "phoneNo",
      role: "role",
      isActive: "isInactive", // Backend uses isInactive
      createdAt: "createdAt",
    };

    const sortBy = sortedColumn ? sortByMap[sortedColumn] || "createdAt" : "createdAt";
    const sortOrderBackend = sortOrder === "ascend" ? "asc" : sortOrder === "descend" ? "desc" : "desc";

    await dispatch(
      getAllUsersThunk({
        page: reduxPagination.page,
        limit: reduxPagination.limit,
        filters: {
          ...filters,
          search: searchTerm || undefined,
          sortBy,
          sortOrder: sortOrderBackend,
        },
      })
    );
  }, [dispatch, reduxPagination.page, reduxPagination.limit, sortedColumn, sortOrder, filters, searchTerm]);

  // Handle search with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm !== filters.search) {
        dispatch(setFilters({ search: searchTerm || undefined }));
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, filters.search, dispatch]);

  // Fetch users when filters, pagination, or sorting changes
  useEffect(() => {
    fetchUsers();
  }, [searchTerm, sortOrder, reduxPagination.page, reduxPagination.limit]);

  // Handle sort
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
    // Reset to first page when sorting
    dispatch(setPagination({ page: 1 }));
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    dispatch(setPagination({ page }));
  };

  const handlePageSizeChange = (size: number) => {
    dispatch(setPagination({ page: 1, limit: size }));
  };

  const total = reduxPagination.total;
  const totalPages = reduxPagination.totalPages;


  return (
    <>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-4xl font-bold mb-2 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text text-transparent">
          User Management
        </h1>
        <p className="text-text-tertiary text-sm sm:text-base">Manage your users and their roles</p>
      </div>

      {/* Search Bar */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-tertiary z-10" />
          <Input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
            size="middle"
          />
        </div>
        <div className="flex gap-3">
          <Button
            onClick={() => setDialogOpen(true)}
            type="primary"
            className={`flex items-center px-4 py-2 text-sm font-medium transition-colors`}
            icon={<User className="w-4 h-4  cursor-pointer" />}
          >
            Create User
          </Button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-bg-card rounded-lg overflow-hidden">
        <div className="overflow-x-auto -mx-1 sm:mx-0">
          <div className="min-w-[800px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead
                    className="cursor-pointer select-none hover:bg-bg-tertiary min-w-[150px]"
                    onClick={() => handleSort("name")}
                  >
                    <div className="flex items-center gap-2">
                      <span>Name</span>
                      {sortedColumn === "name" && (
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
                    className="cursor-pointer select-none hover:bg-bg-tertiary min-w-[180px]"
                    onClick={() => handleSort("email")}
                  >
                    <div className="flex items-center gap-2">
                      <span>Email</span>
                      {sortedColumn === "email" && (
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
                    className="cursor-pointer select-none hover:bg-bg-tertiary min-w-[180px]"
                    onClick={() => handleSort("phoneNo")}
                  >
                    <div className="flex items-center gap-2">
                      <span>Phone No</span>

                      {sortedColumn === "phoneNo" && (
                        <span className="flex flex-col">
                          <ChevronUp
                            className={cn(
                              "w-3 h-3",
                              sortOrder === "ascend"
                                ? "text-accent-primary"
                                : "text-text-muted"
                            )}
                          />
                          <ChevronDown
                            className={cn(
                              "w-3 h-3 -mt-1",
                              sortOrder === "descend"
                                ? "text-accent-primary"
                                : "text-text-muted"
                            )}
                          />
                        </span>
                      )}
                    </div>
                  </TableHead>


                  <TableHead
                    className="cursor-pointer select-none hover:bg-bg-tertiary min-w-[100px]"
                    onClick={() => handleSort("role")}
                  >
                    <div className="flex items-center gap-2">
                      <span>Role</span>
                      {sortedColumn === "role" && (
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
                    className="cursor-pointer select-none hover:bg-bg-tertiary min-w-[90px]"
                    onClick={() => handleSort("isActive")}
                  >
                    <div className="flex items-center gap-2">
                      <span>Status</span>
                      {sortedColumn === "isActive" && (
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
                    onClick={() => handleSort("createdAt")}
                  >
                    <div className="flex items-center gap-2">
                      <span>Created At</span>
                      {sortedColumn === "createdAt" && (
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
                  <TableHead className="min-w-[140px]">Subscription Plan</TableHead>
                  <TableHead className="min-w-[140px]">Date Subscribed</TableHead>
                  <TableHead className="min-w-[140px]">State</TableHead>
                  <TableHead className="!text-center min-w-[60px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableSkeleton columns={10} />
                ) : users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-8 text-text-tertiary">
                      {error ? `Error: ${error}` : "No data available"}
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => {
                    const name = user.name || `${user.firstName || ""} ${user.lastName || ""}`.trim() || "N/A";
                    // Get subscription data if available (from user object or subscriptions array)
                    const subscription = user?.subscriptions?.[0] || null
                    const subscriptionPlan = subscription?.plan.name || "N/A"
                    const subscriptionDate = subscription?.createdAt || null

                    return (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium text-text-primary truncate"><div className="flex items-center gap-2"><div className="w-8 h-8 rounded-full bg-accent-primary text-black !text-xs font-semibold flex items-center shrink-0 justify-center">{getUserInitials(user)}</div> {name}</div></TableCell>
                        <TableCell className="text-text-primary truncate">{user.email}</TableCell>
                        <TableCell className="text-text-primary truncate">
                          {user.phoneNo ? user.phoneNo : "N/A"}
                        </TableCell>
                        <TableCell className="truncate">
                          <span
                            className={cn(
                              "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
                              user.role === "ADMIN"
                                ? "bg-accent-primary/20 text-accent-primary border-border-accent"
                                : "bg-bg-tertiary text-text-tertiary border-border-primary"
                            )}
                          >
                            {user.role}
                          </span>
                        </TableCell>
                        <TableCell className="truncate">
                          <span
                            className={cn(
                              "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
                              user.isActive
                                ? "bg-green-500/20 text-green-500 border-green-500/30"
                                : "bg-red-500/20 text-red-500 border-red-500/30"
                            )}
                          >
                            {user.isActive ? "Active" : "Inactive"}
                          </span>
                        </TableCell>
                        <TableCell className="text-text-primary truncate">
                          {user.createdAt
                            ? new Date(user.createdAt).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })
                            : "N/A"}
                        </TableCell>
                        <TableCell className="text-text-primary truncate">
                          {subscriptionPlan !== "N/A" ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent-primary/20 text-accent-primary border border-border-accent">
                              {subscriptionPlan}
                            </span>
                          ) : (
                            "N/A"
                          )}
                        </TableCell>
                        <TableCell className="text-text-primary truncate">
                          {subscriptionDate
                            ? new Date(subscriptionDate).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })
                            : "N/A"}
                        </TableCell>
                        <TableCell className="text-text-primary truncate">{user.state?.name ?? "N/A"}</TableCell>
                        <TableCell className="text-center">
                          <Button
                            type="text"
                            size="small"
                            icon={<ChevronRight className="w-4 h-4" />}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedUser(uiUserToContextUser(user));
                              router.push(`${routes.admin.user}/${user.id}`);
                            }}
                            className="!p-1 !h-auto !w-fit hover:bg-bg-tertiary transition-colors"
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-4 py-3 border-t border-border-primary bg-bg-secondary flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="text-sm text-text-tertiary whitespace-nowrap">
              Showing {(reduxPagination.page - 1) * reduxPagination.limit + 1} to{" "}
              {Math.min(reduxPagination.page * reduxPagination.limit, total)} of {total} entries
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
              <Select
                value={reduxPagination.limit.toString()}
                onValueChange={(value) => handlePageSizeChange(Number(value))}
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
                  onClick={() => handlePageChange(reduxPagination.page - 1)}
                  disabled={reduxPagination.page === 1}
                  className="p-1 rounded hover:bg-bg-tertiary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4 text-text-primary" />
                </button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (reduxPagination.page <= 3) {
                      pageNum = i + 1;
                    } else if (reduxPagination.page >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = reduxPagination.page - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={cn(
                          "px-2 sm:px-3 py-1 rounded text-sm transition-colors",
                          reduxPagination.page === pageNum
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
                  onClick={() => handlePageChange(reduxPagination.page + 1)}
                  disabled={reduxPagination.page === totalPages}
                  className="p-1 rounded hover:bg-bg-tertiary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-4 h-4 text-text-primary" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Toggle Active Status Confirmation Dialog */}
      <Popup
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title="Create User"
        description="Fill details to create a new user."
        footer={
          <div className="flex flex-col-reverse sm:flex-row justify-end items-center gap-3 w-full">
            <Button
              className="!w-full sm:!w-fit"
              onClick={() => {
                setDialogOpen(false);
                formik.resetForm();
              }}
            >
              Cancel
            </Button>
            <Button
              type="primary"
              className="!w-full sm:!w-fit"
              onClick={(e) => {
                e.stopPropagation();
                formik.handleSubmit();
              }}
              disabled={formik.isSubmitting}
            >
              {formik.isSubmitting ? (
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
                  Creating...
                </span>
              ) : (
                'Create User'
              )}
            </Button>
          </div>
        }
      >
        <form className="space-y-6" noValidate onSubmit={(e) => e.preventDefault()}>
          {/* First Name */}
          <div className="flex flex-col md:flex-row gap-4 w-full">
            <div className="space-y-2  w-full">
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-300">
                First Name
              </label>
              <div className="relative">
                <Input
                  id="firstName"
                  name="firstName"
                  type="text"
                  autoComplete="given-name"
                  placeholder="Enter your first name"
                  value={formik.values.firstName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.firstName && formik.errors.firstName && (
                  <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {formik.errors.firstName}
                  </p>
                )}
              </div>
            </div>

            {/* Last Name */}
            <div className="space-y-2  w-full">
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-300">
                Last Name
              </label>
              <div className="relative">
                <Input
                  id="lastName"
                  name="lastName"
                  type="text"
                  autoComplete="family-name"
                  placeholder="Enter your last name"
                  value={formik.values.lastName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.lastName && formik.errors.lastName && (
                  <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {formik.errors.lastName}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 w-full">
            {/* Email */}
            <div className="space-y-2 w-full">
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                Email
              </label>
              <div className="relative">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="Enter your email address"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.email && formik.errors.email && (
                  <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {formik.errors.email}
                  </p>
                )}
              </div>
            </div>

            {/* Role */}
            <div className="space-y-2 w-full">
              <label htmlFor="role" className="block text-sm font-medium text-gray-300">
                Role
              </label>
              <div className="relative">
                <Select
                  value={formik.values.role ?? 'USER'}
                  onValueChange={(value) =>
                    formik.setFieldValue('role', value)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USER">USER</SelectItem>
                    <SelectItem value="ADMIN">ADMIN</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 w-full">
            {/* Password */}
            <div className="space-y-2 w-full">
              <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type='password'
                  autoComplete="new-password"
                  placeholder="Create a password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="pr-10"
                />

                {formik.touched.password && formik.errors.password && (
                  <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {formik.errors.password}
                  </p>
                )}
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-2 w-full">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300">
                Confirm Password
              </label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type='password'
                  autoComplete="new-password"
                  placeholder="Re-enter your password"
                  value={formik.values.confirmPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="pr-10"
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
          </div>
        </form>
      </Popup >
    </>
  );
}
