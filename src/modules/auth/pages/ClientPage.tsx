// Página principal para el rol Cliente
import { LoadingSpinner } from "../../../shared/ui/Index";
import { SidebarClient, Header } from "../../../shared/components/Index";

export function ClientPage() {
  return (
    <div className="h-screen flex flex-col">
      <Header />
      <main className="flex flex-1 min-h-0">
        <SidebarClient />
        <section className="flex flex-col flex-1 items-center justify-center">
          <h1 className="text-2xl font-bold mb-2">Bienvenido Cliente</h1>
          <p className="mb-4 text-gray-700">Esta es una página de ejemplo para mostrar cómo estructurar un componente en React.</p>
          <LoadingSpinner />
        </section>
      </main>
    </div>
  );
}
