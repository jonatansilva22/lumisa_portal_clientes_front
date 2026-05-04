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
    <form onSubmit={onSubmit} className="w-full flex flex-col gap-7">
      <div>
        <Label htmlFor="email" className="mb-1 block text-blue-900 font-semibold">
          Correo electrónico:
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="Ingrese su correo electrónico"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full h-11 rounded-xl px-4 border border-blue-200 bg-blue-50 text-blue-900 placeholder-black-200 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          required
        />
      </div>
      <div>
        <Label htmlFor="password" className="mb-1 block text-blue-900 font-semibold">
          Contraseña:
        </Label>
        <Input
          id="password"
          type={showPassword ? "text" : "password"}
          placeholder="Ingrese su contraseña"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full h-11 rounded-xl px-4 border border-blue-200 bg-blue-50 text-blue-900 placeholder-black-200 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          required
        />
      </div>
      <div className="flex items-center gap-2 mb-2">
        <input
          type="checkbox"
          id="showPassword"
          checked={showPassword}
          onChange={() => setShowPassword(v => !v)}
          className="accent-blue-500 w-5 h-5 rounded focus:ring-2 focus:ring-blue-400 transition"
        />
        <Label htmlFor="showPassword" className="text-blue-700 cursor-pointer select-none">
          Mostrar contraseña
        </Label>
      </div>
      {error && <div className="text-center text-white bg-red-500/90 rounded-lg py-2 px-3 font-semibold shadow mb-2 animate-pulse">{error}</div>}
      <Button
        type="submit"
        className="w-full mt-2 bg-gradient-to-r from-blue-700 via-blue-500 to-orange-400 text-white font-bold py-3 rounded-xl shadow-lg hover:scale-[1.03] hover:shadow-xl transition-all duration-200"
        disabled={loading}
      >
        {loading ? "Ingresando..." : "Ingresar"}
      </Button>
    </form>
  );
}