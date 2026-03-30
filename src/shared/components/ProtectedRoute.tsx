import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../modules/auth/store/auth";
import type { ReactNode } from "react";

interface ProtectedRouteProps {
  allowedRoles: number[]; // Ejemplo: [1] para admin, [2] para asesor, [3] para cliente
  children: ReactNode;
}

export function ProtectedRoute({ allowedRoles, children }: ProtectedRouteProps) {
  const user = useAuthStore((state) => state.user);

  if (!user) {
    // No autenticado
    return <Navigate to="/" replace />;
  }

  if (!allowedRoles.includes(user.role_id)) {
    // Rol no autorizado
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}
