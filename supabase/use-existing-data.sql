-- Work with the existing demo-agency that's already in your database

-- STEP 1: See what's actually in your agencies table
SELECT 'Your existing agencies:' as info;
SELECT id, name, slug FROM agencies;

-- STEP 2: Use the ACTUAL agency ID that exists (not the one I made up)
-- Insert artists using the real agency ID from your database
DO $$
DECLARE
    existing_agency_id uuid;
BEGIN
    -- Get the actual UUID of the existing demo-agency
    SELECT id INTO existing_agency_id FROM agencies WHERE slug = 'demo-agency' LIMIT 1;
    
    IF existing_agency_id IS NOT NULL THEN
        -- Insert artist using the REAL agency ID
        INSERT INTO artists (id, agency_id, name, email, genres, created_at, updated_at) 
        VALUES (
            gen_random_uuid(),
            existing_agency_id,
            'Luna Martinez', 
            'luna@demo.com', 
            ARRAY['Pop', 'Latin'],
            NOW(),
            NOW()
        ) ON CONFLICT (agency_id, email) DO NOTHING;
        
        -- Get the artist ID we just created
        DECLARE artist_id_var uuid;
        BEGIN
            SELECT id INTO artist_id_var FROM artists WHERE email = 'luna@demo.com' AND agency_id = existing_agency_id;
            
            -- Create tenant for this artist
            INSERT INTO tenants (id, agency_id, artist_id, name, slug, created_at, updated_at)
            VALUES (
                gen_random_uuid(),
                existing_agency_id,
                artist_id_var,
                'Luna Martinez',
                'luna-martinez',
                NOW(),
                NOW()
            ) ON CONFLICT (agency_id, slug) DO NOTHING;
            
            -- Get tenant ID and create metrics
            DECLARE tenant_id_var uuid;
            BEGIN
                SELECT id INTO tenant_id_var FROM tenants WHERE slug = 'luna-martinez' AND agency_id = existing_agency_id;
                
                -- Create metrics
                INSERT INTO music_production_metrics (tenant_id, agency_id, artist_id, total_releases, finished_unreleased, unfinished, updated_at)
                VALUES (tenant_id_var, existing_agency_id, artist_id_var, 8, 2, 3, NOW())
                ON CONFLICT (tenant_id, artist_id) DO NOTHING;
                
                INSERT INTO engagement_metrics (tenant_id, agency_id, artist_id, updated_at)
                VALUES (tenant_id_var, existing_agency_id, artist_id_var, NOW())
                ON CONFLICT (tenant_id, artist_id) DO NOTHING;
                
                INSERT INTO fanbase_metrics (tenant_id, agency_id, artist_id, super_fans, fans, cold_fans, total, updated_at)
                VALUES (tenant_id_var, existing_agency_id, artist_id_var, 1500, 12000, 8500, 22000, NOW())
                ON CONFLICT (tenant_id, artist_id) DO NOTHING;
            END;
        END;
        
        RAISE NOTICE 'SUCCESS: Added demo artist to your existing agency!';
    ELSE
        RAISE NOTICE 'No demo-agency found in database';
    END IF;
END $$;

-- STEP 3: Verify everything worked
SELECT 'Final verification:' as info;
SELECT a.name as agency_name, ar.name as artist_name, t.slug as tenant_slug
FROM agencies a
JOIN artists ar ON ar.agency_id = a.id  
JOIN tenants t ON t.artist_id = ar.id
WHERE a.slug = 'demo-agency';