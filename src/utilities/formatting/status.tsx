import { cn } from "@/lib/utils";
import React from "react";

/**
 * Subscription status types
 */
export type SubscriptionStatus =
  | "ACTIVE"
  | "CANCELED"
  | "EXPIRED"
  | "REFUNDED"
  | "TRIAL"
  | "PAST_DUE";

/**
 * Game result status types
 */
export type GameResultStatus = "WIN" | "LOSS" | "PENDING";

/**
 * Payment status types
 */
export type PaymentStatus = "PENDING" | "SUCCESS" | "FAILED" | "REFUNDED";

/**
 * User status types
 */
export type UserStatus = "active" | "inactive";

/**
 * Gets subscription status badge styles
 * @param status - Subscription status
 * @returns Tailwind CSS classes for the badge
 */
export const getSubscriptionStatusBadgeStyles = (
  status: string
): string => {
  const styles: Record<string, string> = {
    ACTIVE: "bg-green-500/20 text-green-400 border-green-500/30",
    CANCELED: "bg-red-500/20 text-red-400 border-red-500/30",
    EXPIRED: "bg-gray-500/20 text-gray-400 border-gray-500/30",
    REFUNDED: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    TRIAL: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    PAST_DUE: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  };

  return (
    styles[status as keyof typeof styles] || styles.ACTIVE
  );
};

/**
 * Gets subscription status label
 * @param status - Subscription status
 * @returns Formatted label string
 */
export const getSubscriptionStatusLabel = (status: string): string => {
  return status.charAt(0).toUpperCase() + status.slice(1).replace("_", " ");
};

/**
 * Renders a subscription status badge component
 * @param status - Subscription status
 * @param className - Additional CSS classes
 * @returns React component
 */
export const getSubscriptionStatusBadge = (
  status: string,
  className?: string
): React.ReactElement => {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
        getSubscriptionStatusBadgeStyles(status),
        className
      )}
    >
      {getSubscriptionStatusLabel(status)}
    </span>
  );
};

/**
 * Gets game result status badge styles
 * @param result - Game result status
 * @returns Tailwind CSS classes for the badge
 */
export const getResultBadgeStyles = (result: string): string => {
  const styles: Record<string, string> = {
    WIN: "bg-green-500/20 text-green-400 border-green-500/30",
    LOSS: "bg-red-500/20 text-red-400 border-red-500/30",
    PENDING: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  };

  return (
    styles[result as keyof typeof styles] || styles.PENDING
  );
};

/**
 * Gets game result label
 * @param result - Game result status
 * @returns Formatted label string
 */
export const getResultLabel = (result: string): string => {
  return result === "WIN"
    ? "Win"
    : result === "LOSS"
    ? "Loss"
    : "Pending";
};

/**
 * Renders a game result status badge component
 * @param result - Game result status
 * @param className - Additional CSS classes
 * @returns React component
 */
export const getResultBadge = (
  result: string,
  className?: string
): React.ReactElement => {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
        getResultBadgeStyles(result),
        className
      )}
    >
      {result}
    </span>
  );
};

/**
 * Gets payment status badge styles
 * @param status - Payment status
 * @returns Tailwind CSS classes for the badge
 */
export const getPaymentStatusBadgeStyles = (status: string): string => {
  const styles: Record<string, string> = {
    PENDING: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    SUCCESS: "bg-green-500/20 text-green-400 border-green-500/30",
    FAILED: "bg-red-500/20 text-red-400 border-red-500/30",
    REFUNDED: "bg-gray-500/20 text-gray-400 border-gray-500/30",
  };

  return (
    styles[status as keyof typeof styles] || styles.PENDING
  );
};

/**
 * Renders a payment status badge component
 * @param status - Payment status
 * @param className - Additional CSS classes
 * @returns React component
 */
export const getPaymentStatusBadge = (
  status: string,
  className?: string
): React.ReactElement => {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
        getPaymentStatusBadgeStyles(status),
        className
      )}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

/**
 * Gets user status badge styles
 * @param status - User status
 * @returns Tailwind CSS classes for the badge
 */
export const getUserStatusBadgeStyles = (status: string): string => {
  const styles: Record<string, string> = {
    active: "bg-green-500/20 text-green-400 border-green-500/30",
    inactive: "bg-red-500/20 text-red-400 border-red-500/30",
  };

  return (
    styles[status as keyof typeof styles] || styles.active
  );
};

/**
 * Renders a user status badge component
 * @param status - User status
 * @param className - Additional CSS classes
 * @returns React component
 */
export const getUserStatusBadge = (
  status: string,
  className?: string
): React.ReactElement => {
  return (
    <span
      className={cn(
        "inline-flex items-center px-3 py-1 rounded-full text-md font-medium border",
        getUserStatusBadgeStyles(status),
        className
      )}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};
