import { Card } from "../../../shared/ui/Card";

interface CartSummaryProps {
  subtotal: number;
  totalItems: number;
  onCheckout?: () => void;
  loading?: boolean;
  className?: string;
}

export function CartSummary({ subtotal, totalItems, onCheckout, loading, className }: CartSummaryProps) {
  return (
    <Card className={`w-full min-w-0 md:min-w-[330px] md:max-w-xs flex flex-col gap-4 ${className || ''}`}>
      <div className="text-lg font-semibold mb-2">Subtotal ({totalItems} producto{totalItems !== 1 ? 's' : ''}):</div>
      <div className="text-2xl font-bold text-orange-600 mb-4">${subtotal.toFixed(2)}</div>
      <button
        className="w-full border border-orange-500 text-orange-500 rounded-full py-2 text-lg font-semibold hover:bg-orange-200 transition cursor-pointer disabled:opacity-60"
        onClick={onCheckout}
        disabled={loading || totalItems === 0}
      >
        Solicitar Pedido
      </button>
    </Card>
  );
}
