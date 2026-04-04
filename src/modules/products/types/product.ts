// Tipos para el módulo de productos
export interface ProductType {
	id: number;
	name: string;
}

export interface Unit {
	id: number;
	name: string;
	abbreviation?: string;
}

export interface Product {
	id: number;
	name: string;
	description?: string;
	price: number;
	image_url?: string | null;
	quantity: number;
	type_id: number;
	unit_id: number;
	active: boolean;
	created_at: string;
	updated_at?: string | null;
	// Relaciones
	type: ProductType;
	unit: Unit;
}
