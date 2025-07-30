import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Public routes that don't require authentication
  const publicRoutes = ['/auth/login', '/auth/signup', '/auth/callback', '/'];
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

  // API routes that don't require tenant context
  const publicApiRoutes = ['/api/auth'];
  const isPublicApiRoute = publicApiRoutes.some(route => pathname.startsWith(route));

  // For now, allow all routes to pass through
  // Authentication will be handled in the individual page components
  // This avoids Edge Runtime compatibility issues with Supabase

  const response = NextResponse.next();

  // Add tenant context headers for API routes if available
  if (pathname.startsWith('/api/') && !isPublicApiRoute) {
    const referer = req.headers.get('referer') || '';
    if (referer) {
      try {
        const refererUrl = new URL(referer);
        const refererPath = refererUrl.pathname;
        const pathParts = refererPath.split('/').filter(Boolean);
        
        if (pathParts[0] === 'agency') {
          const agencySlug = pathParts[1];
          const artistSlug = pathParts[3];
          
          if (agencySlug) response.headers.set('x-agency-slug', agencySlug);
          if (artistSlug) response.headers.set('x-artist-slug', artistSlug);
        }
      } catch {
        // Ignore invalid URLs
      }
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};