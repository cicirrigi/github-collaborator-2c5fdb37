/**
 * ⚛️ AuthProvider – Vantage Lane 2.0 (Enterprise Edition)
 *
 * 🔹 Context client-side sincronizat cu Supabase
 * 🔹 Ascultă evenimente auth (sign-in/out, token refresh)
 * 🔹 Oferă user, session, loading, role utils
 * 🔹 Perfect sincronizat cu SSR middleware
 */

'use client';

import type { Session, User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { createClient } from '../../../lib/supabase/client';

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
  supabase: ReturnType<typeof createClient> | null;
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
  const router = useRouter();

  // Direct client initialization - no delays for JWT attachment
  const supabase = useMemo(() => {
    if (typeof window === 'undefined') return null;
    return createClient();
  }, []);

  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = Boolean(user && session);

  /* --------------------------------------------------
   * 🔄 Session Management
   * -------------------------------------------------- */

  useEffect(() => {
    let mounted = true;

    const clearCorruptedCookies = () => {
      try {
        // Clear all Supabase-related cookies that might be corrupted
        const cookiesToClear = [
          'sb-access-token',
          'sb-refresh-token',
          `sb-${process.env.NEXT_PUBLIC_SUPABASE_URL?.split('//')[1]?.split('.')[0]}-auth-token`,
        ];

        cookiesToClear.forEach(cookieName => {
          document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        });

        // Clear localStorage Supabase keys
        Object.keys(localStorage).forEach(key => {
          if (key.startsWith('sb-') || key.includes('supabase')) {
            localStorage.removeItem(key);
          }
        });
      } catch {
        // Cookie cleanup failed silently
      }
    };

    const init = async () => {
      if (!supabase) return; // Wait for client to be initialized

      setIsLoading(true);
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          // General error handled
          // If error contains "Failed to parse cookie", clear corrupted cookies
          if (
            error.message.includes('Failed to parse cookie') ||
            error.message.includes('Invalid JWT')
          ) {
            clearCorruptedCookies();
            // Retry after cleanup
            const { data: retryData, error: retryError } = await supabase.auth.getSession();
            if (retryError) {
              // Auth state listener setup failed
            } else {
              setSession(retryData.session);
              setUser(retryData.session?.user ?? null);
            }
            return;
          }
        }
        if (!mounted) return;

        setSession(data.session);
        setUser(data.session?.user ?? null);
      } catch (err) {
        // Initial session setup
        // If catch block triggered, likely corrupted cookies
        if (
          err instanceof Error &&
          (err.message.includes('JSON') || err.message.includes('parse'))
        ) {
          clearCorruptedCookies();
          window.location.reload(); // Force clean reload after cookie cleanup
        }
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    if (supabase) {
      init();
    }

    let listener: { subscription: { unsubscribe: () => void } } | null = null;

    if (supabase) {
      const { data } = supabase.auth.onAuthStateChange((event: string, session: Session | null) => {
        // Auth event handled
        setSession(session);
        setUser(session?.user ?? null);

        switch (event) {
          case 'SIGNED_IN':
            router.refresh(); // revalidare SSR state only on sign in
            break;
          case 'TOKEN_REFRESHED':
            // Don't refresh on token refresh - causes unnecessary refetches
            break;
          case 'SIGNED_OUT':
            router.push('/'); // redirect home
            router.refresh();
            break;
        }
      });

      listener = data;
    }

    return () => {
      mounted = false;
      if (listener) {
        listener.subscription.unsubscribe();
      }
    };
  }, [supabase, router]);

  /* --------------------------------------------------
   * 🚪 Auth Actions
   * -------------------------------------------------- */

  /* --------------------------------------------------
   * 🚪 Sign Out
   * -------------------------------------------------- */
  const signOut = useCallback(async () => {
    if (!supabase) return; // Null safety check

    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      // rest handled by listener
    } catch {
      // Sign out error handled
    } finally {
      setIsLoading(false);
    }
  }, [supabase]);

  /* --------------------------------------------------
   * 🔁 Manual Refresh
   * -------------------------------------------------- */
  const refresh = useCallback(async () => {
    if (!supabase) return; // Null safety check

    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      setSession(data.session);
      setUser(data.session?.user ?? null);
      router.refresh();
    } catch {
      // Refresh error handled
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
    supabase,
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
      // Auth debug info available in React DevTools
      // Can be viewed using React DevTools extension
    }
  }, [auth]);

  return auth;
}
