/**
 * 🧪 Auth Validation Tests – Vantage Lane 2.0
 */

import { describe, it, expect } from 'vitest';
import {
  signInSchema,
  signUpSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from './authSchema';

describe('signInSchema', () => {
  it('accepts valid credentials', () => {
    const data = { email: 'user@test.com', password: 'Abc12345', rememberMe: true };
    expect(() => signInSchema.parse(data)).not.toThrow();
  });

  it('accepts credentials without rememberMe', () => {
    const data = { email: 'user@test.com', password: 'Abc12345' };
    expect(() => signInSchema.parse(data)).not.toThrow();
  });

  it('rejects invalid email', () => {
    const data = { email: 'bad', password: 'Abc12345' };
    expect(() => signInSchema.parse(data)).toThrow(/valid email/i);
  });

  it('rejects empty email', () => {
    const data = { email: '', password: 'Abc12345' };
    expect(() => signInSchema.parse(data)).toThrow(/required/);
  });

  it('rejects short password', () => {
    const data = { email: 'a@b.com', password: '123' };
    expect(() => signInSchema.parse(data)).toThrow(/at least 8/);
  });

  it('trims and lowercases email', () => {
    const data = { email: '  USER@TEST.COM  ', password: 'Abc12345' };
    const result = signInSchema.parse(data);
    expect(result.email).toBe('user@test.com');
  });
});

describe('signUpSchema', () => {
  const validSignUpData = {
    email: 'new@test.com',
    password: 'Abc12345',
    confirmPassword: 'Abc12345',
    firstName: 'John',
    lastName: 'Doe',
    phone: '+441234567890',
    acceptTerms: true,
    marketingConsent: false,
  };

  it('accepts valid signup data', () => {
    expect(() => signUpSchema.parse(validSignUpData)).not.toThrow();
  });

  it('accepts signup without phone', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { phone, ...dataWithoutPhone } = validSignUpData;
    expect(() => signUpSchema.parse(dataWithoutPhone)).not.toThrow();
  });

  it('accepts signup with empty phone string', () => {
    const dataWithEmptyPhone = { ...validSignUpData, phone: '' };
    expect(() => signUpSchema.parse(dataWithEmptyPhone)).not.toThrow();
  });

  it('accepts local phone numbers', () => {
    const dataWithLocalPhone = { ...validSignUpData, phone: '0123456789' };
    expect(() => signUpSchema.parse(dataWithLocalPhone)).not.toThrow();
  });

  it('rejects unmatched passwords', () => {
    const data = {
      ...validSignUpData,
      confirmPassword: 'DifferentPassword123',
    };
    expect(() => signUpSchema.parse(data)).toThrow(/match/);
  });

  it('requires terms acceptance', () => {
    const data = {
      ...validSignUpData,
      acceptTerms: false,
    };
    expect(() => signUpSchema.parse(data)).toThrow(/accept/);
  });

  it('requires first name', () => {
    const data = {
      ...validSignUpData,
      firstName: '',
    };
    expect(() => signUpSchema.parse(data)).toThrow(/required/);
  });

  it('requires last name', () => {
    const data = {
      ...validSignUpData,
      lastName: '',
    };
    expect(() => signUpSchema.parse(data)).toThrow(/required/);
  });

  it('rejects invalid phone number', () => {
    const invalidPhones = ['123', 'abc', '++123', '12345678901234567890'];

    invalidPhones.forEach(phone => {
      const data = { ...validSignUpData, phone };
      expect(() => signUpSchema.parse(data)).toThrow(/valid phone|too long/);
    });
  });

  it('trims names and lowercases email', () => {
    const data = {
      ...validSignUpData,
      email: '  NEW@TEST.COM  ',
      firstName: '  John  ',
      lastName: '  Doe  ',
    };
    const result = signUpSchema.parse(data);
    expect(result.email).toBe('new@test.com');
    expect(result.firstName).toBe('John');
    expect(result.lastName).toBe('Doe');
  });

  it('handles email too long', () => {
    const longEmail = 'a'.repeat(250) + '@test.com';
    const data = { ...validSignUpData, email: longEmail };
    expect(() => signUpSchema.parse(data)).toThrow(/too long/);
  });
});

describe('forgotPasswordSchema', () => {
  it('accepts valid email', () => {
    const data = { email: 'reset@test.com' };
    expect(() => forgotPasswordSchema.parse(data)).not.toThrow();
  });

  it('rejects invalid email', () => {
    const data = { email: 'invalid-email' };
    expect(() => forgotPasswordSchema.parse(data)).toThrow(/valid email/);
  });

  it('rejects empty email', () => {
    const data = { email: '' };
    expect(() => forgotPasswordSchema.parse(data)).toThrow(/required/);
  });

  it('trims and lowercases email', () => {
    const data = { email: '  RESET@TEST.COM  ' };
    const result = forgotPasswordSchema.parse(data);
    expect(result.email).toBe('reset@test.com');
  });
});

describe('resetPasswordSchema', () => {
  it('accepts valid reset data', () => {
    const data = {
      token: 'valid-token-123',
      password: 'NewPass123',
      confirmPassword: 'NewPass123',
    };
    expect(() => resetPasswordSchema.parse(data)).not.toThrow();
  });

  it('rejects mismatched passwords', () => {
    const data = {
      token: 'valid-token-123',
      password: 'NewPass123',
      confirmPassword: 'DifferentPass123',
    };
    expect(() => resetPasswordSchema.parse(data)).toThrow(/don't match/);
  });

  it('rejects empty token', () => {
    const data = {
      token: '',
      password: 'NewPass123',
      confirmPassword: 'NewPass123',
    };
    expect(() => resetPasswordSchema.parse(data)).toThrow(/token is required/);
  });

  it('rejects weak password', () => {
    const data = {
      token: 'valid-token-123',
      password: 'weak',
      confirmPassword: 'weak',
    };
    expect(() => resetPasswordSchema.parse(data)).toThrow(/at least 8 characters/);
  });
});
