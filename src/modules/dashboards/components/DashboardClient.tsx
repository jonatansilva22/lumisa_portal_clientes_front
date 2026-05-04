import DashboardGeneralInfo from './DashboardGeneralInfo';
import PieChart from './PieChart';
import BarChart from './BarChart';
import DashboardIncidents from './DashboardIncidents';
import DashboardCompanyInfo from './DashboardCompanyInfo';
import PaymentsPieChart from './PaymentsPieChart';
import type { ClientDashboard } from '../types/dashboard';

interface Props {
  data: ClientDashboard;
}

export default function DashboardClient({ data }: Props) {
  // Totales
  const totalPedidos = data.orders_pie.values.reduce((a, b) => a + b, 0);
  const totalPagos = Object.values(data.payment_status).reduce((a, b) => a + b, 0);
  const totalPorMes = data.orders_bar.values.reduce((a, b) => a + b, 0);

  return (
    <div className="flex flex-col gap-8">
      <DashboardCompanyInfo company={data.company_info} />
      <DashboardGeneralInfo data={data} />
      <div className="flex flex-wrap gap-8 justify-center">
        {/* Card Pedidos por estado */}
        <div className="bg-white rounded shadow p-6 w-full max-w-md flex flex-col items-center">
          <div className="font-semibold text-lg mb-2 w-full text-center">Pedidos por estado</div>
          <div className="w-full flex flex-col items-center">
            {(() => {
              // Mapeo de colores por estado
              const estadoColor: Record<string, string> = {
                'Pendiente': '#fbbf24',    // naranja
                'Autorizado': '#a78bfa',  // morado
                'Pagado': '#34d399',      // verde
                'Cancelado': '#9ca3af',   // gris
                'Rechazado': '#f87171',   // rojo
              };
              // Arreglo de colores en el orden de los labels
              const colors = data.orders_pie.labels.map(label => estadoColor[label] || '#38bdf8');
              // Pasar los colores personalizados a PieChart usando una prop especial
              return <>
                <PieChart data={{
                  ...data.orders_pie,
                  // @ts-ignore
                  backgroundColor: colors,
                }} title={undefined} />
                <style>{`.dashboard-pie-legend span.color { display:inline-block;width:16px;height:16px;border-radius:3px;margin-right:6px;}`}</style>
                <div className="text-sm text-gray-500 mt-2 mb-1 text-center w-full">Total: <span className="font-bold text-xl text-gray-700">{totalPedidos}</span></div>
                <ul className="dashboard-pie-legend text-sm mt-2 grid grid-cols-2 gap-x-4 gap-y-2 w-full">
                  {data.orders_pie.labels.map((label, i) => (
                    <li key={label} className="flex items-center gap-2 text-base">
                      <span className="color" style={{ background: colors[i] }}></span>
                      <span>{label}:</span>
                      <span className="font-bold text-lg">{data.orders_pie.values[i]}</span>
                    </li>
                  ))}
                </ul>
              </>;
            })()}
          </div>
        </div>
        {/* Card Pedidos por mes */}
        <div className="bg-white rounded shadow p-6 w-full max-w-md flex flex-col items-center">
          <div className="font-semibold text-lg mb-2 w-full text-center">Pedidos por mes</div>
          <BarChart data={data.orders_bar} />
          <div className="text-sm text-gray-500 mt-2 text-center w-full">Total: <span className="font-bold text-xl text-gray-700">{totalPorMes}</span></div>
        </div>
        {/* Card Pagos por estado */}
        <div className="bg-white rounded shadow p-6 w-full max-w-md flex flex-col items-center">
          <div className="font-semibold text-lg mb-2 w-full text-center">Pagos por estado</div>
          <PaymentsPieChart paymentStatus={data.payment_status} />
          <div className="text-sm text-gray-500 mt-2 text-center w-full">Total: <span className="font-bold text-xl text-gray-700">{totalPagos}</span></div>
        </div>
      </div>
      <DashboardIncidents incidents={data.incidents} />
    </div>
  );
}
