import { useState, useMemo } from "react";
import { toast } from "react-hot-toast";
import { useProducts } from "../hooks/useProducts";
import { useAuth } from "../../../shared/hooks/useAuth";
import { Button } from "../../../shared/ui/Button";
import { ProductsFiltersBar } from "../components/ProductsFiltersBar";
import { ProductsSummary } from "../components/ProductsSummary";
import { LoadingSpinner } from "../../../shared/ui/LoadingSpinner";
import { ProductTable } from "../components/ProductTable";
import { ProductModal } from "../components/ProductModal";
import { DeleteProductModal } from "../components/DeleteProductModal";
import { createProduct, updateProduct, deleteProduct } from "../services/products";
import { formDataToObject } from "../utils/formDataToObject";
import { getS3UploadUrl, uploadFileToS3 } from "../services/s3";
import type { Product } from "../types/product";
import { SidebarAdmin, Header } from "../../../shared/components/Index";
import { BackButton } from "../../../shared/ui/BackButton";

export default function ProductsPage() {
  const { products, types, units, loading, error, reload } = useProducts();
  const { isAdmin } = useAuth();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("Todos");
  const [typeFilter, setTypeFilter] = useState("Todos");
  const [unitFilter, setUnitFilter] = useState("Todos");
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [sortDesc, setSortDesc] = useState(true);

  const filteredProducts = useMemo(() => {
    let filtered = products;
    if (filter !== "Todos") filtered = filtered.filter(p => filter === "Activo" ? p.active : !p.active);
    if (typeFilter !== "Todos") filtered = filtered.filter(p => String(p.type_id) === String(typeFilter));
    if (unitFilter !== "Todos") filtered = filtered.filter(p => String(p.unit_id) === String(unitFilter));
    if (search.trim()) filtered = filtered.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
    // Ordenar por ID
    filtered = filtered.slice().sort((a, b) => sortDesc ? b.id - a.id : a.id - b.id);
    return filtered;
  }, [products, search, filter, typeFilter, unitFilter, sortDesc]);

  const handleOpenCreate = () => { setEditingProduct(null); setFormError(""); setShowFormModal(true); };
  const handleEdit = (product: Product) => { setEditingProduct(product); setFormError(""); setShowFormModal(true); };
  const handleDelete = (product: Product) => { setProductToDelete(product); setDeleteError(""); setShowDeleteModal(true); };

  const handleFormSubmit = async (formData: FormData) => {
    setFormLoading(true);
    setFormError("");
    try {
      const plainObj = formDataToObject(formData);
      if (formData.get("image") instanceof File) {
        const file = formData.get("image") as File;
        if (file && file.size > 0) {
          const { upload_url, object_url } = await getS3UploadUrl({
            module: "products",
            filename: file.name,
            contentType: file.type,
          });
          await uploadFileToS3(upload_url, file);
          plainObj.image_url = object_url;
        }
      }
      delete plainObj.image;
      if (editingProduct) {
        await updateProduct(editingProduct.id, plainObj);
        toast.success("Producto actualizado correctamente");
      } else {
        await createProduct(plainObj);
        toast.success("Producto creado correctamente");
      }
      setShowFormModal(false);
      reload();
    } catch (err: any) {
      let msg = "Error al guardar producto";
      if (err?.response?.data?.detail) msg = err.response.data.detail;
      else if (err?.message) msg = err.message;
      setFormError(msg);
      toast.error(msg);
    } finally {
      setFormLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;
    setDeleteLoading(true);
    setDeleteError("");
    try {
      await deleteProduct(productToDelete.id);
      setShowDeleteModal(false);
      reload();
      toast.success("Producto eliminado correctamente");
    } catch (err: any) {
      // Solo mostrar el error en el toast, no en el modal
      setDeleteError("");
      toast.error(err?.message || "Error al eliminar producto");
    } finally {
      setDeleteLoading(false);
    }
  };

  // Calcular totales para el resumen
  const totalProducts = products.length;
  const totalActive = products.filter(p => p.active).length;
  const totalInactive = products.filter(p => !p.active).length;

  return (
    <div className="h-screen flex flex-col">
      <Header />
      <div className="flex flex-1 min-h-0">
        <SidebarAdmin />
        <main className="flex-1 p-4 overflow-y-auto">
          <div className="flex flex-col items-center mb-6 w-full max-w-6xl mx-auto">
            <div className="flex items-center w-full justify-between gap-2">
              <BackButton onClick={() => window.history.back()} className="mr-2" />
              <h1 className="text-3xl font-bold text-gray-800 text-center flex-1">Gestión de productos</h1>
            </div>
          </div>
          <ProductsSummary total={totalProducts} active={totalActive} inactive={totalInactive} />
          <div className="flex flex-col max-w-[1248px] mx-auto mb-2 w-full gap-2 [@media(min-width:1248px)]:flex-row [@media(min-width:1248px)]:items-center [@media(min-width:1248px)]:justify-between [@media(min-width:1248px)]:gap-4">
            <div className="w-full flex flex-col gap-2 [@media(min-width:1248px)]:flex-row [@media(min-width:1248px)]:grow [@media(min-width:1248px)]:min-w-0 [@media(min-width:1248px)]:gap-2 flex-shrink">
              <ProductsFiltersBar
                search={search}
                onSearchChange={e => setSearch(e.target.value)}
                filter={filter}
                onFilterChange={e => setFilter(e.target.value)}
                typeFilter={typeFilter}
                onTypeFilterChange={e => setTypeFilter(e.target.value)}
                unitFilter={unitFilter}
                onUnitFilterChange={e => setUnitFilter(e.target.value)}
                types={types}
                units={units}
                isAdmin={isAdmin}
                onNewProduct={handleOpenCreate}
                sortDesc={sortDesc}
                onSortDescChange={setSortDesc}
              />
            </div>
            {isAdmin && (
              <div className="w-full mt-2 min-w-0 [@media(min-width:1248px)]:w-auto [@media(min-width:1248px)]:mt-0">
                <Button
                  onClick={handleOpenCreate}
                  className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-blue-600 text-white font-bold px-6 py-3 rounded-xl shadow-lg hover:from-indigo-600 hover:to-blue-700 transition-all text-base w-full [@media(min-width:1248px)]:w-auto min-w-0 [@media(min-width:1248px)]:min-w-[180px]"
                >
                  <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  Nuevo Producto
                </Button>
              </div>
            )}
          </div>
          <div className="mt-4 flex justify-center">
            <div className="w-full max-w-7xl">
              {loading ? <LoadingSpinner className="my-8" /> : error ? (
                <div className="text-red-500 text-center py-8">{error}</div>
              ) : (
                <ProductTable
                  products={filteredProducts}
                  isAdmin={isAdmin}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              )}
            </div>
          </div>
        </main>
        <ProductModal
          open={showFormModal}
          onClose={() => setShowFormModal(false)}
          initialData={editingProduct || {}}
          types={types}
          units={units}
          onSubmit={handleFormSubmit}
          loading={formLoading}
          error={formError}
        />
        <DeleteProductModal
          open={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          product={productToDelete}
          onConfirm={handleConfirmDelete}
          loading={deleteLoading}
          error={deleteError}
        />
      </div>
    </div>
  );
}