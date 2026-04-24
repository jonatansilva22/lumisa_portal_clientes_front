export type Chat = {
  id: number;
  order_id: number;
  sender_id: number;
  receiver_id: number;
  message: string;
  read: boolean;
  sent_at: string;
};

export type ChatCreate = {
  order_id: number;
  receiver_id: number;
  message: string;
};