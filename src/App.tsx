import "./App.css";
import { BrowserRouter as Router } from "react-router-dom";
import {AppRoutes} from "./routes/AppRoutes";
import { useEffect } from "react";
import { useAuthStore } from "./modules/auth/store/auth";
import { Toaster } from "react-hot-toast";

function App() {
  const setAuth = useAuthStore((s) => s.setAuth);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    if (token && user) {
      setAuth(JSON.parse(user), token);
    }
  }, [setAuth]);

  return (
    <>
      <Toaster position="bottom-right" toastOptions={{ duration: 3500 }} />
      <Router>
        <AppRoutes />
      </Router>
    </>
  );
}

export default App;