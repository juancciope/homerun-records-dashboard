'use client';

import { useState } from 'react';

interface Artist {
  id: string;
  name: string;
  email: string;
  genres: string[];
  totalReleases: number;
  finishedUnreleased: number;
  unfinished: number;
  totalStreams: number;
  superFans: number;
  fans: number;
  coldFans: number;
}

export default function Dashboard() {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    genres: '',
  });

  const handleAddArtist = (e: React.FormEvent) => {
    e.preventDefault();
    const newArtist: Artist = {
      id: Date.now().toString(),
      name: formData.name,
      email: formData.email,
      genres: formData.genres.split(',').map(g => g.trim()),
      totalReleases: 0,
      finishedUnreleased: 0,
      unfinished: 0,
      totalStreams: 0,
      superFans: 0,
      fans: 0,
      coldFans: 0,
    };
    
    setArtists([...artists, newArtist]);
    setFormData({ name: '', email: '', genres: '' });
    setShowAddForm(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Home Run Records
              </h1>
              <p className="text-gray-600">Artist Management Dashboard</p>
            </div>
            
            <button
              onClick={() => setShowAddForm(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Add Artist
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-600">Total Artists</h3>
            <p className="text-3xl font-bold text-gray-900">{artists.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-600">Total Releases</h3>
            <p className="text-3xl font-bold text-gray-900">
              {artists.reduce((sum, artist) => sum + artist.totalReleases, 0)}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-600">Total Streams</h3>
            <p className="text-3xl font-bold text-gray-900">
              {artists.reduce((sum, artist) => sum + artist.totalStreams, 0).toLocaleString()}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-600">Total Fans</h3>
            <p className="text-3xl font-bold text-gray-900">
              {artists.reduce((sum, artist) => sum + artist.superFans + artist.fans + artist.coldFans, 0).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Artists */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold">Artists</h2>
          </div>
          
          {artists.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-gray-400 mb-4">
                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No artists yet</h3>
              <p className="text-gray-500 mb-4">Get started by adding your first artist.</p>
              <button
                onClick={() => setShowAddForm(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Add Your First Artist
              </button>
            </div>
          ) : (
            <div className="divide-y">
              {artists.map((artist) => (
                <div key={artist.id} className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">{artist.name}</h3>
                      <p className="text-sm text-gray-500">{artist.email}</p>
                      <div className="flex gap-2 mt-2">
                        {artist.genres.map((genre) => (
                          <span
                            key={genre}
                            className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                          >
                            {genre}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-8 text-center">
                      <div>
                        <p className="text-sm text-gray-500">Music Production</p>
                        <p className="font-semibold">{artist.totalReleases} releases</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Engagement</p>
                        <p className="font-semibold">{artist.totalStreams.toLocaleString()} streams</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Fan Base</p>
                        <p className="font-semibold">{(artist.superFans + artist.fans + artist.coldFans).toLocaleString()} fans</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Artist Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Add New Artist</h2>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleAddArtist} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Artist Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter artist name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="artist@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Genres
                  </label>
                  <input
                    type="text"
                    value={formData.genres}
                    onChange={(e) => setFormData({ ...formData, genres: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Hip Hop, R&B, Pop (comma separated)"
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Add Artist
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}