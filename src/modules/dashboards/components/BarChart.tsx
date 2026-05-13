import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import type { BarChartData } from '../types/dashboard';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartDataLabels);


interface Props {
  data: BarChartData & {
    backgroundColor?: string[] | string;
    borderRadius?: number;
  };
  title?: string;
}


export default function BarChart({ data, title }: Props) {
  const backgroundColor = data.backgroundColor || '#60a5fa';
  const borderRadius = data.borderRadius ?? 8;
  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: title || 'Datos',
        data: data.values,
        backgroundColor,
        borderRadius,
        borderSkipped: false,
        barPercentage: 0.7,
        categoryPercentage: 0.7,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: !!title, text: title },
      datalabels: {
        anchor: 'center' as const,
        align: 'center' as const,
        color: '#fff',
        font: { weight: 'bold' as const, size: 16 },
        formatter: (value: number) => value === 0 ? '' : value,
        offset: 0,
      },
      tooltip: {
        callbacks: {
          label: (ctx: any) => `${ctx.dataset.label}: ${ctx.parsed.y}`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#888', font: { weight: 'bold' as const } },
      },
      y: {
        beginAtZero: true,
        grid: { color: '#eee' },
        ticks: { stepSize: 1, color: '#888', font: { weight: 'bold' as const } },
      },
    },
  };

  return (
    <div className="w-full flex flex-col items-center">
      {title && <div className="font-semibold text-lg mb-2 w-full text-center">{title}</div>}
      <div className="w-full h-64 max-w-xs mx-auto">
        <Bar data={chartData} options={options} plugins={[ChartDataLabels]} style={{ width: '100%', height: '100%' }} />
      </div>
    </div>
  );
}
