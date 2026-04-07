import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { User, UserCreate } from "../types/user";
import { getCompanies } from "../services/companies";
import { getS3UploadUrl, uploadFileToS3 } from "../services/s3";
import { Modal } from "../../../shared/components/Modal";
import { FileUpload } from "../../../shared/ui/FileUpload";

const schema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  last_name: z.string().min(1, "El apellido es requerido"),
  email: z.string().email("Correo inválido"),
  password: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z.string().min(6, "Mínimo 6 caracteres").optional()
  ),
  role_id: z.number({ invalid_type_error: "Selecciona un rol" }),
  company_id: z.number().optional().nullable(),
});

type FormData = z.infer<typeof schema>;

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
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: user.name,
      last_name: user.last_name,
      email: user.email,
      role_id: user.role.id,
      company_id: null,
    },
  });

  const [companies, setCompanies] = useState<{ id: number; name: string }[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const selectedRole = watch("role_id");

  useEffect(() => {
    getCompanies().then(setCompanies);
  }, []);

  const onSubmit = async (data: FormData) => {
    let image_url: string | null = user.image_url ?? null;

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
        image_url = user.image_url ?? null;
      } finally {
        setUploading(false);
      }
    }

    const payload: Partial<UserCreate> = {
      name: data.name,
      last_name: data.last_name,
      email: data.email,
      role_id: data.role_id,
      image_url,
      company_id: selectedRole === 3 ? (data.company_id ?? null) : null,
    };
    if (data.password) payload.password = data.password;
    onUpdate(user.id, payload);
  };

  return (
    <Modal open={true} onClose={onClose}>
      <h2 className="text-lg font-bold mb-4">Editar Usuario</h2>

      {/* Preview foto actual */}
      {user.image_url && !imageFile && (
        <div className="flex items-center gap-3 mb-3">
          <img src={user.image_url}
            className="w-12 h-12 rounded-full object-cover border"
            onError={(e) => (e.currentTarget.style.display = "none")} />
          <span className="text-sm text-gray-500">Foto actual</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">

        {/* Nombre y Apellido */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
            <input {...register("name")}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400" />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Apellido</label>
            <input {...register("last_name")}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400" />
            {errors.last_name && <p className="text-red-500 text-sm mt-1">{errors.last_name.message}</p>}
          </div>
        </div>

        {/* Correo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Correo</label>
          <input {...register("email")}
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400" />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
        </div>

        {/* Contraseña opcional */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nueva contraseña <span className="text-gray-400">(dejar vacío para no cambiar)</span>
          </label>
          <input {...register("password")} type="password" placeholder="Nueva contraseña"
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400" />
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
        </div>

        {/* Foto de perfil */}
        <FileUpload
          label="Cambiar foto de perfil"
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
            {uploading ? "Subiendo imagen..." : "Guardar Cambios"}
          </button>
        </div>
      </form>
    </Modal>
  );
}