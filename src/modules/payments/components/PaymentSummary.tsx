import type { Order } from '../../orders/types/order';

interface PaymentSummaryProps {
  order: Order;
}

export function PaymentSummary({ order }: PaymentSummaryProps) {
  const total = typeof order.total_payment === 'string' ? parseFloat(order.total_payment) : order.total_payment;
  return (
    <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-2xl p-6 shadow flex items-center gap-4 mb-4">
      <div className="flex items-center justify-center w-14 h-14 rounded-full bg-blue-200/60">
        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3zm0 0V4m0 16v-4m8-4h-4m-8 0H4" /></svg>
      </div>
      <div className="flex-1">
        <h3 className="font-bold text-xl text-blue-800 mb-1">Resumen del pedido</h3>
        <div className="flex flex-col gap-1 text-base text-blue-900">
          <div>
            <span className="font-semibold">Folio:</span> <span className="ml-1">{order.folio}</span>
          </div>
          <div>
            <span className="font-semibold">Total a pagar:</span> <span className="ml-1 text-lg font-bold text-green-600">${Number.isFinite(total) ? total.toFixed(2) : '-'}</span>
          </div>
          <div>
            <span className="font-semibold">Productos:</span> <span className="ml-1">{order.order_details?.length ?? 0}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
