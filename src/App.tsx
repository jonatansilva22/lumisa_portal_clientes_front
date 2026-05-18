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
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 6500,
          style: {
            fontSize: '1.15rem',
            minWidth: '340px',
            maxWidth: '420px',
            padding: '18px 22px',
            borderRadius: '1rem',
          },
        }}
      />
      <Router>
        <AppRoutes />
      </Router>
    </>
  );
}

export default App;