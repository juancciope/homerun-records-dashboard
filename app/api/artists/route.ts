import { NextRequest, NextResponse } from 'next/server';
import { Artist } from '@/lib/types';

// Mock data for demonstration
const mockArtists: Artist[] = [
  {
    id: '1',
    name: 'Sample Artist',
    email: 'artist@example.com',
    imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=150&h=150&fit=crop&crop=face',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date(),
  },
];

export async function GET() {
  try {
    // In a real implementation, this would fetch from your database
    return NextResponse.json({ artists: mockArtists });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch artists' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.name || !body.email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }

    // In a real implementation, this would save to your database
    const newArtist: Artist = {
      id: Date.now().toString(),
      name: body.name,
      email: body.email,
      imageUrl: body.imageUrl,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockArtists.push(newArtist);
    
    return NextResponse.json({ artist: newArtist }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create artist' },
      { status: 500 }
    );
  }
}