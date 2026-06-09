import PieChart from './PieChart';
import BarChart from './BarChart';
import PaymentsPieChart from './PaymentsPieChart';
import { Card } from '../../../shared/ui/Card';
import type { AdvisorDashboard } from '../types/dashboard';
import {
  UserGroupIcon,
  ShoppingBagIcon,
  CubeIcon,
  CurrencyDollarIcon,
} from '@heroicons/react/24/outline';

interface Props {
  data: AdvisorDashboard;
  showInfoOnly?: boolean;
  showChartsOnly?: boolean;
}

import { BuildingOffice2Icon } from '@heroicons/react/24/outline';

export default function DashboardAdvisor({ data, showInfoOnly, showChartsOnly }: Props) {

  const ordersStateColors = data.orders_pie.labels.map(label => {
    const map: Record<string, string> = {
      'Pendiente': '#fbbf24',
      'Autorizado': '#a78bfa',
      'Pagado': '#34d399',
      'Cancelado': '#9ca3af',
      'Rechazado': '#f87171',
    };
    return map[label] || '#38bdf8';
  });

  return (
    <div className="flex flex-col gap-12">
      {(!showChartsOnly && !showInfoOnly) && (
        <h1 className="text-3xl font-bold mb-6 text-center">Dashboard de Asesor</h1>
      )}
      {(!showChartsOnly) && (
        <div>
          <h2 className="text-2xl font-bold mb-4 text-center">Información General</h2>
          <Card className="flex flex-col gap-4 p-6 w-full max-w-6xl mx-auto shadow-xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-6">
              {/* Clientes */}
              <div className="flex flex-col items-center">
                <UserGroupIcon className="w-8 h-8 text-blue-500 mb-1" />
                <span className="font-bold text-lg text-gray-700 mb-1">Clientes</span>
                <div className="flex flex-col items-center bg-gray-50 rounded-lg p-2 w-full">
                  <span className="text-xs text-gray-500">Clientes</span>
                  <span className="text-2xl font-bold text-gray-800">{data.total_clients}</span>
                </div>
              </div>
              {/* Empresas */}
              <div className="flex flex-col items-center">
                <BuildingOffice2Icon className="w-8 h-8 text-yellow-500 mb-1" />
                <span className="font-bold text-lg text-gray-700 mb-1">Empresas</span>
                <div className="flex flex-col items-center bg-gray-50 rounded-lg p-2 w-full">
                  <span className="text-xs text-gray-500">Total empresas</span>
                  <span className="text-2xl font-bold text-gray-800">{Array.isArray(data.companies_info) ? data.companies_info.length : 0}</span>
                </div>
                <div className="mt-2 flex flex-wrap gap-2 items-center justify-center">
                  <span className="inline-block px-2 py-1 rounded font-bold text-xs bg-green-100 text-green-700">Activas: {Array.isArray(data.companies_info) ? data.companies_info.filter(e => e.active).length : 0}</span>
                  <span className="inline-block px-2 py-1 rounded font-bold text-xs bg-gray-200 text-gray-700">Inactivas: {Array.isArray(data.companies_info) ? data.companies_info.filter(e => !e.active).length : 0}</span>
                  {Array.isArray(data.companies_info) && data.companies_info.length === 0 && <span className="text-xs text-gray-400 ml-2">Sin empresas registradas</span>}
                </div>
              </div>
              {/* Pedidos */}
              <div className="flex flex-col items-center">
                <ShoppingBagIcon className="w-8 h-8 text-orange-500 mb-1" />
                <span className="font-bold text-lg text-gray-700 mb-1">Pedidos</span>
                <div className="flex flex-col items-center bg-gray-50 rounded-lg p-2 w-full">
                  <span className="text-xs text-gray-500">Pedidos</span>
                  <span className="text-2xl font-bold text-gray-800">{data.total_orders}</span>
                </div>
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
              </div>
              {/* Pagos */}
              <div className="flex flex-col items-center">
                <CurrencyDollarIcon className="w-8 h-8 text-emerald-500 mb-1" />
                <span className="font-bold text-lg text-gray-700 mb-1">Pagos</span>
                <div className="flex flex-col items-center bg-gray-50 rounded-lg p-2 w-full">
                  <span className="text-xs text-gray-500">Total pagos</span>
                  <span className="text-2xl font-bold text-gray-800">{
                    (data.payment_status.pending || 0) +
                    (data.payment_status.paid || 0) +
                    (data.payment_status.rejected || 0) +
                    (data.payment_status.cancelled || 0)
                  }</span>
                </div>
                <div className="mt-2 flex flex-wrap gap-2 items-center justify-center">
                  <span className="inline-block px-2 py-1 rounded font-bold text-xs bg-yellow-100 text-yellow-700">Pendientes: {data.payment_status.pending}</span>
                  <span className="inline-block px-2 py-1 rounded font-bold text-xs bg-green-100 text-green-700">Pagados: {data.payment_status.paid}</span>
                  <span className="inline-block px-2 py-1 rounded font-bold text-xs bg-red-100 text-red-700">Rechazados: {data.payment_status.rejected}</span>
                  <span className="inline-block px-2 py-1 rounded font-bold text-xs bg-gray-200 text-gray-700">Cancelados: {data.payment_status.cancelled}</span>
                </div>
              </div>
              {/* Productos */}
              <div className="flex flex-col items-center">
                <CubeIcon className="w-8 h-8 text-indigo-500 mb-1" />
                <span className="font-bold text-lg text-gray-700 mb-1">Productos</span>
                <div className="flex flex-col items-center bg-gray-50 rounded-lg p-2 w-full">
                  <span className="text-xs text-gray-500">Productos gestionados</span>
                  <span className="text-2xl font-bold text-gray-800">{data.products_managed}</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
      {(!showInfoOnly) && (
        <div>
          <h2 className="text-2xl font-bold mb-4 text-center">Gráficas</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {/* Pedidos por estado */}
            <Card className="flex flex-col items-center justify-center">
              <div className="font-semibold text-lg mb-2 w-full text-center">Pedidos por estado</div>
              <PieChart data={data.orders_pie} backgroundColor={ordersStateColors} />
              <div className="text-sm text-gray-500 mt-2 mb-1 text-center w-full">Total: <span className="font-bold text-xl text-gray-700">{data.orders_pie.values.reduce((a, b) => a + b, 0)}</span></div>
              <div className="w-full flex flex-col items-center mt-2">
                <ul className="flex flex-row flex-wrap gap-x-4 gap-y-1 justify-center w-full">
                  {data.orders_pie.labels.map((label, i) => (
                    <li key={label} className="flex items-center gap-2 text-base">
                      <span className="inline-block w-4 h-4 rounded" style={{ background: ordersStateColors[i] }}></span>
                      <span className="text-gray-700">{label}:</span>
                      <span className="font-bold text-lg">{data.orders_pie.values[i]}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
            {/* Pedidos por mes */}
            <Card className="flex flex-col items-center justify-center">
              <div className="font-semibold text-lg mb-2 w-full text-center">Pedidos por mes</div>
              <BarChart data={{
                ...data.orders_bar,
                backgroundColor: data.orders_bar.labels.map(() => '#60a5fa'),
                borderRadius: 8,
              }} />
            </Card>
            {/* Pagos por estado */}
            <Card className="flex flex-col items-center justify-center">
              <div className="font-semibold text-lg mb-2 w-full text-center">Pagos por estado</div>
              <PaymentsPieChart paymentStatus={data.payment_status} />
              <div className="w-full flex flex-col items-center mt-2">
                <ul className="flex flex-row flex-wrap gap-x-4 gap-y-1 justify-center w-full">
                  <li className="flex items-center gap-2 text-base">
                    <span className="inline-block w-4 h-4 rounded" style={{ background: '#fbbf24' }}></span>
                    <span className="text-gray-700">Pendiente:</span>
                    <span className="font-bold text-lg">{data.payment_status.pending}</span>
                  </li>
                  <li className="flex items-center gap-2 text-base">
                    <span className="inline-block w-4 h-4 rounded" style={{ background: '#34d399' }}></span>
                    <span className="text-gray-700">Pagado:</span>
                    <span className="font-bold text-lg">{data.payment_status.paid}</span>
                  </li>
                  <li className="flex items-center gap-2 text-base">
                    <span className="inline-block w-4 h-4 rounded" style={{ background: '#f87171' }}></span>
                    <span className="text-gray-700">Rechazado:</span>
                    <span className="font-bold text-lg">{data.payment_status.rejected}</span>
                  </li>
                  <li className="flex items-center gap-2 text-base">
                    <span className="inline-block w-4 h-4 rounded" style={{ background: '#9ca3af' }}></span>
                    <span className="text-gray-700">Cancelado:</span>
                    <span className="font-bold text-lg">{data.payment_status.cancelled}</span>
                  </li>
                </ul>
              </div>
            </Card>
            {/* Empresas activas/inactivas */}
            <Card className="flex flex-col items-center justify-center">
              <div className="font-semibold text-lg mb-2 w-full text-center">Empresas activas/inactivas</div>
              {(() => {
                const pie = data.companies_pie || { labels: [], values: [] };
                let labels = pie.labels;
                let values = pie.values;
                if (!labels || labels.length < 2) {
                  const total = Array.isArray(data.companies_info) ? data.companies_info.length : 0;
                  const active = Array.isArray(data.companies_info) ? data.companies_info.filter(e => e.active).length : 0;
                  const inactive = total - active;
                  labels = ['Activas', 'Inactivas'];
                  values = [active, inactive];
                }
                const companiesColors = ["#34d399", "#9ca3af"];
                return <>
                  <PieChart data={{ labels, values }} backgroundColor={companiesColors} />
                  <div className="text-sm text-gray-500 mt-2 mb-1 text-center w-full">Total: <span className="font-bold text-xl text-gray-700">{values.reduce((a, b) => a + b, 0)}</span></div>
                  <div className="w-full flex flex-col items-center mt-2">
                    <ul className="flex flex-row flex-wrap gap-x-4 gap-y-1 justify-center w-full">
                      {labels.map((label, i) => (
                        <li key={label} className="flex items-center gap-2 text-base">
                          <span className="inline-block w-4 h-4 rounded" style={{ background: companiesColors[i] }}></span>
                          <span className="text-gray-700">{label}:</span>
                          <span className="font-bold text-lg">{values[i]}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </>;
              })()}
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}