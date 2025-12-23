/**
 * Login Page
 * Premium gaming platform login page with modern 2025 UI design
 */

'use client';

import { useFormik } from 'formik';
import { z } from 'zod';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import Link from 'next/link';
import Image from 'next/image';
import { routes } from '@/utilities/routes';
import { loginSchema } from '@/utilities/schema';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { LoginCredentials } from '@/types/auth';
import { useRouter } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';
import { toast } from 'react-toastify';

// Form user login initialValues
export const loginInitialValues = {
  email: '',
  password: '',
}

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter()

  // Formik form configuration
  const formik = useFormik<LoginFormValues>({
    initialValues: loginInitialValues,
    validationSchema: toFormikValidationSchema(loginSchema),
    onSubmit: async (loginDetails: LoginCredentials, { setSubmitting }) => {
      try {
        const res = await signIn('credentials', {
          email: loginDetails.email,
          password: loginDetails.password,
          redirect: false,
        });

        if (!res || res.error) {
          toast.error(res?.error ?? 'Invalid credentials', { theme: 'dark' });
          return;
        }
        toast.success('You have logged in successfully', {
          theme: 'dark',
        });
        router.replace(routes.home);

      } catch (err: any) {
        const errorMessage = err.response?.data?.message || 'Login Failed!'

        toast.error(errorMessage, {
          theme: 'dark',
        });

      } finally {
        setSubmitting(false);
      }
    },
  });


  return (
    <div className="min-h-screen flex bg-black overflow-hidden relative  bg-gradient-to-br from-purple-900/20 via-black to-orange-900/20 overflow-hidden">
      {/* Left Side - Logo Image (50% width) */}
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center">
        {/* Logo Container */}
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

      {/* Right Side - Login Form (50% width) */}
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
              Sign in
            </h1>
            <p className="text-gray-400 text-sm sm:text-base">
              Enter your credentials to access your account
            </p>
          </div>

          {/* Login Form */}
          <form className="space-y-6" noValidate>
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
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {formik.errors.email}
                  </p>
                )}
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                  Password
                </label>
                <Link href={routes.auth.forgotPassword} className="text-sm font-medium text-yellow-400 hover:text-yellow-300 transition-colors">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.password && formik.errors.password && (
                  <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {formik.errors.password}
                  </p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="primary"
              onClick={(e) => {
                e.stopPropagation();
                formik.handleSubmit();
              }}
              disabled={formik.isSubmitting}
            >
              {formik.isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          {/* Footer Links */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-400">
              Don't have an account?{' '}
              <Link
                href={routes.auth.register}
                className="font-medium text-yellow-400 hover:text-yellow-300 transition-colors"
              >
                Create account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

