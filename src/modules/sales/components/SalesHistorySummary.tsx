import React from "react";
import { Card } from "../../../shared/ui/Card";
interface SalesHistorySummaryProps {
  total: number;
  earnings: number;
}

export const SalesHistorySummary: React.FC<SalesHistorySummaryProps> = ({ total, earnings }) => (
  <div className="flex justify-center mb-2">
    <Card className="w-full max-w-5xl p-0 bg-gradient-to-br from-gray-50 to-white border-0 shadow-md">
      <div className="flex flex-row divide-x divide-gray-200 flex-1 px-2 py-2">
        {/* Total ventas */}
        <div className="flex flex-1 flex-col items-center py-2 px-0.5 md:px-2">
          <span className="mb-0.5">
            <svg width="20" height="20" fill="none" stroke="#2563eb" strokeWidth="2.2" viewBox="0 0 24 24"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/></svg>
          </span>
          <span className="text-base font-extrabold text-gray-800 tracking-tight">{total}</span>
          <span className="uppercase text-xs tracking-widest text-blue-600 font-semibold mt-0.5">Ventas</span>
        </div>
        {/* Ganancias */}
        <div className="flex flex-1 flex-col items-center py-2 px-0.5 md:px-2">
          <span className="mb-0.5">
            <svg width="20" height="20" fill="none" stroke="#22c55e" strokeWidth="2.2" viewBox="0 0 24 24"><path d="M12 8v8m0 0l-3-3m3 3l3-3"/><circle cx="12" cy="12" r="10"/></svg>
          </span>
          <span className="text-base font-extrabold text-green-600 tracking-tight">${earnings.toLocaleString('es-MX', {minimumFractionDigits:2})}</span>
          <span className="uppercase text-xs tracking-widest text-green-600 font-semibold mt-0.5">Ganancias</span>
        </div>
      </div>
    </Card>
  </div>
);
