import { Suspense } from 'react';
import DashboardMetrics from '@/components/dashboard/DashboardMetrics';
import Header from '@/components/dashboard/Header';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Artist Dashboard
        </h1>
        <Suspense fallback={<DashboardSkeleton />}>
          <DashboardMetrics />
        </Suspense>
      </div>
    </main>
  );
}

function DashboardSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[...Array(9)].map((_, i) => (
        <div key={i} className="bg-white rounded-lg shadow p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      ))}
    </div>
  );
}