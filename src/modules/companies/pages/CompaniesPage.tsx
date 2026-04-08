import { useState } from "react";
import { Header } from "../../../shared/components/Index";
import { SidebarAdmin } from "../../../shared/components/Index";
import { SearchBar } from "../../../shared/components/Index";
import { Table } from "../../../shared/ui/Index";
import { Button } from "../../../shared/ui/Index";
import { DeleteButton } from "../../../shared/ui/Index";
import { FilterDropdown } from "../../../shared/ui/Index";
import { LoadingSpinner } from "../../../shared/ui/Index";
import { useCompanies } from "../hooks/useCompanies";
import { CreateCompanyModal } from "../components/CreateCompanyModal";
import { EditCompanyModal } from "../components/EditCompanyModal";
import { ViewCompanyModal } from "../components/ViewCompanyModal";
import { ConfirmModal } from "../components/ConfirmModal";
import type { Company, CompanyCreate } from "../types/company";

export function CompaniesPage() {
  const { companies, loading, handleCreate, handleUpdate, handleToggleActive } = useCompanies();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todos los estados");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [viewingCompany, setViewingCompany] = useState<Company | null>(null);
  const [togglingCompanyId, setTogglingCompanyId] = useState<number | null>(null);

  const totalEmpresas = companies.length;
  const totalActivas = companies.filter((c) => c.active).length;
  const totalInactivas = companies.filter((c) => !c.active).length;

  const filtered = companies.filter((c) => {
    const matchSearch = `${c.name} ${c.rfc} ${c.email ?? ""}`
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchStatus =
      statusFilter === "Todos los estados" ||
      (statusFilter === "Activo" ? c.active : !c.active);
    return matchSearch && matchStatus;
  });

  const togglingCompany = companies.find((c) => c.id === togglingCompanyId);

  return (
    <div className="h-screen flex flex-col">
      <Header />
      <div className="flex flex-1 min-h-0">
        <SidebarAdmin />
        <main className="flex-1 p-6 overflow-auto">

          {/* Titulo y boton */}
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Gestión de Empresas</h1>
            <Button onClick={() => setShowCreateModal(true)}>+ Nueva Empresa</Button>
          </div>

          {/* Tarjetas de conteo */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="border rounded-lg p-4 flex items-center gap-3">
              <span className="text-2xl">🏢</span>
              <div>
                <p className="text-xl font-bold">{totalEmpresas}</p>
                <p className="text-sm text-gray-500">Total Empresas</p>
              </div>
            </div>
            <div className="border rounded-lg p-4 flex items-center gap-3">
              <span className="text-2xl">✅</span>
              <div>
                <p className="text-xl font-bold">{totalActivas}</p>
                <p className="text-sm text-gray-500">Activas</p>
              </div>
            </div>
            <div className="border rounded-lg p-4 flex items-center gap-3">
              <span className="text-2xl">⚠️</span>
              <div>
                <p className="text-xl font-bold">{totalInactivas}</p>
                <p className="text-sm text-gray-500">Inactivas</p>
              </div>
            </div>
          </div>

          {/* Buscador y filtros */}
          <div className="flex gap-3 mb-4">
            <SearchBar
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nombre, RFC..."
              className="flex-1"
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
                    <div className="flex gap-2">
                      <button
                        onClick={() => setViewingCompany(c)}
                        className="border rounded-full px-4 py-1 text-sm hover:bg-gray-100 transition">
                        Ver
                      </button>
                      <button
                        onClick={() => setEditingCompany(c)}
                        className="border rounded-full px-4 py-1 text-sm hover:bg-gray-100 transition">
                        Editar
                      </button>
                      <DeleteButton onClick={() => setTogglingCompanyId(c.id)} />
                    </div>
                  ),
                },
              ]}
            />
          )}
        </main>
      </div>

      {/* Modal ver empresa */}
      {viewingCompany && (
        <ViewCompanyModal
          company={viewingCompany}
          onClose={() => setViewingCompany(null)}
        />
      )}

      {/* Modal crear empresa */}
      {showCreateModal && (
        <CreateCompanyModal
          onClose={() => setShowCreateModal(false)}
          onCreate={async (data) => {
            await handleCreate(data);
            setShowCreateModal(false);
          }}
        />
      )}

      {/* Modal editar empresa */}
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

      {/* Confirmación toggle activo */}
      {togglingCompanyId !== null && (
        <ConfirmModal
          message={`¿Desea ${togglingCompany?.active ? "desactivar" : "activar"} esta empresa?`}
          confirmLabel={togglingCompany?.active ? "Desactivar" : "Activar"}
          confirmColor={togglingCompany?.active ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"}
          onCancel={() => setTogglingCompanyId(null)}
          onConfirm={async () => {
            await handleToggleActive(togglingCompanyId);
            setTogglingCompanyId(null);
          }}
        />
      )}
    </div>
  );
}