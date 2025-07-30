-- Let's debug this step by step

-- STEP 1: Check what's already in the agencies table
SELECT 'Current agencies:' as step;
SELECT id, name, slug FROM agencies;

-- STEP 2: Delete any conflicting data if it exists
DELETE FROM fanbase_metrics WHERE agency_id IN ('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002');
DELETE FROM engagement_metrics WHERE agency_id IN ('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002');
DELETE FROM music_production_metrics WHERE agency_id IN ('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002');
DELETE FROM data_sources WHERE agency_id IN ('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002');
DELETE FROM releases WHERE agency_id IN ('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002');
DELETE FROM tenants WHERE agency_id IN ('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002');
DELETE FROM artists WHERE agency_id IN ('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002');
DELETE FROM agency_analytics WHERE agency_id IN ('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002');
DELETE FROM agencies WHERE id IN ('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002');

-- STEP 3: Insert agencies with explicit UUID casting and full settings
INSERT INTO agencies (id, name, slug, plan, settings, created_at, updated_at) VALUES 
(
    '550e8400-e29b-41d4-a716-446655440001'::uuid, 
    'Demo Music Agency', 
    'demo-agency', 
    'professional', 
    '{"branding": {"primaryColor": "#3B82F6"}, "features": {"maxArtists": 25}, "billing": {"status": "active"}}'::jsonb,
    NOW(),
    NOW()
);

-- STEP 4: Verify the agency was inserted
SELECT 'Agency inserted:' as step;
SELECT id, name, slug FROM agencies WHERE slug = 'demo-agency';

-- STEP 5: Now insert artists
INSERT INTO artists (id, agency_id, name, email, genres, created_at, updated_at) VALUES 
(
    '660e8400-e29b-41d4-a716-446655440001'::uuid, 
    '550e8400-e29b-41d4-a716-446655440001'::uuid, 
    'Luna Martinez', 
    'luna@demo.com', 
    ARRAY['Pop', 'Latin'],
    NOW(),
    NOW()
);

-- STEP 6: Verify the artist was inserted
SELECT 'Artist inserted:' as step;
SELECT id, name, email FROM artists WHERE email = 'luna@demo.com';

-- STEP 7: Insert tenant
INSERT INTO tenants (id, agency_id, artist_id, name, slug, created_at, updated_at) VALUES 
(
    '770e8400-e29b-41d4-a716-446655440001'::uuid,
    '550e8400-e29b-41d4-a716-446655440001'::uuid,
    '660e8400-e29b-41d4-a716-446655440001'::uuid,
    'Luna Martinez',
    'luna-martinez',
    NOW(),
    NOW()
);

-- STEP 8: Insert basic metrics (just one for testing)
INSERT INTO music_production_metrics (tenant_id, agency_id, artist_id, total_releases, finished_unreleased, unfinished, updated_at) VALUES 
(
    '770e8400-e29b-41d4-a716-446655440001'::uuid,
    '550e8400-e29b-41d4-a716-446655440001'::uuid,
    '660e8400-e29b-41d4-a716-446655440001'::uuid,
    8, 2, 3,
    NOW()
);

INSERT INTO engagement_metrics (tenant_id, agency_id, artist_id, updated_at) VALUES 
(
    '770e8400-e29b-41d4-a716-446655440001'::uuid,
    '550e8400-e29b-41d4-a716-446655440001'::uuid,
    '660e8400-e29b-41d4-a716-446655440001'::uuid,
    NOW()
);

INSERT INTO fanbase_metrics (tenant_id, agency_id, artist_id, super_fans, fans, cold_fans, total, updated_at) VALUES 
(
    '770e8400-e29b-41d4-a716-446655440001'::uuid,
    '550e8400-e29b-41d4-a716-446655440001'::uuid,
    '660e8400-e29b-41d4-a716-446655440001'::uuid,
    1500, 12000, 8500, 22000,
    NOW()
);

SELECT 'SUCCESS: Demo data created!' as final_result;