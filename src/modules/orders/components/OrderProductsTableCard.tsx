
import { useState } from "react";
import { Card } from "../../../shared/ui/Card";
import { Input } from "../../../shared/ui/Input";
import { Button } from "../../../shared/ui/Button";
import { Modal } from "../../../shared/components/Modal";
import type { Order } from "../types/order";


interface OrderProductsTableCardProps {
  order: Order;
  productNames: Record<number, string>;
  canEditShippingPrice?: boolean;
  onUpdateShippingPrice?: (shippingPrice: number) => Promise<void>;
  shippingPrice?: number;
  loading?: boolean;
  disabledEditShippingPrice?: boolean;
}


export function OrderProductsTableCard({ order, productNames, canEditShippingPrice, onUpdateShippingPrice, shippingPrice, loading, disabledEditShippingPrice }: OrderProductsTableCardProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [pendingValue, setPendingValue] = useState<string>("");
  const [error, setError] = useState<string>("");

  // Helper para asegurar que el valor es numérico
  function parseToNumber(val: unknown): number | undefined {
    if (val === undefined || val === null) return undefined;
    if (typeof val === "number") return val;
    if (typeof val === "string" && val.trim() !== "") {
      const n = Number(val);
      return isNaN(n) ? undefined : n;
    }
    return undefined;
  }

  const currentShipping = parseToNumber(shippingPrice !== undefined ? shippingPrice : (order as any).shipping_price);


  const handleEditClick = () => {
    setPendingValue(currentShipping !== undefined ? currentShipping.toFixed(2) : "");
    setModalOpen(true);
    setError("");
  };

  // Validación en tiempo real
  const validateShipping = (val: string): string => {
    if (val.trim() === "") return "El precio de envío es obligatorio";
    const num = Number(val);
    if (isNaN(num)) return "Debe ser un número válido";
    if (num < 0) return "No puede ser menor que 0";
    if (num > 999999.99) return "No puede ser mayor que 999,999.99";
    return "";
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setPendingValue(val);
    setError(validateShipping(val));
  };

  const handleModalConfirm = async () => {
    const validation = validateShipping(pendingValue);
    setError(validation);
    if (validation) return;
    const value = Number(pendingValue);
    if (onUpdateShippingPrice) {
      await onUpdateShippingPrice(value);
    }
    setModalOpen(false);
  };

  return (
    <Card className="shadow-md! overflow-hidden">
      <h3 className="text-xl font-bold text-gray-800 mb-4 tracking-tight">Productos del pedido</h3>
      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
        <table className="min-w-full text-base border-separate border-spacing-0">
          <thead>
            <tr className="bg-gradient-to-r from-blue-50 to-blue-100 text-blue-900">
              <th className="text-left px-4 py-3 font-semibold border-b border-gray-200">ID</th>
              <th className="text-left px-4 py-3 font-semibold border-b border-gray-200">Nombre</th>
              <th className="text-right px-4 py-3 font-semibold border-b border-gray-200">Cantidad</th>
              <th className="text-right px-4 py-3 font-semibold border-b border-gray-200">Precio unitario</th>
              <th className="text-right px-4 py-3 font-semibold border-b border-gray-200">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {order.order_details.map((detail, idx) => {
              const unitPrice = Number(detail.unit_price);
              const subtotal = unitPrice * detail.quantity;
              return (
                <tr
                  key={detail.id}
                  className={
                    `transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 border-b border-gray-100`
                  }
                >
                  <td className="px-4 py-3 text-gray-700">{detail.product_id}</td>
                  <td className="px-4 py-3 text-gray-800 font-medium">{productNames[detail.product_id] ?? "Sin nombre"}</td>
                  <td className="px-4 py-3 text-right text-gray-700">{detail.quantity}</td>
                  <td className="px-4 py-3 text-right text-gray-700">${unitPrice.toFixed(2)}</td>
                  <td className="px-4 py-3 text-right font-semibold text-blue-700">${subtotal.toFixed(2)}</td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            {/* Fila de precio de envío */}
            <tr className="bg-blue-50 border-t border-blue-100">
              <td colSpan={4} className="px-4 py-3 text-right font-bold text-blue-800 align-middle">
                <span className="inline-block mr-2">Precio de envío</span>
                {canEditShippingPrice && !disabledEditShippingPrice && (
                  <Button
                    className="ml-2 px-2 py-1 text-xs cursor-pointer bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-sm border border-blue-400 transition-all duration-150"
                    type="button"
                    onClick={handleEditClick}
                    disabled={loading}
                    style={{ fontWeight: 500, fontSize: '0.85rem', minWidth: 0 }}
                  >
                    <span className="material-icons align-middle text-base mr-1" style={{ fontSize: '1.1em', verticalAlign: 'middle' }}></span>
                    Editar
                  </Button>
                )}
              </td>
              <td className="px-4 py-3 text-right font-bold text-blue-900 align-middle text-lg">
                {currentShipping !== undefined ? `$${currentShipping.toFixed(2)}` : "-"}
              </td>
            </tr>
            {/* Fila de total */}
            <tr className="bg-blue-100 border-t border-blue-200">
              <td colSpan={4} className="px-4 py-3 text-right font-bold text-blue-900 text-base">Total</td>
              <td className="px-4 py-3 text-right font-bold text-blue-900 text-lg">${Number(order.total_payment).toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Modal de confirmación para editar precio de envío */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <h4 className="text-lg font-bold mb-4 text-blue-800">Editar precio de envío</h4>
        <div className="mb-2 text-gray-700">Ingrese el nuevo precio de envío para este pedido:</div>
        <div className="relative mb-2">
          <Input
            type="number"
            min={0}
            max={999999.99}
            step={0.01}
            value={pendingValue}
            onChange={handleInputChange}
            disabled={loading || disabledEditShippingPrice}
            className={`mb-0 border-2 pr-10 pl-4 py-2 rounded-lg text-lg font-semibold focus:ring-2 transition-all duration-150 ${error ? 'border-red-400 focus:ring-red-300' : 'border-blue-400 focus:ring-blue-500'}`}
            style={{ boxShadow: error ? '0 0 0 2px #f87171' : undefined, background: '#f8fafc' }}
            placeholder="$0.00"
          />
          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none select-none">$</span>
        </div>
        {error && <div className="text-red-500 text-sm mb-2 font-medium">{error}</div>}
        <div className="flex justify-end gap-2 mt-4">
          <Button type="button" className="bg-gray-200 text-gray-700 border border-gray-300 hover:bg-gray-300" onClick={() => setModalOpen(false)} disabled={loading}>
            Cancelar
          </Button>
          <Button type="button" className={`bg-blue-600 text-white border border-blue-700 hover:bg-blue-700 ${error ? 'opacity-60 cursor-not-allowed' : ''}`} onClick={handleModalConfirm} disabled={loading || !!error}>
            Confirmar
          </Button>
        </div>
      </Modal>
    </Card>
  );
}
