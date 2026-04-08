import type { CartDetail } from "../types/cart";
import { Button } from "../../../shared/ui/Button";
import { QuantityInput } from "../../../shared/ui/QuantityInput";
import { DeleteButton } from "../../../shared/ui/DeleteButton";
import { useProducts } from "../../products/hooks/useProducts";
import { useCallback } from "react";
import { Card } from "../../../shared/ui/Card";

interface CartProductItemProps {
  item: CartDetail;
  onQuantityChange: (productId: number, quantity: number) => void;
  onRemove: (productId: number) => void;
}

export function CartProductItem({ item, onQuantityChange, onRemove, className }: CartProductItemProps & { className?: string }) {
  const { products } = useProducts();
  const product = products.find(p => p.id === item.product_id);

  const handleQuantityChange = useCallback((q: number) => {
    if (q > 0) onQuantityChange(item.product_id, q);
  }, [item.product_id, onQuantityChange]);

  if (!product) return null;

  return (
    <Card className={`flex flex-col md:flex-row items-center border-b last:border-b-0 py-4 sm:py-6 md:py-8 px-2 sm:px-4 md:px-6 gap-3 sm:gap-6 md:gap-8 w-full shadow-none border border-gray-200 transition-transform duration-200 hover:scale-[1.025] hover:shadow-xl ${className || ''}`}>
      <div className="w-24 h-24 sm:w-32 sm:h-32 flex items-center justify-center bg-gray-100 rounded-lg shadow-sm shrink-0 mx-auto md:mx-0">
        {product.image_url ? (
          <img src={product.image_url} alt={product.name} className="object-contain w-20 h-20 sm:w-28 sm:h-28" />
        ) : (
          <svg width="72" height="72" fill="none" stroke="gray" strokeWidth="2" viewBox="0 0 64 64"><rect x="8" y="8" width="48" height="48" rx="6"/><circle cx="24" cy="24" r="6"/><path d="M56 44l-16-16L16 56"/></svg>
        )}
      </div>
      <div className="flex-1 min-w-0 flex flex-col gap-2 sm:gap-3 w-full md:mx-4">
        <div className="font-bold text-lg sm:text-2xl truncate md:break-words md:whitespace-normal">{product.name}</div>
        <div className="text-gray-500 text-sm sm:text-base truncate md:break-words md:whitespace-normal">{product.description || 'Sin descripción'}</div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-2">
          <QuantityInput
            value={item.quantity}
            min={1}
            max={product.quantity}
            onChange={handleQuantityChange}
          />
          <DeleteButton onClick={() => onRemove(item.product_id)} />
        </div>
      </div>
      <div className="font-bold text-lg sm:text-2xl min-w-[70px] sm:min-w-[100px] text-right text-orange-700 mt-2 md:mt-0 md:self-center">${Number(item.unit_price).toFixed(2)}</div>
    </Card>
  );
}
