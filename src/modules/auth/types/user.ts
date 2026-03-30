// modules/auth/types/user.ts
export type User = {
  id: number;
  name: string;
  last_name: string;
  email: string;
  image_url?: string | null;
  role_id: number;
  company_id?: number | null;
  active: boolean;
};