import ProductDetailPage from "../modules/products/pages/ProductDetailPage";
import ProductsCatalogPage from "../modules/products/pages/ProductsCatalogPage";
import { Routes, Route } from "react-router-dom";
// Importaremos aqui las páginas
import LoginPage from "../modules/auth/pages/LoginPage";
import { ProtectedRoute } from "../shared/components/ProtectedRoute";
import { UnauthorizedPage } from "../modules/auth/pages/UnauthorizedPage";
import { AdminPage } from "../modules/auth/pages/AdminPage";
import { AdviserPage } from "../modules/auth/pages/AdviserPage";
import { ClientPage } from "../modules/auth/pages/ClientPage";
import { EjemploPage } from "../modules/products/pages/EjemploPage";
import ProductsPage from "../modules/products/pages/ProductsPage";
import {UsersPage} from "../modules/users/pages/UsersPage";
import  CartPage  from "../modules/carts/pages/CartPage";
import { CompaniesPage } from "../modules/companies/pages/CompaniesPage";
import {ProfilePage} from "../modules/users/pages/ProfilePage";
import OrdersPage from "../modules/orders/pages/OrdersPage";
import OrderDetailPage from "../modules/orders/pages/OrderDetailPage";
import ManagedOrdersPage from "../modules/orders/pages/ManagedOrdersPage";
import ManagedOrderDetailPage from "../modules/orders/pages/ManagedOrderDetailPage";
import {ChatPage} from "../modules/chats/pages/ChatPage";
import PaymentsPayPage from "../modules/payments/pages/PaymentsPayPage";

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

        <Route path="/users"
      element={
        <ProtectedRoute allowedRoles={[1]}>
          <UsersPage />
        </ProtectedRoute>
      } />

      <Route path="/profile"
      element={
        <ProtectedRoute allowedRoles={[1,2,3]}>
          <ProfilePage />
        </ProtectedRoute>
      } />

        <Route path="/products"
      element={
        <ProtectedRoute allowedRoles={[1]}>
          <ProductsPage />
        </ProtectedRoute>
      } />

        <Route path="/companies"
      element={
        <ProtectedRoute allowedRoles={[1]}>
          <CompaniesPage />
        </ProtectedRoute>
      } />

        <Route path="/catalog"
      element={
        <ProtectedRoute allowedRoles={[2,3]}>
          <ProductsCatalogPage />
        </ProtectedRoute>
      } />

        <Route path="/products/:id"
      element={
        <ProtectedRoute allowedRoles={[1,2,3]}>
          <ProductDetailPage />
        </ProtectedRoute>
      } />

      <Route path="/cart"
      element={
        <ProtectedRoute allowedRoles={[2,3]}>
          <CartPage />
        </ProtectedRoute>
      } />

      <Route path="/orders"
      element={
        <ProtectedRoute allowedRoles={[3]}>
          <OrdersPage />
        </ProtectedRoute>
      } />

      <Route path="/orders/:id"
      element={
        <ProtectedRoute allowedRoles={[3]}>
          <OrderDetailPage />
        </ProtectedRoute>
      } />

      <Route path="/manage/orders"
      element={
        <ProtectedRoute allowedRoles={[1, 2]}>
          <ManagedOrdersPage/>
        </ProtectedRoute>
      } />

      <Route path="/manage/orders/:id"
      element={
        <ProtectedRoute allowedRoles={[1, 2]}>
          <ManagedOrderDetailPage/>
        </ProtectedRoute>
      } />

      <Route path="/chat"
      element={
        <ProtectedRoute allowedRoles={[1, 2, 3]}>
          <ChatPage/>
        </ProtectedRoute>
      } />

      <Route path="/pay/:id"
      element={
        <ProtectedRoute allowedRoles={[3]}>
          <PaymentsPayPage/>
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