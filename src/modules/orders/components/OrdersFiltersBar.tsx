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
}: OrdersFiltersBarProps) {
  return (
    <div className="w-full flex justify-center mb-4">
      <Card className="p-5 flex flex-col items-center max-w-4xl w-full bg-linear-to-br from-gray-50 to-white border border-gray-200 shadow-md">
        <div className="w-full flex flex-wrap justify-center items-center gap-4">
          {typeof search === "string" && typeof onSearchChange === "function" ? (
            <SearchBar
              value={search}
              onChange={onSearchChange}
              placeholder="Buscar pedido"
              className="px-3 py-2 w-44 md:w-72 bg-white rounded-lg shadow-sm border border-gray-200 focus-within:ring-2 focus-within:ring-blue-200 transition-all"
            />
          ) : null}

          <select
            className="bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-base shadow-sm focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all outline-none min-w-60"
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

          <select
            className="bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-base shadow-sm focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all outline-none min-w-44"
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
