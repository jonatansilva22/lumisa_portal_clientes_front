import { Card } from '../../../shared/ui/Card';

interface PurchaseHistorySummaryProps {
  total: number;
  spent: number;
}

export function PurchaseHistorySummary({ total, spent }: PurchaseHistorySummaryProps) {
  return (
    <div className="flex justify-center mb-2">
      <Card className="w-full max-w-5xl p-0 bg-gradient-to-br from-gray-50 to-white border-0 shadow-md">
        <div className="flex flex-row divide-x divide-gray-200 flex-1 px-2 py-2">
          {/* Total compras */}
          <div className="flex flex-1 flex-col items-center py-2 px-0.5 md:px-2">
            <span className="mb-0.5">
              <svg width="20" height="20" fill="none" stroke="#2563eb" strokeWidth="2.2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M8 12h8"/></svg>
            </span>
            <span className="text-base font-extrabold text-gray-800 tracking-tight">{total}</span>
            <span className="uppercase text-xs tracking-widest text-blue-600 font-semibold mt-0.5">Compras</span>
          </div>
          {/* Total gastado */}
          <div className="flex flex-1 flex-col items-center py-2 px-0.5 md:px-2">
            <span className="mb-0.5">
              <svg width="20" height="20" fill="none" stroke="#22c55e" strokeWidth="2.2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M8 12h8"/></svg>
            </span>
            <span className="text-base font-extrabold text-green-600 tracking-tight">${spent.toLocaleString('es-MX', {minimumFractionDigits:2})}</span>
            <span className="uppercase text-xs tracking-widest text-green-600 font-semibold mt-0.5">Gastado</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
