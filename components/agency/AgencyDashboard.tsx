'use client';

import { Agency, MultiTenantArtist, AgencyAnalytics } from '@/lib/types/multi-tenant';
import Link from 'next/link';
import Image from 'next/image';
import { formatNumber } from '@/lib/utils/formatters';

interface AgencyDashboardProps {
  agency: Agency;
  artists: (MultiTenantArtist & { tenants: { id: string; slug: string; is_active: boolean }[] })[];
  analytics: AgencyAnalytics | null;
  userRole: string;
}

export default function AgencyDashboard({ agency, artists, analytics, userRole }: AgencyDashboardProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const activeArtists = artists.filter(artist => (artist as any).is_active);
  const totalStreams = analytics?.totalStreams || 0;
  const totalFans = analytics?.totalFans || 0;

  return (
    <div className="space-y-8">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          title="Total Artists"
          value={artists.length}
          icon="👥"
          trend={{ value: 2, isPositive: true }}
        />
        <StatCard
          title="Active Artists"
          value={activeArtists.length}
          icon="✅"
        />
        <StatCard
          title="Total Streams"
          value={formatNumber(totalStreams)}
          icon="🎵"
          trend={{ value: 15.3, isPositive: true }}
        />
        <StatCard
          title="Total Fans"
          value={formatNumber(totalFans)}
          icon="❤️"
          trend={{ value: 8.7, isPositive: true }}
        />
      </div>

      {/* Agency Plan Info */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Current Plan</h3>
            <p className="text-gray-600 capitalize">{agency.plan}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Artists</p>
            <p className="text-2xl font-bold text-gray-900">
              {artists.length} / {agency.settings.features.maxArtists}
            </p>
          </div>
        </div>
        
        {artists.length >= agency.settings.features.maxArtists && (
          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-md">
            <p className="text-amber-800 text-sm">
              You&apos;ve reached your artist limit. Upgrade your plan to add more artists.
            </p>
          </div>
        )}
      </div>

      {/* Artists Grid */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Artists</h2>
          <div className="text-sm text-gray-500">
            {artists.length} {artists.length === 1 ? 'artist' : 'artists'}
          </div>
        </div>

        {artists.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No artists yet</h3>
            <p className="text-gray-500 mb-4">Get started by adding your first artist to the platform.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {artists.map((artist) => (
              <ArtistCard
                key={artist.id}
                artist={artist}
                agencySlug={agency.slug}
                _userRole={userRole}
              />
            ))}
          </div>
        )}
      </div>

      {/* Top Performers */}
      {analytics?.topPerformingArtists && analytics.topPerformingArtists.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performers This Month</h3>
          <div className="space-y-4">
            {analytics.topPerformingArtists.slice(0, 5).map((performer, index) => (
              <div key={performer.artistId} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{performer.artistName}</p>
                    <p className="text-sm text-gray-500">{formatNumber(performer.streams)} streams</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    performer.growth >= 0
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {performer.growth >= 0 ? '↗' : '↘'}
                    {Math.abs(performer.growth)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ title, value, icon, trend }: {
  title: string;
  value: string | number;
  icon?: string;
  trend?: { value: number; isPositive: boolean };
}) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        {icon && <span className="text-2xl">{icon}</span>}
      </div>
      
      <div className="space-y-2">
        <p className="text-3xl font-bold text-gray-900">{value}</p>
        
        {trend && (
          <div className="flex items-center space-x-1">
            <span
              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                trend.isPositive
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {trend.isPositive ? '↗' : '↘'}
              {Math.abs(trend.value)}%
            </span>
            <span className="text-xs text-gray-500">vs last month</span>
          </div>
        )}
      </div>
    </div>
  );
}

function ArtistCard({ artist, agencySlug, _userRole }: {
  artist: MultiTenantArtist & { tenants: { id: string; slug: string; is_active: boolean }[] };
  agencySlug: string;
  _userRole: string;
}) {
  // Cast artist to access database fields (snake_case)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dbArtist = artist as any;
  const tenant = artist.tenants[0]; // Assuming one tenant per artist for now
  
  return (
    <div className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6">
      <div className="flex items-center space-x-4 mb-4">
        {dbArtist.image_url ? (
          <Image
            src={dbArtist.image_url}
            alt={dbArtist.name}
            width={48}
            height={48}
            className="w-12 h-12 rounded-full object-cover"
          />
        ) : (
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
            {dbArtist.name.charAt(0).toUpperCase()}
          </div>
        )}
        
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{dbArtist.name}</h3>
          <p className="text-sm text-gray-500">{dbArtist.email}</p>
        </div>
        
        <div className={`w-3 h-3 rounded-full ${
          dbArtist.is_active ? 'bg-green-400' : 'bg-gray-300'
        }`}></div>
      </div>

      {dbArtist.genres && dbArtist.genres.length > 0 && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-1">
            {dbArtist.genres.slice(0, 3).map((genre: string) => (
              <span
                key={genre}
                className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
              >
                {genre}
              </span>
            ))}
            {dbArtist.genres.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                +{dbArtist.genres.length - 3} more
              </span>
            )}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500">
          Created {new Date(dbArtist.created_at).toLocaleDateString()}
        </div>
        
        {tenant && (
          <Link
            href={`/agency/${agencySlug}/artist/${tenant.slug}`}
            className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
          >
            View Dashboard
          </Link>
        )}
      </div>
    </div>
  );
}