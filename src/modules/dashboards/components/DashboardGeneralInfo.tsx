import type { ClientDashboard } from '../types/dashboard';

interface Props {
  data: ClientDashboard;
}

export default function DashboardGeneralInfo({ data }: Props) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-white rounded shadow p-4">
        <div className="text-gray-500">Pedidos totales</div>
        <div className="text-2xl font-bold">{data.total_orders}</div>
      </div>
      <div className="bg-white rounded shadow p-4">
        <div className="text-gray-500">Total pagado</div>
        <div className="text-2xl font-bold">${data.total_paid.toLocaleString()}</div>
      </div>
      <div className="bg-white rounded shadow p-4">
        <div className="text-gray-500">Productos en carrito</div>
        <div className="text-2xl font-bold">{data.cart_products_count}</div>
      </div>
      <div className="bg-white rounded shadow p-4">
        <div className="text-gray-500">Pagos pendientes</div>
        <div className="text-2xl font-bold">{data.payment_status.pending}</div>
      </div>
    </div>
  );
}
