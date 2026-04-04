import { api } from "../../../shared/services/axios";

// Helper para obtener el token de auth
function getAuthToken(): string | null {
  return localStorage.getItem("token");
}

function authHeader() {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/**
 * Solicita una URL presignada para subir una imagen a S3 y devuelve la upload_url y object_url.
 */
export async function getS3UploadUrl({ module, filename, contentType }: { module: string; filename: string; contentType: string; }) {
  const res = await api.post(
    "/products/s3-upload-url",
    { module, filename, content_type: contentType },
    { headers: authHeader() }
  );
  return res.data as { upload_url: string; object_url: string };
}

/**
 * Sube el archivo a S3 usando la URL presignada.
 */
export async function uploadFileToS3(uploadUrl: string, file: File) {
  await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      "Content-Type": file.type,
    },
    body: file,
  });
}
