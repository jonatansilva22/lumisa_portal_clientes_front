import React from "react";
import { Card } from '../../../shared/ui/Card';
import type { AdminDashboard } from '../types/dashboard';

interface KPI {
  label: string;
  value: number;
  icon: React.ReactNode;
}

interface DashboardInfoCardProps {
  title: string;
  icon: React.ReactNode;
  kpis: KPI[];
  data: AdminDashboard;
}

const DashboardInfoCard: React.FC<DashboardInfoCardProps> = ({ title, icon, kpis, data }) => (
  <Card className="flex flex-col gap-2 w-full max-w-xs sm:max-w-sm md:max-w-md mx-auto p-2 sm:p-4 md:p-6 wrap-break-word">
    <div className="flex items-center gap-2 mb-2 justify-center">
      {icon}
      <span className="font-bold text-lg text-gray-700 tracking-wide">{title}</span>
    </div>
    <div className={`grid ${kpis.length === 1 ? 'grid-cols-1' : 'grid-cols-2'} gap-2 sm:gap-3`}>
      {kpis.map(kpi => (
        <div key={kpi.label} className="flex flex-col items-center bg-linear-to-br from-gray-50 to-white rounded-xl p-2 shadow-sm">
          <span className="mb-1">{kpi.icon}</span>
          <span className="text-xs text-gray-500 font-medium">{kpi.label}</span>
          <span className="text-2xl font-extrabold text-gray-800">{kpi.value}</span>
        </div>
      ))}
    </div>
    {/* Enriquecimiento visual por sección */}
    {title === 'Empresas' && (
      <div className="mt-2 flex flex-wrap gap-2 items-center justify-center">
        <span className="inline-block px-2 py-1 rounded font-bold text-xs bg-green-100 text-green-700">
          Activas: {typeof data.active_companies === 'number' ? data.active_companies : 0}
        </span>
        <span className="inline-block px-2 py-1 rounded font-bold text-xs bg-gray-200 text-gray-700">
          Inactivas: {typeof data.inactive_companies === 'number' ? data.inactive_companies : 0}
        </span>
        {data.total_companies === 0 && <span className="text-xs text-gray-400 ml-2">Sin empresas registradas</span>}
      </div>
    )}
    {title === 'Pedidos' && (
      <div className="mt-2 flex flex-wrap gap-2 items-center justify-center">
        {Object.entries(data.orders_by_status).map(([status, value]) => {
          const colorMap: Record<string, string> = {
            'Pendiente': 'bg-yellow-100 text-yellow-700',
            'Autorizado': 'bg-purple-100 text-purple-700',
            'Pagado': 'bg-green-100 text-green-700',
            'Cancelado': 'bg-gray-200 text-gray-700',
            'Rechazado': 'bg-red-100 text-red-700',
          };
          return (
            <span key={status} className={`inline-block px-2 py-1 rounded font-bold text-xs ${colorMap[status] || 'bg-blue-100 text-blue-700'}`}>{status}: {value}</span>
          );
        })}
      </div>
    )}
    {title === 'Pagos' && (
      <div className="mt-2 flex flex-wrap gap-2 items-center justify-center">
        <span className="inline-block px-2 py-1 rounded font-bold text-xs bg-yellow-100 text-yellow-700">
          Pendientes: {data.payment_status.pending}
        </span>
        <span className="inline-block px-2 py-1 rounded font-bold text-xs bg-green-100 text-green-700">
          Pagados: {data.payment_status.paid}
        </span>
        <span className="inline-block px-2 py-1 rounded font-bold text-xs bg-red-100 text-red-700">
          Rechazados: {data.payment_status.rejected}
        </span>
        <span className="inline-block px-2 py-1 rounded font-bold text-xs bg-gray-200 text-gray-700">
          Cancelados: {data.payment_status.cancelled}
        </span>
      </div>
    )}
  </Card>
);

export default DashboardInfoCard;
