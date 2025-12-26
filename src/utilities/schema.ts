
import { z } from 'zod';

// Zod Login validation schema
export const loginSchema = z.object({
  email: z
    .string()
    .nonempty('Email is required')
    .email('Invalid email address'),
  password: z
    .string()
    .nonempty('Password is required')
    .min(8, 'Password must be at least 8 characters long')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
      'Password must include uppercase, lowercase, number, and special character'
    ),
});

// Zod Register validation schema
// Includes first name, last name and terms & conditions acceptance
export const registerSchema = z
  .object({
    firstName: z
      .string()
      .nonempty('First name is required')
      .min(2, 'First name must be at least 2 characters'),
    lastName: z
      .string()
      .nonempty('Last name is required')
      .min(2, 'Last name must be at least 2 characters'),
    email: z
      .string()
      .nonempty('Email is required')
      .email('Invalid email address'),
    password: z
      .string()
      .nonempty('Password is required')
      .min(8, 'Password must be at least 8 characters long')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
        'Password must include uppercase, lowercase, number, and special character'
      ),
    confirmPassword: z.string().nonempty('Please confirm your password'),
    terms: z
      .boolean()
      .refine((val) => val === true, {
        message: 'You must accept the terms & conditions',
      }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

// Zod Forgot Password schema - email only
export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .nonempty('Email is required')
    .email('Invalid email address'),
});

// Zod Reset Password schema - new password + confirm password
export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .nonempty('Password is required')
      .min(8, 'Password must be at least 8 characters long')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
        'Password must include uppercase, lowercase, number, and special character'
      ),
    confirmPassword: z.string().nonempty('Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

// Create subscription plan schema
export const createSubscriptionPlanSchema = z
  .object({
    name: z.string().min(1, "Plan name is required"),
    description: z.string().min(1, "Description is required"),
   price: z
      .number({ invalid_type_error: "Price is required" })
      .refine((val) => val > 0, "Price must be greater than 0"),
    duration: z.enum(["monthly", "yearly"]),
    features: z.array(
      z.object({
        name: z.string().min(1, "Feature is required"),
      })
    ),
    isActive: z.boolean(),
    popular: z.boolean(),
  })
  .refine((data) => data.features.length > 0, {
    path: ["features"],
    message: "At least one feature is required",
  });



