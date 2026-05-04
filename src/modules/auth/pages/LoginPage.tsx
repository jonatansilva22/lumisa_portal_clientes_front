import { LoginForm } from "../components/LoginForm";
import lumisaLogo from "@/assets/lumisa-logo.png";

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center bg-gradient-to-br from-blue-900 via-blue-400 to-orange-300 relative">
      <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')] pointer-events-none" />
      <div className="z-10 flex flex-col items-center justify-center w-full min-h-screen">
        <div className="bg-white/90 rounded-3xl shadow-2xl px-8 py-10 flex flex-col items-center w-full max-w-md border border-blue-100 backdrop-blur-md">
          <img src={lumisaLogo} alt="Lumisa" className="h-28 mb-4 drop-shadow-lg" />
          <h1 className="text-2xl font-bold text-blue-900 mb-1 tracking-tight text-center">¡Bienvenido al Portal de Clientes!</h1>
          <p className="text-blue-700 text-sm mb-5 text-center font-medium">Lumisa Comercializadora</p>
          <LoginForm />
        </div>
        <footer className="mt-8 text-xl font-semibold text-blue-100 drop-shadow-sm select-none">
          © {new Date().getFullYear()} Lumisa Comercializadora. Todos los derechos reservados.
        </footer>
      </div>
    </div>
  );
}