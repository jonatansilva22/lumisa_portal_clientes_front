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
        font: { weight: 'bold' as const, size: 18 },
        formatter: (_value: number, context: any) => {
          const dataset = context.chart.data.datasets[0];
          const total = dataset.data.reduce((a: number, b: number) => a + b, 0);
          const val = dataset.data[context.dataIndex];
          if (!val || total === 0) return '';
          const percent = Math.round((val / total) * 100);
          return percent + '%';
        },
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
     
    </div>
  );
}
