import { api } from "../../../shared/services/axios";
import type { LoginResponse } from "../types/login";

/**
 * Realiza login contra el backend.
 * @param email Email del usuario
 * @param password Contraseña del usuario
 * @returns LoginResponse con token y datos de usuario
 * @throws Error con response del backend si falla
 */

export async function login(email: string, password: string): Promise<LoginResponse> {
  try {
    const res = await api.post<LoginResponse>("/auth/login", { email, password });
    return res.data;
  } catch (error) {
    // Re-lanza el error para que el hook lo maneje y muestre el mensaje adecuado
    throw error;
  }
}