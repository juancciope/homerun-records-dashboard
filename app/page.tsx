import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function Home() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options)
          })
        },
      },
    }
  );

  // Check if user is logged in
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    // Not logged in - redirect to login
    redirect('/auth/login');
  }

  // Logged in - redirect to dashboard
  redirect('/agency/demo-agency');
}