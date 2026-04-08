import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Company, CompanyCreate } from "../types/company";
import { Modal } from "../../../shared/components/Modal";

const schema = z.object({
  name: z.string().min(1, "La razón social es requerida"),
  address: z.string().min(1, "La dirección es requerida"),
  phone: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z.string().optional()
  ),
  email: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z.string().email("Correo inválido").optional()
  ),
  observations: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z.string().optional()
  ),
});

type FormData = z.infer<typeof schema>;

type Props = {
  company: Company;
  onClose: () => void;
  onUpdate: (id: number, data: Partial<CompanyCreate>) => void;
};

export function EditCompanyModal({ company, onClose, onUpdate }: Props) {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: company.name,
      address: company.address,
      phone: company.phone ?? "",
      email: company.email ?? "",
      observations: company.observations ?? "",
    },
  });

  const onSubmit = (data: FormData) => {
    onUpdate(company.id, {
      name: data.name,
      address: data.address,
      phone: data.phone || null,
      email: data.email || null,
      observations: data.observations || null,
    });
  };

  return (
    <Modal open={true} onClose={onClose}>
      <h2 className="text-lg font-bold mb-4">Editar Empresa</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">

        {/* Razon social */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Razón social</label>
          <input {...register("name")}
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400" />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
        </div>

        {/* RFC (solo lectura) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">RFC</label>
          <input value={company.rfc} disabled
            className="w-full border rounded-lg px-3 py-2 text-sm bg-gray-100 text-gray-500 cursor-not-allowed" />
          <p className="text-xs text-gray-400 mt-1">El RFC no se puede modificar</p>
        </div>

        {/* Telefono y Correo */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
            <input {...register("phone")} placeholder="ejemplo: +52 5555555"
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400" />
            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Correo electrónico</label>
            <input {...register("email")} placeholder="contacto@empresa.com"
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400" />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>
        </div>

        {/* Direccion */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
          <input {...register("address")}
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400" />
          {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>}
        </div>

        {/* Observaciones */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Observaciones</label>
          <textarea {...register("observations")}
            rows={3}
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none" />
          {errors.observations && <p className="text-red-500 text-sm mt-1">{errors.observations.message}</p>}
        </div>

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