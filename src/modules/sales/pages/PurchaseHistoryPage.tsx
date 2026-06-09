import { usePurchaseHistory } from '../hooks/usePurchaseHistory';
import { useState, useEffect } from 'react';
import { Header } from '../../../shared/components/Header';
import { SidebarClient } from '../../../shared/components/SidebarClient';
import { BackButton } from '../../../shared/ui/BackButton';
import { PurchaseHistorySummary } from '../components/PurchaseHistorySummary';
import { PurchaseHistoryFiltersBar } from '../components/PurchaseHistoryFiltersBar';
import { PurchaseHistoryTable } from '../components/PurchaseHistoryTable';
import { ExportPurchaseHistoryButton } from '../components/ExportPurchaseHistoryButton';

export default function PurchaseHistoryPage() {
  const {
    purchases,
    summary,
    loading,
    error,
    period,
    setPeriod,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    refetch,
    setCustomActive,
  } = usePurchaseHistory();
  const [showCustom, setShowCustom] = useState(false);

  // Sincroniza el estado customActive con showCustom
  useEffect(() => {
    setCustomActive(showCustom);
  }, [showCustom, setCustomActive]);

  return (
    <div className="h-screen flex flex-col">
      <Header />
      <div className="flex flex-1 min-h-0">
        <SidebarClient />
        <main className="flex-1 p-4 overflow-y-auto">
          <div className="flex flex-col items-center mb-6">
            <div className="w-full flex items-center max-w-6xl mx-auto mb-2 justify-between">
              <div className="flex items-center gap-2 flex-1">
                <BackButton onClick={() => window.history.back()} className="mr-2" />
                <h1 className="text-3xl font-bold text-gray-800 text-center w-full">Historial de compras</h1>
              </div>
            </div>
          </div>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between max-w-5xl mx-auto mb-2 w-full gap-2">
            <div className="flex-1">
              <PurchaseHistorySummary total={summary.total_purchases} spent={summary.total_spent} />
            </div>
            <div className="shrink-0 w-full md:w-auto mt-2 md:mt-0 flex justify-end">
              <ExportPurchaseHistoryButton purchases={purchases} />
            </div>
          </div>
          <div className="w-full max-w-5xl mx-auto mb-2 flex flex-col gap-2">
            <PurchaseHistoryFiltersBar
              period={period}
              setPeriod={v => {
                setPeriod(v);
                setStartDate(undefined);
                setEndDate(undefined);
                setShowCustom(false);
              }}
              startDate={startDate}
              setStartDate={setStartDate}
              endDate={endDate}
              setEndDate={setEndDate}
              showCustom={showCustom}
              setShowCustom={setShowCustom}
              onFilter={refetch}
            />
          </div>
          <div className="mt-4 flex justify-center">
            <div className="w-full max-w-7xl">
              <PurchaseHistoryTable
                purchases={purchases}
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
