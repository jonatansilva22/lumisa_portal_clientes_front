
import { api } from '../../../shared/services/axios';
import type { Cart, CartDetailCreate, CartDetailUpdate } from '../types/cart';

// Helper para obtener el token de auth
function getAuthToken(): string | null {
  return localStorage.getItem("token");
}

function authHeader() {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}


// Obtener el carrito del usuario actual
export async function getMyCart(): Promise<Cart> {
  const { data } = await api.get<Cart>('/carts/me', {
    headers: authHeader(),
  });
  return data;
}


// Agregar producto al carrito
export async function addProductToCart(payload: CartDetailCreate): Promise<Cart> {
  const { data } = await api.post<Cart>('/carts/me', payload, {
    headers: authHeader(),
  });
  return data;
}


// Actualizar cantidad de un producto en el carrito
export async function updateProductInCart(productId: number, payload: CartDetailUpdate): Promise<Cart> {
  const { data } = await api.put<Cart>(`/carts/me/${productId}`, payload, {
    headers: authHeader(),
  });
  return data;
}


// Eliminar producto del carrito
export async function removeProductFromCart(productId: number): Promise<Cart> {
  const { data } = await api.delete<Cart>(`/carts/me/${productId}`, {
    headers: authHeader(),
  });
  return data;
}


// Vaciar el carrito
export async function clearCart(): Promise<Cart> {
  const { data } = await api.delete<Cart>('/carts/me/clear', {
    headers: authHeader()
  });
  return data;
}
