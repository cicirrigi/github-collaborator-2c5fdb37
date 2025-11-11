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
  .min(1, 'Email is required')
  .email('Please enter a valid email address')
  .toLowerCase()
  .trim();

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
  .regex(/^(\+?[1-9]\d{1,14}|0\d{9})$/, 'Please enter a valid phone number')
  .optional()
  .or(z.literal(''));

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
 * 🔁  Reset Password Schema
 * -------------------------------------------------- */
export const resetPasswordSchema = z.object({
  email: emailSchema,
});

/* --------------------------------------------------
 * 🧩  Type Inference
 * -------------------------------------------------- */
export type SignInSchemaType = z.infer<typeof signInSchema>;
export type SignUpSchemaType = z.infer<typeof signUpSchema>;
export type ResetPasswordSchemaType = z.infer<typeof resetPasswordSchema>;
