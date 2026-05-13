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
          { header: <span className="text-base font-bold">Cliente</span>, accessor: (row: any) => row.client?.name ?? row.client_name ?? '-' },
          { header: <span className="text-base font-bold">Empresa</span>, accessor: (row: any) => row.company?.name ?? row.company_name ?? '-' },
          { header: <span className="text-base font-bold">Total</span>, accessor: (row: SaleHistory) => `$${row.total_payment.toLocaleString('es-MX', {minimumFractionDigits:2})}` },
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
