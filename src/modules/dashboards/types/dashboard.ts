// Tipos para los dashboards de cliente, asesor y admin

export type PieChartData = {
  labels: string[];
  values: number[];
};

export type BarChartData = {
  labels: string[];
  values: number[];
};

export type PaymentStatusSummary = {
  pending: number;
  paid: number;
  rejected: number;
  cancelled: number;
};

export type ClientDashboard = {
  company_info: Record<string, any>;
  total_orders: number;
  orders_by_status: Record<string, number>;
  total_paid: number;
  cart_products_count: number;
  payment_status: PaymentStatusSummary;
  incidents: Array<Record<string, any>>;
  orders_pie: PieChartData;
  orders_bar: BarChartData;
  recent_activity: string[];
  total_products: number;
};

export type AdvisorDashboard = {
  total_clients: number;
  total_orders: number;
  orders_by_status: Record<string, number>;
  products_managed: number;
  payment_status: PaymentStatusSummary;
  companies_info: Array<Record<string, any>>; // Igual que el admin
  incidents: Array<Record<string, any>>;
  orders_pie: PieChartData;
  orders_bar: BarChartData;
  notifications: Array<Record<string, any>>;
  recent_activity: string[];
  total_companies?: number; // compatibilidad legacy opcional
  companies_pie: PieChartData;
};

export type AdminDashboard = {
  total_users: number;
  total_clients: number;
  total_advisors: number;
  total_admins: number;
  total_companies: number;
  active_companies: number;
  inactive_companies: number;
  total_orders: number;
  total_payments: number;
  total_products: number;
  active_products: number;
  inactive_products: number;
  products_in_carts: number;
  payment_status: PaymentStatusSummary;
  orders_by_status: Record<string, number>;
  user_roles_pie: PieChartData;
  orders_pie: PieChartData;
  products_pie: PieChartData;
  orders_bar: BarChartData;
  payments_bar: BarChartData;
  incidents: Array<Record<string, any>>;
  notifications: Array<Record<string, any>>;
  recent_activity: string[];
};
