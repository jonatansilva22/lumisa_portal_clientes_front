import { useState } from "react";
import { Modal } from "../../../shared/components/Modal";
import { Button } from "../../../shared/ui/Button";
import { Card } from "../../../shared/ui/Card";

interface OrderActionsCardProps {
  isCanceled: boolean;
  actionLoading: boolean;
  canProceedToPay: boolean;
  canCancelOrder: boolean;
  onCancelOrder: () => void;
  onProceedToPay: () => void;
}

export function OrderActionsCard({
  isCanceled,
  actionLoading,
  canProceedToPay,
  canCancelOrder,
  onCancelOrder,
  onProceedToPay,
}: OrderActionsCardProps) {
  const [openConfirmModal, setOpenConfirmModal] = useState(false);

  const handleOpenConfirm = () => {
    if (isCanceled || actionLoading) return;
    setOpenConfirmModal(true);
  };

  const handleCloseConfirm = () => {
    if (actionLoading) return;
    setOpenConfirmModal(false);
  };

  const handleConfirmCancel = async () => {
    await onCancelOrder();
    setOpenConfirmModal(false);
  };

  return (
    <>
      <Card className="shadow-md!">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Acciones disponibles</h3>
        <div className="flex flex-col md:flex-row gap-3">
          <Button
            onClick={handleOpenConfirm}
            disabled={actionLoading || isCanceled || !canCancelOrder}
            className="mt-0! border border-red-300 text-red-700 bg-red-50 hover:bg-red-100 disabled:opacity-60 disabled:cursor-not-allowed text-base"
          >
            {isCanceled
              ? "Pedido cancelado"
              : !canCancelOrder
                ? "No se puede cancelar"
                : actionLoading
                  ? "Cancelando..."
                  : "Cancelar pedido"}
          </Button>

          <Button
            onClick={onProceedToPay}
            disabled={!canProceedToPay}
            className="mt-0! border border-emerald-300 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 disabled:opacity-60 disabled:cursor-not-allowed text-base"
          >
            Proceder al pago
          </Button>
        </div>
        {!canProceedToPay ? (
          <p className="mt-3 text-sm text-gray-500">El pago solo se habilita cuando el pedido este en estado autorizado.</p>
        ) : null}
      </Card>

      <Modal open={openConfirmModal} onClose={handleCloseConfirm}>
        <div className="flex flex-col items-center gap-4">
          <span className="text-lg font-semibold text-gray-800">¿Confirmas cancelar este pedido?</span>
          <div className="flex gap-4 mt-2">
            <button
              className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              onClick={handleConfirmCancel}
              disabled={actionLoading}
            >
              {actionLoading ? "Cancelando..." : "Confirmar"}
            </button>
            <button
              className="px-6 py-2 rounded bg-gray-300 text-gray-800 hover:bg-gray-400 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              onClick={handleCloseConfirm}
              disabled={actionLoading}
            >
              Cancelar
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
