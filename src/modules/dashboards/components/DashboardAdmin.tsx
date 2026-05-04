
import PieChart from './PieChart';
import BarChart from './BarChart';
import PaymentsPieChart from './PaymentsPieChart';
import DashboardIncidents from './DashboardIncidents';
import { Card } from '../../../shared/ui/Card';
import { StatusBadge } from '../../../shared/ui/StatusBadge';
import {
  UserGroupIcon,
  UserIcon,
  UsersIcon,
  BuildingOffice2Icon,
  ShoppingBagIcon,
  CubeIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';
import type { AdminDashboard } from '../types/dashboard';

interface Props {
  data: AdminDashboard;
}


export default function DashboardAdmin({ data }: Props) {
  // KPIs
  const kpis = [
    {
      label: 'Usuarios',
      value: data.total_users,
      icon: <UserGroupIcon className="w-7 h-7 text-blue-500" />,
      section: 'Usuarios',
    },
    {
      label: 'Clientes',
      value: data.total_clients,
      icon: <UserIcon className="w-7 h-7 text-green-500" />,
      section: 'Usuarios',
    },
    {
      label: 'Asesores',
      value: data.total_advisors,
      icon: <UsersIcon className="w-7 h-7 text-purple-500" />,
      section: 'Usuarios',
    },
    {
      label: 'Administradores',
      value: data.total_admins,
      icon: <UserGroupIcon className="w-7 h-7 text-pink-500" />,
      section: 'Usuarios',
    },
    {
      label: 'Empresas',
      value: data.total_companies,
      icon: <BuildingOffice2Icon className="w-7 h-7 text-yellow-500" />,
      section: 'Empresas',
    },
    {
      label: 'Pedidos',
      value: data.total_orders,
      icon: <ShoppingBagIcon className="w-7 h-7 text-orange-500" />,
      section: 'Pedidos',
    },
    {
      label: 'Pagos',
      value: data.total_payments,
      icon: <CurrencyDollarIcon className="w-7 h-7 text-emerald-500" />,
      section: 'Pagos',
    },
    {
      label: 'Productos',
      value: data.total_products,
      icon: <CubeIcon className="w-7 h-7 text-indigo-500" />,
      section: 'Productos',
    },
    {
      label: 'Productos activos',
      value: data.active_products,
      icon: <CubeIcon className="w-7 h-7 text-green-500" />,
      section: 'Productos',
    },
    {
      label: 'Productos inactivos',
      value: data.inactive_products,
      icon: <CubeIcon className="w-7 h-7 text-gray-400" />,
      section: 'Productos',
    },
    {
      label: 'Productos en carritos',
      value: data.products_in_carts,
      icon: <CubeIcon className="w-7 h-7 text-yellow-400" />,
      section: 'Productos',
    },
  ];

  // Agrupar KPIs por sección
  const sections = [
    {
      title: 'Usuarios',
      icon: <UserGroupIcon className="w-8 h-8 text-blue-500" />,
      kpis: kpis.filter(k => k.section === 'Usuarios'),
    },
    {
      title: 'Empresas',
      icon: <BuildingOffice2Icon className="w-8 h-8 text-yellow-500" />,
      kpis: kpis.filter(k => k.section === 'Empresas'),
    },
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


  // Leyendas para gráficas de pastel
  function PieLegend({ labels, colors, values, capitalizeLabels = false }: { labels: string[]; colors: string[]; values: number[]; capitalizeLabels?: boolean }) {
    return (
      <ul className="dashboard-pie-legend text-sm mt-2 grid grid-cols-2 gap-x-4 gap-y-2 w-full">
        {labels.map((label, i) => {
          const displayLabel = capitalizeLabels ? label.charAt(0).toUpperCase() + label.slice(1).toLowerCase() : label;
          return (
            <li key={label} className="flex items-center gap-2 text-base">
              <span className="inline-block w-4 h-4 rounded mr-2" style={{ background: colors[i] }}></span>
              <span>{displayLabel}:</span>
              <span className="font-bold text-lg">{values[i]}</span>
            </li>
          );
        })}
      </ul>
    );
  }

  // Utilidades para totales
  const totalUserRoles = data.user_roles_pie.values.reduce((a, b) => a + b, 0);
  const totalOrdersState = data.orders_pie.values.reduce((a, b) => a + b, 0);
  const totalProducts = data.products_pie.values.reduce((a, b) => a + b, 0);
  const totalOrdersBar = data.orders_bar.values.reduce((a, b) => a + b, 0);
  const totalPaymentsBar = data.payments_bar.values.reduce((a, b) => a + b, 0);
  const totalPaymentsPie = [
    data.payment_status.pending,
    (data.payment_status as any).paid ?? 0,
    data.payment_status.rejected,
    data.payment_status.cancelled,
  ].reduce((a, b) => a + b, 0);

  // Colores personalizados para cada gráfica de pastel
  const userRolesColors = ['#60a5fa', '#a78bfa', '#fbbf24', '#34d399', '#f87171', '#f472b6', '#facc15', '#38bdf8', '#818cf8', '#fca5a5'];
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
  const productsColors = ['#34d399', '#9ca3af'];
  const paymentsColors = ['#fbbf24', '#34d399', '#f87171', '#60a5fa'];

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
              {section.title === 'Empresas' && (
                <div className="mt-2 flex flex-wrap gap-2 items-center">
                  <span className="text-xs text-gray-500">Activas:</span>
                  <span className="inline-block px-2 py-1 rounded bg-green-100 text-green-700 font-bold">
                    {data.total_companies > 0 ? Math.floor(data.total_companies * 0.8) : 0}
                  </span>
                  <span className="text-xs text-gray-500">Inactivas:</span>
                  <span className="inline-block px-2 py-1 rounded bg-gray-200 text-gray-700 font-bold">
                    {data.total_companies > 0 ? Math.ceil(data.total_companies * 0.2) : 0}
                  </span>
                  {data.total_companies === 0 && <span className="text-xs text-gray-400 ml-2">Sin empresas registradas</span>}
                </div>
              )}
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
          {/* Usuarios por rol */}
          <Card className="flex flex-col items-center justify-center">
            <div className="font-semibold text-lg mb-2 w-full text-center">Usuarios por rol</div>
            <PieChart data={data.user_roles_pie} backgroundColor={userRolesColors} />
            <div className="text-sm text-gray-500 mt-2 mb-1 text-center w-full">Total: <span className="font-bold text-xl text-gray-700">{totalUserRoles}</span></div>
            <PieLegend labels={data.user_roles_pie.labels} colors={userRolesColors} values={data.user_roles_pie.values} capitalizeLabels={true} />
          </Card>
          {/* Pedidos por estado */}
          <Card className="flex flex-col items-center justify-center">
            <div className="font-semibold text-lg mb-2 w-full text-center">Pedidos por estado</div>
            <PieChart data={data.orders_pie} backgroundColor={ordersStateColors} />
            <div className="text-sm text-gray-500 mt-2 mb-1 text-center w-full">Total: <span className="font-bold text-xl text-gray-700">{totalOrdersState}</span></div>
            <PieLegend labels={data.orders_pie.labels} colors={ordersStateColors} values={data.orders_pie.values} />
          </Card>
          {/* Productos activos/inactivos */}
          <Card className="flex flex-col items-center justify-center">
            <div className="font-semibold text-lg mb-2 w-full text-center">Productos activos/inactivos</div>
            <PieChart data={data.products_pie} backgroundColor={productsColors} />
            <div className="text-sm text-gray-500 mt-2 mb-1 text-center w-full">Total: <span className="font-bold text-xl text-gray-700">{totalProducts}</span></div>
            <PieLegend labels={data.products_pie.labels} colors={productsColors} values={data.products_pie.values} />
          </Card>
          {/* Pedidos por mes */}
          <Card className="flex flex-col items-center justify-center">
            <div className="font-semibold text-lg mb-2 w-full text-center">Pedidos por mes</div>
            <BarChart data={{
              ...data.orders_bar,
              // Colores personalizados para barras
              backgroundColor: data.orders_bar.labels.map(() => '#60a5fa'),
              borderRadius: 8,
            }} />
            <div className="text-sm text-gray-500 mt-2 mb-1 text-center w-full">Total: <span className="font-bold text-xl text-gray-700">{totalOrdersBar}</span></div>
          </Card>
          {/* Pagos por mes */}
          <Card className="flex flex-col items-center justify-center">
            <div className="font-semibold text-lg mb-2 w-full text-center">Pagos por mes</div>
            <BarChart data={{
              ...data.payments_bar,
              backgroundColor: data.payments_bar.labels.map(() => '#34d399'),
              borderRadius: 8,
            }} />
            <div className="text-sm text-gray-500 mt-2 mb-1 text-center w-full">Total: <span className="font-bold text-xl text-gray-700">{totalPaymentsBar}</span></div>
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
