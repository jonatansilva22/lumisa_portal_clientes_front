export interface Notification {
  id: number;
  user_id: number;
  order_id?: number | null;
  type: string;
  message: string;
  read: boolean;
  created_at: string;
  updated_at?: string | null;
}

