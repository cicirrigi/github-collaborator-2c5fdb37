/**
 * 🛡️ Auth Guards – Vantage Lane 2.0
 *
 * Server-side authentication guards for:
 * - Route Handlers
 * - Server Actions
 * - Middleware
 *
 * Guards available:
 * - requireUser: Requires authenticated user
 * - requireRole: Requires specific roles
 * - optionalAuth: Optional authentication
 */

import { redirect } from 'next/navigation';
import type { Session, User } from '@supabase/supabase-js';

import { createSupabaseServerClient } from '@/lib/supabase/server';

/* --------------------------------------------------
 * 🧩 Context Types
 * -------------------------------------------------- */

export interface AuthContext {
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>;
  session: Session;
  user: User;
}

export interface OptionalAuthContext {
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>;
  session: Session | null;
  user: User | null;
}

/* --------------------------------------------------
 * 🔐 Require Authenticated User
 * -------------------------------------------------- */

/**
 * Requires authenticated user
 * - Used in API routes & server actions
 * - If no user => redirect to /auth/signin (or specified page)
 * - Returns AuthContext with guaranteed user
 */
export async function requireUser(options?: { redirectTo?: string }): Promise<AuthContext> {
  const redirectTo = options?.redirectTo ?? '/auth/signin';

  const supabase = await createSupabaseServerClient();
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error || !session || !session.user) {
    redirect(redirectTo);
  }

  return {
    supabase,
    session,
    user: session.user,
  };
}

/* --------------------------------------------------
 * 🧩 Optional Authentication
 * -------------------------------------------------- */

/**
 * Optional authentication
 * - Doesn't require login
 * - Returns user if exists, otherwise user: null
 * - Useful for pages with optional features
 */
export async function optionalAuth(): Promise<OptionalAuthContext> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error || !session || !session.user) {
    return {
      supabase,
      session: null,
      user: null,
    };
  }

  return {
    supabase,
    session,
    user: session.user,
  };
}

/* --------------------------------------------------
 * 👑 Require Role
 * -------------------------------------------------- */

/**
 * Requires specific role(s)
 * - First ensures user is authenticated
 * - Then checks if user has required role(s)
 * - Role can be in user.user_metadata.role or app_metadata.roles
 * - Throws error on insufficient permissions (can be caught in API routes)
 */
export async function requireRole(
  requiredRoles: string[] | string,
  options?: { redirectTo?: string; throwError?: boolean }
): Promise<AuthContext> {
  const ctx = await requireUser(options);
  const { user } = ctx;

  // Get roles from metadata
  const rolesFromMeta =
    (user.app_metadata?.roles as string[] | undefined) ||
    ((user.user_metadata?.role ? [user.user_metadata.role] : []) as string[]);

  const rolesArray = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];

  const hasRole = rolesArray.some(role => rolesFromMeta?.includes(role));

  if (!hasRole) {
    if (options?.throwError !== false) {
      // Throw error for API routes to handle
      throw new Error(`Forbidden: User lacks required role(s): ${rolesArray.join(', ')}`);
    } else {
      // Redirect for page routes
      redirect(options?.redirectTo ?? '/forbidden');
    }
  }

  return ctx;
}

/* --------------------------------------------------
 * 🔍 Check User Role (Non-throwing)
 * -------------------------------------------------- */

/**
 * Check if user has role without throwing
 * - Returns boolean indicating if user has role
 * - Useful for conditional rendering or logic
 */
export async function hasRole(requiredRoles: string[] | string, user?: User): Promise<boolean> {
  let targetUser = user;

  if (!targetUser) {
    const { user: authUser } = await optionalAuth();
    if (!authUser) return false;
    targetUser = authUser;
  }

  const rolesFromMeta =
    (targetUser.app_metadata?.roles as string[] | undefined) ||
    ((targetUser.user_metadata?.role ? [targetUser.user_metadata.role] : []) as string[]);

  const rolesArray = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];

  return rolesArray.some(role => rolesFromMeta?.includes(role));
}

/* --------------------------------------------------
 * 🧪 Development Helpers
 * -------------------------------------------------- */

/**
 * Get current user without redirects (for development/debugging)
 * - Returns user or null
 * - Never redirects or throws
 */
export async function getCurrentUser(): Promise<User | null> {
  try {
    const { user } = await optionalAuth();
    return user;
  } catch (error) {
    console.warn('Failed to get current user:', error);
    return null;
  }
}
