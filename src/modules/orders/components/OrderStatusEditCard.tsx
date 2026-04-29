import { CheckCircleIcon, ClockIcon } from "@heroicons/react/24/outline";
import { useEffect, useMemo, useState } from "react";
import { Modal } from "../../../shared/components/Modal";
import { Card } from "../../../shared/ui/Card";
import { Button } from "../../../shared/ui/Button";
import type { OrderStatus } from "../types/order";

interface OrderStatusEditCardProps {
  currentStatusId: number;
  statuses: OrderStatus[];
  saving: boolean;
  onSave: (statusId: number) => void | Promise<void>;
  disabled?: boolean;
}

export function OrderStatusEditCard({ currentStatusId, statuses, saving, onSave, disabled }: OrderStatusEditCardProps) {
  const [selectedStatusId, setSelectedStatusId] = useState<number | null>(currentStatusId);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);

  const selectableStatuses = useMemo(() => {
    if (disabled) return [];
    return statuses.filter((status) => {
      const normalizedName = status.name.toLowerCase();
      return !normalizedName.includes("revisad") && !normalizedName.includes("pagad");
    });
  }, [statuses, disabled]);

  useEffect(() => {
    const currentIsSelectable = selectableStatuses.some((status) => status.id === currentStatusId);
    if (currentIsSelectable) {
      setSelectedStatusId(currentStatusId);
      return;
    }

    setSelectedStatusId(selectableStatuses[0]?.id ?? null);
  }, [currentStatusId, selectableStatuses]);

  const hasChanged = selectedStatusId !== null && selectedStatusId !== currentStatusId;

  const currentStatusName = useMemo(() => {
    return statuses.find((status) => status.id === currentStatusId)?.name ?? `Estado ${currentStatusId}`;
  }, [currentStatusId, statuses]);

  const selectedStatusName = useMemo(() => {
    if (selectedStatusId === null) return "Sin estado seleccionable";
    return statuses.find((status) => status.id === selectedStatusId)?.name ?? `Estado ${selectedStatusId}`;
  }, [selectedStatusId, statuses]);

  const selectedToneByName = (statusName: string): string => {
    const normalized = statusName.toLowerCase();

    if (normalized.includes("pend")) {
      return "ring-2 ring-amber-500 border-amber-400 bg-amber-50 text-amber-800 shadow-sm";
    }

    if (normalized.includes("revis")) {
      return "ring-2 ring-blue-500 border-blue-400 bg-blue-50 text-blue-800 shadow-sm";
    }

    if (normalized.includes("autoriz")) {
      return "ring-2 ring-violet-500 border-violet-400 bg-violet-50 text-violet-800 shadow-sm";
    }

    if (normalized.includes("pagad")) {
      return "ring-2 ring-emerald-500 border-emerald-400 bg-emerald-50 text-emerald-800 shadow-sm";
    }

    if (normalized.includes("cancel")) {
      return "ring-2 ring-gray-500 border-gray-400 bg-gray-100 text-gray-800 shadow-sm";
    }

    if (normalized.includes("rechaz")) {
      return "ring-2 ring-red-500 border-red-400 bg-red-50 text-red-800 shadow-sm";
    }

    return "ring-2 ring-indigo-500 border-indigo-400 bg-indigo-50 text-indigo-800 shadow-sm";
  };

  const handleConfirmSave = async () => {
    if (selectedStatusId === null) return;
    await onSave(selectedStatusId);
    setOpenConfirmModal(false);
  };

  return (
    <>
      <Card className="shadow-md!">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <h3 className="text-lg font-bold text-gray-800">Flujo y cambio de estado</h3>
          <span className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-gray-50 px-3 py-1 text-sm text-gray-700">
            <ClockIcon className="w-4 h-4" />
            Estado actual: <strong>{currentStatusName}</strong>
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {selectableStatuses.map((status) => {
            const isCurrent = status.id === currentStatusId;
            const isSelected = status.id === selectedStatusId;
            return (
              <button
                key={status.id}
                type="button"
                onClick={() => setSelectedStatusId(status.id)}
                className={`text-left rounded-xl border p-4 transition cursor-pointer ${
                  isSelected
                    ? selectedToneByName(status.name)
                    : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold">{status.name}</p>
                  </div>
                  {isCurrent ? <CheckCircleIcon className="w-5 h-5 text-gray-500" /> : null}
                </div>
                <div className="mt-3 text-xs font-medium">
                  {isCurrent ? "Actual" : isSelected ? "Seleccionado" : "Disponible"}
                </div>
              </button>
            );
          })}
        </div>

        {selectableStatuses.length === 0 ? (
          <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
            No hay estados manuales disponibles para seleccionar en este pedido.
          </div>
        ) : null}

        <div className="mt-4 rounded-lg border border-dashed border-gray-300 bg-gray-50 p-3 text-sm text-gray-700">
          Cambiaras de <strong>{currentStatusName}</strong> a <strong>{selectedStatusName}</strong>.
        </div>

        <div className="flex justify-end">
          <Button
            onClick={() => setOpenConfirmModal(true)}
            disabled={disabled || !hasChanged || saving || selectableStatuses.length === 0}
            className="whitespace-nowrap mt-4! bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {saving ? "Guardando..." : "Confirmar cambio de estado"}
          </Button>
        </div>
            {disabled && (
              <div className="mt-4 rounded-lg border border-emerald-300 bg-emerald-50 p-3 text-emerald-700 font-semibold text-center">
                El pedido está pagado y su estado ya no puede ser modificado.
              </div>
            )}
      </Card>

      <Modal open={openConfirmModal} onClose={() => (!saving ? setOpenConfirmModal(false) : null)}>
        <div className="flex flex-col gap-4">
          <h4 className="text-lg font-bold text-gray-800">Confirmar actualización de estado</h4>
          <p className="text-gray-700">
            Esta acción cambiara el estado del pedido de <strong>{currentStatusName}</strong> a <strong>{selectedStatusName}</strong>.
          </p>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              className="px-4 py-2 rounded bg-gray-200 text-gray-800 hover:bg-gray-300 disabled:opacity-60 cursor-pointer disabled:cursor-not-allowed"
              onClick={() => setOpenConfirmModal(false)}
              disabled={saving}
            >
              Cancelar
            </button>
            <button
              type="button"
              className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60 cursor-pointer disabled:cursor-not-allowed"
              onClick={handleConfirmSave}
              disabled={saving}
            >
              {saving ? "Guardando..." : "Sí, actualizar"}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
