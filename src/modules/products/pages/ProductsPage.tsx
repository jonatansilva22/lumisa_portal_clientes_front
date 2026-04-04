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

  const filteredProducts = useMemo(() => {
    let filtered = products;
    if (filter !== "Todos") filtered = filtered.filter(p => filter === "Activo" ? p.active : !p.active);
    if (typeFilter !== "Todos") filtered = filtered.filter(p => String(p.type_id) === String(typeFilter));
    if (unitFilter !== "Todos") filtered = filtered.filter(p => String(p.unit_id) === String(unitFilter));
    if (search.trim()) filtered = filtered.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
    return filtered;
  }, [products, search, filter, typeFilter, unitFilter]);

  const handleOpenCreate = () => { setEditingProduct(null); setFormError(""); setShowFormModal(true); };
  const handleEdit = (product: Product) => { setEditingProduct(product); setFormError(""); setShowFormModal(true); };
  const handleDelete = (product: Product) => { setProductToDelete(product); setDeleteError(""); setShowDeleteModal(true); };

  const handleFormSubmit = async (formData: FormData) => {
    setFormLoading(true);
    setFormError("");
    try {
      const plainObj = formDataToObject(formData);
      // Manejo de imagen: si hay archivo nuevo, subir a S3 y poner la URL
      if (formData.get("image") instanceof File) {
        const file = formData.get("image") as File;
        if (file && file.size > 0) {
          // 1. Pedir URL presignada
          const { upload_url, object_url } = await getS3UploadUrl({
            module: "products",
            filename: file.name,
            contentType: file.type,
          });
          // 2. Subir archivo a S3
          await uploadFileToS3(upload_url, file);
          // 3. Guardar la URL pública en image_url
          plainObj.image_url = object_url;
        }
      }
      // Si no hay imagen nueva, mantener la existente o vacía
      delete plainObj.image; // nunca enviar el archivo al backend
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
      setFormError("Error al guardar producto");
      toast.error("Ha ocurrido un error");
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
    } catch {
      setDeleteError("Error al eliminar producto");
      toast.error("Error al eliminar producto");
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
          <div className="flex flex-col items-center mb-6">
            <div className="w-full flex items-center max-w-6xl mx-auto mb-2">
              <BackButton onClick={() => window.history.back()} className="mr-2" />
              <h1 className="text-3xl font-bold text-gray-800 text-center flex-1">Gestión de productos</h1>
            </div>
          </div>
          <ProductsSummary total={totalProducts} active={totalActive} inactive={totalInactive} />
          <div className="flex flex-row items-center justify-between max-w-6xl mx-auto mb-2 w-full gap-4 flex-wrap">
            <div className="flex-1 min-w-[300px]">
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
              />
            </div>
            {isAdmin && (
              <Button onClick={handleOpenCreate} className="whitespace-nowrap bg-gray-200 hover:bg-gray-300">
                + Nuevo Producto
              </Button>
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