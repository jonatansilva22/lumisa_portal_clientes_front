import type { PaymentStatusSummary } from '../types/dashboard';

interface Props {
  paymentStatus: PaymentStatusSummary;
}

export default function DashboardPaymentsChart({ paymentStatus }: Props) {
  // Simulación de gráfica de pastel para pagos por estado
  const labels = ['Pendiente', 'Autorizado', 'Rechazado', 'Cancelado', 'Otro'];
  const values = [
    paymentStatus.pending,
    paymentStatus.authorized,
    paymentStatus.rejected,
    paymentStatus.cancelled,
    paymentStatus.other,
  ];
  return (
    <div className="bg-white rounded shadow p-4 w-full max-w-md">
      <div className="font-semibold mb-2">Pagos por estado</div>
      <div className="text-gray-400 text-sm">[Gráfica de pastel aquí]</div>
      <ul className="text-xs mt-2">
        {labels.map((label, i) => (
          <li key={label}>{label}: <span className="font-bold">{values[i]}</span></li>
        ))}
      </ul>
    </div>
  );
}
