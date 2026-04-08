import type { Company } from "../types/company";
import { Modal } from "../../../shared/components/Modal";

type Props = {
  company: Company;
  onClose: () => void;
};

export function ViewCompanyModal({ company, onClose }: Props) {
  return (
    <Modal open={true} onClose={onClose}>
      <h2 className="text-lg font-bold mb-4">Detalle de Empresa</h2>

      <div className="space-y-3">
        <div>
          <p className="text-xs text-gray-400 uppercase font-medium">Razón social</p>
          <p className="text-sm text-gray-800">{company.name}</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-xs text-gray-400 uppercase font-medium">RFC</p>
            <p className="text-sm text-gray-800">{company.rfc}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase font-medium">Estado</p>
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${company.active ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-500"}`}>
              {company.active ? "Activa" : "Inactiva"}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-xs text-gray-400 uppercase font-medium">Teléfono</p>
            <p className="text-sm text-gray-800">{company.phone ?? "—"}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase font-medium">Correo</p>
            <p className="text-sm text-gray-800">{company.email ?? "—"}</p>
          </div>
        </div>

        <div>
          <p className="text-xs text-gray-400 uppercase font-medium">Dirección</p>
          <p className="text-sm text-gray-800">{company.address}</p>
        </div>

        <div>
          <p className="text-xs text-gray-400 uppercase font-medium">Observaciones</p>
          <p className="text-sm text-gray-800 whitespace-pre-wrap">{company.observations ?? "Sin observaciones"}</p>
        </div>
      </div>

      <div className="flex justify-end mt-6">
        <button onClick={onClose}
          className="border rounded-full px-5 py-2 text-sm hover:bg-gray-100 transition">
          Cerrar
        </button>
      </div>
    </Modal>
  );
}