import { type ReactNode } from "react";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
  showHeader?: boolean; // 
};

export function Modal({ open, onClose, children, className = "", showHeader = true }: ModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      {/* Fondo oscuro */}
      <div
        className={`bg-white rounded-xl shadow-lg p-8 min-w-[320px] max-w-full relative ${className}`}
        onClick={e => e.stopPropagation()}
      >
        {showHeader && (
          <div className="absolute top-0 left-0 w-full h-10 bg-gray-400 rounded-t-xl" style={{ borderTopLeftRadius: '0.75rem', borderTopRightRadius: '0.75rem' }} />
        )}
        <div className={showHeader ? "pt-10" : ""}>
          {children}
        </div>
      </div>
      {/* Cierra el modal al hacer click fuera */}
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-label="Cerrar modal"
      />
    </div>
  );
}