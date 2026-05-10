// modules/auth/hooks/useLogin.ts
import { useState } from "react";
import { login } from "../services/auth";
import type { LoginResponse } from "../types/login";

/**
 * Hook para manejar login y errores detallados según respuesta del backend.
 */

export function useLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Intenta loguear y setea mensajes de error según el código y mensaje del backend.
   */
  
  const handleLogin = async (email: string, password: string): Promise<LoginResponse | null> => {
    setLoading(true);
    setError(null);
    try {
      const data = await login(email, password);
      return data;
    } catch (err: any) {
      // Manejo de errores detallados según backend
      let msg = "Error desconocido. Intente de nuevo.";
      if (err?.response) {
        const status = err.response.status;
        const detail = err.response.data?.detail;
        if (status === 401) msg = detail || "Email o contraseña inválidos";
        else if (status === 403) msg = detail || "Usuario inactivo. Contacte al administrador.";
        else if (status === 404) msg = detail || "Usuario no encontrado";
        else msg = detail || msg;
      }
      setError(msg);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { handleLogin, loading, error };
}