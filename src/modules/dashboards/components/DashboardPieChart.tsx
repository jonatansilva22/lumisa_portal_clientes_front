import type { PieChartData } from '../types/dashboard';

interface Props {
  data: PieChartData;
  title?: string;
}

export default function DashboardPieChart({ data, title }: Props) {
  // Aquí irá la integración con una librería de gráficas (ej: recharts, chart.js, etc)
  return (
    <div className="bg-white rounded shadow p-4 w-full max-w-md">
      <div className="font-semibold mb-2">{title}</div>
      <div className="text-gray-400 text-sm">[Gráfica de pastel aquí]</div>
      <pre className="text-xs mt-2">{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
