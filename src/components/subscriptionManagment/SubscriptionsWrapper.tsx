import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp, RefreshCw, Search } from 'lucide-react';
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Input } from '../ui/Input';
import { DateTimePicker } from '../ui/DateTimePicker';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/Select';
import { Button } from '../ui/Button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/Table';
import { TableSkeleton } from '../ui/TableSkeleton';
import { useAppDispatch, useAppSelector } from '@/redux/store/hooks';
import { cn } from '@/lib/utils';
import { routes } from '@/utilities/routes';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { getAllUserSubscriptionsAdminThunk } from '@/redux/thunk/subscriptionThunk';
import { setFilters, setPagination } from '@/redux/slice/subscriptionSlice';
import { SubscriptionStatus } from '@/types/subscription';
import { getAllSubscriptionPlansThunk } from '@/redux/thunk/subscriptionPlanThunk';


const statusOptions: { value: string; label: string }[] = [
  { value: "all", label: "All Status" },
  { value: "ACTIVE", label: "Active" },
  { value: "CANCELED", label: "Cancelled" },
  { value: "EXPIRED", label: "Expired" },
  { value: "REFUNDED", label: "Refunded" },
];

export const SubscriptionsWrapper = () => {

  const router = useRouter();
  const dispatch = useAppDispatch();

  const [searchTerm, setSearchTerm] = useState("");
  const [startDateFilter, setStartDateFilter] = useState<Date | undefined>(undefined);
  const [endDateFilter, setEndDateFilter] = useState<Date | undefined>(undefined);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [planFilter, setPlanFilter] = useState<string>("all");

  const { subscriptions, isLoading, filters, pagination } = useAppSelector((state) => state.subscription);
  const { plans } = useAppSelector((state) => state.subscriptionPlan);

  const fetchSubscriptions = async () => {
    try {
      await dispatch(
        getAllUserSubscriptionsAdminThunk({
          page: pagination.page,
          limit: pagination.limit,
          filters: {
            search: searchTerm || undefined,
            startDateFrom: startDateFilter,
            startDateTo: endDateFilter,
            status: statusFilter !== "all" ? (statusFilter as SubscriptionStatus) : undefined,
            planId: planFilter !== "all" ? Number(planFilter) : undefined,
            sortBy: filters.sortBy,
            sortOrder: filters.sortOrder,
          },
        })
      ).unwrap();
    } catch (err: any) {
      console.error("Failed to fetch subscriptions:", err.message || err);
    }
  };

  const fetchSubscriptionPlan = async () => {
    try {
      await dispatch(getAllSubscriptionPlansThunk()).unwrap()
    } catch (error: any) {
      console.error(error.message || "Failed to fetch subscription plans")
    }
  }

  // Sorting
  const handleSort = (column: string) => {
    dispatch(
      setFilters({
        sortBy: column,
        sortOrder: filters.sortBy === column
          ? filters.sortOrder === "ascend"
            ? "descend"
            : "ascend"
          : "ascend",
      })
    );

  };

  // Status badge
  const getStatusBadge = (status: string) => {
    const styles = {
      ACTIVE: "bg-green-500/20 text-green-400 border-green-500/30",
      CANCELED: "bg-red-500/20 text-red-400 border-red-500/30",
      EXPIRED: "bg-gray-500/20 text-gray-400 border-gray-500/30",
      REFUNDED: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
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
    fetchSubscriptions();
  }, [dispatch, pagination.page, pagination.limit, searchTerm, startDateFilter, endDateFilter, statusFilter, planFilter, filters.sortBy, filters.sortOrder]);

  useEffect(() => {
    fetchSubscriptionPlan();
  }, [])

  return (
    <div className="">
      <div className="p-2 border-b border-border-primary">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-lg font-semibold text-text-primary">Subscriptions</h2>
            <p className="text-sm text-text-tertiary mt-1">Manage customer subscriptions</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col lg:flex-row gap-4 justify-start lg:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-tertiary z-10" />
            <Input
              type="text"
              placeholder="Search by name, email, or plan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              size="middle"
            />
          </div>
          <div className="flex gap-4">
            <DateTimePicker
              rangePicker={true}
              rangeValue={{
                start: startDateFilter,
                end: endDateFilter,
              }}
              onRangeChange={(range) => {
                setStartDateFilter(range.start);
                setEndDateFilter(range.end);
              }}
              placeholder="Filter by start date"
              className="w-full min-w-[220px]"
              showDate={true}
              showTime={false}
            />
            <Select
              value={statusFilter ?? "all"}
              onValueChange={(value) => setStatusFilter(value)}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue>
                  {statusOptions.find((option) => option.value === (statusFilter ?? "all"))?.label}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={planFilter} onValueChange={(value) => setPlanFilter(value)}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue>
                  {planFilter === "all"
                    ? "All Plans"
                    : plans.find((plan) => plan.id.toString() === planFilter)?.name || "Select Plan"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Plans</SelectItem>
                {plans.map((plan) => (
                  <SelectItem key={plan.id} value={plan.id.toString()}>
                    {plan.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>


            <Button
              type="primary"
              className="!w-fit !px-3 "
              icon={<RefreshCw className="w-4 h-4" />}
              onClick={fetchSubscriptions}
            >
            </Button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto -mx-1 sm:mx-0">
        <div className="min-w-[1000px] p-4">
          <Table className="">
            <TableHeader>
              <TableRow>
                <TableHead
                  className="cursor-pointer select-none hover:bg-bg-tertiary min-w-[150px]"
                  onClick={() => handleSort("user.email")}
                >
                  <div className="flex items-center gap-2">
                    <span>User</span>
                    {filters.sortBy === "user.email" && (
                      <span className="flex flex-col">
                        <ChevronUp
                          className={cn(
                            "w-3 h-3",
                            filters.sortOrder === "ascend" ? "text-accent-primary" : "text-text-muted"
                          )}
                        />
                        <ChevronDown
                          className={cn(
                            "w-3 h-3 -mt-1",
                            filters.sortOrder === "descend" ? "text-accent-primary" : "text-text-muted"
                          )}
                        />
                      </span>
                    )}
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer select-none hover:bg-bg-tertiary min-w-[150px]"
                  onClick={() => handleSort("plan.name")}
                >
                  <div className="flex items-center gap-2">
                    <span>Plan</span>
                    {filters.sortBy === "plan.name" && (
                      <span className="flex flex-col">
                        <ChevronUp
                          className={cn(
                            "w-3 h-3",
                            filters.sortOrder === "ascend" ? "text-accent-primary" : "text-text-muted"
                          )}
                        />
                        <ChevronDown
                          className={cn(
                            "w-3 h-3 -mt-1",
                            filters.sortOrder === "descend" ? "text-accent-primary" : "text-text-muted"
                          )}
                        />
                      </span>
                    )}
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer select-none hover:bg-bg-tertiary min-w-[100px]"
                  onClick={() => handleSort("status")}
                >
                  <div className="flex items-center gap-2">
                    <span>Status</span>
                    {filters.sortBy === "status" && (
                      <span className="flex flex-col">
                        <ChevronUp
                          className={cn(
                            "w-3 h-3",
                            filters.sortOrder === "ascend" ? "text-accent-primary" : "text-text-muted"
                          )}
                        />
                        <ChevronDown
                          className={cn(
                            "w-3 h-3 -mt-1",
                            filters.sortOrder === "descend" ? "text-accent-primary" : "text-text-muted"
                          )}
                        />
                      </span>
                    )}
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer select-none hover:bg-bg-tertiary min-w-[100px]"
                  onClick={() => handleSort("plan.price")}
                >
                  <div className="flex items-center gap-2">
                    <span>Amount</span>
                    {filters.sortBy === "plan.price" && (
                      <span className="flex flex-col">
                        <ChevronUp
                          className={cn(
                            "w-3 h-3",
                            filters.sortOrder === "ascend" ? "text-accent-primary" : "text-text-muted"
                          )}
                        />
                        <ChevronDown
                          className={cn(
                            "w-3 h-3 -mt-1",
                            filters.sortOrder === "descend" ? "text-accent-primary" : "text-text-muted"
                          )}
                        />
                      </span>
                    )}
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer select-none hover:bg-bg-tertiary min-w-[120px]"
                  onClick={() => handleSort("startDate")}
                >
                  <div className="flex items-center gap-2">
                    <span>Date</span>
                    {filters.sortBy === "startDate" && (
                      <span className="flex flex-col">
                        <ChevronUp
                          className={cn(
                            "w-3 h-3",
                            filters.sortOrder === "ascend" ? "text-accent-primary" : "text-text-muted"
                          )}
                        />
                        <ChevronDown
                          className={cn(
                            "w-3 h-3 -mt-1",
                            filters.sortOrder === "descend" ? "text-accent-primary" : "text-text-muted"
                          )}
                        />
                      </span>
                    )}
                  </div>
                </TableHead>
                <TableHead className="min-w-[140px]">Payment Method</TableHead>
                <TableHead className="!text-center min-w-[140px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableSkeleton columns={7} />
              ) : subscriptions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-text-tertiary">
                    No subscriptions found
                  </TableCell>
                </TableRow>
              ) : (
                subscriptions.map((subscription) => (
                  <TableRow key={subscription.subscriptionId}>
                    <TableCell className="font-medium text-text-primary">
                      <div>
                        <div className="font-medium">{subscription.user.name}</div>
                        <div className="text-xs text-text-tertiary">{subscription.user.email}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-text-primary">{subscription.plan.name}</TableCell>
                    <TableCell>{getStatusBadge(subscription.status)}</TableCell>
                    <TableCell className="text-accent-primary font-medium">
                      ${subscription.plan.price.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-text-primary">

                      <div className="font-medium"> {new Date(subscription.startDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })} to {new Date(subscription.endDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}</div>
                      <div className="text-xs text-text-tertiary">One Month Subscription</div>
                    </TableCell>
                    <TableCell className="text-text-tertiary">{subscription.payment?.paymentMethod}</TableCell>
                    <TableCell className="text-center">
                      <Button
                        type="text"
                        size="small"
                        icon={<ChevronRight className="w-4 h-4" />}
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`${routes.admin.subscriptions}/${subscription.subscriptionId}`);
                        }}
                        className="!p-1 !h-auto !w-fit hover:bg-bg-tertiary transition-colors"
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="px-4 py-3 border-t border-border-primary bg-bg-secondary flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="text-sm text-text-tertiary whitespace-nowrap">
            Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
            {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
            {pagination.total} entries
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
            <Select
              value={pagination.limit.toString()}
              onValueChange={(value) =>
                dispatch(
                  setPagination({ limit: Number(value), page: 1 })
                )
              }
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
                onClick={() =>
                  dispatch(setPagination({ page: Math.max(1, pagination.page - 1) }))
                }
                disabled={pagination.page === 1}

                className="p-1 rounded hover:bg-bg-tertiary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4 text-text-primary" />
              </button>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                  let pageNum;
                  if (pagination.totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (pagination.page <= 3) {
                    pageNum = i + 1;
                  } else if (pagination.page >= pagination.totalPages - 2) {
                    pageNum = pagination.totalPages - 4 + i;
                  } else {
                    pageNum = pagination.page - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => dispatch(setPagination({ page: pageNum }))}
                      className={cn(
                        "px-2 sm:px-3 py-1 rounded text-sm transition-colors",
                        pagination.page === pageNum
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
                onClick={() =>
                  dispatch(
                    setPagination({
                      page: Math.min(pagination.totalPages, pagination.page + 1),
                    })
                  )
                }
                disabled={pagination.page === pagination.totalPages}
                className="p-1 rounded hover:bg-bg-tertiary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4 text-text-primary" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SubscriptionsWrapper