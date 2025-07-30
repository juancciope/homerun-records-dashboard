import { Artist, MusicProductionMetrics, EngagementMetrics, FanBaseMetrics, Release, DataSource } from '@/lib/types';

export interface DatabaseConnector {
  // Artist operations
  getArtist(id: string): Promise<Artist | null>;
  getArtists(): Promise<Artist[]>;
  createArtist(artist: Omit<Artist, 'id' | 'createdAt' | 'updatedAt'>): Promise<Artist>;
  updateArtist(id: string, artist: Partial<Artist>): Promise<Artist>;
  deleteArtist(id: string): Promise<void>;

  // Metrics operations
  getMusicProductionMetrics(artistId: string): Promise<MusicProductionMetrics | null>;
  updateMusicProductionMetrics(artistId: string, metrics: Partial<MusicProductionMetrics>): Promise<MusicProductionMetrics>;
  
  getEngagementMetrics(artistId: string): Promise<EngagementMetrics | null>;
  updateEngagementMetrics(artistId: string, metrics: Partial<EngagementMetrics>): Promise<EngagementMetrics>;
  
  getFanBaseMetrics(artistId: string): Promise<FanBaseMetrics | null>;
  updateFanBaseMetrics(artistId: string, metrics: Partial<FanBaseMetrics>): Promise<FanBaseMetrics>;

  // Release operations
  getReleases(artistId: string): Promise<Release[]>;
  getRelease(id: string): Promise<Release | null>;
  createRelease(release: Omit<Release, 'id' | 'createdAt' | 'updatedAt'>): Promise<Release>;
  updateRelease(id: string, release: Partial<Release>): Promise<Release>;
  deleteRelease(id: string): Promise<void>;

  // Data source operations
  getDataSources(artistId: string): Promise<DataSource[]>;
  updateDataSource(id: string, dataSource: Partial<DataSource>): Promise<DataSource>;
  createDataSource(dataSource: Omit<DataSource, 'id'>): Promise<DataSource>;
  deleteDataSource(id: string): Promise<void>;
}