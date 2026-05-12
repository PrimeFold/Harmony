import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PROTECTED_ROUTES = ['/pages/dashboard'];

function isProtectedPath(pathname: string) {
  return PROTECTED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
}

export async function middleware(request: NextRequest) {
 
  const { pathname } = request.nextUrl;

  // Match exact route and nested paths while avoiding partial string collisions.
  const isProtectedRoute = isProtectedPath(pathname);

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
