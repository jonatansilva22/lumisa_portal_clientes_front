// --- Historial de ventas para admin/asesor ---
export interface SaleHistory {
  order_id: number;
  folio: string;
  client: {
    id: number;
    name: string;
  };
  company: {
    id: number;
    name: string;
  };
  total_payment: number;
  paid_at: string; // ISO date
}

export interface SalesHistorySummary {
  total_sales: number;
  total_earnings: number;
}

export interface SalesHistoryResponse extends SalesHistorySummary {
  sales: SaleHistory[];
}

export type SalesHistoryPeriod = 'monthly' | 'weekly' | 'yearly' | '';
