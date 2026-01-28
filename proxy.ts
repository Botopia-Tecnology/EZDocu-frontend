import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { signToken, verifyToken, SessionData } from '@/lib/auth/session';

const PUBLIC_ROUTES = ['/', '/sign-in', '/sign-up', '/pricing'];

function getRedirectByRole(userType: string): string {
  switch (userType) {
    case 'admin': return '/admin';
    case 'team': return '/dashboard';
    case 'member': return '/workspace';
    case 'user': return '/workspace'; // Usuario sin company va a workspace
    default: return '/workspace';
  }
}

function canAccessRoute(pathname: string, session: SessionData | null): boolean {
  if (PUBLIC_ROUTES.some(p => pathname === p || pathname.startsWith(p + '?'))) {
    return true;
  }

  if (!session) return false;

  const { userType } = session;

  if (pathname.startsWith('/admin')) {
    return userType === 'admin';
  }

  if (pathname.startsWith('/dashboard')) {
    return userType === 'admin' || userType === 'team';
  }

  if (pathname.startsWith('/workspace')) {
    return ['admin', 'team', 'member', 'user'].includes(userType);
  }

  return true;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get('session');

  let session: SessionData | null = null;
  let res = NextResponse.next();

  if (sessionCookie) {
    try {
      session = await verifyToken(sessionCookie.value);

      const expiresInOneDay = new Date(Date.now() + 24 * 60 * 60 * 1000);
      res.cookies.set({
        name: 'session',
        value: await signToken({
          ...session,
          expires: expiresInOneDay.toISOString()
        }),
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        expires: expiresInOneDay
      });
    } catch {
      res.cookies.delete('session');
      session = null;
    }
  }

  // Redirect logged-in users from auth pages to their dashboard
  if (session && (pathname === '/sign-in' || pathname === '/sign-up')) {
    return NextResponse.redirect(new URL(getRedirectByRole(session.userType), request.url));
  }

  // Check route access
  if (!canAccessRoute(pathname, session)) {
    if (!session) {
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }
    return NextResponse.redirect(new URL(getRedirectByRole(session.userType), request.url));
  }

  return res;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
