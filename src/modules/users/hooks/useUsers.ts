import { useState, useEffect } from "react";
import { getUsers, createUser, updateUser, deleteUser } from "../services/users";
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
    } catch {
      toast.error("Error al crear usuario");
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

  return { users, loading, handleCreate, handleUpdate, handleDelete };
}