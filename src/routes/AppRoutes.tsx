import { Routes, Route } from "react-router-dom";
// Importaremos aqui las páginas
import LoginPage from "../modules/auth/pages/LoginPage";
import { ProtectedRoute } from "../shared/components/ProtectedRoute";
import { UnauthorizedPage } from "../modules/auth/pages/UnauthorizedPage";
import { AdminPage } from "../modules/auth/pages/AdminPage";
import { AdviserPage } from "../modules/auth/pages/AdviserPage";
import { ClientPage } from "../modules/auth/pages/ClientPage";
import { EjemploPage } from "../modules/products/pages/EjemploPage";

export function AppRoutes() {
  return (
    <Routes>
      {/* Ruta pública */}
      <Route path="/" element={<LoginPage />} />

      {/* Rutas protegida solo para administradores */}
      <Route path="/admin" 
      element={
        <ProtectedRoute allowedRoles={[1]}>
          <AdminPage />
        </ProtectedRoute>
      } />

      <Route path="/ejemplo" 
      element={
        <ProtectedRoute allowedRoles={[3]}>
          <EjemploPage />
        </ProtectedRoute>
      } />



      {/* Rutas protegida solo para asesores */}
      <Route path="/adviser" 
      element={
        <ProtectedRoute allowedRoles={[2]}>
          <AdviserPage />
        </ProtectedRoute>
      } />


      {/* Ruta protegida solo para clientes */}
      <Route path="/client" 
      element={
        <ProtectedRoute allowedRoles={[3]}>
          <ClientPage />
        </ProtectedRoute>
      } />



      {/* Ruta para acceso no autorizado */}
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
    </Routes>
  );
}