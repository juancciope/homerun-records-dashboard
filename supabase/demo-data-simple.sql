-- Simple working demo data - no complex logic, just basic inserts with conflict handling

-- First, insert agencies (these must exist before artists)
INSERT INTO agencies (id, name, slug, plan) VALUES 
('550e8400-e29b-41d4-a716-446655440001'::uuid, 'Demo Music Agency', 'demo-agency', 'professional'),
('550e8400-e29b-41d4-a716-446655440002'::uuid, 'Indie Records Co', 'indie-records', 'starter')
ON CONFLICT (slug) DO NOTHING;

-- Then insert artists (now agencies exist)
INSERT INTO artists (id, agency_id, name, email, genres) VALUES 
('660e8400-e29b-41d4-a716-446655440001'::uuid, '550e8400-e29b-41d4-a716-446655440001'::uuid, 'Luna Martinez', 'luna@demo.com', ARRAY['Pop', 'Latin']),
('660e8400-e29b-41d4-a716-446655440002'::uuid, '550e8400-e29b-41d4-a716-446655440001'::uuid, 'The Midnight Collective', 'midnight@demo.com', ARRAY['Electronic'])
ON CONFLICT (agency_id, email) DO NOTHING;

-- Then tenants
INSERT INTO tenants (id, agency_id, artist_id, name, slug) VALUES 
('770e8400-e29b-41d4-a716-446655440001'::uuid, '550e8400-e29b-41d4-a716-446655440001'::uuid, '660e8400-e29b-41d4-a716-446655440001'::uuid, 'Luna Martinez', 'luna-martinez'),
('770e8400-e29b-41d4-a716-446655440002'::uuid, '550e8400-e29b-41d4-a716-446655440001'::uuid, '660e8400-e29b-41d4-a716-446655440002'::uuid, 'The Midnight Collective', 'midnight-collective')
ON CONFLICT (agency_id, slug) DO NOTHING;

-- Finally metrics
INSERT INTO music_production_metrics (tenant_id, agency_id, artist_id, total_releases, finished_unreleased, unfinished) VALUES 
('770e8400-e29b-41d4-a716-446655440001'::uuid, '550e8400-e29b-41d4-a716-446655440001'::uuid, '660e8400-e29b-41d4-a716-446655440001'::uuid, 8, 2, 3),
('770e8400-e29b-41d4-a716-446655440002'::uuid, '550e8400-e29b-41d4-a716-446655440001'::uuid, '660e8400-e29b-41d4-a716-446655440002'::uuid, 12, 1, 2)
ON CONFLICT (tenant_id, artist_id) DO NOTHING;

INSERT INTO engagement_metrics (tenant_id, agency_id, artist_id) VALUES 
('770e8400-e29b-41d4-a716-446655440001'::uuid, '550e8400-e29b-41d4-a716-446655440001'::uuid, '660e8400-e29b-41d4-a716-446655440001'::uuid),
('770e8400-e29b-41d4-a716-446655440002'::uuid, '550e8400-e29b-41d4-a716-446655440001'::uuid, '660e8400-e29b-41d4-a716-446655440002'::uuid)
ON CONFLICT (tenant_id, artist_id) DO NOTHING;

INSERT INTO fanbase_metrics (tenant_id, agency_id, artist_id, super_fans, fans, cold_fans, total) VALUES 
('770e8400-e29b-41d4-a716-446655440001'::uuid, '550e8400-e29b-41d4-a716-446655440001'::uuid, '660e8400-e29b-41d4-a716-446655440001'::uuid, 1500, 12000, 8500, 22000),
('770e8400-e29b-41d4-a716-446655440002'::uuid, '550e8400-e29b-41d4-a716-446655440001'::uuid, '660e8400-e29b-41d4-a716-446655440002'::uuid, 2100, 15500, 6800, 24400)
ON CONFLICT (tenant_id, artist_id) DO NOTHING;

SELECT 'Demo data added successfully!' as result;