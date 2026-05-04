import { useEffect } from 'react';
import { useClientDashboard } from '../hooks/useDashboard';
import DashboardClient from '../components/DashboardClient';
import { Header, SidebarClient } from '../../../shared/components/Index';
import { LoadingSpinner } from '../../../shared/ui/LoadingSpinner';

export default function ClientDashboardPage() {
  const { data, loading, error, fetchDashboard } = useClientDashboard();

  useEffect(() => {
    fetchDashboard();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="h-screen flex flex-col">
      <Header />
      <div className="flex flex-1 min-h-0">
        <SidebarClient />
        <main className="flex-1 p-4 overflow-y-auto bg-gray-50">
          <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
          {loading && <LoadingSpinner className="my-12" />}
          {error && <div className="text-red-500 mb-4">{error}</div>}
          {data && <DashboardClient data={data} />}
        </main>
      </div>
    </div>
  );
}
