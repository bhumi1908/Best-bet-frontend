/**
 * API Utilities
 * Common utilities for API interactions
 */

// Type guard for AxiosError
interface AxiosErrorLike {
  response?: {
    status?: number;
    data?: {
      message?: string;
    };
  };
  message?: string;
}

/**
 * Extract error message from API error
 */
export const getErrorMessage = (error: unknown): string => {
  if (error && typeof error === 'object' && 'response' in error) {
    const axiosError = error as AxiosErrorLike;
    return (
      axiosError.response?.data?.message ||
      axiosError.message ||
      'An unexpected error occurred'
    );
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred';
};

/**
 * Check if error is a network error
 */
export const isNetworkError = (error: unknown): boolean => {
  if (error && typeof error === 'object' && 'response' in error) {
    const axiosError = error as AxiosErrorLike;
    return !axiosError.response;
  }
  return false;
};

/**
 * Check if error is an authentication error
 */
export const isAuthError = (error: unknown): boolean => {
  if (error && typeof error === 'object' && 'response' in error) {
    const axiosError = error as AxiosErrorLike;
    return axiosError.response?.status === 401 || axiosError.response?.status === 403;
  }
  return false;
};

