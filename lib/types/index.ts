export interface Artist {
  id: string;
  name: string;
  email: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MusicProductionMetrics {
  artistId: string;
  totalReleases: number;
  finishedUnreleased: number;
  unfinished: number;
  updatedAt: Date;
}

export interface EngagementMetrics {
  artistId: string;
  streamings: {
    spotify: number;
    appleMusic: number;
    youtube: number;
    total: number;
  };
  socialMedia: {
    instagram: number;
    twitter: number;
    tiktok: number;
    facebook: number;
  };
  youtubeMetrics: {
    subscribers: number;
    views: number;
    engagement: number;
  };
  updatedAt: Date;
}

export interface FanBaseMetrics {
  artistId: string;
  superFans: number;
  fans: number;
  coldFans: number;
  total: number;
  growth: {
    daily: number;
    weekly: number;
    monthly: number;
  };
  updatedAt: Date;
}

export interface DataSource {
  id: string;
  name: string;
  type: 'spotify' | 'apple_music' | 'youtube' | 'instagram' | 'twitter' | 'tiktok' | 'facebook' | 'custom';
  status: 'connected' | 'disconnected' | 'error';
  lastSync?: Date;
  config?: Record<string, unknown>;
}

export interface Release {
  id: string;
  artistId: string;
  title: string;
  type: 'single' | 'ep' | 'album';
  status: 'finished' | 'unfinished' | 'released';
  releaseDate?: Date;
  platforms?: string[];
  artwork?: string;
  tracks?: Track[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Track {
  id: string;
  title: string;
  duration: number;
  isrc?: string;
  status: 'demo' | 'finished' | 'mastered' | 'released';
}

export interface DashboardData {
  artist: Artist;
  musicProduction: MusicProductionMetrics;
  engagement: EngagementMetrics;
  fanBase: FanBaseMetrics;
  recentReleases: Release[];
  dataSources: DataSource[];
}