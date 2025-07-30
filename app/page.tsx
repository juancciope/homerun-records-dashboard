import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-2 rounded-lg">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z"/>
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Home Run Records</h1>
                <p className="text-sm text-gray-500">Artist Dashboard Platform</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link 
                href="/auth/login"
                className="px-4 py-2 text-blue-600 hover:text-blue-700"
              >
                Sign In
              </Link>
              <Link 
                href="/auth/signup"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Multi-Tenant Artist Dashboard
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            A GoHighLevel-style platform for music agencies to manage multiple artists with real-time analytics across Music Production, Engagement, and Fan Base metrics.
          </p>
          
          <div className="flex justify-center space-x-4 mb-12">
            <Link 
              href="/auth/signup"
              className="px-8 py-3 bg-blue-600 text-white rounded-lg text-lg hover:bg-blue-700"
            >
              Create Agency Account
            </Link>
            <Link 
              href="/auth/login"
              className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg text-lg hover:bg-gray-50"
            >
              Sign In
            </Link>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <div className="text-3xl mb-4">🎵</div>
              <h3 className="text-xl font-semibold mb-2">Music Production</h3>
              <p className="text-gray-600">Track total releases, finished unreleased tracks, and works in progress.</p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <div className="text-3xl mb-4">📱</div>
              <h3 className="text-xl font-semibold mb-2">Engagement</h3>
              <p className="text-gray-600">Monitor streaming data across all DSPs, social media, and YouTube metrics.</p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <div className="text-3xl mb-4">❤️</div>
              <h3 className="text-xl font-semibold mb-2">Fan Base</h3>
              <p className="text-gray-600">Analyze super fans, regular fans, and cold fans with growth tracking.</p>
            </div>
          </div>

          {/* Demo Link */}
          <div className="mt-16 p-6 bg-blue-50 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Try the Demo</h3>
            <p className="text-blue-700 mb-4">
              See the platform in action with sample data
            </p>
            <Link 
              href="/auth/login"
              className="inline-block px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              View Demo Dashboard →
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}