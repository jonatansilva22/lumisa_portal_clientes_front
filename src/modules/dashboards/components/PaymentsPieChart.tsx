import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import type { PaymentStatusSummary } from '../types/dashboard';

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const LABELS = ['Pendiente', 'Pagado', 'Rechazado', 'Cancelado'];
const COLORS = [
  '#fbbf24', // Pendiente (amarillo)
  '#34d399', // Pagado (verde)
  '#f87171', // Rechazado (rojo)
  '#60a5fa', // Cancelado (azul)
];

interface Props {
  paymentStatus: PaymentStatusSummary;
}

export default function PaymentsPieChart({ paymentStatus }: Props) {
  const values = [
    paymentStatus.pending,
    paymentStatus.paid,
    paymentStatus.rejected,
    paymentStatus.cancelled,
  ];
  const total = values.reduce((a, b) => a + b, 0);

  const chartData = {
    labels: LABELS,
    datasets: [
      {
        data: values,
        backgroundColor: COLORS,
        borderWidth: 1,
      },
    ],
  };

  const options = {
    plugins: {
      datalabels: {
        color: '#222',
        font: { weight: 'bold', size: 18 },
        formatter: (value: number) => value === 0 ? '' : value,
      },
      legend: { display: false },
    },
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-64 h-64">
        <Pie data={chartData} options={options} plugins={[ChartDataLabels]} />
      </div>
      <div className="text-sm text-gray-500 mt-2 mb-1 text-center w-full">Total: <span className="font-bold text-xl text-gray-700">{total}</span></div>
      <ul className="text-sm mt-2 grid grid-cols-2 gap-x-4 gap-y-2 w-full">
        {LABELS.map((label, i) => (
          <li key={label} className="flex items-center gap-2 text-base">
            <span style={{ background: COLORS[i], width: 16, height: 16, borderRadius: 3, display: 'inline-block' }}></span>
            <span>{label}:</span>
            <span className="font-bold text-lg">{values[i]}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
