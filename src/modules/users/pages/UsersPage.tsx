//Modulo Usuarios
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "../../../shared/components/Index";
import { SidebarAdmin, SidebarAdviser } from "../../../shared/components/Index";
import { Table } from "../../../shared/ui/Index";
import { Button } from "../../../shared/ui/Index";
import { LoadingSpinner } from "../../../shared/ui/Index";
import { BackButton } from "../../../shared/ui/BackButton";
import { useUsers } from "../hooks/useUsers";
import { useAuth } from "../../../shared/hooks/useAuth";
import { CreateUserModal } from "../components/CreateUserModal";
import { EditUserModal } from "../components/EditUserModal";
import { ConfirmModal } from "../components/ConfirmModal";
import { UsersSummary } from "../components/UsersSummary";
import { UsersFiltersBar } from "../components/UsersFiltersBar";
import { getCompanies } from "../services/companies";
import type { User, UserCreate } from "../types/user";
import { TrashIcon } from "@heroicons/react/24/outline";

export function UsersPage() {
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const isAdmin = currentUser?.role_id === 1;
  const isAdviser = currentUser?.role_id === 2;
  const { users, loading, handleToggleActive, handleCreate, handleUpdate, handleDelete } = useUsers();
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [togglingUserId, setTogglingUserId] = useState<number | null>(null);
  const [deletingUserId, setDeletingUserId] = useState<number | null>(null);
  const [companies, setCompanies] = useState<{ id: number; name: string }[]>([]);

  useEffect(() => {
    getCompanies().then(setCompanies).catch(() => {});
  }, []);

  const getCompanyName = (company_id?: number | null) => {
    if (!company_id) return null;
    const company = companies.find((c) => c.id === company_id);
    return company ? company.name : null;
  };

  // Ahora admin y asesor ven todos los usuarios, solo cliente ve clientes
  const visibleUsers = (isAdmin || isAdviser)
    ? users
    : users.filter((u) => u.role.name?.toLowerCase() === "cliente");

  // Totales globales SIEMPRE (no filtrados, insensible a mayúsculas)
  const totalUsuarios = users.length;
  const totalClientes = users.filter((u) => u.role.name?.toLowerCase() === "cliente").length;
  const totalAsesores = users.filter((u) => u.role.name?.toLowerCase() === "asesor").length;
  const totalAdmins = users.filter((u) => u.role.name?.toLowerCase() === "administrador").length;

  // Filtros SOLO afectan la tabla
  const filtered = visibleUsers.filter((u) => {
    const matchSearch = `${u.name} ${u.last_name} ${u.email}`
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchRole =
      roleFilter === "all" ||
      (u.role.name?.toLowerCase() === roleFilter.toLowerCase());
    const matchStatus =
      statusFilter === "all" ||
      (statusFilter === "active" ? u.active : !u.active);
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
  const deletingUser = users.find((u) => u.id === deletingUserId);

  return (
    <div className="h-screen flex flex-col">
      <Header />
      <div className="flex flex-1 min-h-0">
        {isAdmin ? <SidebarAdmin /> : <SidebarAdviser />}
        <main className="flex-1 p-3 sm:p-6 overflow-auto">

          {/* Titulo centrado y boton */}
          <div className="relative flex flex-col items-center mb-4 gap-2 w-full">
            <div className="flex items-center w-full justify-between gap-2">
              <BackButton onClick={() => navigate(-1)} />
              <h1 className="text-xl sm:text-2xl font-bold text-center flex-1">
                {isAdmin ? "Gestión de Usuarios" : "Clientes"}
              </h1>
            </div>
            {isAdmin && (
              <>
                {/* Botón en el flujo normal en móviles */}
                <div className="w-full sm:hidden mt-2">
                  <Button
                    onClick={() => setShowCreateModal(true)}
                    className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-blue-600 text-white font-bold px-6 py-3 rounded-xl shadow-lg hover:from-indigo-600 hover:to-blue-700 transition-all text-base w-full min-w-0"
                  >
                    <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    Nuevo Usuario
                  </Button>
                </div>
                {/* Botón flotante en escritorio */}
                <div className="hidden sm:block">
                  <div className="absolute right-0 top-0">
                    <Button
                      onClick={() => setShowCreateModal(true)}
                      className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-blue-600 text-white font-bold px-6 py-3 rounded-xl shadow-lg hover:from-indigo-600 hover:to-blue-700 transition-all text-base min-w-[180px]"
                    >
                      <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                      Nuevo Usuario
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Tarjetas de conteo y filtros: admin y asesor ven todo igual */}
          {(isAdmin || isAdviser) && (
            <>
              <UsersSummary
                total={totalUsuarios}
                clients={totalClientes}
                advisers={totalAsesores}
                admins={totalAdmins}
              />
              <UsersFiltersBar
                search={search}
                onSearchChange={(e) => setSearch(e.target.value)}
                roleFilter={roleFilter}
                onRoleFilterChange={(e) => setRoleFilter(e.target.value)}
                statusFilter={statusFilter}
                onStatusFilterChange={(e) => setStatusFilter(e.target.value)}
                showRoleFilter={true}
              />
            </>
          )}

          {/* Tabla */}
          {loading ? (
            <div className="flex justify-center mt-10">
              <LoadingSpinner />
            </div>
          ) : (
            <div className="overflow-x-auto">
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
                    accessor: (u) => u.role.name?.toLowerCase() === "cliente" ? (
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
                      <div className="flex gap-2 items-center">
                        {isAdmin ? (
                          <>
                            <button
                              onClick={() => setEditingUser(u)}
                              className="bg-amber-50 text-amber-600 rounded-full px-4 py-2 text-sm font-medium hover:bg-amber-100 transition">
                              Editar
                            </button>
                            <button
                              onClick={() => setTogglingUserId(u.id)}
                              title={u.active ? "Desactivar usuario" : "Activar usuario"}
                              className={`w-10 h-6 rounded-full flex items-center transition-colors duration-300 px-0.5 ${u.active ? "bg-green-500" : "bg-gray-300"}`}>
                              <span className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform duration-300 ${u.active ? "translate-x-4" : "translate-x-0"}`} />
                            </button>
                            <button
                              onClick={() => setDeletingUserId(u.id)}
                              title="Eliminar usuario"
                              className="bg-red-50 text-red-500 p-2 rounded-full hover:bg-red-100 transition">
                              <TrashIcon className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          <span className="text-xs text-gray-400 italic">Solo lectura</span>
                        )}
                      </div>
                    ),
                  },
                ]}
              />
            </div>
          )}
        </main>
      </div>

      {showCreateModal && (
        <CreateUserModal
          onClose={() => setShowCreateModal(false)}
          onCreate={async (data) => {
            await handleCreate(data);
            setShowCreateModal(false);
          }}
        />
      )}

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

      {togglingUserId !== null && (
        <ConfirmModal
          message={`¿Desea ${togglingUser?.active ? "desactivar" : "activar"} a ${togglingUser?.name} ${togglingUser?.last_name}?`}
          confirmLabel={togglingUser?.active ? "Desactivar" : "Activar"}
          confirmColor={togglingUser?.active ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"}
          onCancel={() => setTogglingUserId(null)}
          onConfirm={async () => {
            await handleToggleActive(togglingUserId);
            setTogglingUserId(null);
          }}
        />
      )}

      {deletingUserId !== null && (
        <ConfirmModal
          message={`¿Está seguro que desea eliminar a ${deletingUser?.name} ${deletingUser?.last_name}? Esta acción no se puede deshacer.`}
          confirmLabel="Eliminar"
          confirmColor="bg-red-600 hover:bg-red-700"
          onCancel={() => setDeletingUserId(null)}
          onConfirm={async () => {
            await handleDelete(deletingUserId);
            setDeletingUserId(null);
          }}
        />
      )}
    </div>
  );
}