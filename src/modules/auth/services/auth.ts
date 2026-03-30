// modules/auth/services/auth.ts
import { api } from "../../../shared/services/axios";
import type { LoginResponse } from "../types/login";

export async function login(email: string, password: string): Promise<LoginResponse> {
  const res = await api.post<LoginResponse>("/auth/login", { email, password });
  return res.data;
}