import { LoadingSpinner } from "../../../shared/ui/Index";
import { SidebarClient, Header } from "../../../shared/components/Index";

export function EjemploPage() {
  return (
    <div>
      <div className="h-screen flex flex-col">
        <Header />
        <div className="flex flex-1 min-h-0">
          <SidebarClient />
          <h1>Ejemplo de página</h1>
          <p>
            Esta es una página de ejemplo para mostrar cómo estructurar un
            componente en React.
          </p>
          <LoadingSpinner />
        </div>
      </div>
    </div>
  );
}
