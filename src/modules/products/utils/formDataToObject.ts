// src/modules/products/utils/formDataToObject.ts
export function formDataToObject(formData: FormData) {
  const plainObj: Record<string, any> = {};
  for (const [key, value] of formData.entries()) {
    if (key === "image" && (!value || (typeof value === "string" && value === ""))) continue;
    plainObj[key] = value;
  }
  return plainObj;
}
