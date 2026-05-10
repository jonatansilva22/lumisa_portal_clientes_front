import { Modal } from "../../../shared/components/Modal";
import { ProductForm } from "./ProductForm";
import type { Product, ProductType, Unit } from "../types/product";


interface ProductModalProps {
  open: boolean;
  onClose: () => void;
  initialData?: Partial<Product>;
  types: ProductType[];
  units: Unit[];
  onSubmit: (formData: FormData) => void;
  loading?: boolean;
  error?: string;
}

export function ProductModal({ open, onClose, initialData = {}, types, units, onSubmit, loading, error }: ProductModalProps) {
  return (
    <Modal open={open} onClose={onClose}>
      <h2 className="text-lg font-bold mb-2">{initialData && initialData.id ? "Editar producto" : "Nuevo producto"}</h2>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <ProductForm
        initialData={initialData}
        types={types}
        units={units}
        onSubmit={onSubmit}
        onCancel={onClose}
        loading={loading}
      />
    </Modal>
  );
}
