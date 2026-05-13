
import PieChart from './PieChart';
import BarChart from './BarChart';
import PaymentsPieChart from './PaymentsPieChart';
import { Card } from '../../../shared/ui/Card';
import { ShoppingBagIcon, CurrencyDollarIcon, ShoppingCartIcon, BuildingOffice2Icon, CubeIcon } from '@heroicons/react/24/outline';
import type { ClientDashboard } from '../types/dashboard';

interface Props {
  data: ClientDashboard;
  showOnlyCharts?: boolean;
}

export default function DashboardClient({ data, showOnlyCharts }: Props) {
  // Totales
  const totalPedidos = data.orders_pie.values.reduce((a, b) => a + b, 0);
  const totalPagos = Object.values(data.payment_status).reduce((a, b) => a + b, 0);
  const totalPorMes = data.orders_bar.values.reduce((a, b) => a + b, 0);

  // Colores para pie chart pedidos
  const estadoColor: Record<string, string> = {
    'Pendiente': '#fbbf24',
    'Autorizado': '#a78bfa',
    'Pagado': '#34d399',
    'Cancelado': '#9ca3af',
    'Rechazado': '#f87171',
  };
  const pieColors = data.orders_pie.labels.map(label => estadoColor[label] || '#38bdf8');

  if (showOnlyCharts) {
    return (
      <div className="w-full flex flex-col items-center gap-6">
        <h2 className="text-2xl font-bold mb-2 text-center">Gráficas</h2>
        <div className="w-full flex flex-wrap justify-center items-stretch gap-8">
        {/* Pedidos por estado */}
        <Card className="flex flex-col items-center justify-center w-full max-w-md p-6">
          <div className="font-semibold text-lg mb-2 w-full text-center">Pedidos por estado</div>
          <PieChart data={data.orders_pie} backgroundColor={pieColors} />
          <div className="text-sm text-gray-500 mt-2 mb-1 text-center w-full">Total: <span className="font-bold text-xl text-gray-700">{totalPedidos}</span></div>
          <ul className="dashboard-pie-legend text-sm mt-2 grid grid-cols-2 gap-x-4 gap-y-2 w-full">
            {data.orders_pie.labels.map((label, i) => (
              <li key={label} className="flex items-center gap-2 text-base">
                <span className="inline-block w-4 h-4 rounded" style={{ background: pieColors[i] }}></span>
                <span>{label}:</span>
                <span className="font-bold text-lg">{data.orders_pie.values[i]}</span>
              </li>
            ))}
          </ul>
        </Card>
        {/* Pedidos por mes */}
        <Card className="flex flex-col items-center justify-center w-full max-w-md p-6">
          <div className="font-semibold text-lg mb-2 w-full text-center">Pedidos por mes</div>
          <BarChart data={data.orders_bar} />
          <div className="text-sm text-gray-500 mt-2 text-center w-full">Total: <span className="font-bold text-xl text-gray-700">{totalPorMes}</span></div>
        </Card>
        {/* Pagos por estado */}
        <Card className="flex flex-col items-center justify-center w-full max-w-md p-6">
          <div className="font-semibold text-lg mb-2 w-full text-center">Pagos por estado</div>
          <PaymentsPieChart paymentStatus={data.payment_status} />
            <div className="w-full flex flex-col items-center mt-2">
              <ul className="flex flex-row flex-wrap gap-x-4 gap-y-1 justify-center w-full">
                {/* Colores: pendientes amarillo, pagados verde, rechazados rojo, cancelados gris */}
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
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10 w-full items-center">
      <h1 className="text-3xl font-bold text-center mb-2 mt-2">Dashboard Cliente</h1>
      <h2 className="text-2xl font-bold mb-2 text-center">Información General</h2>
      {/* Empresa asociada */}
      <Card className="w-full max-w-3xl mx-auto flex flex-col gap-2 p-6">
        <div className="flex items-center gap-2 mb-2">
          <BuildingOffice2Icon className="w-7 h-7 text-yellow-500" />
          <span className="font-bold text-lg text-gray-700">Empresa asociada</span>
          {data.company_info?.active !== undefined && (
            <span className={`ml-2 px-2 py-1 rounded text-xs font-bold ${data.company_info.active ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-700'}`}>
              {data.company_info.active ? 'Activa' : 'Inactiva'}
            </span>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div><span className="text-gray-500">Nombre: </span>{data.company_info?.name || '-'}</div>
          <div><span className="text-gray-500">RFC: </span>{data.company_info?.rfc || '-'}</div>
          <div><span className="text-gray-500">Dirección: </span>{data.company_info?.address || '-'}</div>
          <div><span className="text-gray-500">Teléfono: </span>{data.company_info?.phone || '-'}</div>
          <div><span className="text-gray-500">Email: </span>{data.company_info?.email || '-'}</div>
          {data.company_info?.observations && (
            <div className="md:col-span-2"><span className="text-gray-500">Observaciones: </span>{data.company_info.observations}</div>
          )}
        </div>
      </Card>
        {/* KPIs */}
        <Card className="w-full max-w-3xl mx-auto flex flex-col gap-4 p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex flex-col items-center justify-center">
              <ShoppingBagIcon className="w-8 h-8 text-orange-500 mb-1" />
              <span className="text-xs text-gray-500">Pedidos totales</span>
              <span className="text-2xl font-bold text-gray-800">{data.total_orders}</span>
            </div>
            <div className="flex flex-col items-center justify-center">
              <CubeIcon className="w-8 h-8 text-indigo-500 mb-1" />
              <span className="text-xs text-gray-500">Productos</span>
              <span className="text-2xl font-bold text-gray-800">{data.total_products ?? '-'}</span>
                <span className="text-2xl font-bold text-gray-800">{data.total_products}</span>
            </div>
            <div className="flex flex-col items-center justify-center">
              <ShoppingCartIcon className="w-8 h-8 text-blue-500 mb-1" />
              <span className="text-xs text-gray-500">Productos en carrito</span>
              <span className="text-2xl font-bold text-gray-800">{data.cart_products_count}</span>
            </div>
            <div className="flex flex-col items-center justify-center">
              <CurrencyDollarIcon className="w-8 h-8 text-yellow-500 mb-1" />
              <span className="text-xs text-gray-500">Pagos pendientes</span>
              <span className="text-2xl font-bold text-gray-800">{data.payment_status?.pending}</span>
            </div>
          </div>
        </Card>
      {/* Gráficas */}
      <div className="w-full flex flex-wrap justify-center items-stretch gap-8">
        {/* Pedidos por estado */}
        <Card className="flex flex-col items-center justify-center w-full max-w-md p-6">
          <div className="font-semibold text-lg mb-2 w-full text-center">Pedidos por estado</div>
          <PieChart data={data.orders_pie} backgroundColor={pieColors} />
          <div className="text-sm text-gray-500 mt-2 mb-1 text-center w-full">Total: <span className="font-bold text-xl text-gray-700">{totalPedidos}</span></div>
          <ul className="dashboard-pie-legend text-sm mt-2 grid grid-cols-2 gap-x-4 gap-y-2 w-full">
            {data.orders_pie.labels.map((label, i) => (
              <li key={label} className="flex items-center gap-2 text-base">
                <span className="inline-block w-4 h-4 rounded" style={{ background: pieColors[i] }}></span>
                <span>{label}:</span>
                <span className="font-bold text-lg">{data.orders_pie.values[i]}</span>
              </li>
            ))}
          </ul>
        </Card>
        {/* Pedidos por mes */}
        <Card className="flex flex-col items-center justify-center w-full max-w-md p-6">
          <div className="font-semibold text-lg mb-2 w-full text-center">Pedidos por mes</div>
          <BarChart data={data.orders_bar} />
          <div className="text-sm text-gray-500 mt-2 text-center w-full">Total: <span className="font-bold text-xl text-gray-700">{totalPorMes}</span></div>
        </Card>
        {/* Pagos por estado */}
        <Card className="flex flex-col items-center justify-center w-full max-w-md p-6">
          <div className="font-semibold text-lg mb-2 w-full text-center">Pagos por estado</div>
          <PaymentsPieChart paymentStatus={data.payment_status} />
          <div className="text-sm text-gray-500 mt-2 text-center w-full">Total: <span className="font-bold text-xl text-gray-700">{totalPagos}</span></div>
        </Card>
      </div>
    </div>
  );
}
