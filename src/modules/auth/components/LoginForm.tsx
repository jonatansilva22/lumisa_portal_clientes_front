import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input, Button, Label } from "../../../shared/ui/Index";
import { useLogin } from "../hooks/useLogin";
import { useAuthStore } from "../store/auth";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { handleLogin, loading, error } = useLogin();
  const setAuth = useAuthStore((s) => s.setAuth);
  const navigate = useNavigate();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = await handleLogin(email, password);
    if (data) {
      setAuth(data.user, data.access_token);
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("user", JSON.stringify(data.user));
      // Redirige según el rol
      if (data.user.role_id === 1) navigate("/admin");
      else if (data.user.role_id === 2) navigate("/adviser");
      else if (data.user.role_id === 3) navigate("/client");
      else navigate("/unauthorized");
    }
  };

  return (
    <form onSubmit={onSubmit} className="w-full flex flex-col gap-6">
      <div>
        <Label htmlFor="email" className="mb-1 block text-gray-700">
          Correo electrónico:
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="ejemplo@mail.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full h-10 border border-gray-300 rounded px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />
      </div>
      <div>
        <Label htmlFor="password" className="mb-1 block text-gray-700">
          Contraseña:
        </Label>
        <Input
          id="password"
          type={showPassword ? "text" : "password"}
          placeholder="********"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full h-10 border border-gray-300 rounded px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />
      </div>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="showPassword"
          checked={showPassword}
          onChange={() => setShowPassword(v => !v)}
          className="accent-indigo-500 w-5 h-5"
        />
        <Label htmlFor="showPassword" className="text-gray-600 cursor-pointer">
          Mostrar contraseña
        </Label>
      </div>
      {error && <div className="text-red-500">{error}</div>}
      <Button type="submit" className="w-full mt-2 bg-indigo-100 text-indigo-700 hover:bg-indigo-200" disabled={loading}>
        {loading ? "Ingresando..." : "Ingresar"}
      </Button>
    </form>
  );
}