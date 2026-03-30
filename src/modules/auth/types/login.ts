
// modules/auth/types/login.ts
import type { User } from "./user";

export type LoginResponse = {
  access_token: string;
  token_type: string;
  user: User;
};