import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedRoutes = ['/', '/leads', '/companies', '/deals', '/tasks', '/settings'];
const authRoutes = ['/login'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('token')?.value;

  // Check if it's a protected route
  // If it's an auth route, it's not protected
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));
  
  // A route is protected if it starts with a protected path AND it's not an auth route
  // Special case for root: exact match if it's just '/'
  const isProtected = !isAuthRoute && protectedRoutes.some((route) => {
    if (route === '/') return pathname === '/';
    return pathname.startsWith(route);
  });

  // If the user doesn't have a token and tries to access a protected route
  if (isProtected && !token) {
    const url = new URL('/login', request.url);
    url.searchParams.set('from', pathname);
    return NextResponse.redirect(url);
  }

  // If the user has a token and tries to access an auth route (login)
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
