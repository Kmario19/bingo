import auth from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

const protectedRoutes = ['/dashboard', '/play'];
const publicRoutes = ['/login', '/signup'];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);

  const isAuthenticated = await auth.isAuthenticated();

  console.log('Testing middleware', path, isAuthenticated);

  if (isProtectedRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL('/login', req.nextUrl));
  }

  if (
    isPublicRoute &&
    isAuthenticated &&
    !req.nextUrl.pathname.startsWith('/dashboard')
  ) {
    return NextResponse.redirect(new URL('/dashboard', req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher:
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
};
