// Tipos para el carrito y detalles, alineados con el backend
export interface CartDetail {
  id: number;
  product_id: number;
  quantity: number;
  unit_price: number | string;
}

export interface Cart {
  id: number;
  user_id: number;
  active: boolean;
  cart_details: CartDetail[];
}

// Para crear/agregar producto al carrito
export interface CartDetailCreate {
  product_id: number;
  quantity: number;
}

// Para actualizar cantidad
export interface CartDetailUpdate {
  quantity?: number;
}
