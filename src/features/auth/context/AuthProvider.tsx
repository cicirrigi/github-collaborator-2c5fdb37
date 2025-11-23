/**
 * ⚛️ AuthProvider – Vantage Lane 2.0 (Enterprise Edition)
 *
 * 🔹 Context client-side sincronizat cu Supabase
 * 🔹 Ascultă evenimente auth (sign-in/out, token refresh)
 * 🔹 Oferă user, session, loading, role utils
 * 🔹 Perfect sincronizat cu SSR middleware
 */

'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Session, User } from '@supabase/supabase-js';

/* --------------------------------------------------
 * 🧩 Types
 * -------------------------------------------------- */

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signOut: () => Promise<void>;
  refresh: () => Promise<void>;
  hasRole: (roles: string | string[]) => boolean;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

/* --------------------------------------------------
 * 🧱 Context Setup
 * -------------------------------------------------- */

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/* --------------------------------------------------
 * ⚛️ AuthProvider Component
 * -------------------------------------------------- */

export function AuthProvider({ children }: AuthProviderProps) {
  const supabase = createClientComponentClient();
  const router = useRouter();

  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = Boolean(user && session);

  /* --------------------------------------------------
   * 🔄 Session Management
   * -------------------------------------------------- */

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) console.warn('[AuthProvider] init error:', error.message);
        if (!mounted) return;

        setSession(data.session);
        setUser(data.session?.user ?? null);
      } catch (err) {
        console.error('[AuthProvider] init failed:', err);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    init();

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log(`[Auth] event: ${event}`);
      setSession(session);
      setUser(session?.user ?? null);

      switch (event) {
        case 'SIGNED_IN':
        case 'TOKEN_REFRESHED':
          router.refresh(); // revalidare SSR state
          break;
        case 'SIGNED_OUT':
          router.push('/'); // redirect home
          router.refresh();
          break;
      }
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, [supabase, router]);

  /* --------------------------------------------------
   * 🚪 Auth Actions
   * -------------------------------------------------- */

  /* --------------------------------------------------
   * 🚪 Sign Out
   * -------------------------------------------------- */
  const signOut = useCallback(async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      // rest handled by listener
    } catch (err) {
      console.error('[AuthProvider] signOut error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [supabase]);

  /* --------------------------------------------------
   * 🔁 Manual Refresh
   * -------------------------------------------------- */
  const refresh = useCallback(async () => {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      setSession(data.session);
      setUser(data.session?.user ?? null);
      router.refresh();
    } catch (err) {
      console.error('[AuthProvider] refresh error:', err);
    }
  }, [supabase, router]);

  /* --------------------------------------------------
   * 👑 Role Management
   * -------------------------------------------------- */

  /* --------------------------------------------------
   * 👑 Role Helpers
   * -------------------------------------------------- */
  const hasRole = useCallback(
    (roles: string | string[]): boolean => {
      if (!user) return false;

      const userRoles =
        (user.app_metadata?.roles as string[] | undefined) ??
        (user.user_metadata?.role ? [user.user_metadata.role] : []);

      const check = Array.isArray(roles) ? roles : [roles];
      return check.some(role => userRoles?.includes(role));
    },
    [user]
  );

  /* --------------------------------------------------
   * 📦 Context Value
   * -------------------------------------------------- */
  const value: AuthContextValue = {
    user,
    session,
    isAuthenticated,
    isLoading,
    signOut,
    refresh,
    hasRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/* --------------------------------------------------
 * 🪝 useAuth Hook
 * -------------------------------------------------- */

/**
 * Hook pentru accesarea contextului de autentificare
 *
 * @throws Error dacă e folosit în afara AuthProvider
 * @returns AuthContextValue
 *
 * @example
 * ```tsx
 * const { user, isLoading, signOut } = useAuth();
 *
 * if (isLoading) return <Spinner />;
 * if (!user) return <LoginPrompt />;
 *
 * return <Dashboard user={user} onSignOut={signOut} />;
 * ```
 */
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an <AuthProvider>');
  return ctx;
}

/* --------------------------------------------------
 * 🧪 useAuthDebug (dev only)
 * -------------------------------------------------- */

export function useAuthDebug() {
  const auth = useAuth();

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.table({
        isAuthenticated: auth.isAuthenticated,
        isLoading: auth.isLoading,
        userId: auth.user?.id,
        email: auth.user?.email,
        roles: auth.user?.app_metadata?.roles || auth.user?.user_metadata?.role,
      });
    }
  }, [auth]);

  return auth;
}
