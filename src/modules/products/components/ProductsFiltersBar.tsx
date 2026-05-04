import { Card } from "../../../shared/ui/Card";
import { Button } from "../../../shared/ui/Button";
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
      <Card className="mb-4 p-6 flex flex-col items-center max-w-3xl w-full bg-gradient-to-br from-gray-50 to-white border border-gray-200 shadow-md">
        <div className="flex flex-wrap justify-center items-center gap-4 w-full">
          <SearchBar
            value={search}
            onChange={onSearchChange}
            placeholder="Buscar producto"
            className="px-3 py-2 w-44 md:w-64 bg-white rounded-lg shadow-sm border border-gray-200 focus-within:ring-2 focus-within:ring-blue-200 transition-all"
          />
                    <button
            type="button"
            className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all outline-none"
            onClick={() => onSortDescChange(!sortDesc)}
            title={sortDesc ? "Orden descendente (más reciente primero)" : "Orden ascendente (más antiguo primero)"}
          >
            {sortDesc ? "Más recientes primero" : "Más antiguos primero"}
          </button>
          {typeof filter !== 'undefined' && typeof onFilterChange !== 'undefined' && (
            <select
              className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all outline-none"
              value={filter}
              onChange={onFilterChange}
            >
              <option value="Todos">Todos</option>
              <option value="Activo">Activo</option>
              <option value="Inactivo">Inactivo</option>
            </select>
          )}
          <select
            className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all outline-none"
            value={typeFilter}
            onChange={onTypeFilterChange}
          >
            <option value="Todos">Todos los tipos</option>
            {types.map(t => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
          <select
            className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all outline-none"
            value={unitFilter}
            onChange={onUnitFilterChange}
          >
            <option value="Todos">Todas las unidades</option>
            {units.map(u => (
              <option key={u.id} value={u.id}>{u.abbreviation || u.name}</option>
            ))}
          </select>
        </div>
        {/* Fin de filtros */}
      </Card>
    </div>
  );
}
