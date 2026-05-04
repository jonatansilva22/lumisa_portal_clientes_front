import PieChart from './PieChart';
import BarChart from './BarChart';
import PaymentsPieChart from './PaymentsPieChart';
import DashboardIncidents from './DashboardIncidents';
import { Card } from '../../../shared/ui/Card';
import type { AdvisorDashboard } from '../types/dashboard';
import {
  UserGroupIcon,
  UserIcon,
  ShoppingBagIcon,
  CubeIcon,
  CurrencyDollarIcon,
} from '@heroicons/react/24/outline';

interface Props {
  data: AdvisorDashboard;
}


export default function DashboardAdvisor({ data }: Props) {
  // KPIs extendidos
  const kpis = [
    {
      label: 'Clientes',
      value: data.total_clients,
      icon: <UserIcon className="w-7 h-7 text-green-500" />,
      section: 'Clientes',
    },
    {
      label: 'Pedidos',
      value: data.total_orders,
      icon: <ShoppingBagIcon className="w-7 h-7 text-orange-500" />,
      section: 'Pedidos',
    },
    {
      label: 'Productos gestionados',
      value: data.products_managed,
      icon: <CubeIcon className="w-7 h-7 text-indigo-500" />,
      section: 'Productos',
    },
    // Empresas (si existiera total_companies en el backend para asesor)
    // {
    //   label: 'Empresas',
    //   value: data.total_companies,
    //   icon: <BuildingOffice2Icon className="w-7 h-7 text-yellow-500" />,
    //   section: 'Empresas',
    // },
    {
      label: 'Pagos pendientes',
      value: data.payment_status.pending,
      icon: <CurrencyDollarIcon className="w-7 h-7 text-yellow-500" />,
      section: 'Pagos',
    },
    {
      label: 'Pagos pagados',
      value: data.payment_status.paid,
      icon: <CurrencyDollarIcon className="w-7 h-7 text-green-500" />,
      section: 'Pagos',
    },
    {
      label: 'Pagos rechazados',
      value: data.payment_status.rejected,
      icon: <CurrencyDollarIcon className="w-7 h-7 text-red-500" />,
      section: 'Pagos',
    },
    {
      label: 'Pagos cancelados',
      value: data.payment_status.cancelled,
      icon: <CurrencyDollarIcon className="w-7 h-7 text-gray-400" />,
      section: 'Pagos',
    },
  ];

  // Agrupar KPIs por sección
  const sections = [
    {
      title: 'Clientes',
      icon: <UserGroupIcon className="w-8 h-8 text-blue-500" />,
      kpis: kpis.filter(k => k.section === 'Clientes'),
    },
    // Empresas (si existiera en backend para asesor)
    // {
    //   title: 'Empresas',
    //   icon: <BuildingOffice2Icon className="w-8 h-8 text-yellow-500" />,
    //   kpis: kpis.filter(k => k.section === 'Empresas'),
    // },
    {
      title: 'Pedidos',
      icon: <ShoppingBagIcon className="w-8 h-8 text-orange-500" />,
      kpis: kpis.filter(k => k.section === 'Pedidos'),
    },
    {
      title: 'Pagos',
      icon: <CurrencyDollarIcon className="w-8 h-8 text-emerald-500" />,
      kpis: kpis.filter(k => k.section === 'Pagos'),
    },
    {
      title: 'Productos',
      icon: <CubeIcon className="w-8 h-8 text-indigo-500" />,
      kpis: kpis.filter(k => k.section === 'Productos'),
    },
  ];

  // Leyenda para pedidos por estado
  function PieLegend({ labels, colors, values }: { labels: string[]; colors: string[]; values: number[] }) {
    return (
      <ul className="dashboard-pie-legend text-sm mt-2 grid grid-cols-2 gap-x-4 gap-y-2 w-full">
        {labels.map((label, i) => (
          <li key={label} className="flex items-center gap-2 text-base">
            <span className="inline-block w-4 h-4 rounded mr-2" style={{ background: colors[i] }}></span>
            <span>{label}:</span>
            <span className="font-bold text-lg">{values[i]}</span>
          </li>
        ))}
      </ul>
    );
  }

  // Colores personalizados para pedidos por estado
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
      {/* Información General */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Información General</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {sections.map(section => (
            <Card key={section.title} className="flex flex-col gap-2">
              <div className="flex items-center gap-2 mb-2">
                {section.icon}
                <span className="font-bold text-lg text-gray-700">{section.title}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {section.kpis.map(kpi => (
                  <div key={kpi.label} className="flex items-center gap-2 bg-gray-50 rounded-lg p-2">
                    {kpi.icon}
                    <div>
                      <div className="text-xs text-gray-500">{kpi.label}</div>
                      <div className="text-xl font-bold text-gray-800">{kpi.value}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Enriquecimiento visual por sección */}
              {section.title === 'Pedidos' && (
                <div className="mt-2 flex flex-wrap gap-2 items-center">
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
              {section.title === 'Pagos' && (
                <div className="mt-2 flex flex-wrap gap-2 items-center">
                  <span className="text-xs text-gray-500">Pendientes:</span>
                  <span className="inline-block px-2 py-1 rounded bg-yellow-100 text-yellow-700 font-bold">{data.payment_status.pending}</span>
                  <span className="text-xs text-gray-500">Pagados:</span>
                  <span className="inline-block px-2 py-1 rounded bg-green-100 text-green-700 font-bold">{data.payment_status.paid}</span>
                  <span className="text-xs text-gray-500">Rechazados:</span>
                  <span className="inline-block px-2 py-1 rounded bg-red-100 text-red-700 font-bold">{data.payment_status.rejected}</span>
                  <span className="text-xs text-gray-500">Cancelados:</span>
                  <span className="inline-block px-2 py-1 rounded bg-gray-200 text-gray-700 font-bold">{data.payment_status.cancelled}</span>
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>

      {/* Gráficas */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Gráficas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {/* Pedidos por estado */}
          <Card className="flex flex-col items-center justify-center">
            <div className="font-semibold text-lg mb-2 w-full text-center">Pedidos por estado</div>
            <PieChart data={data.orders_pie} backgroundColor={ordersStateColors} />
            <PieLegend labels={data.orders_pie.labels} colors={ordersStateColors} values={data.orders_pie.values} />
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
          </Card>
        </div>
      </div>

      {/* Incidencias */}
      <DashboardIncidents incidents={data.incidents} />
    </div>
  );
}
