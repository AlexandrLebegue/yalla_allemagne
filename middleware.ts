import { NextRequest, NextResponse } from 'next/server';
import * as jose from 'jose';

const ADMIN_JWT_SECRET = process.env.ADMIN_JWT_SECRET || 'default-secret-change-me-in-production';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect admin routes (except login page itself and auth API)
  if (pathname.startsWith('/admin') && !pathname.startsWith('/api/admin/auth')) {
    // Allow access to the login page (/admin) without authentication
    if (pathname === '/admin') {
      return NextResponse.next();
    }

    // Check for admin_token cookie
    const token = request.cookies.get('admin_token')?.value;

    if (!token) {
      // Redirect to login page
      return NextResponse.redirect(new URL('/admin', request.url));
    }

    try {
      // Verify JWT token
      const secret = new TextEncoder().encode(ADMIN_JWT_SECRET);
      await jose.jwtVerify(token, secret);
      return NextResponse.next();
    } catch {
      // Invalid token, redirect to login
      const response = NextResponse.redirect(new URL('/admin', request.url));
      response.cookies.delete('admin_token');
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
