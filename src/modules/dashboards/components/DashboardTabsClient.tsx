
import { useState } from 'react';
import DashboardClient from './DashboardClient';
import type { ClientDashboard } from '../types/dashboard';
import { Card } from '../../../shared/ui/Card';
import { BuildingOffice2Icon, ShoppingBagIcon, CurrencyDollarIcon, ShoppingCartIcon, ChartPieIcon } from '@heroicons/react/24/outline';

const TABS = [
  { key: 'info', label: 'Información General', icon: <BuildingOffice2Icon className="w-5 h-5 mr-1" /> },
  { key: 'charts', label: 'Gráficas', icon: <ChartPieIcon className="w-5 h-5 mr-1" /> },
];

interface Props {
  clientData: ClientDashboard;
}

export function DashboardTabsClient({ clientData }: Props) {
  const [tab, setTab] = useState('info');

  return (
    <div className="w-full max-w-7xl mx-auto px-1 sm:px-4 overflow-x-auto">
      <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-8 border-b border-gray-200 bg-white rounded-t-xl shadow-sm">
        {TABS.map(t => (
          <button
            key={t.key}
            className={`flex items-center cursor-pointer px-4 py-2 font-semibold text-base rounded-t-lg transition-all duration-150 focus:outline-none
              ${tab === t.key
                ? 'bg-blue-600 text-white shadow -mb-px border-b-2 border-blue-600'
                : 'bg-gray-50 text-gray-500 hover:text-blue-600 hover:bg-blue-50 border-b-2 border-transparent'}
            `}
            onClick={() => setTab(t.key)}
            type="button"
            style={{ minWidth: 160 }}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>
      <div className="bg-white rounded-b-xl shadow p-2 sm:p-4 md:p-6 min-h-[350px] max-w-full overflow-x-auto">
        {tab === 'info' && (
          <div className="flex flex-col gap-10 w-full items-center">
            <h2 className="text-2xl font-bold mb-2 text-center">Información General</h2>
            {/* Empresa asociada */}
            <Card className="w-full max-w-3xl mx-auto flex flex-col gap-2 p-6">
              <div className="flex items-center gap-2 mb-2">
                <BuildingOffice2Icon className="w-7 h-7 text-yellow-500" />
                <span className="font-bold text-lg text-gray-700">Empresa asociada</span>
                {clientData.company_info?.active !== undefined && (
                  <span className={`ml-2 px-2 py-1 rounded text-xs font-bold ${clientData.company_info.active ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-700'}`}>
                    {clientData.company_info.active ? 'Activa' : 'Inactiva'}
                  </span>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div><span className="text-gray-500">Nombre: </span>{clientData.company_info?.name || '-'}</div>
                <div><span className="text-gray-500">RFC: </span>{clientData.company_info?.rfc || '-'}</div>
                <div><span className="text-gray-500">Dirección: </span>{clientData.company_info?.address || '-'}</div>
                <div><span className="text-gray-500">Teléfono: </span>{clientData.company_info?.phone || '-'}</div>
                <div><span className="text-gray-500">Email: </span>{clientData.company_info?.email || '-'}</div>
                {clientData.company_info?.observations && (
                  <div className="md:col-span-2"><span className="text-gray-500">Observaciones: </span>{clientData.company_info.observations}</div>
                )}
              </div>
            </Card>
            {/* KPIs */}
            <Card className="w-full max-w-3xl mx-auto flex flex-col gap-4 p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex flex-col items-center justify-center">
                  <ShoppingBagIcon className="w-8 h-8 text-orange-500 mb-1" />
                  <span className="text-xs text-gray-500">Pedidos totales</span>
                  <span className="text-2xl font-bold text-gray-800">{clientData.total_orders}</span>
                </div>
                <div className="flex flex-col items-center justify-center">
                  <ShoppingCartIcon className="w-8 h-8 text-blue-500 mb-1" />
                  <span className="text-xs text-gray-500">Productos en carrito</span>
                  <span className="text-2xl font-bold text-gray-800">{clientData.cart_products_count}</span>
                </div>
                  <div className="flex flex-col items-center justify-center">
                    <ShoppingCartIcon className="w-8 h-8 text-indigo-500 mb-1" />
                    <span className="text-xs text-gray-500">Productos</span>
                    <span className="text-2xl font-bold text-gray-800">{typeof clientData.total_products === 'number' ? clientData.total_products : '-'}</span>
                  </div>
                  <div className="flex flex-col items-center justify-center">
                    <CurrencyDollarIcon className="w-8 h-8 text-green-500 mb-1" />
                    <span className="text-xs text-gray-500">Pagos pagados</span>
                    <span className="text-2xl font-bold text-gray-800">{clientData.payment_status?.paid}</span>
                  </div>
              </div>
            </Card>
          </div>
        )}
        {tab === 'charts' && (
          <DashboardClient data={clientData} showOnlyCharts />
        )}
      </div>
    </div>
  );
}
