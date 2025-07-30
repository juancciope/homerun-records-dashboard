import { Suspense } from 'react';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import AgencyDashboard from '@/components/agency/AgencyDashboard';
import CreateArtistButton from '@/components/agency/CreateArtistButton';

interface AgencyPageProps {
  params: Promise<{
    agencySlug: string;
  }>;
}

export default async function AgencyPage({ params }: AgencyPageProps) {
  const { agencySlug } = await params;
  const supabase = createServerComponentClient({ cookies });

  // Get current user session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/auth/login');
  }

  // Get agency data
  const { data: agency, error: agencyError } = await supabase
    .from('agencies')
    .select('*')
    .eq('slug', agencySlug)
    .single();

  if (agencyError || !agency) {
    notFound();
  }

  // Get user data with permissions
  const { data: user, error: userError } = await supabase
    .from('users')
    .select(`
      id,
      role,
      agency_id,
      first_name,
      last_name,
      permissions
    `)
    .eq('id', session.user.id)
    .single();

  if (userError || !user) {
    redirect('/auth/login');
  }

  // Check if user has access to this agency
  if (user.role !== 'super_admin' && user.agency_id !== agency.id) {
    redirect('/unauthorized');
  }

  // Get artists for this agency
  const { data: artists, error: artistsError } = await supabase
    .from('artists')
    .select(`
      id,
      name,
      email,
      image_url,
      genres,
      social_links,
      is_active,
      created_at,
      tenants(
        id,
        slug,
        is_active
      )
    `)
    .eq('agency_id', agency.id)
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (artistsError) {
    console.error('Error fetching artists:', artistsError);
  }

  // Get agency analytics
  const { data: analytics } = await supabase
    .from('agency_analytics')
    .select('*')
    .eq('agency_id', agency.id)
    .eq('period', 'month')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b border-gray-200 bg-white">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {agency.name}
              </h1>
              <p className="text-gray-600">
                {user.role === 'super_admin' ? 'Super Admin View' : 'Agency Dashboard'}
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              {(user.role === 'agency_admin' || user.role === 'super_admin') && (
                <CreateArtistButton agencyId={agency.id} />
              )}
              
              <div className="text-sm text-gray-500">
                Welcome, {user.first_name} {user.last_name}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Suspense fallback={<AgencyDashboardSkeleton />}>
          <AgencyDashboard
            agency={agency}
            artists={artists || []}
            analytics={analytics}
            userRole={user.role}
          />
        </Suspense>
      </div>
    </div>
  );
}

function AgencyDashboardSkeleton() {
  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow p-6">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Artists Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow p-6">
            <div className="animate-pulse">
              <div className="h-12 w-12 bg-gray-200 rounded-full mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}