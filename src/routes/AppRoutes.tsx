import { Routes, Route } from "react-router-dom";
// Aqui vamos importar todas las páginas
import {EjemploPage} from "../modules/products/pages/EjemploPage";


export function AppRoutes() {
  return (
    <Routes>
        {/* Aqui pondremos todas las rutas */}
        <Route path="/ejemplo" element={<EjemploPage />} />
    </Routes>
  );
}