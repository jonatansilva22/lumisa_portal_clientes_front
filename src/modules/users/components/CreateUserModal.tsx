import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { UserCreate } from "../types/user";
import { getCompanies } from "../services/companies";
import { getS3UploadUrl, uploadFileToS3 } from "../services/s3";
import { Modal } from "../../../shared/components/Modal";
import { FileUpload } from "../../../shared/ui/FileUpload";

const schema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  last_name: z.string().min(1, "El apellido es requerido"),
  email: z.string().email("Correo inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
  confirm_password: z.string(),
  role_id: z.number({
    required_error: "Selecciona un rol",
    invalid_type_error: "Selecciona un rol",
  }),
  company_id: z.preprocess(
    (val) => (isNaN(val as number) || val === 0 ? undefined : val),
    z.number({ invalid_type_error: "Selecciona una empresa" }).optional().nullable()
  ),
}).refine((d) => d.password === d.confirm_password, {
  message: "Las contraseñas no coinciden",
  path: ["confirm_password"],
}).refine((d) => {
  if (d.role_id === 3 && !d.company_id) return false;
  return true;
}, {
  message: "Selecciona una empresa para el cliente",
  path: ["company_id"],
});

type FormData = z.infer<typeof schema>;

type Props = {
  onClose: () => void;
  onCreate: (data: UserCreate) => void;
};

const roles = [
  { id: 1, label: "Administrador", desc: "Acceso completo al sistema" },
  { id: 2, label: "Asesor", desc: "Gestiona clientes y solicitudes" },
  { id: 3, label: "Cliente", desc: "Usuario del portal" },
];

export function CreateUserModal({ onClose, onCreate }: Props) {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const [companies, setCompanies] = useState<{ id: number; name: string }[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const selectedRole = watch("role_id");

  useEffect(() => {
    getCompanies().then(setCompanies);
  }, []);

  const onSubmit = async (data: FormData) => {
    let image_url: string | null = null;

    if (imageFile) {
      try {
        setUploading(true);
        const { upload_url, object_url } = await getS3UploadUrl({
          module: "users",
          filename: imageFile.name,
          contentType: imageFile.type,
        });
        await uploadFileToS3(upload_url, imageFile);
        image_url = object_url;
      } catch {
        image_url = null;
      } finally {
        setUploading(false);
      }
    }

    const { confirm_password, ...rest } = data;
    onCreate({
      ...rest,
      image_url,
      company_id: selectedRole === 3 ? (data.company_id ?? null) : null,
    });
  };

  return (
    <Modal open={true} onClose={onClose}>
      <h2 className="text-lg font-bold mb-4">Registro de Usuarios</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">

        {/* Nombre y Apellido */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
            <input {...register("name")} placeholder="Nombre"
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400" />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Apellido</label>
            <input {...register("last_name")} placeholder="Apellido"
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400" />
            {errors.last_name && <p className="text-red-500 text-sm mt-1">{errors.last_name.message}</p>}
          </div>
        </div>

        {/* Correo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Correo</label>
          <input {...register("email")} placeholder="correo@ejemplo.com"
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400" />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
        </div>

        {/* Contraseñas */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
            <input {...register("password")} type="password" placeholder="Contraseña"
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400" />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar contraseña</label>
            <input {...register("confirm_password")} type="password" placeholder="Confirmar contraseña"
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400" />
            {errors.confirm_password && <p className="text-red-500 text-sm mt-1">{errors.confirm_password.message}</p>}
          </div>
        </div>

        {/* Foto de perfil */}
        <FileUpload
          label="Foto de perfil"
          value={imageFile}
          onChange={setImageFile}
          accept="image/*"
        />

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
            <select {...register("company_id", { valueAsNumber: true })}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400">
              <option value="">Selecciona una empresa</option>
              {companies.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            {errors.company_id && <p className="text-red-500 text-sm mt-1">{errors.company_id.message}</p>}
          </div>
        )}

        {/* Botones */}
        <div className="flex justify-end gap-2 mt-4">
          <button type="button" onClick={onClose}
            className="border rounded-full px-5 py-2 text-sm hover:bg-gray-100 transition">
            Cancelar
          </button>
          <button type="submit" disabled={uploading}
            className="bg-gray-900 text-white rounded-full px-5 py-2 text-sm hover:bg-gray-700 transition disabled:opacity-50">
            {uploading ? "Subiendo imagen..." : "Registrar Usuario"}
          </button>
        </div>
      </form>
    </Modal>
  );
}