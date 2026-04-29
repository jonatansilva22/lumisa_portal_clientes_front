export interface Payment {
  id: number;
  amount: number;
  order_id: number;
  method_id: number;
  status_id: number;
  paid_at?: string | null;
  created_at?: string;
  updated_at?: string;
  // MercadoPago init_point para redirigir al pago
  mp_init_point?: string;
}

export interface PaymentCreate {
  amount: number;
  order_id: number;
  method_id: number;
}

export interface PaymentMethod {
  id: number;
  name: string;
}

export interface PaymentStatus {
  id: number;
  name: string;
}
