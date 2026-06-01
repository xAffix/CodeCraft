import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Auth is handled client-side via Supabase.
// This middleware just passes through — the pages themselves
// redirect if the user isn't authenticated.
export function middleware(_request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
