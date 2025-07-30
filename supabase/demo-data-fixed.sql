-- Fixed Demo data for Home Run Records with proper UUID casting
-- This script checks for existing data before inserting

-- Insert demo agencies only if they don't exist
INSERT INTO agencies (id, name, slug, plan, settings) 
SELECT v.id::uuid, v.name, v.slug, v.plan::text, v.settings::jsonb
FROM (
    VALUES 
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
    }')
) AS v(id, name, slug, plan, settings)
WHERE NOT EXISTS (
    SELECT 1 FROM agencies WHERE agencies.slug = v.slug
);

-- Insert demo artists only if they don't exist
INSERT INTO artists (id, agency_id, name, email, phone, bio, genres, social_links) 
SELECT v.id::uuid, v.agency_id::uuid, v.name, v.email, v.phone, v.bio, string_to_array(v.genres, ','), v.social_links::jsonb
FROM (
    VALUES 
    ('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'Luna Martinez', 'luna@demo.com', '+1-555-0101', 'Rising pop star with Latin influences', 'Pop,Latin,R&B', '{
        "spotify": "https://open.spotify.com/artist/luna",
        "instagram": "https://instagram.com/lunamartinez",
        "youtube": "https://youtube.com/lunamartinez"
    }'),
    ('660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 'The Midnight Collective', 'midnight@demo.com', '+1-555-0102', 'Electronic duo creating atmospheric soundscapes', 'Electronic,Ambient,Synthwave', '{
        "spotify": "https://open.spotify.com/artist/midnight",
        "instagram": "https://instagram.com/midnightcollective"
    }'),
    ('660e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', 'Jake Rivers', 'jake@indie.com', '+1-555-0103', 'Singer-songwriter with folk rock influences', 'Folk,Rock,Indie', '{
        "spotify": "https://open.spotify.com/artist/jake",
        "youtube": "https://youtube.com/jakerivers"
    }')
) AS v(id, agency_id, name, email, phone, bio, genres, social_links)
WHERE NOT EXISTS (
    SELECT 1 FROM artists WHERE artists.email = v.email
);

-- Insert tenants only if they don't exist
INSERT INTO tenants (id, agency_id, artist_id, name, slug) 
SELECT v.id::uuid, v.agency_id::uuid, v.artist_id::uuid, v.name, v.slug
FROM (
    VALUES 
    ('770e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', 'Luna Martinez', 'luna-martinez'),
    ('770e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440002', 'The Midnight Collective', 'midnight-collective'),
    ('770e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440003', 'Jake Rivers', 'jake-rivers')
) AS v(id, agency_id, artist_id, name, slug)
WHERE NOT EXISTS (
    SELECT 1 FROM tenants WHERE tenants.slug = v.slug
);

-- Insert music production metrics only if they don't exist
INSERT INTO music_production_metrics (tenant_id, agency_id, artist_id, total_releases, finished_unreleased, unfinished) 
SELECT v.tenant_id::uuid, v.agency_id::uuid, v.artist_id::uuid, v.total_releases::integer, v.finished_unreleased::integer, v.unfinished::integer
FROM (
    VALUES 
    ('770e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', '8', '2', '3'),
    ('770e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440002', '12', '1', '2'),
    ('770e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440003', '5', '3', '4')
) AS v(tenant_id, agency_id, artist_id, total_releases, finished_unreleased, unfinished)
WHERE NOT EXISTS (
    SELECT 1 FROM music_production_metrics WHERE music_production_metrics.tenant_id = v.tenant_id::uuid
);

-- Insert engagement metrics only if they don't exist
INSERT INTO engagement_metrics (tenant_id, agency_id, artist_id, streamings, social_media, youtube_metrics) 
SELECT v.tenant_id::uuid, v.agency_id::uuid, v.artist_id::uuid, v.streamings::jsonb, v.social_media::jsonb, v.youtube_metrics::jsonb
FROM (
    VALUES 
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
    }')
) AS v(tenant_id, agency_id, artist_id, streamings, social_media, youtube_metrics)
WHERE NOT EXISTS (
    SELECT 1 FROM engagement_metrics WHERE engagement_metrics.tenant_id = v.tenant_id::uuid
);

-- Insert fanbase metrics only if they don't exist
INSERT INTO fanbase_metrics (tenant_id, agency_id, artist_id, super_fans, fans, cold_fans, total, growth) 
SELECT v.tenant_id::uuid, v.agency_id::uuid, v.artist_id::uuid, v.super_fans::integer, v.fans::integer, v.cold_fans::integer, v.total::integer, v.growth::jsonb
FROM (
    VALUES 
    ('770e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', '1500', '12000', '8500', '22000', '{
        "daily": 45,
        "weekly": 320,
        "monthly": 1200
    }'),
    ('770e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440002', '2100', '15500', '6800', '24400', '{
        "daily": 62,
        "weekly": 450,
        "monthly": 1800
    }'),
    ('770e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440003', '450', '3200', '2100', '5750', '{
        "daily": 12,
        "weekly": 85,
        "monthly": 340
    }')
) AS v(tenant_id, agency_id, artist_id, super_fans, fans, cold_fans, total, growth)
WHERE NOT EXISTS (
    SELECT 1 FROM fanbase_metrics WHERE fanbase_metrics.tenant_id = v.tenant_id::uuid
);

-- Insert releases only if they don't exist
INSERT INTO releases (tenant_id, agency_id, artist_id, title, type, status, release_date, platforms) 
SELECT v.tenant_id::uuid, v.agency_id::uuid, v.artist_id::uuid, v.title, v.type::text, v.status::text, v.release_date::date, string_to_array(v.platforms, ',')
FROM (
    VALUES 
    ('770e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', 'Midnight Dreams', 'single', 'released', '2024-01-15', 'spotify,apple_music,youtube'),
    ('770e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', 'Summer Vibes EP', 'ep', 'finished', '2024-03-01', 'spotify,apple_music'),
    ('770e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440002', 'Neon Nights', 'album', 'released', '2023-11-20', 'spotify,apple_music,youtube'),
    ('770e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440003', 'Country Roads', 'single', 'unfinished', NULL, '')
) AS v(tenant_id, agency_id, artist_id, title, type, status, release_date, platforms)
WHERE NOT EXISTS (
    SELECT 1 FROM releases WHERE releases.tenant_id = v.tenant_id::uuid AND releases.title = v.title
);

-- Insert data sources only if they don't exist
INSERT INTO data_sources (tenant_id, agency_id, artist_id, name, type, status, last_sync) 
SELECT v.tenant_id::uuid, v.agency_id::uuid, v.artist_id::uuid, v.name, v.type::text, v.status::text, (NOW() - (v.minutes_ago || ' minutes')::interval)
FROM (
    VALUES 
    ('770e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', 'Spotify', 'spotify', 'connected', '5'),
    ('770e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', 'Instagram', 'instagram', 'connected', '10'),
    ('770e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', 'YouTube', 'youtube', 'error', '120'),
    ('770e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440002', 'Spotify', 'spotify', 'connected', '3'),
    ('770e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440002', 'YouTube', 'youtube', 'connected', '8')
) AS v(tenant_id, agency_id, artist_id, name, type, status, minutes_ago)
WHERE NOT EXISTS (
    SELECT 1 FROM data_sources WHERE data_sources.tenant_id = v.tenant_id::uuid AND data_sources.type = v.type::text
);

-- Insert agency analytics only if it doesn't exist for today
INSERT INTO agency_analytics (agency_id, period, total_artists, active_artists, total_streams, total_fans, top_performing_artists, date_key) 
SELECT v.agency_id::uuid, v.period::text, v.total_artists::integer, v.active_artists::integer, v.total_streams::bigint, v.total_fans::bigint, v.top_performing_artists::jsonb, CURRENT_DATE
FROM (
    VALUES 
    ('550e8400-e29b-41d4-a716-446655440001', 'month', '2', '2', '536000', '46400', '[
        {"artistId": "660e8400-e29b-41d4-a716-446655440002", "artistName": "The Midnight Collective", "streams": 277000, "growth": 18.5},
        {"artistId": "660e8400-e29b-41d4-a716-446655440001", "artistName": "Luna Martinez", "streams": 259000, "growth": 12.3}
    ]'),
    ('550e8400-e29b-41d4-a716-446655440002', 'month', '1', '1', '74000', '5750', '[
        {"artistId": "660e8400-e29b-41d4-a716-446655440003", "artistName": "Jake Rivers", "streams": 74000, "growth": 8.2}
    ]')
) AS v(agency_id, period, total_artists, active_artists, total_streams, total_fans, top_performing_artists)
WHERE NOT EXISTS (
    SELECT 1 FROM agency_analytics WHERE agency_analytics.agency_id = v.agency_id::uuid AND agency_analytics.period = v.period::text AND agency_analytics.date_key = CURRENT_DATE
);

-- Success message
SELECT 'Demo data successfully added with proper UUID casting!' as message;