import { useEffect } from 'react';
import { useAdminDashboard } from '../hooks/useDashboard';
import DashboardAdmin from '../components/DashboardAdmin';
import { Header, SidebarAdmin } from '../../../shared/components/Index';
import { LoadingSpinner } from '../../../shared/ui/LoadingSpinner';


export default function AdminDashboardPage() {
  const { data, loading, error, fetchDashboard } = useAdminDashboard();

  useEffect(() => {
    fetchDashboard();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="h-screen flex flex-col">
      <Header />
      <div className="flex flex-1 min-h-0">
        <SidebarAdmin />
        <main className="flex-1 p-4 overflow-y-auto bg-gray-50">
          <h1 className="text-2xl font-bold mb-6">Dashboard Administrador</h1>
          {loading && <LoadingSpinner className="my-12" />}
          {error && <div className="text-red-500 mb-4">{error}</div>}
          {data && <DashboardAdmin data={data} />}
        </main>
      </div>
    </div>
  );
}
