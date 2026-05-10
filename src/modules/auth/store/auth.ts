import { create } from "zustand";
import type { User } from "../types/user";

// Constantes para claves de localStorage
const TOKEN_KEY = "token";
const USER_KEY = "user";

/**
 * Estado y acciones de autenticación global (Zustand).
 * Incluye persistencia en localStorage.
 */

export type AuthState = {
  /** Usuario autenticado o null */
  user: User | null;
  /** Token JWT o null */
  token: string | null;
  /** Setea usuario y token, y los persiste */
  setAuth: (user: User, token: string) => void;
  /** Limpia sesión y localStorage */
  logout: () => void;
};

/**
 * Obtiene el estado inicial de autenticación desde localStorage.
 */

function getInitialAuthState(): Pick<AuthState, "user" | "token"> {
  const token = localStorage.getItem(TOKEN_KEY);
  const userStr = localStorage.getItem(USER_KEY);
  let user = null;
  try {
    user = userStr ? JSON.parse(userStr) : null;
  } catch {
    user = null;
  }
  return { user, token };
}

/**
 * Hook global de Zustand para autenticación.
 */

export const useAuthStore = create<AuthState>((set) => ({
  ...getInitialAuthState(),
  setAuth: (user, token) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    set({ user, token });
  },
  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    set({ user: null, token: null });
  },
}));