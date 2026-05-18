import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "../../../shared/components/Index";
import { SidebarAdmin, SidebarAdviser } from "../../../shared/components/Index";
import { Table } from "../../../shared/ui/Index";
import { Button } from "../../../shared/ui/Index";
import { LoadingSpinner } from "../../../shared/ui/Index";
import { BackButton } from "../../../shared/ui/BackButton";
import { useAuth } from "../../../shared/hooks/useAuth";
import { useCompanies } from "../hooks/useCompanies";
import { CreateCompanyModal } from "../components/CreateCompanyModal";
import { EditCompanyModal } from "../components/EditCompanyModal";
import { ViewCompanyModal } from "../components/ViewCompanyModal";
import { ConfirmModal } from "../components/ConfirmModal";
import { CompaniesSummary } from "../components/CompaniesSummary";
import { CompaniesFiltersBar } from "../components/CompaniesFiltersBar";
import type { Company, CompanyCreate } from "../types/company";
import { TrashIcon } from "@heroicons/react/24/outline";

export function CompaniesPage() {
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const isAdmin = currentUser?.role_id === 1;
  const { companies, loading, handleCreate, handleUpdate, handleToggleActive, handleDelete } = useCompanies();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [viewingCompany, setViewingCompany] = useState<Company | null>(null);
  const [togglingCompanyId, setTogglingCompanyId] = useState<number | null>(null);
  const [deletingCompanyId, setDeletingCompanyId] = useState<number | null>(null);

  const totalEmpresas = companies.length;
  const totalActivas = companies.filter((c) => c.active).length;
  const totalInactivas = companies.filter((c) => !c.active).length;

  const filtered = companies.filter((c) => {
    const matchSearch = `${c.name} ${c.rfc} ${c.email ?? ""}`
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchStatus =
      statusFilter === "all" ||
      (statusFilter === "active" ? c.active : !c.active);
    return matchSearch && matchStatus;
  });

  const togglingCompany = companies.find((c) => c.id === togglingCompanyId);
  const deletingCompany = companies.find((c) => c.id === deletingCompanyId);

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
                {isAdmin ? "Gestión de Empresas" : "Empresas"}
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
                    Nueva Empresa
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
                      Nueva Empresa
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Tarjetas de conteo: admin y asesor ven igual */}
          {(isAdmin || currentUser?.role_id === 2) && (
            <CompaniesSummary
              total={totalEmpresas}
              active={totalActivas}
              inactive={totalInactivas}
            />
          )}

          {/* Buscador y filtros */}
          <CompaniesFiltersBar
            search={search}
            onSearchChange={(e) => setSearch(e.target.value)}
            statusFilter={statusFilter}
            onStatusFilterChange={(e) => setStatusFilter(e.target.value)}
          />

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
                    header: "Empresa",
                    accessor: (c) => (
                      <div>
                        <p className="font-medium">{c.name}</p>
                        <p className="text-xs text-gray-400">id: {c.id}</p>
                      </div>
                    ),
                  },
                  { header: "RFC", accessor: "rfc" },
                  { header: "Contacto", accessor: (c) => c.email ?? "—" },
                  { header: "Dirección", accessor: "address" },
                  {
                    header: "Estado",
                    accessor: (c) => (
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${c.active ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-500"}`}>
                        {c.active ? "Activa" : "Inactiva"}
                      </span>
                    ),
                  },
                  {
                    header: "Acción",
                    accessor: (c) => (
                      <div className="flex gap-2 items-center">
                        {isAdmin && (
                          <>
                            <button
                              onClick={() => setViewingCompany(c)}
                              className="bg-blue-50 text-blue-600 rounded-full px-4 py-2 text-sm font-medium hover:bg-blue-100 transition">
                              Ver detalles
                            </button>
                            <button
                              onClick={() => setEditingCompany(c)}
                              className="bg-amber-50 text-amber-600 rounded-full px-4 py-2 text-sm font-medium hover:bg-amber-100 transition">
                              Editar
                            </button>
                            <button
                              onClick={() => setTogglingCompanyId(c.id)}
                              title={c.active ? "Desactivar empresa" : "Activar empresa"}
                              className={`w-10 h-6 rounded-full flex items-center transition-colors duration-300 px-0.5 ${c.active ? "bg-green-500" : "bg-gray-300"}`}>
                              <span className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform duration-300 ${c.active ? "translate-x-4" : "translate-x-0"}`} />
                            </button>
                            <button
                              onClick={() => setDeletingCompanyId(c.id)}
                              title="Eliminar empresa"
                              className="bg-red-50 text-red-500 p-2 rounded-full hover:bg-red-100 transition">
                              <TrashIcon className="w-5 h-5" />
                            </button>
                          </>
                        )}
                        {!isAdmin && (
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

      {viewingCompany && (
        <ViewCompanyModal
          company={viewingCompany}
          onClose={() => setViewingCompany(null)}
        />
      )}

      {showCreateModal && (
        <CreateCompanyModal
          onClose={() => setShowCreateModal(false)}
          onCreate={async (data) => {
            await handleCreate(data);
            setShowCreateModal(false);
          }}
        />
      )}

      {editingCompany && (
        <EditCompanyModal
          company={editingCompany}
          onClose={() => setEditingCompany(null)}
          onUpdate={async (id, data) => {
            await handleUpdate(id, data);
            setEditingCompany(null);
          }}
        />
      )}

      {togglingCompanyId !== null && (
        <ConfirmModal
          message={`¿Desea ${togglingCompany?.active ? "desactivar" : "activar"} la empresa "${togglingCompany?.name}"?`}
          confirmLabel={togglingCompany?.active ? "Desactivar" : "Activar"}
          confirmColor={togglingCompany?.active ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"}
          onCancel={() => setTogglingCompanyId(null)}
          onConfirm={async () => {
            await handleToggleActive(togglingCompanyId);
            setTogglingCompanyId(null);
          }}
        />
      )}

      {deletingCompanyId !== null && (
        <ConfirmModal
          message={`¿Está seguro que desea eliminar la empresa "${deletingCompany?.name}"? Esta acción no se puede deshacer.`}
          confirmLabel="Eliminar"
          confirmColor="bg-red-600 hover:bg-red-700"
          onCancel={() => setDeletingCompanyId(null)}
          onConfirm={async () => {
            await handleDelete(deletingCompanyId);
            setDeletingCompanyId(null);
          }}
        />
      )}
    </div>
  );
}