import { useState, useEffect } from "react";
import { getCompanies, createCompany, updateCompany, toggleCompanyActive } from "../services/companies";
import type { Company, CompanyCreate } from "../types/company";
import toast from "react-hot-toast";

export function useCompanies() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const data = await getCompanies();
      setCompanies(data);
    } catch {
      toast.error("Error al cargar empresas");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (data: CompanyCreate) => {
    try {
      await createCompany(data);
      toast.success("Empresa creada exitosamente");
      fetchCompanies();
    } catch (error: any) {
      const msg = error?.response?.data?.detail;
      toast.error(msg || "Error al crear empresa");
    }
  };

  const handleUpdate = async (id: number, data: Partial<CompanyCreate>) => {
    try {
      await updateCompany(id, data);
      toast.success("Empresa actualizada exitosamente");
      fetchCompanies();
    } catch {
      toast.error("Error al actualizar empresa");
    }
  };

  const handleToggleActive = async (id: number) => {
    try {
      await toggleCompanyActive(id);
      toast.success("Estado actualizado exitosamente");
      fetchCompanies();
    } catch {
      toast.error("Error al actualizar estado");
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  return { companies, loading, handleCreate, handleUpdate, handleToggleActive };
}