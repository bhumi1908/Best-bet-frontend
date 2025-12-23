/**
 * Forgot Password Page
 * User can enter email to receive a reset password link
 */

'use client';

import { useFormik } from 'formik';
import { z } from 'zod';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { routes } from '@/utilities/routes';
import { forgotPasswordSchema } from '@/utilities/schema';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import apiClient from '@/utilities/axios/instance';
import { toast } from 'react-toastify';

// Form initial values for forgot password
export const forgotPasswordInitialValues = {
  email: '',
};

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {

  const formik = useFormik<ForgotPasswordFormValues>({
    initialValues: forgotPasswordInitialValues,
    validationSchema: toFormikValidationSchema(forgotPasswordSchema),
    onSubmit: async (values, { setSubmitting }) => {

      try {
        const res = await apiClient.post(routes.api.auth.forgotPassword, { email: values.email });

        if (res.status === 200) {
          const successMessage = `Password reset email has been sent to ${values.email}. Please check your inbox.`;
          toast.success(successMessage, {
            theme: 'dark',
          });
        } else {
          const errorMessage = 'Failed to send password reset email.';
          toast.error(errorMessage, {
            theme: 'dark',
          });

        }
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.message ||
          'Something went wrong. Please try again later.';

        toast.error(errorMessage, {
          theme: 'dark',
        });

      } finally {
        setSubmitting(false);
      }

      // For now, just log the values and show a success message.
    },
  });

  return (
    <div className="min-h-screen flex bg-black overflow-hidden relative bg-gradient-to-br from-purple-900/20 via-black to-orange-900/20">
      {/* Left Side - Logo Image (50% width) */}
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center">
        <div className="relative z-10 w-full h-full flex items-center justify-center">
          <div className="relative w-full aspect-square">
            <Image
              src="/images/Best Bet Logo v1 - 10-28-2025.png"
              alt="Best Bet Logo"
              width={1000}
              height={1000}
              className="h-screen w-screen"
              priority
            />
          </div>
        </div>
      </div>

      {/* Right Side - Forgot Password Form (50% width) */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 lg:p-12 relative">
        {/* Animated background effects */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="w-full max-w-md relative z-10">
          {/* Header */}
          <div className="mb-10">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-3 tracking-tight">
              Forgot Password
            </h1>
            <p className="text-gray-400 text-sm sm:text-base">
              Enter your email address and we&apos;ll send you a link to reset your password.
            </p>
          </div>

          {/* Form */}
          <form className="space-y-6" noValidate>
            {/* Success Message */}
            {formik.status?.success && (
              <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/30 p-4 backdrop-blur-sm">
                <p className="text-sm text-emerald-400">{formik.status?.success}</p>
              </div>
            )}

            {/* Email Input */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                Email
              </label>
              <div className="relative">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="Enter your email"
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

            {/* Submit Button */}
            <Button
              type="primary"
              disabled={formik.isSubmitting}
              onClick={(e) => {
                e.stopPropagation();
                formik.handleSubmit();
              }}
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
                  Sending reset link...
                </span>
              ) : (
                'Send reset link'
              )}
            </Button>
          </form>

          {/* Footer Links */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-400">
              Remembered your password?{' '}
              <Link
                href={routes.auth.login}
                className="font-medium text-yellow-400 hover:text-yellow-300 transition-colors"
              >
                Back to sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}


