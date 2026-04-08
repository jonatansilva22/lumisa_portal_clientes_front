import { useCallback } from 'react';
import {
  getMyCart,
  addProductToCart,
  updateProductInCart,
  removeProductFromCart,
  clearCart,
} from '../services/carts';
import { useCartStore } from '../store/cart';
import type { CartDetailCreate, CartDetailUpdate } from '../types/cart';

export function useCart() {
  const { cart, setCart, loading, setLoading, error, setError } = useCartStore();

  // Cargar el carrito del usuario
  const fetchCart = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMyCart();
      setCart(data);
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Error al cargar el carrito');
    } finally {
      setLoading(false);
    }
  }, [setCart, setLoading, setError]);

  // Agregar producto
  const addToCart = useCallback(async (payload: CartDetailCreate) => {
    setLoading(true);
    setError(null);
    try {
      const data = await addProductToCart(payload);
      setCart(data);
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Error al agregar producto');
    } finally {
      setLoading(false);
    }
  }, [setCart, setLoading, setError]);

  // Actualizar cantidad
  const updateInCart = useCallback(async (productId: number, payload: CartDetailUpdate) => {
    setLoading(true);
    setError(null);
    try {
      const data = await updateProductInCart(productId, payload);
      setCart(data);
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Error al actualizar cantidad');
    } finally {
      setLoading(false);
    }
  }, [setCart, setLoading, setError]);

  // Eliminar producto
  const removeFromCart = useCallback(async (productId: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await removeProductFromCart(productId);
      setCart(data);
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Error al eliminar producto');
    } finally {
      setLoading(false);
    }
  }, [setCart, setLoading, setError]);

  // Vaciar carrito
  const clear = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await clearCart();
      setCart(data);
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Error al vaciar carrito');
    } finally {
      setLoading(false);
    }
  }, [setCart, setLoading, setError]);

  return {
    cart,
    loading,
    error,
    fetchCart,
    addToCart,
    updateInCart,
    removeFromCart,
    clear,
  };
}
