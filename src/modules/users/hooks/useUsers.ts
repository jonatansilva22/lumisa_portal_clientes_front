import { useState, useEffect } from "react";
import { getUsers, createUser, updateUser, toggleUserActive, deleteUser } from "../services/users";
import type { User, UserCreate } from "../types/user";
import toast from "react-hot-toast";

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getUsers();
      setUsers(data);
    } catch {
      toast.error("Error al cargar usuarios");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (data: UserCreate) => {
    try {
      await createUser(data);
      toast.success("Usuario creado exitosamente");
      fetchUsers();
    } catch (error: any) {
      const detail = error?.response?.data?.detail;
      if (Array.isArray(detail)) {
        toast.error(detail[0]?.msg || "Error de validación");
      } else {
        toast.error(detail || "Error al crear usuario");
      }
    }
  };

  const handleUpdate = async (id: number, data: Partial<UserCreate>) => {
    try {
      await updateUser(id, data);
      toast.success("Usuario actualizado exitosamente");
      fetchUsers();
    } catch {
      toast.error("Error al actualizar usuario");
    }
  };

  const handleToggleActive = async (id: number) => {
    try {
      await toggleUserActive(id);
      toast.success("Estado actualizado exitosamente");
      fetchUsers();
    } catch {
      toast.error("Error al actualizar estado");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteUser(id);
      toast.success("Usuario eliminado exitosamente");
      fetchUsers();
    } catch {
      toast.error("Error al eliminar usuario");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return { users, loading, handleCreate, handleUpdate, handleToggleActive, handleDelete };
}