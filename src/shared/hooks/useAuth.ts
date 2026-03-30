import { useAuthStore } from "../../modules/auth/store/auth";

export function useAuth() {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const setAuth = useAuthStore((state) => state.setAuth);
  const logout = useAuthStore((state) => state.logout);

  return {
    user,
    token,
    setAuth,
    logout,
    isAuthenticated: !!user && !!token,
    isAdmin: user?.role_id === 1,
    isAdviser: user?.role_id === 2,
    isClient: user?.role_id === 3,
  };
}
