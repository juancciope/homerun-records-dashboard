-- Demo data for Home Run Records
-- Run this after the main schema is created

-- First, let's create some demo agencies
INSERT INTO agencies (id, name, slug, plan, settings) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Demo Music Agency', 'demo-agency', 'professional', '{
    "branding": {
        "primaryColor": "#3B82F6",
        "secondaryColor": "#8B5CF6"
    },
    "features": {
        "maxArtists": 25,
        "maxDataSources": 10,
        "customDomain": true,
        "whiteLabel": false,
        "apiAccess": true
    },
    "billing": {
        "status": "active"
    }
}'),
('550e8400-e29b-41d4-a716-446655440002', 'Indie Records Co', 'indie-records', 'starter', '{
    "branding": {
        "primaryColor": "#10B981",
        "secondaryColor": "#F59E0B"
    },
    "features": {
        "maxArtists": 5,
        "maxDataSources": 3,
        "customDomain": false,
        "whiteLabel": false,
        "apiAccess": false
    },
    "billing": {
        "status": "active"
    }
}');

-- Create demo artists
INSERT INTO artists (id, agency_id, name, email, phone, bio, genres, social_links) VALUES
('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'Luna Martinez', 'luna@demo.com', '+1-555-0101', 'Rising pop star with Latin influences', ARRAY['Pop', 'Latin', 'R&B'], '{
    "spotify": "https://open.spotify.com/artist/luna",
    "instagram": "https://instagram.com/lunamartinez",
    "youtube": "https://youtube.com/lunamartinez"
}'),
('660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 'The Midnight Collective', 'midnight@demo.com', '+1-555-0102', 'Electronic duo creating atmospheric soundscapes', ARRAY['Electronic', 'Ambient', 'Synthwave'], '{
    "spotify": "https://open.spotify.com/artist/midnight",
    "instagram": "https://instagram.com/midnightcollective"
}'),
('660e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', 'Jake Rivers', 'jake@indie.com', '+1-555-0103', 'Singer-songwriter with folk rock influences', ARRAY['Folk', 'Rock', 'Indie'], '{
    "spotify": "https://open.spotify.com/artist/jake",
    "youtube": "https://youtube.com/jakerivers"
}');

-- Create tenants for each artist
INSERT INTO tenants (id, agency_id, artist_id, name, slug) VALUES
('770e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', 'Luna Martinez', 'luna-martinez'),
('770e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440002', 'The Midnight Collective', 'midnight-collective'),
('770e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440003', 'Jake Rivers', 'jake-rivers');

-- Add demo metrics for each artist
INSERT INTO music_production_metrics (tenant_id, agency_id, artist_id, total_releases, finished_unreleased, unfinished) VALUES
('770e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', 8, 2, 3),
('770e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440002', 12, 1, 2),
('770e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440003', 5, 3, 4);

INSERT INTO engagement_metrics (tenant_id, agency_id, artist_id, streamings, social_media, youtube_metrics) VALUES
('770e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', '{
    "spotify": 125000,
    "appleMusic": 45000,
    "youtube": 89000,
    "total": 259000
}', '{
    "instagram": 25000,
    "twitter": 8500,
    "tiktok": 45000,
    "facebook": 3200
}', '{
    "subscribers": 18000,
    "views": 450000,
    "engagement": 12.5
}'),
('770e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440002', '{
    "spotify": 89000,
    "appleMusic": 32000,
    "youtube": 156000,
    "total": 277000
}', '{
    "instagram": 15000,
    "twitter": 12000,
    "tiktok": 8500,
    "facebook": 2100
}', '{
    "subscribers": 25000,
    "views": 680000,
    "engagement": 15.2
}'),
('770e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440003', '{
    "spotify": 34000,
    "appleMusic": 12000,
    "youtube": 28000,
    "total": 74000
}', '{
    "instagram": 8500,
    "twitter": 4200,
    "tiktok": 2800,
    "facebook": 1500
}', '{
    "subscribers": 7500,
    "views": 125000,
    "engagement": 9.8
}');

INSERT INTO fanbase_metrics (tenant_id, agency_id, artist_id, super_fans, fans, cold_fans, total, growth) VALUES
('770e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', 1500, 12000, 8500, 22000, '{
    "daily": 45,
    "weekly": 320,
    "monthly": 1200
}'),
('770e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440002', 2100, 15500, 6800, 24400, '{
    "daily": 62,
    "weekly": 450,
    "monthly": 1800
}'),
('770e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440003', 450, 3200, 2100, 5750, '{
    "daily": 12,
    "weekly": 85,
    "monthly": 340
}');

-- Add some demo releases
INSERT INTO releases (tenant_id, agency_id, artist_id, title, type, status, release_date, platforms) VALUES
('770e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', 'Midnight Dreams', 'single', 'released', '2024-01-15', ARRAY['spotify', 'apple_music', 'youtube']),
('770e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', 'Summer Vibes EP', 'ep', 'finished', '2024-03-01', ARRAY['spotify', 'apple_music']),
('770e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440002', 'Neon Nights', 'album', 'released', '2023-11-20', ARRAY['spotify', 'apple_music', 'youtube']),
('770e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440003', 'Country Roads', 'single', 'unfinished', NULL, ARRAY[]);

-- Add data sources
INSERT INTO data_sources (tenant_id, agency_id, artist_id, name, type, status, last_sync) VALUES
('770e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', 'Spotify', 'spotify', 'connected', NOW() - INTERVAL '5 minutes'),
('770e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', 'Instagram', 'instagram', 'connected', NOW() - INTERVAL '10 minutes'),
('770e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', 'YouTube', 'youtube', 'error', NOW() - INTERVAL '2 hours'),
('770e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440002', 'Spotify', 'spotify', 'connected', NOW() - INTERVAL '3 minutes'),
('770e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440002', 'YouTube', 'youtube', 'connected', NOW() - INTERVAL '8 minutes');

-- Add agency analytics
INSERT INTO agency_analytics (agency_id, period, total_artists, active_artists, total_streams, total_fans, top_performing_artists, date_key) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'month', 2, 2, 536000, 46400, '[
    {"artistId": "660e8400-e29b-41d4-a716-446655440002", "artistName": "The Midnight Collective", "streams": 277000, "growth": 18.5},
    {"artistId": "660e8400-e29b-41d4-a716-446655440001", "artistName": "Luna Martinez", "streams": 259000, "growth": 12.3}
]', CURRENT_DATE),
('550e8400-e29b-41d4-a716-446655440002', 'month', 1, 1, 74000, 5750, '[
    {"artistId": "660e8400-e29b-41d4-a716-446655440003", "artistName": "Jake Rivers", "streams": 74000, "growth": 8.2}
]', CURRENT_DATE);

-- Note: You'll need to manually create users in Supabase Auth dashboard
-- Then run these INSERT statements to link them to agencies:

-- Example users to create in Supabase Auth:
-- 1. admin@homerunrecords.com (Super Admin)
-- 2. demo@demo-agency.com (Agency Admin for Demo Music Agency)  
-- 3. indie@indie-records.com (Agency Admin for Indie Records Co)

-- After creating the auth users, you can run these to link them:
/*
-- Replace the UUIDs with the actual user IDs from Supabase Auth
INSERT INTO users (id, email, first_name, last_name, role, agency_id) VALUES
('auth-user-id-1', 'admin@homerunrecords.com', 'Super', 'Admin', 'super_admin', NULL),
('auth-user-id-2', 'demo@demo-agency.com', 'Demo', 'User', 'agency_admin', '550e8400-e29b-41d4-a716-446655440001'),
('auth-user-id-3', 'indie@indie-records.com', 'Indie', 'Manager', 'agency_admin', '550e8400-e29b-41d4-a716-446655440002');
*/