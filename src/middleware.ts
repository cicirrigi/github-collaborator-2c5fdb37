/**
 * 🧭 Auth Middleware – Vantage Lane 2.1 (FIXED)
 *
 * Sincronizare stabilă cookie/session între browser & server
 */

import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => req.cookies.getAll().map(c => ({ name: c.name, value: c.value })),
        setAll: cookiesToSet => {
          cookiesToSet.forEach(({ name, value, options }) => {
            res.cookies.set({ name, value, ...options });
          });
        },
      },
    }
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const pathname = req.nextUrl.pathname;
  const isProtected =
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/account') ||
    pathname.startsWith('/admin');
  const isAuthPage = pathname.startsWith('/auth');

  // 🔒 No session → redirect to login
  if (isProtected && !session) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = '/auth/signin';
    redirectUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // ✅ Already logged in → redirect to dashboard
  if (isAuthPage && session) {
    const homeUrl = req.nextUrl.clone();
    homeUrl.pathname = '/dashboard';
    return NextResponse.redirect(homeUrl);
  }

  return res;
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
