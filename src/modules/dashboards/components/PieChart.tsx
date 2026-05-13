import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import type { PieChartData } from '../types/dashboard';

ChartJS.register(ArcElement, Tooltip, Legend);

interface Props {
  data: PieChartData;
  title?: string;
  backgroundColor?: string[];
}

import ChartDataLabels from 'chartjs-plugin-datalabels';
ChartJS.register(ChartDataLabels);

export default function PieChart({ data, title, backgroundColor }: Props) {
  // Permitir backgroundColor personalizado si viene como prop
  const bgColors = backgroundColor || [
    '#60a5fa', '#fbbf24', '#34d399', '#f87171', '#a78bfa', '#f472b6', '#facc15', '#38bdf8', '#818cf8', '#fca5a5',
  ];
  const chartData = {
    labels: data.labels,
    datasets: [
      {
        data: data.values,
        backgroundColor: bgColors,
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
      {title && <div className="font-semibold mb-2">{title}</div>}
      <div className="w-64 h-64">
        <Pie data={chartData} options={options} plugins={[ChartDataLabels]} />
      </div>
    </div>
  );
}
