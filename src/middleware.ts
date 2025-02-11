import auth from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import { Role } from './types/auth';

const roleRoutes = {
  admin: ['/admin'],
  player: ['/play'],
  anon: ['/login', '/signup'],
};

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  const session = await auth.getSession();

  const routes = roleRoutes[session.role];
  const allowedRoute = routes.includes(path);

  if (!allowedRoute && session.role === Role.Anon) {
    return NextResponse.redirect(new URL('/login', req.nextUrl));
  }

  if (
    !allowedRoute &&
    session.role !== Role.Anon &&
    !req.nextUrl.pathname.startsWith(routes[0])
  ) {
    return NextResponse.redirect(new URL(routes[0], req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher:
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
};
