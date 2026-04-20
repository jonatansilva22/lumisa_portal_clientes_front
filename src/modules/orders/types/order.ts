// Tipos para el módulo de pedidos (orders)
export interface OrderDetail {
  id: number;
  product_id: number;
  quantity: number;
  unit_price: number | string; // Puede venir como string desde el backend
}

export interface UserShort {
  id: number;
  name: string;
  last_name: string;
}

export interface CompanyShort {
  id: number;
  name: string;
}

export interface Order {
  id: number;
  folio: string;
  description?: string | null;
  total_payment: number | string; // Puede venir como string desde el backend
  status_id: number;
  client: UserShort;
  advisor?: UserShort | null;
  company: CompanyShort;

  // Compatibilidad con respuestas antiguas
  client_id?: number;
  advisor_id?: number | null;
  company_id: number;
  created_at?: string;
  updated_at?: string;
  order_details: OrderDetail[];
}

export interface OrderStatus {
  id: number;
  name: string;
}
