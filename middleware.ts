import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  // Refresh session if expired
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const { pathname } = req.nextUrl;

  // Public routes that don't require authentication
  const publicRoutes = ['/auth/login', '/auth/signup', '/auth/callback', '/'];
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

  // API routes that don't require tenant context
  const publicApiRoutes = ['/api/auth'];
  const isPublicApiRoute = publicApiRoutes.some(route => pathname.startsWith(route));

  // Handle authentication
  if (!session && !isPublicRoute) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = '/auth/login';
    redirectUrl.searchParams.set('redirectTo', pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Handle tenant routing for authenticated users
  if (session && !isPublicRoute && !isPublicApiRoute) {
    // Extract tenant from URL: /agency/[agencySlug]/artist/[artistSlug]
    const pathParts = pathname.split('/').filter(Boolean);
    
    if (pathParts[0] === 'agency' || pathParts[0] === 'admin') {
      // Agency or admin routes - validate user has access
      const agencySlug = pathParts[1];
      
      if (agencySlug) {
        // Get user's role and agency access
        const { data: user } = await supabase
          .from('users')
          .select(`
            id,
            role,
            agency_id,
            agencies(slug)
          `)
          .eq('id', session.user.id)
          .single();

        // Super admin can access any agency
        if (user?.role === 'super_admin') {
          return res;
        }

        // Check if user belongs to this agency
        if (user?.agencies?.slug !== agencySlug && user?.role !== 'super_admin') {
          return NextResponse.redirect(new URL('/unauthorized', req.url));
        }
      }
    }

    // Handle artist-specific routes
    if (pathParts[0] === 'agency' && pathParts[2] === 'artist') {
      const artistSlug = pathParts[3];
      
      if (artistSlug) {
        // Get user's access to this specific artist
        const { data: user } = await supabase
          .from('users')
          .select(`
            id,
            role,
            agency_id,
            artist_id,
            artists(id),
            agencies(slug)
          `)
          .eq('id', session.user.id)
          .single();

        // Artists can only access their own dashboard
        if (user?.role === 'artist') {
          const { data: artist } = await supabase
            .from('artists')
            .select('id')
            .eq('id', user.artist_id)
            .single();

          const { data: tenant } = await supabase
            .from('tenants')
            .select('slug')
            .eq('artist_id', artist?.id)
            .single();

          if (tenant?.slug !== artistSlug) {
            return NextResponse.redirect(new URL('/unauthorized', req.url));
          }
        }
      }
    }
  }

  // Add tenant context to request headers for API routes
  if (pathname.startsWith('/api/') && !isPublicApiRoute) {
    const url = req.nextUrl.clone();
    const referer = req.headers.get('referer') || '';
    const refererUrl = new URL(referer, req.url);
    const refererPath = refererUrl.pathname;
    
    // Extract tenant info from referer
    const pathParts = refererPath.split('/').filter(Boolean);
    if (pathParts[0] === 'agency') {
      const agencySlug = pathParts[1];
      const artistSlug = pathParts[3];
      
      // Add tenant context to request headers
      const response = NextResponse.next();
      response.headers.set('x-agency-slug', agencySlug || '');
      response.headers.set('x-artist-slug', artistSlug || '');
      
      return response;
    }
  }

  return res;
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