import type React from "react";
import { Card } from "../../../shared/ui/Card";
import { SearchBar } from "../../../shared/components/SearchBar";
import type { OrderStatus } from "../types/order";

interface OrdersFiltersBarProps {
  search?: string;
  onSearchChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  statusFilter: string;
  onStatusFilterChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  yearFilter: string;
  onYearFilterChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  years: number[];
  statuses: OrderStatus[];
  sortDesc?: boolean;
  onSortDescChange?: (desc: boolean) => void;
  assignmentFilter: string;
  onAssignmentFilterChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  userName?: string;
}

export function OrdersFiltersBar({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  yearFilter,
  onYearFilterChange,
  years,
  statuses,
  sortDesc = true,
  onSortDescChange,
  assignmentFilter,
  onAssignmentFilterChange,
  userName: _userName,
}: OrdersFiltersBarProps) {
  return (
    <div className="w-full flex justify-center">
      <Card className="mb-2 py-3 px-4 sm:px-6 flex items-center max-w-5xl w-full bg-linear-to-br from-gray-50 to-white border-0 shadow-md">
        <div className="flex flex-col md:flex-row md:flex-nowrap items-center gap-2 md:gap-4 w-full">
          {typeof search === "string" && typeof onSearchChange === "function" && (
            <SearchBar
              value={search}
              onChange={onSearchChange}
              placeholder="Buscar pedido"
              className="px-3 py-2 w-full md:w-96 bg-white rounded-lg shadow-sm border border-gray-200 focus-within:ring-2 focus-within:ring-blue-200 transition-all text-xl font-bold"
            />
          )}
          {typeof onSortDescChange === 'function' && (
            <button
              type="button"
              className="w-full md:w-auto bg-white border border-gray-200 rounded-lg px-3 py-2 text-base shadow-sm focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all outline-none flex items-center gap-2 justify-center"
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
          )}
          <select
            className="w-full md:w-auto bg-white border border-gray-200 rounded-lg px-3 py-2 text-base shadow-sm focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all outline-none min-w-[160px]"
            value={statusFilter}
            onChange={onStatusFilterChange}
          >
            <option value="all">Todos los estados</option>
            {statuses
              .filter((status) => !status.name.toLowerCase().includes("revis"))
              .map((status) => (
                <option key={status.id} value={String(status.id)}>
                  {status.name}
                </option>
              ))}
          </select>
            {typeof onAssignmentFilterChange === 'function' && onAssignmentFilterChange.toString() !== (() => {}).toString() && (
              <select
                className="w-full md:w-auto bg-white border border-gray-200 rounded-lg px-3 py-2 text-base shadow-sm focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all outline-none min-w-[170px]"
                value={assignmentFilter}
                onChange={onAssignmentFilterChange}
              >
                <option value="all">Todos los pedidos</option>
                <option value="unassigned">Sin asesor</option>
                <option value="mine">Asignados a mí</option>
              </select>
            )}
          <select
            className="w-full md:w-auto bg-white border border-gray-200 rounded-lg px-3 py-2 text-base shadow-sm focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all outline-none min-w-[140px]"
            value={yearFilter}
            onChange={onYearFilterChange}
          >
            <option value="all">Todos los años</option>
            {years.map((year) => (
              <option key={year} value={String(year)}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </Card>
    </div>
  );
}
