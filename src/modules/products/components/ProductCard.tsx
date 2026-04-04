import type { Product } from "../types/product";
import { Card } from "../../../shared/ui/Card";
import { useNavigate } from "react-router-dom";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const navigate = useNavigate();
  return (
    <Card className="flex flex-col items-center min-h-[260px] max-w-xs w-full mx-auto p-0 overflow-hidden border border-gray-400 transition-all duration-200 transform hover:scale-105 hover:shadow-2xl">
      {/* Imagen */}
      <div className="w-full flex flex-col items-center pt-4 pb-2 border-b border-gray-300">
        <div className="w-32 h-32 bg-white border border-gray-300 rounded-lg overflow-hidden p-0">
          {product.image_url ? (
            <img src={product.image_url} alt={product.name} className="object-cover w-full h-full" />
          ) : (
            <svg width="100%" height="100%" viewBox="0 0 64 64" fill="none" stroke="gray" strokeWidth="2"><rect x="8" y="8" width="48" height="48" rx="6"/><circle cx="24" cy="24" r="6"/><path d="M56 44l-16-16L16 56"/></svg>
          )}
        </div>
      </div>
      {/* Info */}
      <div className="flex flex-col items-center py-3 w-full border-b border-white">
        <span className="font-medium text-base text-black text-center break-words max-w-[90%]">{product.name}</span>
        <span className="text-xl font-bold text-blue-600 mt-1">${product.price}</span>
      </div>
      {/* Botón */}
      <div className="w-full flex justify-center py-2">
        <button
          className="w-11/12 border border-blue-500 bg-blue-500 text-white rounded-full py-2 text-sm font-semibold shadow-sm hover:bg-blue-600 hover:border-blue-600 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-300 cursor-pointer"
          onClick={() => navigate(`/products/${product.id}`)}
        >
          Ver detalles
        </button>
      </div>
    </Card>
  );
}
