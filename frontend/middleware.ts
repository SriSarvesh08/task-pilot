import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const authToken = request.cookies.get('auth_token')
  const { pathname } = request.nextUrl

  // Protected routes require an auth token
  const protectedRoutes = ['/workspace', '/tasks', '/projects', '/settings']
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))

  if (isProtectedRoute && !authToken) {
    const loginUrl = new URL('/login', request.url)
    return NextResponse.redirect(loginUrl)
  }

  // Redirect authenticated users away from login page
  if (pathname === '/login' && authToken) {
    const dashboardUrl = new URL('/workspace', request.url)
    return NextResponse.redirect(dashboardUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/workspace/:path*',
    '/tasks/:path*',
    '/projects/:path*',
    '/settings/:path*',
    '/login',
  ],
}
