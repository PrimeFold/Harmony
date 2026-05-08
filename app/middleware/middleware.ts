import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PROTECTED_ROUTES = ['/dashboard', '/projects', '/settings'];

export async function middleware(request: NextRequest) {
 
  const { pathname } = request.nextUrl;

  // Check if the current path matches any of your protected routes
  const isProtectedRoute = PROTECTED_ROUTES.some(route => pathname.startsWith(route));

  if (isProtectedRoute) {
    const accessToken = request.cookies.get('access-token')?.value;
    const refreshToken = request.cookies.get('refresh-token')?.value;

    if (!accessToken && !refreshToken) {
      const loginUrl = new URL('/auth/signIn', request.url);
      loginUrl.searchParams.set('from', pathname); 
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}