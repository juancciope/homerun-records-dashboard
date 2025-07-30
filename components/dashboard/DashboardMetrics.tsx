'use client';

import { useEffect, useState } from 'react';
import { DashboardData } from '@/lib/types';
import MetricCard from './MetricCard';
import { formatNumber } from '@/lib/utils/formatters';

export default function DashboardMetrics() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Using sample artist ID for demo
        const response = await fetch('/api/metrics/1');
        if (!response.ok) {
          throw new Error('Failed to fetch metrics');
        }
        const dashboardData = await response.json();
        setData(dashboardData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    
    // Set up polling for live data updates every 30 seconds
    const interval = setInterval(fetchData, 30000);
    
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600">Error: {error}</p>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div className="space-y-8">
      {/* Music Production Metrics */}
      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Music Production</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MetricCard
            title="Total Releases"
            value={data.musicProduction.totalReleases}
            icon="🎵"
            trend={{ value: 2, isPositive: true }}
          />
          <MetricCard
            title="Finished Unreleased"
            value={data.musicProduction.finishedUnreleased}
            icon="✅"
            trend={{ value: 1, isPositive: true }}
          />
          <MetricCard
            title="Unfinished"
            value={data.musicProduction.unfinished}
            icon="🎧"
            trend={{ value: -1, isPositive: true }}
          />
        </div>
      </section>

      {/* Engagement Metrics */}
      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Engagement</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MetricCard
            title="Total Streamings"
            value={formatNumber(data.engagement.streamings.total)}
            subtitle="All DSPs"
            icon="🎶"
            trend={{ value: 12.5, isPositive: true }}
          />
          <MetricCard
            title="Social Media Followers"
            value={formatNumber(
              data.engagement.socialMedia.instagram +
              data.engagement.socialMedia.twitter +
              data.engagement.socialMedia.tiktok +
              data.engagement.socialMedia.facebook
            )}
            subtitle="All platforms"
            icon="📱"
            trend={{ value: 8.3, isPositive: true }}
          />
          <MetricCard
            title="YouTube Subscribers"
            value={formatNumber(data.engagement.youtubeMetrics.subscribers)}
            subtitle={`${data.engagement.youtubeMetrics.engagement}% engagement`}
            icon="📺"
            trend={{ value: 15.2, isPositive: true }}
          />
        </div>
      </section>

      {/* Fan Base Metrics */}
      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Fan Base</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MetricCard
            title="Super Fans"
            value={formatNumber(data.fanBase.superFans)}
            icon="⭐"
            trend={{ value: 5.8, isPositive: true }}
          />
          <MetricCard
            title="Fans"
            value={formatNumber(data.fanBase.fans)}
            icon="❤️"
            trend={{ value: 12.1, isPositive: true }}
          />
          <MetricCard
            title="Cold Fans"
            value={formatNumber(data.fanBase.coldFans)}
            icon="👥"
            trend={{ value: -2.3, isPositive: false }}
          />
        </div>
      </section>

      {/* Data Sources Status */}
      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Data Sources</h2>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {data.dataSources.map((source) => (
              <div key={source.id} className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${
                  source.status === 'connected' ? 'bg-green-400' :
                  source.status === 'error' ? 'bg-red-400' : 'bg-gray-400'
                }`}></div>
                <span className="font-medium">{source.name}</span>
                <span className="text-sm text-gray-500 capitalize">{source.status}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      {[...Array(3)].map((_, sectionIndex) => (
        <section key={sectionIndex}>
          <div className="h-6 bg-gray-200 rounded w-40 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, cardIndex) => (
              <div key={cardIndex} className="bg-white rounded-lg shadow p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}