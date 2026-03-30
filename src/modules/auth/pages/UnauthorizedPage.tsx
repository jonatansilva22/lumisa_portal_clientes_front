
export function UnauthorizedPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-red-500 mb-4">Acceso Denegado</h1>
      <p className="text-lg text-gray-700">No tienes permiso para acceder a esta página.</p>
    </div>
  );
}