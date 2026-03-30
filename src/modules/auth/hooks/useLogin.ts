// modules/auth/hooks/useLogin.ts
import { useState } from "react";
import { login } from "../services/auth";
import type { LoginResponse } from "../types/login";

export function useLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (email: string, password: string): Promise<LoginResponse | null> => {
    setLoading(true);
    setError(null);
    try {
      const data = await login(email, password);
      return data;
    } catch (err) {
      setError("Email o contraseña inválidos");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { handleLogin, loading, error };
}