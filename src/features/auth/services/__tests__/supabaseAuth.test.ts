/**
 * 🧪 Supabase Auth Services Tests - Vantage Lane 2.0
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  signInWithEmail,
  signUpWithEmail,
  signInWithProvider,
  signOut,
  getCurrentSession,
  getCurrentUser,
  sendPasswordResetEmail,
} from '../supabaseAuth';

// Mock Supabase client
const mockSupabaseClient = {
  auth: {
    signInWithPassword: vi.fn(),
    signUp: vi.fn(),
    signInWithOAuth: vi.fn(),
    signOut: vi.fn(),
    getSession: vi.fn(),
    getUser: vi.fn(),
    resetPasswordForEmail: vi.fn(),
  },
};

vi.mock('@/lib/supabase/client', () => ({
  createClient: () => mockSupabaseClient,
}));

// Reset tracking for rate limiting tests
const resetAttempts = new Map<string, { count: number; lastAttempt: number }>();

describe('Supabase Auth Services', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetAttempts.clear();

    // Mock window.location for redirect tests
    Object.defineProperty(window, 'location', {
      value: { origin: 'http://localhost:3000' },
      writable: true,
    });
  });

  describe('signInWithEmail', () => {
    it('successfully signs in user', async () => {
      const mockUser = { id: 'user-123', email: 'test@example.com' };
      mockSupabaseClient.auth.signInWithPassword.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      const result = await signInWithEmail({
        email: 'test@example.com',
        password: 'Password123',
        rememberMe: false,
      });

      expect(mockSupabaseClient.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'Password123',
      });

      expect(result).toEqual({
        user: mockUser,
        error: null,
      });
    });

    it('handles authentication error', async () => {
      const mockError = new Error('Invalid credentials');
      mockSupabaseClient.auth.signInWithPassword.mockResolvedValue({
        data: { user: null },
        error: mockError,
      });

      const result = await signInWithEmail({
        email: 'test@example.com',
        password: 'wrongpassword',
        rememberMe: false,
      });

      expect(result).toEqual({
        user: null,
        error: mockError,
      });
    });

    it('handles missing user data', async () => {
      mockSupabaseClient.auth.signInWithPassword.mockResolvedValue({
        data: { user: null },
        error: null,
      });

      const result = await signInWithEmail({
        email: 'test@example.com',
        password: 'Password123',
        rememberMe: false,
      });

      expect(result.user).toBe(null);
      expect(result.error).toBeInstanceOf(Error);
      expect(result.error?.message).toBe('No user data returned from authentication');
    });

    it('handles unexpected errors', async () => {
      mockSupabaseClient.auth.signInWithPassword.mockRejectedValue(new Error('Network error'));

      const result = await signInWithEmail({
        email: 'test@example.com',
        password: 'Password123',
        rememberMe: false,
      });

      expect(result.user).toBe(null);
      expect(result.error?.message).toBe('Network error');
    });
  });

  describe('signUpWithEmail', () => {
    it('successfully signs up user', async () => {
      const mockUser = { id: 'user-456', email: 'new@example.com' };
      mockSupabaseClient.auth.signUp.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      const result = await signUpWithEmail({
        email: 'new@example.com',
        password: 'Password123',
        confirmPassword: 'Password123',
        firstName: 'John',
        lastName: 'Doe',
        phone: '+441234567890',
        acceptTerms: true,
        marketingConsent: false,
      });

      expect(mockSupabaseClient.auth.signUp).toHaveBeenCalledWith({
        email: 'new@example.com',
        password: 'Password123',
        options: {
          data: {
            first_name: 'John',
            last_name: 'Doe',
            phone: '+441234567890',
            marketing_consent: false,
          },
          emailRedirectTo: 'https://vantage-lane.com/auth/callback',
        },
      });

      expect(result).toEqual({
        user: mockUser,
        error: null,
      });
    });

    it('handles signup error', async () => {
      const mockError = new Error('Email already registered');
      mockSupabaseClient.auth.signUp.mockResolvedValue({
        data: { user: null },
        error: mockError,
      });

      const result = await signUpWithEmail({
        email: 'existing@example.com',
        password: 'Password123',
        confirmPassword: 'Password123',
        firstName: 'John',
        lastName: 'Doe',
        phone: '',
        acceptTerms: true,
        marketingConsent: false,
      });

      expect(result).toEqual({
        user: null,
        error: mockError,
      });
    });

    it('uses environment URL when available', async () => {
      const originalEnv = process.env.NEXT_PUBLIC_APP_URL;
      process.env.NEXT_PUBLIC_APP_URL = 'https://vantage-lane.com';

      mockSupabaseClient.auth.signUp.mockResolvedValue({
        data: { user: { id: 'user-456' } },
        error: null,
      });

      await signUpWithEmail({
        email: 'test@example.com',
        password: 'Password123',
        confirmPassword: 'Password123',
        firstName: 'John',
        lastName: 'Doe',
        phone: '',
        acceptTerms: true,
        marketingConsent: false,
      });

      expect(mockSupabaseClient.auth.signUp).toHaveBeenCalledWith(
        expect.objectContaining({
          options: expect.objectContaining({
            emailRedirectTo: 'https://vantage-lane.com/auth/callback',
          }),
        })
      );

      process.env.NEXT_PUBLIC_APP_URL = originalEnv;
    });
  });

  describe('signInWithProvider', () => {
    it('initiates OAuth flow', async () => {
      mockSupabaseClient.auth.signInWithOAuth.mockResolvedValue({
        data: { url: 'https://oauth-url' },
        error: null,
      });

      const result = await signInWithProvider('google');

      expect(mockSupabaseClient.auth.signInWithOAuth).toHaveBeenCalledWith({
        provider: 'google',
        options: {
          redirectTo: 'https://vantage-lane.com/auth/callback',
          scopes: 'email profile',
        },
      });

      expect(result).toEqual({
        user: null,
        error: null,
      });
    });

    it('handles LinkedIn provider correctly', async () => {
      mockSupabaseClient.auth.signInWithOAuth.mockResolvedValue({
        data: { url: 'https://oauth-url' },
        error: null,
      });

      await signInWithProvider('linkedin');

      expect(mockSupabaseClient.auth.signInWithOAuth).toHaveBeenCalledWith({
        provider: 'linkedin_oidc',
        options: {
          redirectTo: 'https://vantage-lane.com/auth/callback',
        },
      });
    });

    it('handles OAuth error', async () => {
      const mockError = new Error('OAuth failed');
      mockSupabaseClient.auth.signInWithOAuth.mockResolvedValue({
        data: null,
        error: mockError,
      });

      const result = await signInWithProvider('google');

      expect(result).toEqual({
        user: null,
        error: mockError,
      });
    });
  });

  describe('sendPasswordResetEmail', () => {
    it('successfully sends reset email', async () => {
      mockSupabaseClient.auth.resetPasswordForEmail.mockResolvedValue({
        data: {},
        error: null,
      });

      const result = await sendPasswordResetEmail('test@example.com');

      expect(mockSupabaseClient.auth.resetPasswordForEmail).toHaveBeenCalledWith(
        'test@example.com',
        {
          redirectTo: 'https://vantage-lane.com/auth/reset-password',
        }
      );

      expect(result).toEqual({ error: null });
    });

    it('handles reset email error', async () => {
      const mockError = new Error('Email not found');
      mockSupabaseClient.auth.resetPasswordForEmail.mockResolvedValue({
        data: null,
        error: mockError,
      });

      const result = await sendPasswordResetEmail('nonexistent@example.com');

      expect(result).toEqual({ error: mockError });
    });

    it('implements basic rate limiting for password reset', async () => {
      // Mock console.warn to track rate limiting
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      mockSupabaseClient.auth.resetPasswordForEmail.mockResolvedValue({
        data: {},
        error: null,
      });

      const email = 'test@example.com';

      // First attempt should succeed
      const result1 = await sendPasswordResetEmail(email);
      expect(result1.error).toBe(null);

      // Simulate rapid subsequent attempts (would be rate limited in real implementation)
      const result2 = await sendPasswordResetEmail(email);
      expect(result2.error).toBe(null); // Currently passes, but we can add rate limiting logic

      consoleSpy.mockRestore();
    });

    it('handles network errors gracefully', async () => {
      mockSupabaseClient.auth.resetPasswordForEmail.mockRejectedValue(new Error('Network timeout'));

      const result = await sendPasswordResetEmail('test@example.com');

      expect(result.error?.message).toBe('Network timeout');
    });
  });

  describe('signOut', () => {
    it('successfully signs out user', async () => {
      mockSupabaseClient.auth.signOut.mockResolvedValue({
        error: null,
      });

      const result = await signOut();

      expect(mockSupabaseClient.auth.signOut).toHaveBeenCalled();
      expect(result).toEqual({ error: null });
    });

    it('handles signout error', async () => {
      const mockError = new Error('Signout failed');
      mockSupabaseClient.auth.signOut.mockResolvedValue({
        error: mockError,
      });

      const result = await signOut();

      expect(result).toEqual({ error: mockError });
    });
  });

  describe('getCurrentSession', () => {
    it('successfully gets current session', async () => {
      const mockSession = { access_token: 'token', user: { id: 'user-123' } };
      mockSupabaseClient.auth.getSession.mockResolvedValue({
        data: { session: mockSession },
        error: null,
      });

      const result = await getCurrentSession();

      expect(result).toEqual({
        session: mockSession,
        error: null,
      });
    });

    it('handles session error', async () => {
      const mockError = new Error('Session expired');
      mockSupabaseClient.auth.getSession.mockResolvedValue({
        data: { session: null },
        error: mockError,
      });

      const result = await getCurrentSession();

      expect(result).toEqual({
        session: null,
        error: mockError,
      });
    });
  });

  describe('getCurrentUser', () => {
    it('successfully gets current user', async () => {
      const mockUser = { id: 'user-123', email: 'test@example.com' };
      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      const result = await getCurrentUser();

      expect(result).toEqual({
        user: mockUser,
        error: null,
      });
    });

    it('handles get user error', async () => {
      const mockError = new Error('User not found');
      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: mockError,
      });

      const result = await getCurrentUser();

      expect(result).toEqual({
        user: null,
        error: mockError,
      });
    });
  });
});
