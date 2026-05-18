// --- Historial de ventas para admin/asesor ---
export interface SaleHistory {
  order_id: number;
  folio: string;
  client_id: number;
  client_name: string;
  company_id: number;
  company_name: string;
  total_payment: number;
  paid_at: string; // ISO date
  // Nuevos campos
  product_names: string[];
  products_price: number;
  shipping_price: number;
  total_price: number;
}

export interface SalesHistorySummary {
  total_sales: number;
  total_earnings: number;
}

export interface SalesHistoryResponse extends SalesHistorySummary {
  sales: SaleHistory[];
}

export type SalesHistoryPeriod = 'monthly' | 'weekly' | 'yearly' | '';
