import type React from "react";
import { Card } from "../../../shared/ui/Card";
import { SearchBar } from "../../../shared/components/SearchBar";

interface CompaniesFiltersBarProps {
  search: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  statusFilter: string;
  onStatusFilterChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export function CompaniesFiltersBar({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
}: CompaniesFiltersBarProps) {
  return (
    <div className="w-full flex justify-center mb-4">
      <Card className="py-3 px-4 sm:px-6 flex items-center max-w-5xl w-full bg-linear-to-br from-gray-50 to-white border-0 shadow-md">
        <div className="flex flex-col md:flex-row md:flex-nowrap items-center gap-2 md:gap-4 w-full">
          <SearchBar
            value={search}
            onChange={onSearchChange}
            placeholder="Buscar empresa"
            className="px-3 py-2 w-full md:w-96 bg-white rounded-lg shadow-sm border border-gray-200 focus-within:ring-2 focus-within:ring-blue-200 transition-all"
          />

          <select
            className="w-full md:w-auto bg-white border border-gray-200 rounded-lg px-3 py-2 text-base shadow-sm focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all outline-none min-w-[160px]"
            value={statusFilter}
            onChange={onStatusFilterChange}
          >
            <option value="all">Todos los estados</option>
            <option value="active">Activo</option>
            <option value="inactive">Inactivo</option>
          </select>
        </div>
      </Card>
    </div>
  );
}