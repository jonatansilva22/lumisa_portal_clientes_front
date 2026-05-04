import { useEffect } from 'react';
import { useAdvisorDashboard } from '../hooks/useDashboard';
import DashboardAdvisor from '../components/DashboardAdvisor';
import { Header, SidebarAdviser } from '../../../shared/components/Index';
import { LoadingSpinner } from '../../../shared/ui/LoadingSpinner';

export default function AdvisorDashboardPage() {
  const { data, loading, error, fetchDashboard } = useAdvisorDashboard();

  useEffect(() => {
    fetchDashboard();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="h-screen flex flex-col">
      <Header />
      <div className="flex flex-1 min-h-0">
        <SidebarAdviser />
        <main className="flex-1 p-4 overflow-y-auto bg-gray-50">
          <h1 className="text-2xl font-bold mb-6">Dashboard Asesor</h1>
          {loading && <LoadingSpinner className="my-12" />}
          {error && <div className="text-red-500 mb-4">{error}</div>}
          {data && <DashboardAdvisor data={data} />}
        </main>
      </div>
    </div>
  );
}
