import { Table } from '../../../shared/ui/Table';
import type { PurchaseHistory } from '../types/salesHistoryPurchases';

interface PurchaseHistoryTableProps {
  purchases: PurchaseHistory[];
  loading: boolean;
  error: string | null;
}

export function PurchaseHistoryTable({ purchases, loading, error }: PurchaseHistoryTableProps) {
  return (
    <div className="w-full max-w-7xl mx-auto overflow-x-auto rounded-2xl shadow bg-white border border-gray-200">
      <Table
        columns={[
          { header: <span className="text-base font-bold">Folio</span>, accessor: 'folio' },
          { header: <span className="text-base font-bold">Empresa</span>, accessor: (row: PurchaseHistory) => row.company_name ?? '-' },
          { header: <span className="text-base font-bold">Productos</span>, accessor: (row: PurchaseHistory) => row.product_names?.join(', ') ?? '-' },
          { header: <span className="text-base font-bold">Precio productos</span>, accessor: (row: PurchaseHistory) => `$${row.products_price.toLocaleString('es-MX', {minimumFractionDigits:2})}` },
          { header: <span className="text-base font-bold">Envío</span>, accessor: (row: PurchaseHistory) => `$${row.shipping_price.toLocaleString('es-MX', {minimumFractionDigits:2})}` },
          { header: <span className="text-base font-bold">Total</span>, accessor: (row: PurchaseHistory) => `$${row.total_price.toLocaleString('es-MX', {minimumFractionDigits:2})}` },
          { header: <span className="text-base font-bold">Pagado en</span>, accessor: (row: PurchaseHistory) => new Date(row.paid_at).toLocaleDateString('es-MX') },
        ]}
        data={purchases}
      />
      {(!purchases.length && !loading) && (
        <div className="p-4 text-center text-gray-400">
          {error ? <span className="text-red-400">{error}</span> : 'Sin compras en este periodo.'}
        </div>
      )}
    </div>
  );
}
