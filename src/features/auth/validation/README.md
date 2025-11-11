# 🛡️ Auth Validation - Enterprise Ready

## 📁 Structura

```
src/features/auth/validation/
├── authSchema.ts              # Schema-uri Zod complete
├── auth.validation.test.ts    # Teste automate comprehensive
└── README.md                  # Documentație (acest fișier)
```

## 🚀 Cum să rulezi testele

```bash
# Rulează toate testele o dată
npm run test

# Rulează testele în mod watch (se re-rulează la schimbări)
npm run test:watch

# Rulează doar testele de validare auth
npx vitest auth.validation.test.ts
```

## 📝 Schema-uri disponibile

### 🔑 Sign In

```typescript
import { signInSchema, type SignInSchemaType } from './authSchema';

const data: SignInSchemaType = {
  email: 'user@example.com',
  password: 'Abc12345',
  rememberMe: true,
};
```

### 🆕 Sign Up

```typescript
import { signUpSchema, type SignUpSchemaType } from './authSchema';

const data: SignUpSchemaType = {
  email: 'new@example.com',
  password: 'Abc12345',
  confirmPassword: 'Abc12345',
  firstName: 'John',
  lastName: 'Doe',
  phone: '+441234567890', // optional
  acceptTerms: true,
  marketingConsent: false, // optional
};
```

### 🔁 Reset Password

```typescript
import { resetPasswordSchema, type ResetPasswordSchemaType } from './authSchema';

const data: ResetPasswordSchemaType = {
  email: 'reset@example.com',
};
```

## ✅ Validări implementate

### Email

- ✅ Required field
- ✅ Valid email format
- ✅ Max 254 characters (RFC 5321)
- ✅ Auto lowercase + trim

### Password

- ✅ Min 8 characters
- ✅ At least one letter
- ✅ At least one number
- ✅ Auto trim

### Phone (optional)

- ✅ E.164 format (+441234567890)
- ✅ Local format (0123456789)
- ✅ Optional field

### Names

- ✅ Required fields
- ✅ Auto trim

### Terms & Conditions

- ✅ Must be explicitly accepted

## 🧪 Coverage testelor

- ✅ **100% schema validation rules**
- ✅ **Edge cases** (empty strings, invalid formats)
- ✅ **Data transformation** (trim, lowercase)
- ✅ **Cross-field validation** (password confirmation)
- ✅ **Optional fields** handling

## 🔄 Extindere

Pentru a adăuga schema noi (ex: changePasswordSchema):

1. **Creează schema în authSchema.ts:**

```typescript
export const changePasswordSchema = z
  .object({
    currentPassword: passwordSchema,
    newPassword: passwordSchema,
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine(d => d.newPassword === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type ChangePasswordSchemaType = z.infer<typeof changePasswordSchema>;
```

2. **Adaugă teste în auth.validation.test.ts:**

```typescript
describe('changePasswordSchema', () => {
  it('accepts valid password change', () => {
    const data = {
      currentPassword: 'OldPass123',
      newPassword: 'NewPass123',
      confirmPassword: 'NewPass123',
    };
    expect(() => changePasswordSchema.parse(data)).not.toThrow();
  });

  // ... more tests
});
```

3. **Rulează testele pentru confirmare:**

```bash
npm run test
```
