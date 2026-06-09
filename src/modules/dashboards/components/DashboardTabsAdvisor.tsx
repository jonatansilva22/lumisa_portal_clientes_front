import { useState } from 'react';
import DashboardAdvisor from './DashboardAdvisor';
import type { AdvisorDashboard } from '../types/dashboard';
import {
  UserGroupIcon,
  ChartPieIcon,
} from '@heroicons/react/24/outline';

interface DashboardTabsAdvisorProps {
  advisorData: AdvisorDashboard;
}

const TABS = [
  { key: 'info', label: 'Información General', icon: <UserGroupIcon className="w-5 h-5 mr-1" /> },
  { key: 'charts', label: 'Gráficas', icon: <ChartPieIcon className="w-5 h-5 mr-1" /> },
];

export function DashboardTabsAdvisor({ advisorData }: DashboardTabsAdvisorProps) {
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
          <DashboardAdvisor data={advisorData} showInfoOnly />
        )}
        {tab === 'charts' && (
          <DashboardAdvisor data={advisorData} showChartsOnly />
        )}
      </div>
    </div>
  );
}