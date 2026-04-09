export type Role = {
  id: number;
  name: string;
};

export type User = {
  id: number;
  name: string;
  last_name: string;
  email: string;
  image_url?: string | null;
  active: boolean;
  role: Role;
  company_id?: number | null;
  created_at: string;
  updated_at?: string | null;
};

export type UserCreate = {
  name: string;
  last_name: string;
  email: string;
  password: string;
  role_id: number;
  company_id?: number | null;
  image_url?: string | null;
};