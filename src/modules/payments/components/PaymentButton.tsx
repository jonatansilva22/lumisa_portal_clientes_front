import { Button } from '../../../shared/ui/Button';

interface PaymentButtonProps {
  loading: boolean;
  disabled?: boolean;
  onClick: () => void;
  children?: React.ReactNode;
}

export function PaymentButton({ loading, disabled, onClick, children }: PaymentButtonProps) {
  return (
    <Button
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {loading ? 'Procesando...' : children || 'Pagar'}
    </Button>
  );
}
