/**
 * 🧭 Vantage Lane Auth Middleware
 *
 * Protejează automat toate rutele /dashboard, /account, /admin
 * - Redirecționează userii neautentificați la /auth/signin
 * - Permite accesul public la /, /about, /fleet etc.
 * - Previne accesul la /auth când user e deja logat
 */

import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { log } from './lib/logger';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // Create Supabase client for middleware
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return req.cookies.get(name)?.value;
        },
        set(name, value, options) {
          res.cookies.set({ name, value, ...options });
        },
        remove(name, options) {
          res.cookies.set({ name, value: '', expires: new Date(0), ...options });
        },
      },
    }
  );

  try {
    // Get current session
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error) {
      log.warn('Middleware auth error', { error });
    }

    const pathname = req.nextUrl.pathname;

    // Define route patterns
    const isProtectedRoute = pathname.startsWith('/account') || pathname.startsWith('/admin');

    const isAuthRoute = pathname.startsWith('/auth');

    // 🔒 Protected routes without session → redirect to login
    if (isProtectedRoute && !session) {
      const redirectUrl = req.nextUrl.clone();
      redirectUrl.pathname = '/auth';
      redirectUrl.searchParams.set('mode', 'signin');
      redirectUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(redirectUrl);
    }

    // ✅ Auth pages with existing session → redirect to home
    if (isAuthRoute && session) {
      const homeUrl = req.nextUrl.clone();
      const redirectTo = req.nextUrl.searchParams.get('redirect');

      // Redirect to originally requested page or home
      homeUrl.pathname = redirectTo && redirectTo.startsWith('/') ? redirectTo : '/';
      homeUrl.search = ''; // Clear search params

      return NextResponse.redirect(homeUrl);
    }

    // 👑 Admin routes - check for admin role
    if (pathname.startsWith('/admin') && session) {
      const userRoles = session.user.app_metadata?.roles as string[] | undefined;
      const userRole = session.user.user_metadata?.role as string | undefined;

      const hasAdminRole =
        userRoles?.includes('admin') ||
        userRoles?.includes('superadmin') ||
        userRole === 'admin' ||
        userRole === 'superadmin';

      if (!hasAdminRole) {
        const forbiddenUrl = req.nextUrl.clone();
        forbiddenUrl.pathname = '/dashboard';
        forbiddenUrl.searchParams.set('error', 'insufficient-permissions');
        return NextResponse.redirect(forbiddenUrl);
      }
    }

    // Continue with the request
    return res;
  } catch (error) {
    log.error('Middleware error', error);

    // On error, allow the request to continue
    // This prevents middleware from blocking the entire app
    return res;
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api (API routes are handled by auth guards)
     * - assets (static assets)
     * - Any files with extensions (.js, .css, .png, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|api|assets|.*\\..*).*)',
  ],
};
