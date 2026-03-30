import react from "react";
import { LoadingSpinner } from "../../../shared/ui/Index";
import { SidebarAdviser, Modal, Header } from "../../../shared/components/Index";

export function AdviserPage() {
  return (
    <div>
      <div className="h-screen flex flex-col">
        <Header />
        <div className="flex flex-1 min-h-0">
          <SidebarAdviser />
          <h1>Bienvenido Asesor </h1>
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

