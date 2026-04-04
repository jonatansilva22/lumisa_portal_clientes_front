import { Modal } from "../../../shared/components/Modal";
import { Button } from "../../../shared/ui/Button";
import type { Product } from "../types/product";

interface DeleteProductModalProps {
  open: boolean;
  onClose: () => void;
  product?: Product | null;
  onConfirm: () => void;
  loading?: boolean;
  error?: string;
}

export function DeleteProductModal({ open, onClose, product, onConfirm, loading, error }: DeleteProductModalProps) {
  return (
    <Modal open={open} onClose={onClose}>
      <h2 className="text-lg font-bold mb-2">Eliminar producto</h2>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <p>¿Seguro que deseas eliminar el producto <b>{product?.name}</b>?</p>
      <div className="flex justify-end gap-2 mt-4">
        <Button onClick={onClose} className="bg-gray-200 hover:bg-gray-400">Cancelar</Button>
        <Button onClick={onConfirm} disabled={loading} className="bg-red-600 hover:bg-red-700 text-white">
          {loading ? "Eliminando..." : "Eliminar"}
        </Button>
      </div>
    </Modal>
  );
}
