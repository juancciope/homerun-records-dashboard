import { NextRequest, NextResponse } from 'next/server';
import { DashboardData } from '@/lib/types';

// Mock data for demonstration
const generateMockMetrics = (artistId: string): DashboardData => {
  const now = new Date();
  
  return {
    artist: {
      id: artistId,
      name: 'Sample Artist',
      email: 'artist@example.com',
      imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=150&h=150&fit=crop&crop=face',
      createdAt: new Date('2024-01-01'),
      updatedAt: now,
    },
    musicProduction: {
      artistId,
      totalReleases: 12,
      finishedUnreleased: 3,
      unfinished: 5,
      updatedAt: now,
    },
    engagement: {
      artistId,
      streamings: {
        spotify: 125000,
        appleMusic: 45000,
        youtube: 89000,
        total: 259000,
      },
      socialMedia: {
        instagram: 15000,
        twitter: 8500,
        tiktok: 25000,
        facebook: 5000,
      },
      youtubeMetrics: {
        subscribers: 12000,
        views: 450000,
        engagement: 8.5,
      },
      updatedAt: now,
    },
    fanBase: {
      artistId,
      superFans: 1200,
      fans: 8500,
      coldFans: 15000,
      total: 24700,
      growth: {
        daily: 45,
        weekly: 320,
        monthly: 1200,
      },
      updatedAt: now,
    },
    recentReleases: [
      {
        id: '1',
        artistId,
        title: 'Latest Single',
        type: 'single',
        status: 'released',
        releaseDate: new Date('2024-01-15'),
        platforms: ['spotify', 'apple_music', 'youtube'],
        createdAt: new Date('2024-01-01'),
        updatedAt: now,
      },
      {
        id: '2',
        artistId,
        title: 'Upcoming EP',
        type: 'ep',
        status: 'finished',
        releaseDate: new Date('2024-02-01'),
        platforms: ['spotify', 'apple_music'],
        createdAt: new Date('2024-01-10'),
        updatedAt: now,
      },
    ],
    dataSources: [
      {
        id: '1',
        name: 'Spotify',
        type: 'spotify',
        status: 'connected',
        lastSync: new Date(Date.now() - 300000), // 5 minutes ago
      },
      {
        id: '2',
        name: 'YouTube',
        type: 'youtube',
        status: 'connected',
        lastSync: new Date(Date.now() - 600000), // 10 minutes ago
      },
      {
        id: '3',
        name: 'Instagram',
        type: 'instagram',
        status: 'error',
        lastSync: new Date(Date.now() - 3600000), // 1 hour ago
      },
    ],
  };
};

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ artistId: string }> }
) {
  try {
    const { artistId } = await params;
    
    // In a real implementation, this would fetch from your database
    const dashboardData = generateMockMetrics(artistId);
    
    return NextResponse.json(dashboardData);
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch metrics' },
      { status: 500 }
    );
  }
}