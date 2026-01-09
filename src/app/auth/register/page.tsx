/**
 * Register Page
 * User registration page with Formik and Zod validation
 */

'use client';

import { useFormik } from 'formik';
import { z } from 'zod';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { routes } from '@/utilities/routes';
import { registerSchema } from '@/utilities/schema';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { UserRegister } from '@/types/auth';
import { useRouter } from 'next/navigation';
import apiClient from '@/utilities/axios/instance';
import { toast } from 'react-toastify';
import { zodFormikValidate } from '@/utilities/zodFormikValidate';
import { useAppDispatch, useAppSelector } from '@/redux/store/hooks';
import { getAllStatesThunk } from '@/redux/thunk/statesThunk';


// Form user Register initialValues
export const registerInitialValues = {
  firstName: '',
  lastName: '',
  email: '',
  phoneNo: '',
  stateId: 0,
  password: '',
  confirmPassword: '',
  terms: false,
};

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter()
  const dispatch = useAppDispatch();
  const { states } = useAppSelector((state) => state.states);

  // Fetch states on mount
  useEffect(() => {
    if (states.length === 0) {
      dispatch(getAllStatesThunk());
    }
  }, [dispatch, states.length]);

  // Formik form configuration
  const formik = useFormik<RegisterFormValues>({
    initialValues: {
      ...registerInitialValues,
      stateId: registerInitialValues.stateId ?? 0,
    } as RegisterFormValues,
    validate: zodFormikValidate(registerSchema),

    onSubmit: async (registerDetails: UserRegister, { setSubmitting }) => {
      try {
        // Convert stateId to number if it's a string
        const payload = {
          ...registerDetails,
          stateId: typeof registerDetails.stateId === 'string'
            ? parseInt(registerDetails.stateId, 10)
            : registerDetails.stateId,
        };
        const res = await apiClient.post(routes.api.auth.register, payload);
        if (res.status === 201) {
          toast.success('Registration successful! Please login.', {
            theme: 'dark',
          });
          router.push(routes.auth.login);
        }
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.message ||
          'Registration failed. Please try again.';

        toast.error(errorMessage, {
          theme: 'dark',
        });
      } finally {
        setSubmitting(false)
      }
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

      {/* Right Side - Register Form (50% width) */}
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
              Create Account
            </h1>
            <p className="text-gray-400 text-sm sm:text-base">
              Join Best Bet and start your premium gaming experience
            </p>
          </div>

          {/* Register Form */}
          <form className="space-y-6" noValidate>
            <div className='flex item-center gap-3 '>
              {/* First Name */}
              <div className="w-full space-y-2">
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
              <div className="w-full space-y-2">
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

            {/* Phone No */}
            <div className="space-y-2">
              <label htmlFor="phoneNo" className="block text-sm font-medium text-gray-300">
                Phone No
              </label>
              <div className="relative">
                <Input
                  id="phoneNo"
                  name="phoneNo"
                  type="tel"
                  autoComplete="tel"
                  placeholder="Enter your phone number"
                  value={formik.values.phoneNo}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.phoneNo && formik.errors.phoneNo && (
                  <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {formik.errors.phoneNo}
                  </p>
                )}
              </div>
            </div>

            {/* Email */}
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

            {/* State */}
            <div className="space-y-2">
              <label htmlFor="stateId" className="block text-sm font-medium text-gray-300">
                State
              </label>
              <div className="relative">
                <Select
                  className='text'
                  value={formik.values.stateId && formik.values.stateId > 0 ? String(formik.values.stateId) : ''}
                  onValueChange={(val) => formik.setFieldValue('stateId', parseInt(val, 10))}
                >
                  <SelectTrigger>
                    <SelectValue>
                      {formik.values.stateId && formik.values.stateId > 0
                        ? states.find(
                          (state) => String(state.id) === String(formik.values.stateId)
                        )?.state_name
                        : <p className='text-text-muted'>Select your state </p>}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {states.map((state) => (
                      <SelectItem key={state.id} value={String(state.id)}>
                        {state.state_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formik.touched.stateId && formik.errors.stateId && (
                  <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {formik.errors.stateId}
                  </p>
                )}
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
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
            <div className="space-y-2">
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

            {/* Terms & Conditions */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  className="h-4 w-4 rounded border-white/20 bg-black/40 text-yellow-400 focus:ring-yellow-400/50"
                  checked={formik.values.terms}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                <label htmlFor="terms" className="text-xs sm:text-sm text-gray-300">
                  I have read and agree to the{' '}
                  <Link
                    href={routes.terms}
                    className="text-yellow-400 hover:text-yellow-300 underline transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Terms of Service
                  </Link>
                  {' '}and{' '}
                  <Link
                    href={routes.privacy}
                    className="text-yellow-400 hover:text-yellow-300 underline transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Privacy Policy
                  </Link>
                </label>
              </div>
              {formik.touched.terms && formik.errors.terms && (
                <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {formik.errors.terms}
                </p>
              )}
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
                  Creating account...
                </span>
              ) : (
                'Create Account'
              )}
            </Button>
          </form>

          {/* Footer Links */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-400">
              Already have an account?{' '}
              <Link
                href={routes.auth.login}
                className="font-medium text-yellow-400 hover:text-yellow-300 transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
