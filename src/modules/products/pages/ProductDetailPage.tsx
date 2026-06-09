import { useParams, useNavigate } from "react-router-dom";
import { useProducts } from "../hooks/useProducts";
import { Card } from "../../../shared/ui/Card";
import { Header, SidebarClient, SidebarAdviser } from "../../../shared/components/Index";
import { useAuth } from '../../../shared/hooks/useAuth';
import { BackButton } from "../../../shared/ui/BackButton";
import { useState } from "react";
import { useCart } from '../../carts/hooks/useCart';
import toast from 'react-hot-toast';
import { LoadingSpinner } from '../../../shared/ui/LoadingSpinner';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, types, units } = useProducts();
  const product = products.find(p => String(p.id) === String(id));
  const [quantity, setQuantity] = useState(1);
  const { addToCart, cart, loading } = useCart();
  const { isAdmin, isAdviser } = useAuth();

  // Mostrar spinner si los datos aún no están listos
  if (!products.length || !types.length || !units.length) {
    return (
      <div className="h-screen flex flex-col">
        <Header />
        <div className="flex flex-1 min-h-0">
          {isAdviser ? <SidebarAdviser /> : <SidebarClient />}
          <main className="flex-1 p-8 flex items-center justify-center">
            <LoadingSpinner size={48} />
          </main>
        </div>
      </div>
    );
  }

  // Si el producto no existe o está inactivo y el usuario no es admin, no mostrar detalles
  if (!product || (!isAdmin && !product.active)) {
    return (
      <div className="h-screen flex flex-col">
        <Header />
        <div className="flex flex-1 min-h-0">
          {isAdviser ? <SidebarAdviser /> : <SidebarClient />}
          <main className="flex-1 p-8 flex items-center justify-center">
            <div className="text-2xl text-gray-500">Producto no encontrado o inactivo</div>
          </main>
        </div>
      </div>
    );
  }

  const type = types.find(t => t.id === product.type_id);
  const unit = units.find(u => u.id === product.unit_id);
  const priceNum = typeof product.price === "number" ? product.price : Number(product.price);
  const total = (priceNum * quantity).toFixed(2);

  const handleAddToCart = async () => {
    if (!product) return;
    // Buscar si el producto ya está en el carrito
    const cartItem = cart?.cart_details?.find((item: any) => item.product_id === product.id);
    const currentQty = cartItem ? cartItem.quantity : 0;
    const newQty = currentQty + quantity;
    if (newQty > product.quantity) {
      toast.error('No puedes agregar más de la cantidad disponible en stock.');
      return;
    }
    try {
      await addToCart({ product_id: product.id, quantity });
      toast.success('¡Producto agregado al carrito!');
    } catch (e) {
      toast.error('Error al agregar al carrito');
    }
  };

  return (
    <div className="h-screen flex flex-col">
      <Header/>
      <div className="flex flex-1 min-h-0">
      {isAdviser ? <SidebarAdviser /> : <SidebarClient />}
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="flex items-center mb-6">
            <BackButton onClick={() => navigate(-1)} className="mr-2" />
            <h1 className="text-3xl font-bold">Detalles de {product.name}</h1>
          </div>
          {/* Fila superior: imagen e info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Imagen */}
            <Card className="flex flex-col items-center justify-center min-h-[220px] h-full p-4 transition-transform duration-300 hover:scale-105">
              <div className="w-full mb-2">
                <h2 className="text-xl font-bold text-center text-gray-900 border-b border-gray-200 pb-2">Imagen del producto</h2>
              </div>
              {product.image_url ? (
                <img src={product.image_url} alt={product.name} className="object-contain w-72 h-72" />
              ) : (
                <svg width="120" height="120" fill="none" stroke="gray" strokeWidth="2" viewBox="0 0 64 64"><rect x="8" y="8" width="48" height="48" rx="6"/><circle cx="24" cy="24" r="6"/><path d="M56 44l-16-16L16 56"/></svg>
              )}
            </Card>
            {/* Info */}
            <Card className="flex flex-col gap-0 min-h-[220px] h-full p-4 transition-transform duration-300 hover:scale-105">
              <div className="flex flex-col w-full">
                <div className="flex items-center justify-between border-b border-gray-200 pb-6 mb-2">
                  <span className="font-bold text-xl">Nombre:</span>
                  <span className="text-xl">{product.name}</span>
                </div>
                <div className="flex items-center justify-between border-b border-gray-200 pb-6 mb-2">
                  <span className="font-bold text-xl">Precio:</span>
                  <span className="text-xl">${priceNum.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between border-b border-gray-200 pb-6 mb-2">
                  <span className="font-bold text-xl">Stock:</span>
                  <span className="text-xl">{product.quantity}</span>
                  <span className="font-bold text-xl ml-8">Unidad:</span>
                  <span className="text-xl">{unit?.abbreviation || unit?.name || '-'}</span>
                </div>
                <div className="flex items-center justify-between border-b border-gray-200 pb-6 mb-2">
                  <span className="font-bold text-xl">Tipo:</span>
                  <span className="text-xl">{type?.name || '-'}</span>
                </div>
              </div>
            </Card>
          </div>
          {/* Fila inferior: descripción y compra */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Descripción */}
            <Card className="transition-transform duration-300 hover:scale-105">
              <div className="font-bold mb-2 text-xl border-b border-gray-200 pb-4 mb-2">Descripción:</div>
              <div className="text-gray-700 whitespace-pre-line text-xl">{product.description || 'Sin descripción'}</div>
            </Card>
            {/* Compra */}
            <Card className="flex flex-col gap-6 items-start p-4 transition-transform duration-300 hover:scale-105">
              {isAdmin ? (
                <div className="w-full text-center text-gray-400 text-xl py-8">Los administradores no pueden agregar productos al carrito.</div>
              ) : (
                <>
                  <div className="flex items-center gap-4 w-full border-b border-gray-200 pb-2 mb-2">
                    <span className="font-bold text-xl">Cantidad:</span>
                    <div className="flex items-center border rounded-lg px-3 py-2 border-orange-500">
                      <button
                        className="text-2xl cursor-pointer px-3 text-orange-500 disabled:text-gray-300 hover:bg-orange-100"
                        onClick={() => setQuantity(q => Math.max(1, q - 1))}
                        disabled={quantity <= 1}
                      >-</button>
                      <span className="mx-3 min-w-[32px] text-center text-xl">{quantity}</span>
                      <button
                        className="text-2xl cursor-pointer px-3 text-orange-500 disabled:text-gray-300 hover:bg-orange-100"
                        onClick={() => setQuantity(q => Math.min(product.quantity, q + 1))}
                        disabled={quantity >= product.quantity}
                      >+</button>
                    </div>
                  </div>
                  <div className="text-xl w-full border-b border-gray-200 pb-2 mb-2">
                    <span className="font-bold">Precio total:</span> ${total}
                  </div>
                  <button
                    className="mt-2 w-full border border-orange-500 text-orange-500 rounded-full py-2 text-xl font-semibold hover:bg-orange-200 transition cursor-pointer disabled:opacity-60"
                    onClick={handleAddToCart}
                    disabled={loading}
                  >
                    {loading ? 'Agregando...' : 'Agregar al carrito'}
                  </button>
                </>
              )}
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
