# 🔐 Auth Feature Module - Vantage Lane 2.0

Modul complet de autentificare cu Supabase, design orchestrat prin tokens, și arhitectură scalabilă.

## 📁 Structură

```
features/auth/
├── components/           # UI components
│   ├── AuthContainer.tsx    # Main orchestrator
│   ├── AuthForm.tsx         # Universal form (signin/signup)
│   ├── AuthTabs.tsx         # Tab switcher
│   ├── AuthField.tsx        # Reusable input field
│   ├── AuthButton.tsx       # Primary CTA button
│   ├── SocialAuthButtons.tsx # Google, Apple auth
│   └── index.ts
│
├── hooks/
│   └── useAuthForm.ts       # Form logic + validation
│
├── services/
│   └── supabaseAuth.ts      # Supabase integration
│
├── tokens/
│   └── authTokens.ts        # Design tokens (no hardcoding)
│
├── validation/
│   └── authSchema.ts        # Zod schemas
│
├── types/
│   └── auth.types.ts        # TypeScript definitions
│
└── index.ts                 # Public exports
```

## 🚀 Usage

### Basic Auth Page

```tsx
// app/auth/page.tsx
import { AuthContainer } from '@/features/auth';

export default function AuthPage() {
  return <AuthContainer defaultMode='signin' redirectTo='/dashboard' />;
}
```

### With URL Query Mode

```tsx
// Supports /auth?mode=signin or /auth?mode=signup
const mode = searchParams.mode || 'signin';
<AuthContainer defaultMode={mode} />;
```

### Custom Integration

```tsx
import { useAuthForm, signInWithEmail } from '@/features/auth';

function CustomLogin() {
  const { form, onSubmit, isLoading } = useAuthForm({
    mode: 'signin',
    redirectTo: '/custom',
  });

  return <form onSubmit={onSubmit}>...</form>;
}
```

## 🎨 Design Tokens

Toate stilurile sunt centralizate în `authTokens.ts`:

```tsx
import { authTokens } from '@/features/auth';

// Typography
authTokens.typography.title.base;
authTokens.typography.subtitle.base;

// Input styling
authTokens.input.base;
authTokens.input.focus;

// Buttons
authTokens.button.primary.background;
```

## 🔐 Supabase Setup Required

1. **Environment Variables** (`.env.local`):

```bash
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

2. **Install Dependencies**:

```bash
npm install @supabase/ssr @supabase/supabase-js
npm install zod react-hook-form @hookform/resolvers
npm install react-icons lucide-react
```

3. **Database Setup** (Supabase Dashboard):

- Enable Email/Password auth
- Configure redirect URLs: `http://localhost:3000/auth/callback`
- Optional: Enable Google/Apple OAuth

## 🎯 Features

- ✅ **Universal Form** - 1 component pentru signin/signup
- ✅ **Tab Switching** - Elegant tab UI
- ✅ **Validation** - Zod schemas cu error messages
- ✅ **Social Auth** - Google, Apple ready
- ✅ **Loading States** - Spinner și disabled states
- ✅ **Error Handling** - User-friendly messages
- ✅ **Type Safe** - Full TypeScript support
- ✅ **Design Orchestrat** - Zero hardcoding
- ✅ **Scalable** - Easy to add 2FA, Magic Link, etc.

## 🔄 Add More Features

### Magic Link

```tsx
// services/supabaseAuth.ts
export async function signInWithMagicLink(email: string) {
  const supabase = getSupabaseClient();
  return await supabase.auth.signInWithOtp({ email });
}
```

### Password Reset

```tsx
// Already implemented in services/supabaseAuth.ts
import { sendPasswordResetEmail } from '@/features/auth';
await sendPasswordResetEmail('user@example.com');
```

### 2FA

```tsx
// Add to signUpSchema
export const signUpWith2FA = signUpSchema.extend({
  twoFactorEnabled: z.boolean(),
});
```

## 📝 Notes

- **OAuth Redirect**: `/auth/callback` needs to be whitelisted in Supabase
- **Session Handling**: Automatic with `@supabase/ssr`
- **RLS Policies**: Ensure proper policies in Supabase
- **Error Messages**: Customizable in `getErrorMessage()` function

## 🎨 Customization

1. **Tokens** - Edit `authTokens.ts`
2. **Validation** - Modify `authSchema.ts`
3. **UI** - Update components with new design
4. **Logic** - Extend `useAuthForm` hook

---

**Built with:** Next.js 15 + Supabase + Tailwind + Framer Motion + Zod 🚀
