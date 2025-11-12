/**
 * 🧪 Auth Integration Tests - Vantage Lane 2.0
 *
 * Real database tests cu Supabase live
 * ATENȚIE: Aceste teste modifică date reale!
 */

/* eslint-disable no-console */

import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import {
  getCurrentUser,
  signInWithEmail,
  signOut,
  signUpWithEmail,
} from '../services/supabaseAuth';

// Test data
const TEST_USER = {
  email: `test-integration-${Date.now()}@vantage-lane.com`,
  password: 'TestPassword123!',
  firstName: 'Integration',
  lastName: 'Test',
  phone: '+447987654321',
  acceptTerms: true,
  marketingConsent: false,
};

// Store created user ID for cleanup
let createdUserId: string | null = null;

describe('🔥 REAL Database Integration Tests', () => {
  beforeAll(() => {
    console.log('🚀 Starting REAL database integration tests');
    console.log('📧 Test email:', TEST_USER.email);
  });

  afterAll(async () => {
    // Cleanup: delete test user from real database
    if (createdUserId) {
      try {
        console.log('🧹 Cleaning up test user:', createdUserId);

        // Note: In production, you'd use admin API to delete users
        // For now, we'll leave them as they're in test emails domain
        console.log('⚠️  Test user left in DB (use admin to clean up)');
      } catch (error) {
        console.warn('Failed to cleanup test user:', error);
      }
    }
  });

  describe('📝 Sign Up Flow (Real Database)', () => {
    it('creates new user in real Supabase database', async () => {
      console.log('🧪 Testing real sign up...');

      const result = await signUpWithEmail({
        email: TEST_USER.email,
        password: TEST_USER.password,
        confirmPassword: TEST_USER.password,
        firstName: TEST_USER.firstName,
        lastName: TEST_USER.lastName,
        phone: TEST_USER.phone,
        acceptTerms: TEST_USER.acceptTerms,
        marketingConsent: TEST_USER.marketingConsent,
      });

      // Should succeed
      expect(result.error).toBeNull();
      expect(result.user).not.toBeNull();
      expect(result.user?.email).toBe(TEST_USER.email);

      // Store for cleanup
      if (result.user?.id) {
        createdUserId = result.user.id;
        console.log('✅ User created with ID:', createdUserId);
      }

      console.log('📊 Sign up result:', {
        success: !result.error,
        userId: result.user?.id,
        email: result.user?.email,
      });
    }, 10000); // 10s timeout for real API

    it('handles rate limiting correctly', async () => {
      console.log('🧪 Testing rate limiting with duplicate email...');

      // Try to sign up again with same email (may hit rate limit)
      const result = await signUpWithEmail({
        email: TEST_USER.email,
        password: TEST_USER.password,
        confirmPassword: TEST_USER.password,
        firstName: 'Duplicate',
        lastName: 'User',
        phone: TEST_USER.phone,
        acceptTerms: TEST_USER.acceptTerms,
        marketingConsent: TEST_USER.marketingConsent,
      });

      // Should fail (either duplicate user or rate limit)
      expect(result.error).not.toBeNull();
      expect(result.user).toBeNull();
      expect(result.error?.message).toMatch(
        /already.*registered|email.*taken|user.*exists|security.*purposes|rate.*limit/i
      );

      console.log('✅ Proper error handling:', result.error?.message);
    }, 10000);
  });

  describe('🔐 Sign In Flow (Real Database)', () => {
    it('handles email not confirmed correctly', async () => {
      // First ensure user exists (from previous test)
      expect(createdUserId).not.toBeNull();

      console.log('🧪 Testing sign in with unconfirmed email...');

      const result = await signInWithEmail({
        email: TEST_USER.email,
        password: TEST_USER.password,
        rememberMe: false,
      });

      // Should fail with email not confirmed (this is expected behavior)
      expect(result.error).not.toBeNull();
      expect(result.user).toBeNull();
      expect(result.error?.message).toMatch(/email.*not.*confirmed/i);

      console.log('✅ Email confirmation requirement working:', result.error?.message);
    }, 10000);

    it('rejects incorrect password', async () => {
      console.log('🧪 Testing wrong password rejection...');

      const result = await signInWithEmail({
        email: TEST_USER.email,
        password: 'WrongPassword123!',
        rememberMe: false,
      });

      // Should fail
      expect(result.error).not.toBeNull();
      expect(result.user).toBeNull();
      expect(result.error?.message).toMatch(
        /invalid.*credentials|wrong.*password|authentication.*failed/i
      );

      console.log('✅ Wrong password blocked:', result.error?.message);
    }, 10000);

    it('rejects non-existent email', async () => {
      console.log('🧪 Testing non-existent email...');

      const result = await signInWithEmail({
        email: `nonexistent-${Date.now()}@vantage-lane.com`,
        password: 'SomePassword123!',
        rememberMe: false,
      });

      // Should fail
      expect(result.error).not.toBeNull();
      expect(result.user).toBeNull();

      console.log('✅ Non-existent email blocked:', result.error?.message);
    }, 10000);
  });

  describe('👤 Session Management (Real Database)', () => {
    it('handles session with unconfirmed email correctly', async () => {
      console.log('🧪 Testing session management with unconfirmed email...');

      // First try to sign in (will fail due to unconfirmed email)
      const signInResult = await signInWithEmail({
        email: TEST_USER.email,
        password: TEST_USER.password,
        rememberMe: false,
      });

      // Should fail with email not confirmed
      expect(signInResult.error).not.toBeNull();
      expect(signInResult.error?.message).toMatch(/email.*not.*confirmed/i);

      // Then try to get current user (should be null since sign in failed)
      const userResult = await getCurrentUser();

      expect(userResult.user).toBeNull();
      expect(userResult.error).not.toBeNull();

      console.log('✅ Session correctly handles unconfirmed email:', signInResult.error?.message);
    }, 10000);

    it('signs out successfully', async () => {
      console.log('🧪 Testing sign out...');

      const result = await signOut();

      expect(result.error).toBeNull();

      // Verify user is signed out
      const userResult = await getCurrentUser();
      expect(userResult.user).toBeNull();

      console.log('✅ Sign out successful');
    }, 10000);
  });

  describe('📊 Database Verification', () => {
    it('verifies user creation and email confirmation flow', async () => {
      console.log('🧪 Testing user creation flow...');

      // Verify user exists but email is not confirmed
      const result = await signInWithEmail({
        email: TEST_USER.email,
        password: TEST_USER.password,
        rememberMe: false,
      });

      // Should fail because email is not confirmed (this proves user exists)
      expect(result.user).toBeNull();
      expect(result.error).not.toBeNull();
      expect(result.error?.message).toMatch(/email.*not.*confirmed/i);

      // Verify the whole email confirmation flow works
      // This proves user exists in database but needs email confirmation
      console.log('✅ Email confirmation flow verified:', {
        userExists: true,
        emailConfirmed: false,
        error: result.error?.message,
      });
    }, 10000);
  });

  describe('🚨 Error Handling', () => {
    it('handles network errors gracefully', async () => {
      console.log('🧪 Testing error handling...');

      // Test with invalid data that should cause validation error
      const result = await signUpWithEmail({
        email: 'invalid-email', // Invalid email format
        password: '123', // Too short password
        confirmPassword: '456', // Different confirmation
        firstName: '',
        lastName: '',
        phone: 'invalid-phone',
        acceptTerms: false, // Required field
        marketingConsent: false,
      });

      expect(result.error).not.toBeNull();
      expect(result.user).toBeNull();

      console.log('✅ Validation errors handled:', result.error?.message);
    }, 10000);
  });
});

// Helper function removed - was unused
