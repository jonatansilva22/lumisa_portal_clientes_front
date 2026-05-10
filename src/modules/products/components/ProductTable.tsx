import { Table } from "../../../shared/ui/Table";
import { Button } from "../../../shared/ui/Button";
import type { Product } from "../types/product";
import { TrashIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

type ProductTableProps = {
	products: Product[];
	isAdmin: boolean;
	onEdit: (product: Product) => void;
	onDelete: (product: Product) => void;
};

export function ProductTable({ products, isAdmin, onEdit, onDelete }: ProductTableProps) {
	const navigate = useNavigate();
		const [visibleCount, setVisibleCount] = useState(30);
	// Enumerar productos manualmente para la columna #
	const enumeratedProducts = products.map((p, idx) => ({ ...p, rowNumber: idx + 1 }));
	const visibleProducts = enumeratedProducts.slice(0, visibleCount);

	return (
		<div className="w-full max-w-7xl mx-auto overflow-x-auto rounded-2xl shadow bg-white border border-gray-200">
			<Table
				columns={[
					{ header: <span className="text-base font-bold">#</span>, accessor: "rowNumber" },
					{
						header: <span className="text-base font-bold">Imagen</span>,
						accessor: (row) => (
							row.image_url ? (
								<img src={row.image_url} alt={row.name} className="w-20 h-20 object-cover rounded-xl border border-gray-200 bg-white" />
							) : (
								<div className="w-20 h-20 bg-gray-100 flex items-center justify-center rounded-xl border border-gray-200">
									<span className="text-gray-400 text-sm">No Img</span>
								</div>
							)
						),
					},
					{ header: <span className="text-base font-bold">Nombre</span>, accessor: "name" },
					{ header: <span className="text-base font-bold">Precio</span>, accessor: (row) => {
						if (row.price === null || row.price === undefined) return "-";
						const n = typeof row.price === "number" ? row.price : Number(row.price);
						return isNaN(n) ? '-' : `$${n.toFixed(2)}`;
					} },
					{ header: <span className="text-base font-bold">Cantidad</span>, accessor: (row) => row.quantity },
					{ header: <span className="text-base font-bold">Tipo</span>, accessor: (row) => row.type?.name || '-' },
					{ header: <span className="text-base font-bold">Unidad</span>, accessor: (row) => row.unit?.abbreviation || row.unit?.name || '-' },
					{
						header: <span className="text-base font-bold">Estado</span>,
						accessor: (row) => (
							<span className={row.active ? "text-green-600 font-semibold" : "text-gray-400 font-semibold"}>
								{row.active ? "Activo" : "Inactivo"}
							</span>
						),
					},
					{
						header: <span className="flex justify-center w-full text-base font-bold">Acciones</span>,
						accessor: (row) => (
							<div className="flex flex-wrap gap-2 justify-center w-full">
								<Button onClick={() => navigate(`/products/${row.id}`)} className="min-w-[110px] px-3 py-2 text-sm font-medium bg-blue-50 border border-blue-200 text-blue-700 rounded hover:bg-blue-200 whitespace-nowrap">Ver detalles</Button>
								{isAdmin && (
									<>
										<Button onClick={() => onEdit(row)} className="min-w-[90px] px-3 py-2 text-sm font-medium bg-yellow-50 border border-yellow-200 text-yellow-700 rounded hover:bg-yellow-200 whitespace-nowrap">Editar</Button>
										<Button onClick={() => onDelete(row)} className="min-w-[90px] px-3 py-2 text-sm font-medium bg-red-50 border border-red-200 text-red-600 rounded hover:bg-red-200 flex items-center justify-center whitespace-nowrap">
											<TrashIcon className="w-4 h-4" />
										</Button>
									</>
								)}
							</div>
						),
					},
				]}
				data={visibleProducts}
			/>
				{products.length > visibleCount && (
					<div className="flex justify-center my-4">
						<Button
							onClick={() => setVisibleCount(c => c + 30)}
							className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 shadow cursor-pointer"
						>
							Cargar más
						</Button>
					</div>
				)}
		</div>
	);
}
