# Home Run Records - Multi-Tenant Architecture

## 🏗️ Architecture Overview

This application follows a **B2B SaaS multi-tenant architecture** similar to GoHighLevel, where:

- **Home Run Records** is the platform operator
- **Agencies** are the primary tenants (customers)
- **Artists** are sub-accounts within each agency
- **Users** have different roles with specific permissions

## 🗄️ Database Choice: Supabase

**Why Supabase over MongoDB:**
- ✅ **Row Level Security (RLS)**: Perfect for multi-tenant data isolation
- ✅ **Real-time subscriptions**: Live dashboard updates
- ✅ **Built-in authentication**: User management with role-based access
- ✅ **PostgreSQL**: ACID compliance, complex queries, JSON support
- ✅ **Edge Functions**: Serverless data processing
- ✅ **Storage**: File uploads for artist assets
- ✅ **Admin Dashboard**: Visual database management

## 🎭 User Roles & Permissions

### 1. Super Admin (Home Run Records)
- **Access**: All agencies and data
- **Permissions**: Create/manage agencies, billing, platform settings
- **Use Cases**: Platform management, support, analytics

### 2. Agency Admin
- **Access**: Their agency and all artists within it
- **Permissions**: Create/manage artists, agency settings, billing
- **Use Cases**: Agency owners, managers

### 3. Agency Member
- **Access**: Their agency and assigned artists
- **Permissions**: View/edit assigned artist data
- **Use Cases**: Agency employees, consultants

### 4. Artist
- **Access**: Only their own dashboard and data
- **Permissions**: View personal metrics, update profile
- **Use Cases**: Individual artists using the platform

## 🏢 Multi-Tenant Data Structure

```
Home Run Records (Platform)
├── Agency A (Tenant 1)
│   ├── Artist 1 (Sub-account)
│   ├── Artist 2 (Sub-account)
│   └── Artist 3 (Sub-account)
├── Agency B (Tenant 2)
│   ├── Artist 4 (Sub-account)
│   └── Artist 5 (Sub-account)
└── Agency C (Tenant 3)
    └── Artist 6 (Sub-account)
```

## 🔗 URL Structure

```
/admin                              # Super admin dashboard
/agency/[agencySlug]                # Agency dashboard
/agency/[agencySlug]/artist/[artistSlug]  # Artist dashboard
/agency/[agencySlug]/settings       # Agency settings
/agency/[agencySlug]/billing        # Agency billing
```

## 🛡️ Security & Data Isolation

### Row Level Security (RLS) Policies
- Users can only access data from their agency
- Artists can only see their own data
- Super admins have access to all data
- Policies enforce tenant isolation at the database level

### Middleware Protection
- Authentication required for all protected routes
- Tenant context validation
- Role-based route access control
- API endpoint protection

## 📊 Database Schema

### Core Tables
- `agencies` - Top-level tenants
- `users` - Multi-role user system
- `artists` - Individual artist accounts
- `tenants` - Artist-specific configurations

### Metrics Tables
- `music_production_metrics`
- `engagement_metrics`
- `fanbase_metrics`
- `releases`
- `data_sources`

### Analytics
- `agency_analytics` - Aggregated agency performance data

## 🚀 Deployment Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│     Vercel      │    │    Supabase     │    │   External APIs │
│                 │    │                 │    │                 │
│  • Next.js App  │────│  • PostgreSQL   │    │  • Spotify API  │
│  • Middleware   │    │  • Auth         │────│  • YouTube API  │
│  • API Routes   │    │  • Storage      │    │  • Instagram    │
│  • SSR/SSG      │    │  • Real-time    │    │  • TikTok, etc. │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🔄 Data Flow

### 1. User Authentication
```
User Login → Supabase Auth → JWT Token → Middleware Validation
```

### 2. Tenant Resolution
```
URL (/agency/demo-agency/artist/john-doe) → Middleware → Tenant Context → RLS Policies
```

### 3. Data Aggregation
```
External APIs → Data Connectors → Supabase → Real-time Updates → Dashboard
```

## 📦 Key Components

### Agency Level
- **AgencyDashboard**: Overview of all artists
- **CreateArtistButton**: Add new artists to agency
- **AgencyAnalytics**: Performance metrics across artists

### Artist Level
- **ArtistDashboard**: Individual artist metrics
- **MetricCards**: Production, Engagement, Fan Base
- **DataSourceConnectors**: API integrations

### Shared
- **Authentication**: Supabase Auth helpers
- **Middleware**: Tenant isolation and security
- **RLS Policies**: Database-level security

## ⚙️ Configuration

### Environment Variables
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# External API Keys
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
# ... other API keys
```

### Agency Plans
- **Starter**: 5 artists, 3 data sources
- **Professional**: 25 artists, 10 data sources, custom domain
- **Enterprise**: Unlimited artists, all features, white-label

## 🚀 Getting Started

1. **Set up Supabase**:
   - Create project
   - Run `supabase/schema.sql`
   - Configure authentication

2. **Deploy to Vercel**:
   - Connect GitHub repository
   - Set environment variables
   - Deploy

3. **Create Super Admin**:
   - Insert super admin user
   - Create first agency
   - Test the flow

## 🔮 Future Enhancements

- **White-label options** for enterprise agencies
- **Custom domains** for agency dashboards
- **Advanced analytics** and reporting
- **Mobile app** for artists
- **Webhook system** for real-time integrations
- **Multi-language support**
- **Advanced billing** with usage-based pricing

This architecture provides a scalable, secure foundation for Home Run Records to serve multiple agencies and their artists with complete data isolation and role-based access control.