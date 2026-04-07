import { api } from "../../../shared/services/axios";
import { useAuthStore } from "../../auth/store/auth";

function authHeader() {
  const token = useAuthStore.getState().token;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function getS3UploadUrl({ module, filename, contentType }: {
  module: string;
  filename: string;
  contentType: string;
}) {
  const res = await api.post(
    "/products/s3-upload-url",
    { module, filename, content_type: contentType },
    { headers: authHeader() }
  );
  return res.data as { upload_url: string; object_url: string };
}

export async function uploadFileToS3(uploadUrl: string, file: File) {
  await fetch(uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": file.type },
    body: file,
  });
}