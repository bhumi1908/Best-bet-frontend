import { format } from "date-fns";

/**
 * Formats a date string or Date object to a readable date string
 * @param date - Date string or Date object
 * @param options - Formatting options
 * @returns Formatted date string or "-" if date is invalid
 */
export const formatDate = (
  date?: string | Date | null,
  options?: {
    year?: "numeric" | "2-digit";
    month?: "numeric" | "2-digit" | "long" | "short" | "narrow";
    day?: "numeric" | "2-digit";
  }
): string => {
  if (!date) return "-";

  const dateObj = typeof date === "string" ? new Date(date) : date;
  if (isNaN(dateObj.getTime())) return "-";

  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: options?.year || "numeric",
    month: options?.month || "long",
    day: options?.day || "numeric",
  };

  return new Intl.DateTimeFormat("en-US", defaultOptions).format(dateObj);
};

/**
 * Formats a date to a short format (e.g., "Jan 15, 2025")
 * @param date - Date string or Date object
 * @returns Formatted date string
 */
export const formatDateShort = (date: string | Date): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return dateObj.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

/**
 * Formats a date to a medium format (e.g., "Jan 15")
 * @param date - Date string or Date object
 * @returns Formatted date string
 */
export const formatDateMedium = (date: string | Date): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return dateObj.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

/**
 * Formats a date using date-fns format (e.g., "MMM dd, yyyy")
 * @param date - Date string or Date object
 * @param formatString - date-fns format string (default: "MMM dd, yyyy")
 * @returns Formatted date string
 */
export const formatDateWithPattern = (
  date: string | Date,
  formatString: string = "MMM dd, yyyy"
): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return format(dateObj, formatString);
};

/**
 * Formats a date range (e.g., "Jan 15, 2025 - Jan 20, 2025")
 * @param startDate - Start date
 * @param endDate - End date
 * @returns Formatted date range string
 */
export const formatDateRange = (
  startDate?: Date | string | null,
  endDate?: Date | string | null
): string => {
  if (!startDate && !endDate) return "";
  if (!startDate) return formatDateShort(endDate!);
  if (!endDate) return formatDateShort(startDate);

  return `${formatDateShort(startDate)} - ${formatDateShort(endDate)}`;
};

/**
 * Formats a date to ISO string (YYYY-MM-DD) using local time
 * Prevents timezone off-by-one errors
 * @param date - Date object or null/undefined
 * @returns ISO date string (YYYY-MM-DD) or undefined
 */
export const formatISODate = (
  date: Date | null | undefined
): string | undefined => {
  if (!date) return undefined;

  // Uses local time, not UTC (which prevents timezone off-by-one errors)
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

/**
 * Formats a date for display in a calendar-style format
 * @param date - Date string or Date object
 * @returns Object with month, day, and year
 */
export const formatDateCalendar = (date: string | Date) => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return {
    month: dateObj.toLocaleDateString("en-US", { month: "short" }),
    day: dateObj.getDate(),
    year: dateObj.toLocaleDateString("en-US", { year: "numeric" }),
  };
};
