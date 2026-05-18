import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Header } from "../../../shared/components/Index";
import { SidebarAdmin, SidebarAdviser, SidebarClient } from "../../../shared/components/Index";
import { useAuth } from "../../../shared/hooks/useAuth";
import { getCompanies } from "../services/companies";
import { updateUser, updatePassword } from "../services/users";
import { getS3UploadUrl, uploadFileToS3 } from "../services/s3";
import toast from "react-hot-toast";

const profileSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  last_name: z.string().min(1, "El apellido es requerido"),
  current_password: z.string().optional(),
  new_password: z.string().optional(),
  confirm_password: z.string().optional(),
}).refine((data) => {
  if (data.new_password) {
    return data.new_password.length >= 8;
  }
  return true;
}, { message: "Mínimo 8 caracteres", path: ["new_password"] })
.refine((data) => {
  if (data.new_password) {
    return /[A-Z]/.test(data.new_password);
  }
  return true;
}, { message: "Debe tener al menos una mayúscula", path: ["new_password"] })
.refine((data) => {
  if (data.new_password) {
    return /[!@#$%^&*(),.?\":{}|<>_\-+=/\\]/.test(data.new_password);
  }
  return true;
}, { message: "Debe tener al menos un carácter especial", path: ["new_password"] })
.refine((data) => {
  if (data.new_password) {
    return data.new_password === data.confirm_password;
  }
  return true;
}, { message: "Las contraseñas no coinciden", path: ["confirm_password"] })
.refine((data) => {
  if (data.new_password) {
    return !!data.current_password;
  }
  return true;
}, { message: "Ingresa tu contraseña actual", path: ["current_password"] });

type ProfileData = z.infer<typeof profileSchema>;

function RoleSidebar({ roleId }: { roleId: number }) {
  switch (roleId) {
    case 2: return <SidebarAdviser />;
    case 3: return <SidebarClient />;
    default: return <SidebarAdmin />;
  }
}

export function ProfilePage() {
  const { user, setAuth, token } = useAuth();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [companyName, setCompanyName] = useState<string | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProfileData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name ?? "",
      last_name: user?.last_name ?? "",
      current_password: "",
      new_password: "",
      confirm_password: "",
    },
  });

  useEffect(() => {
    if (user?.company_id) {
      getCompanies().then((companies) => {
        const company = companies.find((c) => c.id === user.company_id);
        setCompanyName(company?.name ?? null);
      });
    }
  }, [user]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setImageFile(file);
  };

  const previewUrl = imageFile
    ? URL.createObjectURL(imageFile)
    : user?.image_url ?? null;

  const onSubmit = async (data: ProfileData) => {
    if (!user) return;

    let image_url = user.image_url ?? null;

    // Ahora todos los usuarios pueden subir imagen
    if (imageFile) {
      try {
        setUploading(true);
        const { upload_url, object_url } = await getS3UploadUrl({
          filename: imageFile.name,
          contentType: imageFile.type,
        });
        await uploadFileToS3(upload_url, imageFile);
        image_url = object_url;
      } catch {
        toast.error("Error al subir la imagen");
        return;
      } finally {
        setUploading(false);
      }
    }

    try {
      await updateUser(user.id, { name: data.name, last_name: data.last_name, image_url });
      setAuth({ ...user, name: data.name, last_name: data.last_name, image_url }, token!);
    } catch {
      toast.error("Error al actualizar perfil");
      return;
    }

    if (data.new_password && data.current_password) {
      try {
        await updatePassword(user.id, {
          current_password: data.current_password,
          new_password: data.new_password,
        });
      } catch {
        toast.error("Contraseña actual incorrecta");
        return;
      }
    }

    toast.success("Cambios guardados exitosamente");
    reset({
      name: data.name,
      last_name: data.last_name,
      current_password: "",
      new_password: "",
      confirm_password: "",
    });
  };

  return (
    <div className="h-screen flex flex-col">
      <Header />
      <div className="flex flex-1 min-h-0">
        <RoleSidebar roleId={user?.role_id ?? 1} />
        <main className="flex-1 overflow-auto flex items-center justify-center bg-gray-50 p-6">
          <div className="w-full max-w-md">
            <div className="bg-white rounded-3xl shadow-lg overflow-hidden">

              {/* Banner */}
              <div className="h-24 bg-gradient-to-r from-gray-800 to-gray-600" />

              <div className="flex flex-col items-center -mt-12 px-6 pb-6">

                {/* Avatar */}
                {/* Todos los usuarios pueden cambiar la foto */}
                <label className="cursor-pointer relative group">
                  {previewUrl ? (
                    <img src={previewUrl}
                      className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
                      onError={(e) => (e.currentTarget.style.display = "none")} />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-gray-200 border-4 border-white shadow-md flex items-center justify-center text-gray-400 text-4xl">👤</div>
                  )}
                  <div className="absolute inset-0 rounded-full bg-black/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                    <span className="text-white text-xs font-medium">Cambiar</span>
                  </div>
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                </label>

                <h2 className="mt-3 text-xl font-bold text-gray-800">{user?.name} {user?.last_name}</h2>
                <p className="text-sm text-gray-400">{user?.email}</p>

                <form onSubmit={handleSubmit(onSubmit)} className="w-full mt-6 space-y-4">

                  {/* Nombre y Apellido */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">Nombre</label>
                      <input {...register("name")}
                        className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 bg-gray-50" />
                      {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">Apellido</label>
                      <input {...register("last_name")}
                        className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 bg-gray-50" />
                      {errors.last_name && <p className="text-red-500 text-xs mt-1">{errors.last_name.message}</p>}
                    </div>
                  </div>

                  {/* Correo */}
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">Correo</label>
                    <input value={user?.email ?? ""} disabled
                      className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm bg-gray-100 text-gray-400 cursor-not-allowed" />
                  </div>

                  {/* Empresa (solo clientes) */}
                  {user?.role_id === 3 && (
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">Empresa</label>
                      <input value={companyName ?? "Sin empresa"} disabled
                        className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm bg-gray-100 text-gray-400 cursor-not-allowed" />
                    </div>
                  )}

                  {/* Divisor */}
                  <div className="border-t border-gray-100 pt-4">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">Cambiar contraseña <span className="normal-case text-gray-400">(opcional)</span></p>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">Contraseña actual</label>
                        <input {...register("current_password")} type="password"
                          className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 bg-gray-50" />
                        {errors.current_password && <p className="text-red-500 text-xs mt-1">{errors.current_password.message}</p>}
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">Nueva contraseña</label>
                        <input {...register("new_password")} type="password"
                          className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 bg-gray-50" />
                        {errors.new_password && <p className="text-red-500 text-xs mt-1">{errors.new_password.message}</p>}
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">Confirmar nueva contraseña</label>
                        <input {...register("confirm_password")} type="password"
                          className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 bg-gray-50" />
                        {errors.confirm_password && <p className="text-red-500 text-xs mt-1">{errors.confirm_password.message}</p>}
                      </div>
                    </div>
                  </div>

                  {/* BotOn Unico */}
                  <button type="submit" disabled={uploading}
                    className="w-full bg-gray-900 text-white rounded-xl py-2.5 text-sm font-medium hover:bg-gray-700 transition disabled:opacity-50">
                    {uploading ? "Guardando..." : "Guardar cambios"}
                  </button>

                </form>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}