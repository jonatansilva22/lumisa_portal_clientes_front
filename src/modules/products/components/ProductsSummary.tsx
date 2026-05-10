
import React from "react";
import { Card } from "../../../shared/ui/Card";

interface ProductsSummaryProps {
  total: number;
  active: number;
  inactive: number;
}

export const ProductsSummary: React.FC<ProductsSummaryProps> = ({ total, active, inactive }) => (
  <div className="flex justify-center mb-2">
    <Card className="w-full max-w-2xl p-0 bg-gradient-to-br from-gray-50 to-white border-0 shadow-md">
      <div className="flex flex-row divide-x divide-gray-200">
        {/* Total productos */}
        <div className="flex flex-1 flex-col items-center py-2 px-0.5 md:px-2">
          <span className="mb-0.5">
            <svg width="20" height="20" fill="none" stroke="#6366f1" strokeWidth="2.2" viewBox="0 0 24 24"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/></svg>
          </span>
          <span className="text-base font-extrabold text-gray-800 tracking-tight">{total}</span>
          <span className="uppercase text-xs tracking-widest text-indigo-500 font-semibold mt-0.5">Productos</span>
        </div>
        {/* Activos */}
        <div className="flex flex-1 flex-col items-center py-2 px-0.5 md:px-2">
          <span className="mb-0.5">
            <svg width="20" height="20" fill="none" stroke="#22c55e" strokeWidth="2.2" viewBox="0 0 24 24"><polyline points="20 6 10.8 17 4 11.2"/></svg>
          </span>
          <span className="text-base font-extrabold text-green-600 tracking-tight">{active}</span>
          <span className="uppercase text-xs tracking-widest text-green-600 font-semibold mt-0.5">Activos</span>
        </div>
        {/* Inactivos */}
        <div className="flex flex-1 flex-col items-center py-2 px-0.5 md:px-2">
          <span className="mb-0.5">
            <svg width="20" height="20" fill="none" stroke="#a3a3a3" strokeWidth="2.2" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </span>
          <span className="text-base font-extrabold text-gray-400 tracking-tight">{inactive}</span>
          <span className="uppercase text-xs tracking-widest text-gray-400 font-semibold mt-0.5">Inactivos</span>
        </div>
      </div>
    </Card>
  </div>
);
