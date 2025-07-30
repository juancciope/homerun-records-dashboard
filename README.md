# Home Run Records - Artist Dashboard

A real-time analytics dashboard for music artists, providing comprehensive insights across Music Production, Engagement, and Fan Base metrics.

## Features

### 📊 Three Core Analytics Realms

**1. Music Production**
- Total Releases
- Finished Unreleased tracks
- Unfinished projects

**2. Engagement**
- Streaming data across all DSPs (Spotify, Apple Music, YouTube, etc.)
- Social Media metrics (Instagram, Twitter, TikTok, Facebook)
- YouTube analytics (subscribers, views, engagement)

**3. Fan Base**
- Super Fans (highly engaged audience)
- Regular Fans
- Cold Fans (less engaged)
- Growth tracking (daily, weekly, monthly)

### 🔌 Data Source Integration

The platform is designed as a data aggregator, supporting multiple sources:
- Spotify Web API
- YouTube Analytics API
- Instagram Basic Display API
- Twitter API v2
- TikTok Analytics
- Custom data connectors

## Tech Stack

- **Framework**: Next.js 15 with TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase or MongoDB (configurable)
- **Deployment**: Vercel
- **Charts**: Recharts
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd dashboard
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
```

4. Configure your environment variables in `.env.local`:

#### For Supabase:
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

#### For MongoDB:
```bash
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/homerun-dashboard
```

#### API Keys for Data Sources:
```bash
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
YOUTUBE_API_KEY=your_youtube_api_key
INSTAGRAM_ACCESS_TOKEN=your_instagram_access_token
TWITTER_API_KEY=your_twitter_api_key
TWITTER_API_SECRET=your_twitter_api_secret
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the dashboard.

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy

### Manual Deployment

```bash
npm run build
npm start
```

## Project Structure

```
dashboard/
├── app/
│   ├── api/                 # API routes
│   │   ├── artists/         # Artist management
│   │   └── metrics/         # Metrics endpoints
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Dashboard home
├── components/
│   ├── dashboard/           # Dashboard components
│   ├── charts/              # Chart components
│   └── ui/                  # Reusable UI components
├── lib/
│   ├── db/                  # Database connectors
│   ├── types/               # TypeScript definitions
│   ├── connectors/          # Data source connectors
│   └── utils/               # Utility functions
├── hooks/                   # Custom React hooks
└── services/                # Business logic services
```

## Data Source Configuration

### Adding New Data Sources

1. Create a connector class extending `DataSourceConnector`:

```typescript
import { DataSourceConnector, MetricUpdate } from '@/lib/connectors/base';

export class CustomConnector extends DataSourceConnector {
  async connect(): Promise<boolean> {
    // Implementation
  }

  async fetchMetrics(): Promise<MetricUpdate[]> {
    // Implementation
  }

  getSourceType(): string {
    return 'custom';
  }
}
```

2. Register the connector in your data aggregation service
3. Add the necessary API credentials to your environment variables

## Database Setup

### Supabase Setup

1. Create a new Supabase project
2. Run the SQL migrations (coming soon)
3. Set up Row Level Security policies
4. Configure authentication

### MongoDB Setup

1. Create a MongoDB Atlas cluster
2. Set up database collections:
   - `artists`
   - `music_production_metrics`
   - `engagement_metrics`
   - `fanbase_metrics`
   - `releases`
   - `data_sources`

## API Documentation

### Endpoints

- `GET /api/artists` - Get all artists
- `POST /api/artists` - Create new artist
- `GET /api/metrics/[artistId]` - Get dashboard data for artist
- `PUT /api/metrics/[artistId]` - Update artist metrics

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is proprietary to Home Run Records.

## Support

For support, contact the development team or create an issue in the repository.