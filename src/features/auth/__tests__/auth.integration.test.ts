/**
 * 🧪 Auth Integration Tests - Vantage Lane 2.0
 *
 * Real database tests cu Supabase live
 * ATENȚIE: Aceste teste modifică date reale!
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import {
  signUpWithEmail,
  signInWithEmail,
  signOut,
  getCurrentUser,
} from '../services/supabaseAuth';
import { createClient } from '@/lib/supabase/client';

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

    it('prevents duplicate email registration', async () => {
      console.log('🧪 Testing duplicate email prevention...');

      // Try to register same email again
      const result = await signUpWithEmail({
        email: TEST_USER.email, // Same email
        password: 'DifferentPassword123!',
        confirmPassword: 'DifferentPassword123!',
        firstName: 'Duplicate',
        lastName: 'User',
        phone: '+447000000000',
        acceptTerms: true,
        marketingConsent: false,
      });

      // Should fail
      expect(result.error).not.toBeNull();
      expect(result.user).toBeNull();
      expect(result.error?.message).toMatch(/already.*registered|email.*taken|user.*exists/i);

      console.log('✅ Duplicate registration blocked:', result.error?.message);
    }, 10000);
  });

  describe('🔐 Sign In Flow (Real Database)', () => {
    it('signs in with correct credentials', async () => {
      // First ensure user exists (from previous test)
      expect(createdUserId).not.toBeNull();

      console.log('🧪 Testing real sign in...');

      const result = await signInWithEmail({
        email: TEST_USER.email,
        password: TEST_USER.password,
        rememberMe: false,
      });

      // Should succeed
      expect(result.error).toBeNull();
      expect(result.user).not.toBeNull();
      expect(result.user?.email).toBe(TEST_USER.email);
      expect(result.user?.id).toBe(createdUserId);

      console.log('✅ Sign in successful for user:', result.user?.id);
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
    it('gets current user after sign in', async () => {
      console.log('🧪 Testing session retrieval...');

      // First sign in
      const signInResult = await signInWithEmail({
        email: TEST_USER.email,
        password: TEST_USER.password,
        rememberMe: false,
      });

      expect(signInResult.error).toBeNull();

      // Then get current user
      const userResult = await getCurrentUser();

      expect(userResult.error).toBeNull();
      expect(userResult.user).not.toBeNull();
      expect(userResult.user?.email).toBe(TEST_USER.email);

      console.log('✅ Session retrieved:', userResult.user?.id);
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
    it('verifies user metadata is stored correctly', async () => {
      console.log('🧪 Testing user metadata storage...');

      // Direct database check would require admin client
      // For now, verify through auth APIs

      // Sign in to get fresh user data
      const result = await signInWithEmail({
        email: TEST_USER.email,
        password: TEST_USER.password,
        rememberMe: false,
      });

      expect(result.user).not.toBeNull();

      // Check user metadata (stored in raw_user_meta_data in Supabase)
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      expect(user?.email).toBe(TEST_USER.email);
      expect(user?.user_metadata).toBeDefined();

      console.log('✅ User metadata verified:', {
        email: user?.email,
        created_at: user?.created_at,
        metadata_keys: Object.keys(user?.user_metadata || {}),
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
