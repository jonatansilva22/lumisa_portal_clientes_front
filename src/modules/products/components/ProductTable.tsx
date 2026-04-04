import { Table } from "../../../shared/ui/Table";
import { Button } from "../../../shared/ui/Button";
import { DeleteButton } from "../../../shared/ui/DeleteButton";
import type { Product } from "../types/product";
import { TrashIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";

type ProductTableProps = {
	products: Product[];
	isAdmin: boolean;
	onEdit: (product: Product) => void;
	onDelete: (product: Product) => void;
};

export function ProductTable({ products, isAdmin, onEdit, onDelete }: ProductTableProps) {
   const navigate = useNavigate();
   // Enumerar productos manualmente para la columna #
   const enumeratedProducts = products.map((p, idx) => ({ ...p, rowNumber: idx + 1 }));
   return (
		  <Table
			  columns={[
				{ header: "#", accessor: "rowNumber" },
				{
					header: "Imagen",
					accessor: (row) => (
						row.image_url ? (
							<img src={row.image_url} alt={row.name} className="w-26 h-26 object-cover rounded" />
						) : (
							<div className="w-26 h-26 bg-gray-100 flex items-center justify-center rounded">
								<span className="text-gray-400">No Img</span>
							</div>
						)
					),
				},
				{ header: "Nombre", accessor: "name" },
				{ header: "Precio", accessor: (row) => {
					if (row.price === null || row.price === undefined) return "-";
					const n = typeof row.price === "number" ? row.price : Number(row.price);
					return isNaN(n) ? '-' : n.toFixed(2);
				} },
				{ header: "Cantidad", accessor: (row) => row.quantity },
				{ header: "Tipo", accessor: (row) => row.type?.name || '-' },
				{ header: "Unidad", accessor: (row) => row.unit?.abbreviation || row.unit?.name || '-' },
				{
					header: "Estado",
					accessor: (row) => (
						<span className={row.active ? "text-green-600" : "text-gray-400"}>
							{row.active ? "Activo" : "Inactivo"}
						</span>
					),
				},
								{
								   header: <span className="flex justify-center w-full">Acciones</span>,
								   accessor: (row) => (
									   <div className="flex gap-2 justify-center w-full">
												 <Button onClick={() => navigate(`/products/${row.id}`)} className="h-12 w-24 px-3 py-1 text-sm hover:bg-gray-200">Ver detalles</Button>
												 {isAdmin && (
													 <>
														 <Button onClick={() => onEdit(row)} className="h-12 w-24 px-3 py-1 text-sm hover:bg-gray-200">Editar</Button>
														 <Button onClick={() => onDelete(row)} className="px-8 py-2 text-xs bg-red-100 hover:bg-red-200">
															 <TrashIcon className="w-4 h-4 text-red-600" />
														 </Button>
													 </>
												 )}
											 </div>
									 ),
								},
			]}
			   data={enumeratedProducts}
		/>
	);
}
