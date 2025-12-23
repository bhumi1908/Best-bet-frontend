'use client';

import { useFormik } from 'formik';
import { z } from 'zod';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import { registerSchema } from '@/utilities/schema';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { routes } from '@/utilities/routes';
import apiClient from '@/utilities/axios/instance';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/Select';
import { User } from '@/types/user';

type RegisterFormProps = {
    onSuccess?: (user: User) => void;
};

export function RegisterForm({ onSuccess }: RegisterFormProps) {

    const formik = useFormik({
        initialValues: {
            firstName: '',
            lastName: '',
            email: '',
            role: 'USER',
            password: '',
            confirmPassword: '',
            terms: false,
        },
        validationSchema: toFormikValidationSchema(registerSchema),
        onSubmit: async (values, { setSubmitting }) => {
            try {
                const res = await apiClient.post(routes.api.auth.register, values);

                if (res.status === 201) {
                    toast.success('Registration successful!', { theme: 'dark' });
                    onSuccess?.(res.data.data.user);
                }
            } catch (error: any) {
                toast.error(
                    error.response?.data?.message || 'Registration failed. Please try again.',
                    { theme: 'dark' }
                );
            } finally {
                setSubmitting(false);
            }
        },
    });

    return (
        <form className="space-y-6" noValidate>
            {/* First Name */}
            <div className="space-y-2">
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
            <div className="space-y-2">
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

            <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                    Role
                </label>
                <div className="relative">
                    <Select
                        value={formik.values.role}
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
                        I agree to the{' '}
                        <span className="text-yellow-400">Terms &amp; Conditions</span>
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
            <div className="flex justify-center">
                {/* Submit Button */}
                <Button
                    type="primary"
                    onClick={(e) => {
                        e.stopPropagation();
                        formik.handleSubmit();
                    }}
                    disabled={formik.isSubmitting}
                    className='!w-2/3'
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
            </div>
        </form>
    );
}
