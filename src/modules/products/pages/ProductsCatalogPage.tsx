import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BackButton } from "../../../shared/ui/BackButton";
import { useProducts } from "../hooks/useProducts";
import { ProductCard } from "../components/ProductCard";
import { ProductsFiltersBar } from "../components/ProductsFiltersBar";
import type { Product } from "../types/product";
import { Header, SidebarClient, SidebarAdviser } from "../../../shared/components/Index";
import { useAuth } from '../../../shared/hooks/useAuth';
import {LoadingSpinner} from "../../../shared/ui/LoadingSpinner";


export default function ProductsCatalogPage() {
  const navigate = useNavigate();
  const { products, types, units, loading } = useProducts();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("Todos");
  const [unitFilter, setUnitFilter] = useState("Todos");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [sortDesc, setSortDesc] = useState(true);
  const [visibleCount, setVisibleCount] = useState(30);
  const { isAdviser } = useAuth();

  // Solo productos activos para clientes y asesores
  const filteredProducts = products
    .filter(p => {
      if (!p.active) return false;
      if (typeFilter !== "Todos" && String(p.type_id) !== String(typeFilter)) return false;
      if (unitFilter !== "Todos" && String(p.unit_id) !== String(unitFilter)) return false;
      if (search.trim() && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    })
    .slice()
    .sort((a, b) => sortDesc ? b.id - a.id : a.id - b.id);
  const visibleProducts = filteredProducts.slice(0, visibleCount);

  return (
    <div className="h-screen flex flex-col">
      <Header />
      <div className="flex flex-1 min-h-0">
        {isAdviser ? <SidebarAdviser /> : <SidebarClient />}
        <main className="flex-1 p-4 overflow-y-auto">
          <div className="flex items-center gap-2 mb-4">
            <BackButton onClick={() => navigate(-1)} />
            <h1 className="text-2xl font-bold">Productos</h1>
          </div>
          <div className="mb-4">
            <ProductsFiltersBar
              search={search}
              onSearchChange={e => setSearch(e.target.value)}
              typeFilter={typeFilter}
              onTypeFilterChange={e => setTypeFilter(e.target.value)}
              unitFilter={unitFilter}
              onUnitFilterChange={e => setUnitFilter(e.target.value)}
              types={types}
              units={units}
              isAdmin={false}
              onNewProduct={() => {}}
              sortDesc={sortDesc}
              onSortDescChange={setSortDesc}
            />
          </div>
          {loading ? (
            <div className="flex flex-col items-center justify-center py-10 gap-2">
              <LoadingSpinner size={40} />
              <span className="text-gray-500 mt-2">Cargando productos...</span>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-4">
                {visibleProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              {filteredProducts.length > visibleCount && (
                <div className="flex justify-center my-6">
                  <button
                    onClick={() => setVisibleCount(c => c + 30)}
                    className="mt-4 px-8 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 font-semibold transition cursor-pointer"
                  >
                    Cargar más
                  </button>
                </div>
              )}
            </>
          )}
          {/* Aquí puedes agregar un modal para detalles si lo deseas */}
        </main>
      </div>
    </div>
  );
}