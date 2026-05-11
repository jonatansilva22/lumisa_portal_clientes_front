import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { User, UserCreate } from "../types/user";
import { getCompanies } from "../services/companies";
import { Modal } from "../../../shared/components/Modal";

const editUserSchema = z.object({
  role_id: z.number({ invalid_type_error: "Selecciona un rol" }),
  company_id: z.number().optional().nullable(),
});

type FormData = z.infer<typeof editUserSchema>;

type Props = {
  user: User;
  onClose: () => void;
  onUpdate: (id: number, data: Partial<UserCreate>) => void;
};

const roles = [
  { id: 1, label: "Administrador", desc: "Acceso completo al sistema" },
  { id: 2, label: "Asesor", desc: "Gestiona clientes y solicitudes" },
  { id: 3, label: "Cliente", desc: "Usuario del portal" },
];

export function EditUserModal({ user, onClose, onUpdate }: Props) {
  const { handleSubmit, setValue, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(editUserSchema),
    defaultValues: {
      role_id: user.role.id,
      company_id: user.company_id ?? null,
    },
  });

  const [companies, setCompanies] = useState<{ id: number; name: string }[]>([]);
  const selectedRole = watch("role_id");

  useEffect(() => {
    getCompanies().then(setCompanies);
  }, []);

  const onSubmit = async (data: FormData) => {
    const payload: Partial<UserCreate> = {
      role_id: data.role_id,
      company_id: selectedRole === 3 ? (data.company_id ?? null) : null,
    };
    onUpdate(user.id, payload);
  };

  return (
    <Modal open={true} onClose={onClose}>
      <h2 className="text-lg font-bold mb-4">Editar Usuario</h2>

      {/* Info del usuario (solo lectura) */}
      <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 rounded-xl">
        {user.image_url ? (
          <img src={user.image_url}
            className="w-12 h-12 rounded-full object-cover border"
            onError={(e) => (e.currentTarget.style.display = "none")} />
        ) : (
          <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 text-xl">👤</div>
        )}
        <div>
          <p className="font-semibold text-gray-800">{user.name} {user.last_name}</p>
          <p className="text-sm text-gray-400">{user.email}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

        {/* Rol */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Asignación de Rol</label>
          <div className="grid grid-cols-3 gap-2">
            {roles.map((role) => (
              <button key={role.id} type="button"
                onClick={() => setValue("role_id", role.id)}
                className={`border rounded-xl p-3 text-center text-sm transition ${
                  selectedRole === role.id
                    ? "border-purple-500 bg-purple-50 text-purple-700"
                    : "border-gray-200 hover:border-purple-300"
                }`}>
                <p className="font-semibold">{role.label}</p>
                <p className="text-xs text-gray-400 mt-1">{role.desc}</p>
              </button>
            ))}
          </div>
          {errors.role_id && <p className="text-red-500 text-sm mt-1">{errors.role_id.message}</p>}
        </div>

        {/* Empresa (solo clientes) */}
        {selectedRole === 3 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Empresa</label>
            <select
              onChange={(e) => setValue("company_id", e.target.value ? Number(e.target.value) : null)}
              defaultValue={user.company_id ?? ""}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400">
              <option value="">Selecciona una empresa</option>
              {companies.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        )}

        {/* Botones */}
        <div className="flex justify-end gap-2 mt-4">
          <button type="button" onClick={onClose}
            className="border rounded-full px-5 py-2 text-sm hover:bg-gray-100 transition">
            Cancelar
          </button>
          <button type="submit"
            className="bg-gray-900 text-white rounded-full px-5 py-2 text-sm hover:bg-gray-700 transition">
            Guardar Cambios
          </button>
        </div>
      </form>
    </Modal>
  );
}