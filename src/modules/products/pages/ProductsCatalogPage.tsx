import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BackButton } from "../../../shared/ui/BackButton";
import { useProducts } from "../hooks/useProducts";
import { ProductCard } from "../components/ProductCard";
import { ProductsFiltersBar } from "../components/ProductsFiltersBar";
import type { Product } from "../types/product";
import { Header, SidebarClient } from "../../../shared/components/Index";

export default function ProductsCatalogPage() {
  const navigate = useNavigate();
  const { products, types, units, loading } = useProducts();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("Todos");
  const [unitFilter, setUnitFilter] = useState("Todos");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Solo productos activos para clientes y asesores
  const filteredProducts = products.filter(p => {
    if (!p.active) return false;
    if (typeFilter !== "Todos" && String(p.type_id) !== String(typeFilter)) return false;
    if (unitFilter !== "Todos" && String(p.unit_id) !== String(unitFilter)) return false;
    if (search.trim() && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="h-screen flex flex-col">
      <Header />
      <div className="flex flex-1 min-h-0">
        <SidebarClient />
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
            />
          </div>
          {loading ? (
            <div className="text-center py-10">Cargando productos...</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-4">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
          {/* Aquí puedes agregar un modal para detalles si lo deseas */}
        </main>
      </div>
    </div>
  );
}
