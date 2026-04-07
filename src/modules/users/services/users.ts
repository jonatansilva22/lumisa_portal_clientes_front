import { api } from "../../../shared/services/axios";
import type { User, UserCreate } from "../types/user";
import { useAuthStore } from "../../auth/store/auth";

const getAuthHeader = () => {
  const token = useAuthStore.getState().token;
  return { headers: { Authorization: `Bearer ${token}` } };
};

export async function getUsers(): Promise<User[]> {
  const res = await api.get<User[]>("/users", getAuthHeader());
  return res.data;
}

export async function getUserById(id: number): Promise<User> {
  const res = await api.get<User>(`/users/${id}`, getAuthHeader());
  return res.data;
}

export async function createUser(data: UserCreate): Promise<User> {
  const res = await api.post<User>("/users", data, getAuthHeader());
  return res.data;
}

export async function updateUser(id: number, data: Partial<UserCreate>): Promise<User> {
  const res = await api.put<User>(`/users/${id}`, data, getAuthHeader());
  return res.data;
}

export async function toggleUserActive(id: number): Promise<void> {
  await api.patch(`/users/${id}/active`, {}, getAuthHeader());
}