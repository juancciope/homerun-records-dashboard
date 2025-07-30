-- Home Run Records Multi-Tenant Database Schema (Fixed)
-- This schema supports agency-level multi-tenancy with artist sub-accounts

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================
-- AGENCIES (Top-level tenants)
-- =============================================
CREATE TABLE agencies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    domain TEXT UNIQUE,
    logo TEXT,
    plan TEXT CHECK (plan IN ('starter', 'professional', 'enterprise')) DEFAULT 'starter',
    settings JSONB DEFAULT '{
        "branding": {
            "primaryColor": "#3B82F6",
            "secondaryColor": "#8B5CF6"
        },
        "features": {
            "maxArtists": 5,
            "maxDataSources": 3,
            "customDomain": false,
            "whiteLabel": false,
            "apiAccess": false
        },
        "billing": {
            "status": "trialing"
        }
    }',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- USERS (Multi-role user system)
-- =============================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    avatar TEXT,
    role TEXT CHECK (role IN ('super_admin', 'agency_admin', 'agency_member', 'artist')) NOT NULL,
    agency_id UUID REFERENCES agencies(id) ON DELETE CASCADE,
    artist_id UUID, -- Will reference artists(id) after artists table is created
    permissions JSONB DEFAULT '[]',
    is_active BOOLEAN DEFAULT true,
    last_login_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- ARTISTS (Individual artist accounts)
-- =============================================
CREATE TABLE artists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agency_id UUID NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    image_url TEXT,
    bio TEXT,
    genres TEXT[] DEFAULT '{}',
    social_links JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(agency_id, email)
);

-- Add foreign key constraint for users.artist_id
ALTER TABLE users ADD CONSTRAINT fk_users_artist
    FOREIGN KEY (artist_id) REFERENCES artists(id) ON DELETE SET NULL;

-- =============================================
-- TENANTS (Artist-specific configurations)
-- =============================================
CREATE TABLE tenants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agency_id UUID NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
    artist_id UUID NOT NULL REFERENCES artists(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    settings JSONB DEFAULT '{
        "dashboard": {
            "theme": "light",
            "layout": "detailed",
            "defaultView": "overview"
        },
        "notifications": {
            "email": true,
            "sms": false,
            "thresholds": {
                "streamingGrowth": 10,
                "fanbaseGrowth": 5,
                "engagementDrop": -15
            }
        },
        "integrations": {
            "spotify": false,
            "appleMusic": false,
            "youtube": false,
            "instagram": false,
            "tiktok": false,
            "twitter": false
        }
    }',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(agency_id, slug)
);

-- =============================================
-- METRICS TABLES
-- =============================================

-- Music Production Metrics
CREATE TABLE music_production_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    agency_id UUID NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
    artist_id UUID NOT NULL REFERENCES artists(id) ON DELETE CASCADE,
    total_releases INTEGER DEFAULT 0,
    finished_unreleased INTEGER DEFAULT 0,
    unfinished INTEGER DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(tenant_id, artist_id)
);

-- Engagement Metrics
CREATE TABLE engagement_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    agency_id UUID NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
    artist_id UUID NOT NULL REFERENCES artists(id) ON DELETE CASCADE,
    streamings JSONB DEFAULT '{
        "spotify": 0,
        "appleMusic": 0,
        "youtube": 0,
        "total": 0
    }',
    social_media JSONB DEFAULT '{
        "instagram": 0,
        "twitter": 0,
        "tiktok": 0,
        "facebook": 0
    }',
    youtube_metrics JSONB DEFAULT '{
        "subscribers": 0,
        "views": 0,
        "engagement": 0
    }',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(tenant_id, artist_id)
);

-- Fan Base Metrics
CREATE TABLE fanbase_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    agency_id UUID NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
    artist_id UUID NOT NULL REFERENCES artists(id) ON DELETE CASCADE,
    super_fans INTEGER DEFAULT 0,
    fans INTEGER DEFAULT 0,
    cold_fans INTEGER DEFAULT 0,
    total INTEGER DEFAULT 0,
    growth JSONB DEFAULT '{
        "daily": 0,
        "weekly": 0,
        "monthly": 0
    }',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(tenant_id, artist_id)
);

-- =============================================
-- RELEASES
-- =============================================
CREATE TABLE releases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    agency_id UUID NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
    artist_id UUID NOT NULL REFERENCES artists(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    type TEXT CHECK (type IN ('single', 'ep', 'album')) NOT NULL,
    status TEXT CHECK (status IN ('finished', 'unfinished', 'released')) NOT NULL,
    release_date DATE,
    platforms TEXT[] DEFAULT '{}',
    artwork TEXT,
    tracks JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- DATA SOURCES
-- =============================================
CREATE TABLE data_sources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    agency_id UUID NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
    artist_id UUID NOT NULL REFERENCES artists(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT CHECK (type IN ('spotify', 'apple_music', 'youtube', 'instagram', 'twitter', 'tiktok', 'facebook', 'custom')) NOT NULL,
    status TEXT CHECK (status IN ('connected', 'disconnected', 'error')) DEFAULT 'disconnected',
    last_sync TIMESTAMP WITH TIME ZONE,
    config JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- AGENCY ANALYTICS (Aggregated data for agencies)
-- =============================================
CREATE TABLE agency_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agency_id UUID NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
    period TEXT CHECK (period IN ('day', 'week', 'month', 'year')) NOT NULL,
    total_artists INTEGER DEFAULT 0,
    active_artists INTEGER DEFAULT 0,
    total_streams BIGINT DEFAULT 0,
    total_fans BIGINT DEFAULT 0,
    top_performing_artists JSONB DEFAULT '[]',
    revenue_metrics JSONB DEFAULT '{}',
    date_key DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(agency_id, period, date_key)
);

-- =============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================

-- Enable RLS on all tables
ALTER TABLE agencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE artists ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE music_production_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE engagement_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE fanbase_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE releases ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE agency_analytics ENABLE ROW LEVEL SECURITY;

-- Agencies policies
CREATE POLICY "Super admins can see all agencies" ON agencies
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'super_admin'
        )
    );

CREATE POLICY "Agency users can see their own agency" ON agencies
    FOR SELECT USING (
        id IN (
            SELECT agency_id FROM users 
            WHERE users.id = auth.uid()
        )
    );

-- Artists policies
CREATE POLICY "Users can see artists from their agency" ON artists
    FOR SELECT USING (
        agency_id IN (
            SELECT agency_id FROM users 
            WHERE users.id = auth.uid()
        )
    );

CREATE POLICY "Artist users can only see their own data" ON artists
    FOR SELECT USING (
        id IN (
            SELECT artist_id FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'artist'
        )
    );

-- Tenants policies
CREATE POLICY "Users can see tenants from their agency" ON tenants
    FOR SELECT USING (
        agency_id IN (
            SELECT agency_id FROM users 
            WHERE users.id = auth.uid()
        )
    );

-- Metrics policies (similar pattern for all metrics tables)
CREATE POLICY "Users can see metrics from their agency" ON music_production_metrics
    FOR SELECT USING (
        agency_id IN (
            SELECT agency_id FROM users 
            WHERE users.id = auth.uid()
        )
    );

CREATE POLICY "Users can see engagement metrics from their agency" ON engagement_metrics
    FOR SELECT USING (
        agency_id IN (
            SELECT agency_id FROM users 
            WHERE users.id = auth.uid()
        )
    );

CREATE POLICY "Users can see fanbase metrics from their agency" ON fanbase_metrics
    FOR SELECT USING (
        agency_id IN (
            SELECT agency_id FROM users 
            WHERE users.id = auth.uid()
        )
    );

-- Releases policies
CREATE POLICY "Users can see releases from their agency" ON releases
    FOR SELECT USING (
        agency_id IN (
            SELECT agency_id FROM users 
            WHERE users.id = auth.uid()
        )
    );

-- Data sources policies
CREATE POLICY "Users can see data sources from their agency" ON data_sources
    FOR SELECT USING (
        agency_id IN (
            SELECT agency_id FROM users 
            WHERE users.id = auth.uid()
        )
    );

-- Agency analytics policies
CREATE POLICY "Users can see analytics from their agency" ON agency_analytics
    FOR SELECT USING (
        agency_id IN (
            SELECT agency_id FROM users 
            WHERE users.id = auth.uid()
        )
    );

-- =============================================
-- UPDATE TRIGGERS
-- =============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add update triggers to all tables
CREATE TRIGGER update_agencies_updated_at BEFORE UPDATE ON agencies FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_artists_updated_at BEFORE UPDATE ON artists FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_tenants_updated_at BEFORE UPDATE ON tenants FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_releases_updated_at BEFORE UPDATE ON releases FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_data_sources_updated_at BEFORE UPDATE ON data_sources FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================
CREATE INDEX idx_users_agency_id ON users(agency_id);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_artists_agency_id ON artists(agency_id);
CREATE INDEX idx_tenants_agency_id ON tenants(agency_id);
CREATE INDEX idx_tenants_artist_id ON tenants(artist_id);
CREATE INDEX idx_metrics_tenant_id ON music_production_metrics(tenant_id);
CREATE INDEX idx_metrics_agency_id ON music_production_metrics(agency_id);
CREATE INDEX idx_engagement_tenant_id ON engagement_metrics(tenant_id);
CREATE INDEX idx_fanbase_tenant_id ON fanbase_metrics(tenant_id);
CREATE INDEX idx_releases_tenant_id ON releases(tenant_id);
CREATE INDEX idx_data_sources_tenant_id ON data_sources(tenant_id);
CREATE INDEX idx_agency_analytics_agency_id ON agency_analytics(agency_id);

-- =============================================
-- SAMPLE DATA (Optional - for testing)
-- =============================================

-- Insert sample super admin
INSERT INTO users (email, first_name, last_name, role) VALUES
('admin@homerunrecords.com', 'Super', 'Admin', 'super_admin');

-- Insert sample agency
INSERT INTO agencies (name, slug) VALUES
('Demo Agency', 'demo-agency');