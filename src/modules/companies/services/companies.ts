import { api } from "../../../shared/services/axios";
import { useAuthStore } from "../../auth/store/auth";
import type { Company, CompanyCreate } from "../types/company";

const getAuthHeader = () => {
  const token = useAuthStore.getState().token;
  return { headers: { Authorization: `Bearer ${token}` } };
};

export async function getCompanies(): Promise<Company[]> {
  const res = await api.get<Company[]>("/companies", getAuthHeader());
  return res.data;
}

export async function getCompanyById(id: number): Promise<Company> {
  const res = await api.get<Company>(`/companies/${id}`, getAuthHeader());
  return res.data;
}

export async function createCompany(data: CompanyCreate): Promise<Company> {
  const res = await api.post<Company>("/companies", data, getAuthHeader());
  return res.data;
}

export async function updateCompany(id: number, data: Partial<CompanyCreate>): Promise<Company> {
  const res = await api.put<Company>(`/companies/${id}`, data, getAuthHeader());
  return res.data;
}

export async function toggleCompanyActive(id: number): Promise<Company> {
  const res = await api.patch<Company>(`/companies/${id}/active`, {}, getAuthHeader());
  return res.data;
}