
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
    phoneNo: z
      .string()
      .nonempty('Phone number is required')
      .regex(
        /^\+?[1-9]\d{0,2}[\s.-]?\(?\d{1,4}\)?([\s.-]?\d{2,4}){2,4}$/,
        'Please provide a valid phone number'
      ),
    role: z.enum(['USER', 'ADMIN']).optional(),
    stateId: z
      .number()
      .min(1, 'State is required')
      .nullable()
      .or(z.string().nonempty('State is required').transform((val) => parseInt(val, 10)))
      .refine((val) => val !== null, {
        message: 'State is required',
      }),
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


export const createSubscriptionPlanSchema = z.object({
  name: z.string().min(1, "Plan name is required"),
  description: z.string().min(1, "Description is required"),
  isTrial: z.boolean(),
  price: z.number().optional(),
  duration: z.number().optional(),
  trialDays: z.number().nullable().optional(),
  features: z.array(z.object({ name: z.string().min(1, "Feature name is required") }))
    .min(1, "Features are required"),

  isActive: z.boolean(),
  isRecommended: z.boolean(),
}).superRefine((data, ctx) => {
  if (!data.isTrial) {
    if (data.price === undefined) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Price is required",
        path: ["price"],
      });
    }
    if (data.duration === undefined) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Duration is required",
        path: ["duration"],
      });
    }
  }
})



export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .nonempty('Current password is required'),

    newPassword: z
      .string()
      .nonempty('New password is required')
      .min(8, 'New password must be at least 8 characters long')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
        'New password must include uppercase, lowercase, number, and special character'
      ),

    confirmPassword: z
      .string()
      .nonempty('Please confirm your new password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });


export const updateAdminSchema = z.object({
  firstName: z
    .string()
    .nonempty("First name is required")
    .min(2, "First name must be at least 2 characters"),

  lastName: z
    .string()
    .nonempty("Last name is required")
    .min(2, "Last name must be at least 2 characters"),

  phoneNo: z
    .string()
    .nonempty('Phone number is required')
    .regex(
      /^\+?[1-9]\d{0,2}[\s.-]?\(?\d{1,4}\)?([\s.-]?\d{2,4}){2,4}$/,
      'Please provide a valid phone number'
    ),

  stateId: z
    .string()
    .nonempty("State is required")
    .or(z.number().min(1, "State is required"))
    .transform((val) => typeof val === 'string' ? parseInt(val, 10) : val)
    .refine((val) => !isNaN(val) && val > 0, {
      message: "State is required",
    }),

  role: z
    .enum(["USER", "ADMIN"], {
      errorMap: () => ({ message: "Role is required" }),
    }),
});


// User profile
export const updateUserSchema = z.object({
  firstName: z.string().min(1, "First Name is required"),
  lastName: z.string().min(1, "Last Name is required"),
   phoneNo: z
    .string()
    .nonempty('Phone number is required')
    .regex(
      /^\+?[1-9]\d{0,2}[\s.-]?\(?\d{1,4}\)?([\s.-]?\d{2,4}){2,4}$/,
      'Please provide a valid phone number'
    ),
  stateId: z
    .string()
    .nonempty("State is required")
    .or(z.number().min(1, "State is required"))
    .transform((val) => typeof val === 'string' ? parseInt(val, 10) : val)
    .refine((val) => !isNaN(val) && val > 0, {
      message: "State is required",
    }),
});


// Validation schema for form values (allows empty strings)
export const gameHistoryFormSchema = z.object({
  state_id: z.number().min(1, "State is required"),
  game_id: z.number().min(1, "Game type is required"),
  draw_date: z
  .string()
  .min(1, "Draw date is required")
  .transform((val) => {
    const date = new Date(val);
    if (isNaN(date.getTime())) {
      throw new Error("Invalid draw date");
    }
    return date.toISOString(); //ISO format
  }),
  draw_time: z.string().refine((val): val is "MID" | "EVE" => val === "MID" || val === "EVE", {
      message: "Draw time is required",
  }),
  winning_numbers: z.string()
      .min(1, "Winning numbers are required")
      .regex(/^\d+$/, "Winning numbers must contain only digits"),
  // COMMENTED OUT: Result Status flow
  // result: z.string().refine((val): val is "WIN" | "LOSS" | "PENDING" => val === "WIN" || val === "LOSS" || val === "PENDING", {
  //     message: "Result status is required",
  // }),
  prize_amount: z
  .union([
    z.number().min(0, "Prize amount must be greater than or equal to 0"),
    z.string().length(0),
  ])
  .optional()
  .transform((value) => (value === "" ? null : value)),

})
.superRefine((data, ctx) => {
  // Prize amount validation: required if winning numbers entered (and not "000"), not allowed otherwise
  const hasWinningNumbers = data.winning_numbers && data.winning_numbers.trim() !== "" && data.winning_numbers !== "000";
  
  if (hasWinningNumbers) {
     if (typeof data.prize_amount === "number" && data.prize_amount <= 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Prize amount must be greater than 0 when winning numbers are entered",
        path: ["prize_amount"],
      });
    }
  } else {
    // If no winning numbers or "000", prize amount should not be allowed
    if (data.prize_amount !== "" && data.prize_amount !== null && data.prize_amount !== undefined && data.prize_amount !== 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Prize amount is not allowed when winning numbers are not entered or are '000'",
        path: ["prize_amount"],
      });
    }
  }
})