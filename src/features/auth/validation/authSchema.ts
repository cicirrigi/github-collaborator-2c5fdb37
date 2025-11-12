/**
 * 🛡️ Auth Validation Schemas - Vantage Lane 2.0
 *
 * Zod schemas pentru validare form-uri Auth
 * Refolosibile și type-safe
 */

import { z } from 'zod';

/**
 * Email validation schema
 */
const emailSchema = z
  .string()
  .trim()
  .min(1, 'Email is required')
  .email('Please enter a valid email address')
  .max(100, 'Email is too long')
  .toLowerCase();

/**
 * Password validation schema
 * Min 8 caractere, cel puțin o literă și un număr
 */
const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[a-zA-Z]/, 'Password must contain at least one letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .trim();

/* --------------------------------------------------
 * 📞  Phone Schema (E.164 sau local)
 * -------------------------------------------------- */
const phoneSchema = z
  .string()
  .optional()
  .refine(val => !val || val === '' || /^(\+?[1-9]\d{7,14}|0\d{9,10})$/.test(val), {
    message: 'Please enter a valid phone number',
  })
  .refine(val => !val || val.length <= 15, { message: 'Phone number is too long' });

/* --------------------------------------------------
 * 🔑  Sign In Schema
 * -------------------------------------------------- */
export const signInSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  rememberMe: z.boolean().optional(),
});

/* --------------------------------------------------
 * 🆕  Sign Up Schema
 * -------------------------------------------------- */
export const signUpSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    firstName: z.string().min(1, 'First name is required').trim(),
    lastName: z.string().min(1, 'Last name is required').trim(),
    phone: phoneSchema,
    acceptTerms: z
      .boolean()
      .default(false)
      .refine(v => v === true, { message: 'You must accept the terms and conditions' }),
    marketingConsent: z.boolean().optional(),
  })
  .refine(d => d.password === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

/* --------------------------------------------------
 * 🔁  Forgot Password Schema (doar email)
 * -------------------------------------------------- */
export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

/* --------------------------------------------------
 * 🔐  Reset Password Schema (token + passwords)
 * -------------------------------------------------- */
export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, 'Reset token is required'),
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

/* --------------------------------------------------
 * 🧩  Type Inference
 * -------------------------------------------------- */
export type SignInSchemaType = z.infer<typeof signInSchema>;
export type SignUpSchemaType = z.infer<typeof signUpSchema>;
export type ForgotPasswordSchemaType = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordSchemaType = z.infer<typeof resetPasswordSchema>;
