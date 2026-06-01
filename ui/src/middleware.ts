import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('codecraft_auth_token')?.value;
  const isLoginPage = request.nextUrl.pathname === '/';
  
  // Protect all routes except the login page
  if (!token && !isLoginPage) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // If already authenticated and trying to access login, redirect to dashboard
  if (token && isLoginPage) {
    return NextResponse.redirect(new URL('/active_simulation', request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Apply middleware to all routes except static assets and API
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
