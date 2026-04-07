import { api } from "../../../shared/services/axios";
import { useAuthStore } from "../../auth/store/auth";

const getAuthHeader = () => {
  const token = useAuthStore.getState().token;
  return { headers: { Authorization: `Bearer ${token}` } };
};

type Company = {
  id: number;
  name: string;
};

export async function getCompanies(): Promise<Company[]> {
  const res = await api.get<Company[]>("/companies", getAuthHeader());
  return res.data;
}