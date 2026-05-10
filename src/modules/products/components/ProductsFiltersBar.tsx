import { Card } from "../../../shared/ui/Card";
import { SearchBar } from "../../../shared/components/SearchBar";
import type { ProductType, Unit } from "../types/product";
import React from "react";

interface ProductsFiltersBarProps {
  search: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  filter?: string;
  onFilterChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  typeFilter: string;
  onTypeFilterChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  unitFilter: string;
  onUnitFilterChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  types: ProductType[];
  units: Unit[];
  isAdmin: boolean;
  onNewProduct: () => void;
  sortDesc: boolean;
  onSortDescChange: (desc: boolean) => void;
}

export function ProductsFiltersBar({
  search,
  onSearchChange,
  filter,
  onFilterChange,
  typeFilter,
  onTypeFilterChange,
  unitFilter,
  onUnitFilterChange,
  types,
  units,
  sortDesc,
  onSortDescChange
}: ProductsFiltersBarProps) {
  return (
    <div className="w-full flex justify-center">
      <Card className="mb-2 py-3 px-6 flex items-center max-w-5xl w-full bg-gradient-to-br from-gray-50 to-white border-0 shadow-md">
        <div className="flex flex-row flex-nowrap items-center gap-4 w-full overflow-x-auto">
          <SearchBar
            value={search}
            onChange={onSearchChange}
            placeholder="Buscar producto"
            className="px-3 py-2 w-56 md:w-96 bg-white rounded-lg shadow-sm border border-gray-200 focus-within:ring-2 focus-within:ring-blue-200 transition-all text-xl font-bold"
          />
          <button
            type="button"
            className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-base shadow-sm focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all outline-none flex items-center gap-2"
            onClick={() => onSortDescChange(!sortDesc)}
            title={sortDesc ? "Orden descendente (más reciente primero)" : "Orden ascendente (más antiguo primero)"}
          >
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="inline align-middle">
              {sortDesc ? (
                <path d="M19 9l-7 7-7-7" />
              ) : (
                <path d="M5 15l7-7 7 7" />
              )}
            </svg>
            <span>{sortDesc ? "Recientes" : "Antiguos"}</span>
          </button>
          {typeof filter !== 'undefined' && typeof onFilterChange !== 'undefined' && (
            <select
              className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-base shadow-sm focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all outline-none min-w-[110px]"
              value={filter}
              onChange={onFilterChange}
            >
              <option value="Todos">Todos</option>
              <option value="Activo">Activo</option>
              <option value="Inactivo">Inactivo</option>
            </select>
          )}
          <select
            className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-base shadow-sm focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all outline-none min-w-[140px]"
            value={typeFilter}
            onChange={onTypeFilterChange}
          >
            <option value="Todos">Todos los tipos</option>
            {types.map(t => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
          <select
            className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-base shadow-sm focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all outline-none min-w-[140px]"
            value={unitFilter}
            onChange={onUnitFilterChange}
          >
            <option value="Todos">Todas las unidades</option>
            {units.map(u => (
              <option key={u.id} value={u.id}>{u.abbreviation || u.name}</option>
            ))}
          </select>
        </div>
      </Card>
    </div>
  );
}
