type Props = {
  message: string;
  confirmLabel?: string;
  confirmColor?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmModal({ message, confirmLabel = "Confirmar", confirmColor = "bg-gray-900 hover:bg-gray-700", onConfirm, onCancel }: Props) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm text-center">
        <p className="text-gray-700 mb-6">{message}</p>
        <div className="flex justify-center gap-3">
          <button onClick={onCancel}
            className="border rounded-full px-5 py-2 text-sm hover:bg-gray-100 transition">
            Cancelar
          </button>
          <button onClick={onConfirm}
            className={`${confirmColor} text-white rounded-full px-5 py-2 text-sm transition`}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}