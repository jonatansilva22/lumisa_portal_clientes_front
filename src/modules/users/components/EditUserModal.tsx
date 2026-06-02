import { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import type { User, UserCreate } from "../types/user";
import { getCompanies } from "../services/companies";
import { getS3UploadUrl, uploadFileToS3 } from "../services/s3";
import { Modal } from "../../../shared/components/Modal";

const editUserSchema = z.object({
  // ✅ Fix 1: invalid_type_error → error (Zod v4)
  role_id: z.number({ error: "Selecciona un rol" }),
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
  const [imagePreview, setImagePreview] = useState<string | null>(user.image_url || null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const selectedRole = watch("role_id");

  useEffect(() => {
    getCompanies().then(setCompanies);
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Solo se permiten imágenes");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("La imagen no debe superar 5MB");
      return;
    }

    setSelectedFile(file);
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onSubmit = async (data: FormData) => {
    setUploadingImage(true);
    try {
      let imageUrl = user.image_url;

      if (selectedFile) {
        // ✅ Fix 2: Eliminar module, no existe en el tipo de getS3UploadUrl
        const { upload_url, object_url } = await getS3UploadUrl({
          filename: `${Date.now()}_${selectedFile.name}`,
          contentType: selectedFile.type,
        });

        await uploadFileToS3(upload_url, selectedFile);
        imageUrl = object_url;
      }

      const payload: Partial<UserCreate> = {
        role_id: data.role_id,
        company_id: selectedRole === 3 ? (data.company_id ?? null) : null,
        image_url: imageUrl,
      };

      onUpdate(user.id, payload);
    } catch (error) {
      toast.error("Error al subir la imagen");
      console.error(error);
    } finally {
      setUploadingImage(false);
    }
  };

  return (
    <Modal open={true} onClose={onClose}>
      <h2 className="text-lg font-bold mb-4">Editar Usuario</h2>

      {/* Info del usuario con foto editable */}
      <div className="mb-4 p-4 bg-gray-50 rounded-xl">
        <div className="flex items-center gap-4">
          <div className="relative">
            {imagePreview ? (
              <img 
                src={imagePreview}
                alt="Vista previa"
                className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                onError={(e) => {
                  e.currentTarget.src = "";
                  e.currentTarget.style.display = "none";
                }}
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 text-2xl border-2 border-gray-300">
                👤
              </div>
            )}
            
            {imagePreview && (
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition shadow-md"
                title="Quitar foto"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          <div className="flex-1">
            <p className="font-semibold text-gray-800">{user.name} {user.last_name}</p>
            <p className="text-sm text-gray-400 mb-2">{user.email}</p>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-xs text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {imagePreview ? "Cambiar foto" : "Agregar foto"}
            </button>
            
            {selectedFile && (
              <p className="text-xs text-green-600 mt-1">
                ✓ Nueva foto seleccionada
              </p>
            )}
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

        {/* Rol */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Asignación de Rol</label>
          <div className="grid grid-cols-3 gap-2">
            {roles.map((role) => (
              <button 
                key={role.id} 
                type="button"
                onClick={() => setValue("role_id", role.id)}
                className={`border rounded-xl p-3 text-center text-sm transition ${
                  selectedRole === role.id
                    ? "border-purple-500 bg-purple-50 text-purple-700"
                    : "border-gray-200 hover:border-purple-300"
                }`}
              >
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
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
            >
              <option value="">Selecciona una empresa</option>
              {companies.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        )}

        {/* Botones */}
        <div className="flex justify-end gap-2 mt-4">
          <button 
            type="button" 
            onClick={onClose}
            disabled={uploadingImage}
            className="border rounded-full px-5 py-2 text-sm hover:bg-gray-100 transition disabled:opacity-50"
          >
            Cancelar
          </button>
          <button 
            type="submit"
            disabled={uploadingImage}
            className="bg-gray-900 text-white rounded-full px-5 py-2 text-sm hover:bg-gray-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {uploadingImage ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Guardando...
              </>
            ) : (
              "Guardar Cambios"
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}