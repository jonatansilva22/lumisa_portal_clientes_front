import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { CompanyCreate } from "../types/company";
import { Modal } from "../../../shared/components/Modal";

const schema = z.object({
  name: z.string().min(1, "La razón social es requerida"),
  rfc: z.string().min(12, "RFC inválido").max(13, "RFC inválido"),
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
  onClose: () => void;
  onCreate: (data: CompanyCreate) => void;
};

export function CreateCompanyModal({ onClose, onCreate }: Props) {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    onCreate({
      ...data,
      phone: data.phone || null,
      email: data.email || null,
      observations: data.observations || null,
    });
  };

  return (
    <Modal open={true} onClose={onClose}>
      <h2 className="text-lg font-bold mb-4">Registrar Empresa</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">

        {/* Razon social */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Razón social</label>
          <input {...register("name")} placeholder="Nombre legal completo de la empresa"
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400" />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
        </div>

        {/* RFC y Telefono */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">RFC</label>
            <input {...register("rfc")} placeholder="RFC de la empresa"
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400" />
            <p className="text-xs text-gray-400 mt-1">12-13 caracteres</p>
            {errors.rfc && <p className="text-red-500 text-sm mt-1">{errors.rfc.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
            <input {...register("phone")} placeholder="ejemplo: +52 5555555"
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400" />
            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
          </div>
        </div>

        {/* Correo y Direccion */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Correo electrónico</label>
            <input {...register("email")} placeholder="contacto@empresa.com"
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400" />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
            <input {...register("address")} placeholder="Calle, colonia, numero, ciudad y estado"
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400" />
            {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>}
          </div>
        </div>

        {/* Observaciones */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Observaciones</label>
          <textarea {...register("observations")}
            placeholder="Información adicional de la empresa, acuerdos especiales, observaciones"
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
            Registrar Empresa
          </button>
        </div>
      </form>
    </Modal>
  );
}