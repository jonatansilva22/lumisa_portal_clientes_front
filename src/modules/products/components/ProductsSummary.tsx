import React from "react";
import { Card } from "../../../shared/ui/Card";

interface ProductsSummaryProps {
  total: number;
  active: number;
  inactive: number;
}

export const ProductsSummary: React.FC<ProductsSummaryProps> = ({ total, active, inactive }) => (
  <div className="flex flex-wrap gap-4 mb-2 justify-center">
    <Card className="flex flex-col items-center min-w-[140px] p-4 border border-gray-200 shadow-sm">
      <span className="text-2xl mb-1">
        {/* Icono de caja/producto */}
        <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M16 3v4M8 3v4"/></svg>
      </span>
      <span className="text-2xl font-bold">{total}</span>
      <span className="text-gray-600 text-sm mt-1">Productos</span>
    </Card>
    <Card className="flex flex-col items-center min-w-[140px] p-4 border border-gray-200 shadow-sm">
      <span className="text-2xl mb-1">
        {/* Icono de usuario/activo */}
        <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-2.5 3.5-4 8-4s8 1.5 8 4"/></svg>
      </span>
      <span className="text-2xl font-bold">{active}</span>
      <span className="text-green-600 text-sm mt-1">Activos</span>
    </Card>
    <Card className="flex flex-col items-center min-w-[140px] p-4 border border-gray-200 shadow-sm">
      <span className="text-2xl mb-1">
        {/* Icono de advertencia/inactivo */}
        <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 9v4m0 4h.01"/><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/></svg>
      </span>
      <span className="text-2xl font-bold">{inactive}</span>
      <span className="text-gray-400 text-sm mt-1">Inactivos</span>
    </Card>
  </div>
);
