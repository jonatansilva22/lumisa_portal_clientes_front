import { useEffect, useState, useCallback } from "react";
import type { Product, ProductType, Unit } from "../types/product";
import {
	fetchProducts,
	fetchProductTypes,
	fetchUnits,
} from "../services/products";

export function useProducts() {
	const [products, setProducts] = useState<Product[]>([]);
	const [types, setTypes] = useState<ProductType[]>([]);
	const [units, setUnits] = useState<Unit[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const loadAll = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const [prods, tps, uns] = await Promise.all([
				fetchProducts(),
				fetchProductTypes(),
				fetchUnits(),
			]);
			setProducts(prods);
			setTypes(tps);
			setUnits(uns);
		} catch (err: any) {
			setError(err?.response?.data?.detail || err?.message || "Error al cargar productos");
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		loadAll();
	}, [loadAll]);

	return {
		products,
		types,
		units,
		loading,
		error,
		reload: loadAll,
		setProducts, // útil para acciones locales (optimista)
	};
}
