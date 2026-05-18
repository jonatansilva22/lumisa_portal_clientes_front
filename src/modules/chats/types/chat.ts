export type Chat = {
  id: number;
  order_id: number | null;
  sender_id: number;
  receiver_id: number;
  message: string;
  file_url?: string | null;
  read: boolean;
  sent_at: string;
};

export type ChatCreate = {
  order_id: number;
  receiver_id: number;
  message: string;
  file_url?: string | null;
};

export type ChatSocketEvent =
  | {
      type: "history" | "unread_history";
      messages: Chat[];
    }
  | {
      type: "message_created" | "message_read";
      message: Chat;
    }
  | {
      type: "error";
      detail: string;
    }
  | {
      type: "pong";
    };