  // ...existing code...
import React from "react";
import PieChart from './PieChart';
import BarChart from './BarChart';
import PaymentsPieChart from './PaymentsPieChart';
import { Card } from '../../../shared/ui/Card';
import PieLegend from "./PieLegend";
import type { AdminDashboard } from '../types/dashboard';

interface ChartsSectionProps {
  data: AdminDashboard;
  section?: 'Usuarios' | 'Empresas' | 'Pedidos' | 'Pagos' | 'Productos';
  userRolesColors: string[];
  ordersStateColors: string[];
  productsColors: string[];
  totalUserRoles: number;
  totalOrdersState: number;
  totalOrdersBar: number;
  totalProducts: number;
  totalPaymentsBar: number;
}

const ChartsSection: React.FC<ChartsSectionProps> = ({
  data, section, userRolesColors, ordersStateColors, productsColors, totalUserRoles, totalOrdersState, totalOrdersBar, totalProducts, totalPaymentsBar
}) => {
  // Pie de empresas usando datos reales
  const companiesPie = {
    labels: ['Activas', 'Inactivas'],
    values: [
      typeof data.active_companies === 'number' ? data.active_companies : 0,
      typeof data.inactive_companies === 'number' ? data.inactive_companies : 0,
    ],
  };
  const companiesColors = ["#34d399", "#9ca3af"];
  let charts: React.ReactNode[] = [];
  const cardClass = "flex flex-col items-center justify-center rounded-2xl bg-white/80 shadow-xl border border-gray-100 w-full max-w-xs sm:max-w-sm md:max-w-md mx-auto p-2 sm:p-4 md:p-6";
  if (!section || section === 'Usuarios') {
    charts.push(
      <Card key="usuarios" className={cardClass}>
        <div className="font-semibold text-lg mb-2 w-full text-center">Usuarios por rol</div>
        <PieChart data={data.user_roles_pie} backgroundColor={userRolesColors} />
        <div className="text-sm text-gray-500 mt-2 mb-1 text-center w-full">Total: <span className="font-bold text-xl text-gray-700">{totalUserRoles}</span></div>
        <PieLegend labels={data.user_roles_pie.labels} colors={userRolesColors} values={data.user_roles_pie.values} capitalizeLabels={true} />
      </Card>
    );
  }
  if (!section || section === 'Pedidos') {
    charts.push(
      <Card key="pedidos-estado" className={cardClass}>
        <div className="font-semibold text-lg mb-2 w-full text-center">Pedidos por estado</div>
        <PieChart data={data.orders_pie} backgroundColor={ordersStateColors} />
        <div className="text-sm text-gray-500 mt-2 mb-1 text-center w-full">Total: <span className="font-bold text-xl text-gray-700">{totalOrdersState}</span></div>
        <PieLegend labels={data.orders_pie.labels} colors={ordersStateColors} values={data.orders_pie.values} />
      </Card>
    );
    charts.push(
      <Card key="pedidos-mes" className={cardClass}>
        <div className="font-semibold text-lg mb-2 w-full text-center">Pedidos por mes</div>
        <BarChart data={{
          ...data.orders_bar,
          backgroundColor: data.orders_bar.labels.map(() => '#60a5fa'),
          borderRadius: 8,
        }} />
        <div className="text-sm text-gray-500 mt-2 mb-1 text-center w-full">Total: <span className="font-bold text-xl text-gray-700">{totalOrdersBar}</span></div>
      </Card>
    );
  }
  if (!section || section === 'Empresas') {
    charts.push(
      <Card key="empresas-pie" className={cardClass}>
        <div className="font-semibold text-lg mb-2 w-full text-center">Empresas activas/inactivas</div>
        <PieChart data={companiesPie} backgroundColor={companiesColors} />
        <div className="text-sm text-gray-500 mt-2 mb-1 text-center w-full">Total: <span className="font-bold text-xl text-gray-700">{data.total_companies}</span></div>
        <PieLegend labels={companiesPie.labels} colors={companiesColors} values={companiesPie.values} />
      </Card>
    );
  }
  if (!section || section === 'Productos') {
    charts.push(
      <Card key="productos" className={cardClass}>
        <div className="font-semibold text-lg mb-2 w-full text-center">Productos activos/inactivos</div>
        <PieChart data={data.products_pie} backgroundColor={productsColors} />
        <div className="text-sm text-gray-500 mt-2 mb-1 text-center w-full">Total: <span className="font-bold text-xl text-gray-700">{totalProducts}</span></div>
        <PieLegend labels={data.products_pie.labels} colors={productsColors} values={data.products_pie.values} />
      </Card>
    );
  }
  if (!section || section === 'Pagos') {
    charts.push(
      <Card key="pagos-mes" className={cardClass}>
        <div className="font-semibold text-lg mb-2 w-full text-center">Pagos por mes</div>
        <BarChart data={{
          ...data.payments_bar,
          backgroundColor: data.payments_bar.labels.map(() => '#34d399'),
          borderRadius: 8,
        }} />
        <div className="text-sm text-gray-500 mt-2 mb-1 text-center w-full">Total: <span className="font-bold text-xl text-gray-700">{totalPaymentsBar}</span></div>
      </Card>
    );
    // Leyenda igual que cliente
    const paymentsLegendLabels = [
      { label: 'Pendiente', color: '#fbbf24', value: data.payment_status?.pending ?? 0 },
      { label: 'Pagado', color: '#34d399', value: data.payment_status?.paid ?? 0 },
      { label: 'Rechazado', color: '#f87171', value: data.payment_status?.rejected ?? 0 },
      { label: 'Cancelado', color: '#9ca3af', value: data.payment_status?.cancelled ?? 0 },
    ];
    charts.push(
      <Card key="pagos-estado" className={cardClass}>
        <div className="font-semibold text-lg mb-2 w-full text-center">Pagos por estado</div>
        <PaymentsPieChart paymentStatus={data.payment_status} />
        <div className="w-full flex flex-col items-center mt-2">
          <ul className="flex flex-row flex-wrap gap-x-4 gap-y-1 justify-center w-full">
            {paymentsLegendLabels.map((item) => (
              <li key={item.label} className="flex items-center gap-2 text-base">
                <span className="inline-block w-4 h-4 rounded" style={{ background: item.color }}></span>
                <span className="text-gray-700">{item.label}:</span>
                <span className="font-bold text-lg">{item.value}</span>
              </li>
            ))}
          </ul>
        </div>
      </Card>
    );
  }
  // Layout igual que otros módulos: solo flex-wrap y gap, sin div extra por card
  return (
    <div className="w-full flex flex-wrap justify-center items-start gap-4 md:gap-6 lg:gap-8 min-w-0">
      {charts}
    </div>
  );
};

export default ChartsSection;
