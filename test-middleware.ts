import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Create a response
  const response = NextResponse.next()
  
  // Check for auth cookies
  const hasAuthCookie = 
    request.cookies.has('sb-access-token') ||
    request.cookies.has('sb-refresh-token')
  
  const pathname = request.nextUrl.pathname
  
  // Redirect to login if trying to access dashboard without auth
  if (pathname.startsWith('/dashboard')) {
    if (!hasAuthCookie) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }
  
  // Redirect to dashboard if already logged in and trying to access auth pages
  if (hasAuthCookie && (pathname === '/login' || pathname === '/register')) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }
  
  return response
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/register'],
}