
// Página para acceso denegado/no autorizado
import { useNavigate } from "react-router-dom";

export function UnauthorizedPage() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-red-500 mb-4">Acceso Denegado</h1>
      <p className="text-lg text-gray-700 mb-4">No tienes permiso para acceder a esta página.</p>
      <button
        className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold shadow hover:bg-blue-700 transition"
        onClick={() => navigate("/")}
      >
        Volver al login
      </button>
    </div>
  );
}