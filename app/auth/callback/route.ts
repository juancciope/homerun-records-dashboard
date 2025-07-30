import { createServerClient } from '@supabase/ssr';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/';

  if (code) {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          },
        },
      }
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error) {
      // Get user and redirect to appropriate dashboard
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Get user role to determine redirect
        const { data: userData } = await supabase
          .from('users')
          .select('role, agency_id, agencies(slug)')
          .eq('id', user.id)
          .single();

        if (userData) {
          if (userData.role === 'super_admin') {
            return NextResponse.redirect(`${origin}/admin`);
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } else if ((userData as any).agencies?.slug) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return NextResponse.redirect(`${origin}/agency/${(userData as any).agencies.slug}`);
          }
        }
      }
      
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}