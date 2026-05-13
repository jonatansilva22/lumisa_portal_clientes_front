// --- Historial de compras para cliente ---
export interface PurchaseHistory {
  order_id: number;
  folio: string;
  company_id: number;
  company_name: string;
  total_payment: number;
  paid_at: string; // ISO date
}

export interface PurchaseHistorySummary {
  total_purchases: number;
  total_spent: number;
}

export interface PurchaseHistoryResponse extends PurchaseHistorySummary {
  purchases: PurchaseHistory[];
}

export type PurchaseHistoryPeriod = 'monthly' | 'weekly' | 'yearly' | '';
