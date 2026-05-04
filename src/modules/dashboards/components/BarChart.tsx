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
        anchor: 'center',
        align: 'center',
        color: '#fff',
        font: { weight: 'bold', size: 16 },
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
        ticks: { color: '#888', font: { weight: 'bold' } },
      },
      y: {
        beginAtZero: true,
        grid: { color: '#eee' },
        ticks: { stepSize: 1, color: '#888', font: { weight: 'bold' } },
      },
    },
  };

  return (
    <div className="w-full flex flex-col items-center">
      {title && <div className="font-semibold text-lg mb-2 w-full text-center">{title}</div>}
      <div className="w-80 h-64">
        <Bar data={chartData} options={options} plugins={[ChartDataLabels]} />
      </div>
    </div>
  );
}
