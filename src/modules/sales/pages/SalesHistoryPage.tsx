import { useSalesHistory } from '../hooks/useSalesHistory';
import { useState, useEffect } from 'react';
import { Header } from '../../../shared/components/Header';
import { SidebarAdmin } from '../../../shared/components/SidebarAdmin';
import { SidebarAdviser } from '../../../shared/components/SidebarAdviser';
import { useAuth } from '../../../shared/hooks/useAuth';
import { BackButton } from '../../../shared/ui/BackButton';
import { SalesHistorySummary } from '../components/SalesHistorySummary';
import { SalesHistoryFiltersBar } from '../components/SalesHistoryFiltersBar';
import { SalesHistoryTable } from '../components/SalesHistoryTable';
import { ExportSalesHistoryButton } from '../components/ExportSalesHistoryButton';


export default function SalesHistoryPage() {
  const { isAdmin, isAdviser } = useAuth();
  const {
    sales,
    loading,
    error,
    period,
    setPeriod,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    refetch,
    customActive,
    setCustomActive,
  } = useSalesHistory();
  const [showCustom, setShowCustom] = useState(false);

  useEffect(() => {
    setCustomActive(showCustom);
  }, [showCustom, setCustomActive]);

  return (
    <div className="h-screen flex flex-col">
      <Header />
      <div className="flex flex-1 min-h-0">
        {isAdmin && <SidebarAdmin />}
        {isAdviser && <SidebarAdviser />}
        <main className="flex-1 p-4 overflow-y-auto">
          <div className="flex flex-col items-center mb-6">
            <div className="w-full flex items-center max-w-6xl mx-auto mb-2 justify-between">
              <div className="flex items-center gap-2 flex-1">
                <BackButton onClick={() => window.history.back()} className="mr-2" />
                <h1 className="text-3xl font-bold text-gray-800 text-center w-full">Historial de ventas</h1>
              </div>
            </div>
          </div>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between max-w-5xl mx-auto mb-2 w-full gap-2">
            <div className="flex-1">
              <SalesHistorySummary total={sales?.total_sales ?? 0} earnings={sales?.total_earnings ?? 0} />
            </div>
              <div className="shrink-0 w-full md:w-auto mt-2 md:mt-0 flex justify-end">
                <ExportSalesHistoryButton sales={sales?.sales ?? []} />
              </div>
          </div>
          <div className="flex flex-row items-center justify-between max-w-6xl mx-auto mb-2 w-full gap-4 flex-wrap">
            <div className="flex-1 min-w-75 flex items-center gap-4">
              <SalesHistoryFiltersBar
                period={period}
                setPeriod={v => setPeriod(v as any)}
                startDate={startDate}
                setStartDate={v => setStartDate(v)}
                endDate={endDate}
                setEndDate={v => setEndDate(v)}
                showCustom={showCustom}
                setShowCustom={setShowCustom}
                onFilter={refetch}
              />
            </div>
          </div>
          <div className="mt-4 flex justify-center">
            <div className="w-full max-w-7xl">
              <SalesHistoryTable
                sales={sales?.sales ?? []}
                loading={loading}
                error={error}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
