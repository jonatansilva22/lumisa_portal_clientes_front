// modules/auth/pages/LoginPage.tsx
import { LoginForm } from "../components/LoginForm";
import lumisaLogo from "@/assets/lumisa-logo.png";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-800">
      <h1 className="text-4xl font-semibold text-white mb-10">Inicio de sesión</h1>
      <div className="bg-white rounded-xl shadow-lg px-10 py-8 flex flex-col items-center w-full max-w-md">
        <img src={lumisaLogo} alt="Lumisa" className="h-24 mb-8 rounded" />
        <LoginForm />
      </div>
    </div>
  );
}