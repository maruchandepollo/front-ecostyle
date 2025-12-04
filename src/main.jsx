import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";

// Importar estilos en orden
import "./styles/layout.css";
import "./styles/navbar.css";
import "./styles/carrito.css";
import "./styles/login.css";
import "./styles/catalogo.css";

// Limpiar localStorage si no hay token válido (prevenir sesiones fantasma)
if (!localStorage.getItem("token")) {
  localStorage.removeItem("usuarioActual");
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
