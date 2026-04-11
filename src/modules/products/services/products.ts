import { api } from "../../../shared/services/axios";
import type { Product, ProductType, Unit } from "../types/product";

// Helper para obtener el token de auth
function getAuthToken(): string | null {
	return localStorage.getItem("token");
}

function authHeader() {
	const token = getAuthToken();
	return token ? { Authorization: `Bearer ${token}` } : {};
}

// Obtener todos los productos (con filtros opcionales)
export async function fetchProducts(params?: {
	skip?: number;
	limit?: number;
	active_only?: boolean;
}): Promise<Product[]> {
	const res = await api.get<Product[]>("/products", {
		params,
		headers: authHeader(),
	});
	return res.data;
}

// Obtener un producto por ID
export async function fetchProductById(productId: number): Promise<Product> {
	const res = await api.get<Product>(`/products/${productId}`, {
		headers: authHeader(),
	});
	return res.data;
}

// Crear producto (JSON, igual que Thunder Client)
export async function createProduct(payload: Partial<Omit<Product, "id" | "created_at" | "updated_at" | "type" | "unit">>): Promise<Product> {
	const headers = { ...authHeader(), 'Content-Type': 'application/json' };
	const res = await api.post<Product>("/products", payload, { headers });
	return res.data;
}

// Actualizar producto (JSON, igual que Thunder Client)
export async function updateProduct(productId: number, payload: Partial<Omit<Product, "id" | "created_at" | "updated_at" | "type" | "unit">>): Promise<Product> {
	const headers = { ...authHeader(), 'Content-Type': 'application/json' };
	const res = await api.put<Product>(`/products/${productId}`, payload, { headers });
	return res.data;
}

// Eliminar producto
export async function deleteProduct(productId: number): Promise<void> {
	try {
		await api.delete(`/products/${productId}`, {
			headers: authHeader(),
		});
	} catch (error: any) {
		// Propaga el mensaje del backend si existe
		throw new Error(error?.response?.data?.detail || error.message || "Error al eliminar producto");
	}
}


// Obtener tipos de producto
export async function fetchProductTypes(): Promise<ProductType[]> {
	const res = await api.get<ProductType[]>("/products/types", {
		headers: authHeader(),
	});
	return res.data;
}

// Obtener unidades
export async function fetchUnits(): Promise<Unit[]> {
	const res = await api.get<Unit[]>("/products/units", {
		headers: authHeader(),
	});
	return res.data;
}
