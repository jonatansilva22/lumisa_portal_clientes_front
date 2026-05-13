import { useState } from 'react';
import DashboardAdmin from './DashboardAdmin';
import DashboardAdvisor from './DashboardAdvisor';
import DashboardClient from './DashboardClient';
import type { AdminDashboard, AdvisorDashboard, ClientDashboard } from '../types/dashboard';
import {
  CubeIcon,
  UserGroupIcon,
  BuildingOffice2Icon,
  CurrencyDollarIcon,
  ShoppingBagIcon,
} from '@heroicons/react/24/outline';

interface DashboardTabsProps {
  adminData?: AdminDashboard;
  advisorData?: AdvisorDashboard;
  clientData?: ClientDashboard;
}

const TABS = [
  { key: 'productos', label: 'Productos', icon: <CubeIcon className="w-5 h-5 mr-1" /> },
  { key: 'usuarios', label: 'Usuarios', icon: <UserGroupIcon className="w-5 h-5 mr-1" /> },
  { key: 'empresas', label: 'Empresas', icon: <BuildingOffice2Icon className="w-5 h-5 mr-1" /> },
  { key: 'pagos', label: 'Pagos', icon: <CurrencyDollarIcon className="w-5 h-5 mr-1" /> },
  { key: 'pedidos', label: 'Pedidos', icon: <ShoppingBagIcon className="w-5 h-5 mr-1" /> },
];

export function DashboardTabs({ adminData, advisorData, clientData }: DashboardTabsProps) {
  const [tab, setTab] = useState('productos');

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
            style={{ minWidth: 120 }}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>
      <div className="bg-white rounded-b-xl shadow p-2 sm:p-4 md:p-6 min-h-[350px] max-w-full overflow-x-auto">
        {tab === 'productos' && adminData && (
          <DashboardAdmin data={adminData} section="Productos" />
        )}
        {tab === 'usuarios' && adminData && (
          <DashboardAdmin data={adminData} section="Usuarios" />
        )}
        {tab === 'empresas' && adminData && (
          <DashboardAdmin data={adminData} section="Empresas" />
        )}
        {tab === 'pagos' && adminData && (
          <DashboardAdmin data={adminData} section="Pagos" />
        )}
        {tab === 'pedidos' && adminData && (
          <DashboardAdmin data={adminData} section="Pedidos" />
        )}
        {/* Puedes agregar lógica similar para advisorData y clientData si lo deseas */}
      </div>
    </div>
  );
}
