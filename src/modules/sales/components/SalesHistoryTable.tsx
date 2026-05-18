import { Table } from "../../../shared/ui/Table";
import type { SaleHistory } from "../types/salesHistory";

interface SalesHistoryTableProps {
  sales: SaleHistory[];
  loading: boolean;
  error: string | null;
}

export function SalesHistoryTable({ sales, loading, error }: SalesHistoryTableProps) {
  return (
    <div className="w-full max-w-7xl mx-auto overflow-x-auto rounded-2xl shadow bg-white border border-gray-200">
      <Table
        columns={[
          { header: <span className="text-base font-bold">Folio</span>, accessor: "folio" },
          { header: <span className="text-base font-bold">Cliente</span>, accessor: (row: any) => row.client_name ?? '-' },
          { header: <span className="text-base font-bold">Empresa</span>, accessor: (row: any) => row.company_name ?? '-' },
          { header: <span className="text-base font-bold">Productos</span>, accessor: (row: SaleHistory) => row.product_names?.join(', ') ?? '-' },
          { header: <span className="text-base font-bold">Precio productos</span>, accessor: (row: SaleHistory) => `$${row.products_price.toLocaleString('es-MX', {minimumFractionDigits:2})}` },
          { header: <span className="text-base font-bold">Envío</span>, accessor: (row: SaleHistory) => `$${row.shipping_price.toLocaleString('es-MX', {minimumFractionDigits:2})}` },
          { header: <span className="text-base font-bold">Total</span>, accessor: (row: SaleHistory) => `$${row.total_price.toLocaleString('es-MX', {minimumFractionDigits:2})}` },
          { header: <span className="text-base font-bold">Pagado en</span>, accessor: (row: SaleHistory) => new Date(row.paid_at).toLocaleDateString('es-MX') },
        ]}
        data={sales}
      />
      {(!sales.length && !loading) && (
        <div className="p-4 text-center text-gray-400">
          {error ? <span className="text-red-400">{error}</span> : 'Sin ventas en este periodo.'}
        </div>
      )}
    </div>
  );
}
