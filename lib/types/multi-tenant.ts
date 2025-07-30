// Multi-tenant architecture types for Home Run Records
import type { Release, DataSource } from './index';

export interface Agency {
  id: string;
  name: string;
  slug: string; // URL-friendly identifier
  domain?: string; // Custom domain support
  logo?: string;
  plan: 'starter' | 'professional' | 'enterprise';
  settings: {
    branding: {
      primaryColor: string;
      secondaryColor: string;
      logo?: string;
      favicon?: string;
    };
    features: {
      maxArtists: number;
      maxDataSources: number;
      customDomain: boolean;
      whiteLabel: boolean;
      apiAccess: boolean;
    };
    billing: {
      subscriptionId?: string;
      status: 'active' | 'canceled' | 'past_due' | 'trialing';
      currentPeriodEnd?: Date;
    };
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  role: 'super_admin' | 'agency_admin' | 'agency_member' | 'artist';
  agencyId?: string; // null for super_admins
  artistId?: string; // only for artist users
  permissions: Permission[];
  isActive: boolean;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Permission {
  resource: 'artists' | 'metrics' | 'data_sources' | 'users' | 'billing' | 'settings';
  actions: ('create' | 'read' | 'update' | 'delete')[];
}

export interface Tenant {
  id: string;
  agencyId: string;
  artistId: string;
  name: string; // Artist stage name
  slug: string; // URL-friendly identifier
  settings: {
    dashboard: {
      theme: 'light' | 'dark';
      layout: 'compact' | 'detailed';
      defaultView: 'overview' | 'production' | 'engagement' | 'fanbase';
    };
    notifications: {
      email: boolean;
      sms: boolean;
      webhook?: string;
      thresholds: {
        streamingGrowth: number;
        fanbaseGrowth: number;
        engagementDrop: number;
      };
    };
    integrations: {
      spotify: boolean;
      appleMusic: boolean;
      youtube: boolean;
      instagram: boolean;
      tiktok: boolean;
      twitter: boolean;
    };
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Updated Artist interface for multi-tenancy
export interface MultiTenantArtist {
  id: string;
  tenantId: string;
  agencyId: string;
  name: string;
  email: string;
  phone?: string;
  imageUrl?: string;
  bio?: string;
  genres: string[];
  socialLinks: {
    spotify?: string;
    appleMusic?: string;
    youtube?: string;
    instagram?: string;
    tiktok?: string;
    twitter?: string;
    website?: string;
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Updated metrics interfaces for multi-tenancy
export interface MultiTenantMusicProductionMetrics {
  id: string;
  tenantId: string;
  agencyId: string;
  artistId: string;
  totalReleases: number;
  finishedUnreleased: number;
  unfinished: number;
  updatedAt: Date;
}

export interface MultiTenantEngagementMetrics {
  id: string;
  tenantId: string;
  agencyId: string;
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

export interface MultiTenantFanBaseMetrics {
  id: string;
  tenantId: string;
  agencyId: string;
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

// Analytics and reporting
export interface AgencyAnalytics {
  agencyId: string;
  period: 'day' | 'week' | 'month' | 'year';
  totalArtists: number;
  activeArtists: number;
  totalStreams: number;
  totalFans: number;
  topPerformingArtists: {
    artistId: string;
    artistName: string;
    streams: number;
    growth: number;
  }[];
  revenueMetrics?: {
    totalRevenue: number;
    averageRevenuePerArtist: number;
    growthRate: number;
  };
  createdAt: Date;
}

// Multi-tenant dashboard data
export interface MultiTenantDashboardData {
  tenant: Tenant;
  artist: MultiTenantArtist;
  musicProduction: MultiTenantMusicProductionMetrics;
  engagement: MultiTenantEngagementMetrics;
  fanBase: MultiTenantFanBaseMetrics;
  recentReleases: Release[];
  dataSources: DataSource[];
}

