import { create } from 'zustand';
import type { Cart } from '../types/cart';

interface CartState {
  cart: Cart | null;
  loading: boolean;
  error: string | null;
  setCart: (cart: Cart | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useCartStore = create<CartState>((set) => ({
  cart: null,
  loading: false,
  error: null,
  setCart: (cart) => set({ cart }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}));
