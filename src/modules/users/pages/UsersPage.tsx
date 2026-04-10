import { useState, useEffect } from "react";
import { Header } from "../../../shared/components/Index";
import { SidebarAdmin } from "../../../shared/components/Index";
import { SearchBar } from "../../../shared/components/Index";
import { Table } from "../../../shared/ui/Index";
import { Button } from "../../../shared/ui/Index";
import { DeleteButton } from "../../../shared/ui/Index";
import { FilterDropdown } from "../../../shared/ui/Index";
import { LoadingSpinner } from "../../../shared/ui/Index";
import { useUsers } from "../hooks/useUsers";
import { CreateUserModal } from "../components/CreateUserModal";
import { EditUserModal } from "../components/EditUserModal";
import { ConfirmModal } from "../components/ConfirmModal";
import { getCompanies } from "../services/companies";
import type { User, UserCreate } from "../types/user";

export function UsersPage() {
  const { users, loading, handleToggleActive, handleCreate, handleUpdate } = useUsers();
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("Todos los roles");
  const [statusFilter, setStatusFilter] = useState("Todos los estados");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [togglingUserId, setTogglingUserId] = useState<number | null>(null);
  const [companies, setCompanies] = useState<{ id: number; name: string }[]>([]);

  useEffect(() => {
    getCompanies().then(setCompanies).catch(() => {});
  }, []);

  const getCompanyName = (company_id?: number | null) => {
    if (!company_id) return null;
    const company = companies.find((c) => c.id === company_id);
    return company ? company.name : null;
  };

  const totalUsuarios = users.length;
  const totalClientes = users.filter((u) => u.role.name === "cliente").length;
  const totalAsesores = users.filter((u) => u.role.name === "asesor").length;
  const totalAdmins = users.filter((u) => u.role.name === "administrador").length;

  const filtered = users.filter((u) => {
    const matchSearch = `${u.name} ${u.last_name} ${u.email}`
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchRole =
      roleFilter === "Todos los roles" || u.role.name === roleFilter.toLowerCase();
    const matchStatus =
      statusFilter === "Todos los estados" ||
      (statusFilter === "Activo" ? u.active : !u.active);
    return matchSearch && matchRole && matchStatus;
  });

  const getRoleColor = (role: string) => {
    if (role === "cliente") return "bg-green-100 text-green-700";
    if (role === "asesor") return "bg-blue-100 text-blue-700";
    if (role === "administrador") return "bg-red-100 text-red-700";
    return "bg-gray-100 text-gray-700";
  };

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("es-MX");

  const togglingUser = users.find((u) => u.id === togglingUserId);

  return (
    <div className="h-screen flex flex-col">
      <Header />
      <div className="flex flex-1 min-h-0">
        <SidebarAdmin />
        <main className="flex-1 p-6 overflow-auto">

          {/* Titulo y boton */}
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Gestión de Usuarios</h1>
            <Button onClick={() => setShowCreateModal(true)}>+ Nuevo Usuario</Button>
          </div>

          {/* Tarjetas de conteo */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="border rounded-lg p-4 flex items-center gap-3">
              <span className="text-2xl">👥</span>
              <div>
                <p className="text-xl font-bold">{totalUsuarios}</p>
                <p className="text-sm text-gray-500">Total de Usuarios</p>
              </div>
            </div>
            <div className="border rounded-lg p-4 flex items-center gap-3">
              <span className="text-2xl">👤</span>
              <div>
                <p className="text-xl font-bold">{totalClientes}</p>
                <p className="text-sm text-gray-500">Clientes</p>
              </div>
            </div>
            <div className="border rounded-lg p-4 flex items-center gap-3">
              <span className="text-2xl">💼</span>
              <div>
                <p className="text-xl font-bold">{totalAsesores}</p>
                <p className="text-sm text-gray-500">Asesores</p>
              </div>
            </div>
            <div className="border rounded-lg p-4 flex items-center gap-3">
              <span className="text-2xl">⚙️</span>
              <div>
                <p className="text-xl font-bold">{totalAdmins}</p>
                <p className="text-sm text-gray-500">Administradores</p>
              </div>
            </div>
          </div>

          {/* Buscador y filtros */}
          <div className="flex gap-3 mb-4">
            <SearchBar
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar usuarios..."
              className="flex-1"
            />
            <FilterDropdown
              options={["Todos los roles", "Cliente", "Asesor", "Administrador"]}
              value={roleFilter}
              onChange={setRoleFilter}
            />
            <FilterDropdown
              options={["Todos los estados", "Activo", "Inactivo"]}
              value={statusFilter}
              onChange={setStatusFilter}
            />
          </div>

          {/* Tabla */}
          {loading ? (
            <div className="flex justify-center mt-10">
              <LoadingSpinner />
            </div>
          ) : (
            <Table
              data={filtered}
              columns={[
                {
                  header: "Usuario",
                  accessor: (u) => (
                    <div className="flex items-center gap-3">
                      {u.image_url ? (
                        <img src={u.image_url}
                          className="w-8 h-8 rounded-full object-cover border"
                          onError={(e) => (e.currentTarget.style.display = "none")} />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 text-sm">👤</div>
                      )}
                      <div>
                        <p className="font-medium">{u.name} {u.last_name}</p>
                        <p className="text-xs text-gray-400">id: {u.id}</p>
                      </div>
                    </div>
                  ),
                },
                {
                  header: "Rol",
                  accessor: (u) => (
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getRoleColor(u.role.name)}`}>
                      {u.role.name}
                    </span>
                  ),
                },
                { header: "Correo", accessor: "email" },
                {
                  header: "Estado",
                  accessor: (u) => (
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${u.active ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-500"}`}>
                      {u.active ? "Activo" : "Inactivo"}
                    </span>
                  ),
                },
                {
                  header: "Empresa",
                  accessor: (u) => u.role.name === "cliente" ? (
                    <span className="text-sm text-gray-600">
                      {getCompanyName(u.company_id) ?? <span className="text-gray-400 italic">Sin empresa</span>}
                    </span>
                  ) : (
                    <span className="text-gray-300 text-xs">—</span>
                  ),
                },
                {
                  header: "Fecha de registro",
                  accessor: (u) => formatDate(u.created_at),
                },
                {
                  header: "Acción",
                  accessor: (u) => (
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingUser(u)}
                        className="border rounded-full px-4 py-1 text-sm hover:bg-gray-100 transition">
                        Editar
                      </button>
                      <DeleteButton onClick={() => setTogglingUserId(u.id)} />
                    </div>
                  ),
                },
              ]}
            />
          )}
        </main>
      </div>

      {/* Modal crear usuario */}
      {showCreateModal && (
        <CreateUserModal
          onClose={() => setShowCreateModal(false)}
          onCreate={async (data) => {
            await handleCreate(data);
            setShowCreateModal(false);
          }}
        />
      )}

      {/* Modal editar usuario */}
      {editingUser && (
        <EditUserModal
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onUpdate={async (id, data) => {
            await handleUpdate(id, data);
            setEditingUser(null);
          }}
        />
      )}

      {/* Confirmacion toggle activo */}
      {togglingUserId !== null && (
        <ConfirmModal
          message={`¿Desea ${togglingUser?.active ? "desactivar" : "activar"} a este usuario?`}
          confirmLabel={togglingUser?.active ? "Desactivar" : "Activar"}
          confirmColor={togglingUser?.active ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"}
          onCancel={() => setTogglingUserId(null)}
          onConfirm={async () => {
            await handleToggleActive(togglingUserId);
            setTogglingUserId(null);
          }}
        />
      )}
    </div>
  );
}