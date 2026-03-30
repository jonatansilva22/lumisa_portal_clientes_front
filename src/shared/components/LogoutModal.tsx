import { Modal } from "./Modal";
import type { FC } from "react";

interface LogoutModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const LogoutModal: FC<LogoutModalProps> = ({ open, onClose, onConfirm }) => (
  <Modal open={open} onClose={onClose}>
    <div className="flex flex-col items-center gap-4">
      <span className="text-lg font-semibold text-gray-800">¿Seguro que quieres cerrar sesión?</span>
      <div className="flex gap-4 mt-2">
        <button
          className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600 cursor-pointer"
          onClick={onConfirm}
        >
          Cerrar sesión
        </button>
        <button
          className="px-6 py-2 rounded bg-gray-300 text-gray-800 hover:bg-gray-400 cursor-pointer"
          onClick={onClose}
        >
          Cancelar
        </button>
      </div>
    </div>
  </Modal>
);
