import {
  ArrowPathIcon,
  BriefcaseIcon,
  ShieldCheckIcon,
  UserCircleIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { Modal } from "../../../shared/components/Modal";
import { Card } from "../../../shared/ui/Card";
import { Button } from "../../../shared/ui/Button";
import { getUsers } from "../../users/services/users";
import type { User } from "../../users/types/user";

interface OrderAdvisorCardProps {
  currentAdvisorId?: number | null;
  orderId: number;
  saving: boolean;
  onAssign: (advisorId: number) => void | Promise<void>;
}

function roleTone(roleId: number): string {
  if (roleId === 1) return "bg-blue-100 text-blue-700 border-blue-200";
  if (roleId === 2) return "bg-emerald-100 text-emerald-700 border-emerald-200";
  return "bg-gray-100 text-gray-700 border-gray-200";
}

export function OrderAdvisorCard({ currentAdvisorId, orderId, saving, onAssign }: OrderAdvisorCardProps) {
  const [advisors, setAdvisors] = useState<User[]>([]);
  const [selectedId, setSelectedId] = useState<number | "">(currentAdvisorId ?? "");
  const [loadingAdvisors, setLoadingAdvisors] = useState(false);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);

  useEffect(() => {
    setLoadingAdvisors(true);
    getUsers()
      .then((users) => setAdvisors(users.filter((u) => u.role.id === 1 || u.role.id === 2)))
      .catch(() => setAdvisors([]))
      .finally(() => setLoadingAdvisors(false));
  }, []);

  useEffect(() => {
    setSelectedId(currentAdvisorId ?? "");
  }, [currentAdvisorId]);

  const currentAdvisor = advisors.find((a) => a.id === currentAdvisorId);
  const selectedAdvisor = advisors.find((a) => a.id === selectedId);
  const hasChanged = selectedId !== "" && selectedId !== currentAdvisorId;
  const currentAssignedLabel = currentAdvisor
    ? `${currentAdvisor.name} ${currentAdvisor.last_name}`
    : currentAdvisorId != null
      ? `Usuario #${currentAdvisorId}`
      : "Sin asesor asignado";
  const selectedLabel = selectedAdvisor
    ? `${selectedAdvisor.name} ${selectedAdvisor.last_name}`
    : selectedId !== ""
      ? `Usuario #${selectedId}`
      : "Sin seleccionar";
  const adminsCount = advisors.filter((u) => u.role.id === 1).length;
  const advisersCount = advisors.filter((u) => u.role.id === 2).length;

  const handleConfirm = async () => {
    if (selectedId === "") return;
    await onAssign(Number(selectedId));
    setOpenConfirmModal(false);
  };

  return (
    <>
      <Card className="shadow-md! border border-indigo-100 bg-linear-to-br from-white via-white to-indigo-50/60">
        <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-indigo-500 font-semibold mb-1">Gestion de responsable</p>
            <h3 className="text-xl font-bold text-gray-800">Asignacion de usuario staff</h3>
            <p className="text-sm text-gray-500 mt-1">Pedido #{orderId}</p>
          </div>

          <span className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white/90 px-3 py-1 text-sm text-gray-700 shadow-sm">
            <UserCircleIcon className="w-4 h-4 text-indigo-600" />
            {currentAssignedLabel}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-5">
          <div className="rounded-xl border border-blue-100 bg-blue-50/70 px-3 py-2">
            <div className="flex items-center gap-2 text-blue-700 text-sm font-semibold">
              <ShieldCheckIcon className="w-4 h-4" />
              Administrador
            </div>
            <p className="text-xl font-bold text-blue-900 mt-1">{adminsCount}</p>
          </div>
          <div className="rounded-xl border border-emerald-100 bg-emerald-50/70 px-3 py-2">
            <div className="flex items-center gap-2 text-emerald-700 text-sm font-semibold">
              <BriefcaseIcon className="w-4 h-4" />
              Asesores
            </div>
            <p className="text-xl font-bold text-emerald-900 mt-1">{advisersCount}</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white px-3 py-2">
            <div className="flex items-center gap-2 text-gray-600 text-sm font-semibold">
              <UserGroupIcon className="w-4 h-4" />
              Disponibles
            </div>
            <p className="text-xl font-bold text-gray-900 mt-1">{advisors.length}</p>
          </div>
        </div>

        {loadingAdvisors ? (
          <div className="rounded-xl border border-indigo-100 bg-white p-4 text-sm text-gray-500 flex items-center gap-2">
            <ArrowPathIcon className="w-4 h-4 animate-spin text-indigo-500" />
            Cargando usuarios staff...
          </div>
        ) : advisors.length === 0 ? (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
            No hay administradores o asesores disponibles para asignar.
          </div>
        ) : (
          <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5">
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-end">
              <div className="flex-1 flex flex-col gap-2">
                <label htmlFor="advisor-select" className="text-sm font-semibold text-gray-700">
                  Seleccionar responsable
                </label>
                <select
                  id="advisor-select"
                  value={selectedId}
                  onChange={(e) =>
                    setSelectedId(e.target.value === "" ? "" : Number(e.target.value))
                  }
                  className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                >
                  <option value="">-- Elige admin o asesor --</option>
                  {advisors.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name} {a.last_name} ({a.role.name})
                    </option>
                  ))}
                </select>
              </div>

              <Button
                onClick={() => setOpenConfirmModal(true)}
                disabled={!hasChanged || saving}
                className="shrink-0 mt-0! px-5 py-2.5 bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60"
              >
                {saving ? "Guardando..." : "Asignar"}
              </Button>
            </div>

            {selectedAdvisor && (
              <div className="mt-4 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold bg-gray-50 text-gray-700 border-gray-200">
                Nuevo responsable:
                <span>{selectedAdvisor.name} {selectedAdvisor.last_name}</span>
                <span className={`rounded-full border px-2 py-0.5 ${roleTone(selectedAdvisor.role.id)}`}>
                  {selectedAdvisor.role.name}
                </span>
              </div>
            )}
          </div>
        )}
      </Card>

      <Modal
        open={openConfirmModal}
        onClose={() => setOpenConfirmModal(false)}
      >
        <div className="rounded-xl border border-indigo-100 bg-linear-to-r from-indigo-50 to-white px-4 py-3 mb-4">
          <h4 className="text-lg font-semibold text-indigo-900 leading-tight">Confirmar asignacion</h4>
          <p className="text-sm text-indigo-700">Se actualizara el responsable del pedido #{orderId}</p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 mb-5 text-sm">
          <p className="text-gray-600 mb-2">
            <span className="font-semibold text-gray-700">Actual:</span> {currentAssignedLabel}
          </p>
          <p className="text-gray-700">
            <span className="font-semibold">Nuevo:</span> {selectedLabel}
          </p>
        </div>

        <p className="text-gray-600 mb-6">
          ¿Deseas confirmar este cambio de asignacion?
        </p>
        <div className="flex justify-end gap-3">
          <Button
            onClick={() => setOpenConfirmModal(false)}
            className="mt-0! border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 shadow-none!"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={saving}
            className="mt-0! bg-indigo-600 text-white hover:bg-indigo-700"
          >
            {saving ? "Guardando..." : "Confirmar"}
          </Button>
        </div>
      </Modal>
    </>
  );
}
