import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useLayout } from "../hooks/useLayout";
import "../styles/sidebar.css";

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { currentUser, isAdmin, handleLogout } = useLayout();

  // Función para verificar si la ruta está activa
  const isActive = (path) => {
    return location.pathname === path ? "active" : "";
  };

  // Manejar logout
  const onLogout = () => {
    handleLogout();
    setOpen(false);
  };

  // Cerrar sidebar al hacer clic en un link
  const closeSidebar = () => {
    setOpen(false);
  };

  return (
    <>
      {/* Botón hamburguesa */}
      <button className="sidebar-toggle" onClick={() => setOpen(!open)}>
        ☰
      </button>

      {/* Sidebar */}
      <div className={`sidebar ${open ? "open" : ""}`}>
        <h3 className="sidebar-title">EcoStyle</h3>

        <ul className="sidebar-menu">
          <li>
            <Link className={`sidebar-link ${isActive("/")}`} to="/" onClick={closeSidebar}>
              <i className="fas fa-home"></i> Inicio
            </Link>
          </li>
          <li>
            <Link className={`sidebar-link ${isActive("/products")}`} to="/products" onClick={closeSidebar}>
              <i className="fas fa-leaf"></i> Productos
            </Link>
          </li>
          <li>
            <Link className={`sidebar-link ${isActive("/cart")}`} to="/cart" onClick={closeSidebar}>
              <i className="fas fa-shopping-cart"></i> Carrito
            </Link>
          </li>
          <li>
            <Link className={`sidebar-link ${isActive("/perfil")}`} to="/perfil" onClick={closeSidebar}>
              <i className="fas fa-user-circle"></i> Mi Perfil
            </Link>
          </li>
          <li>
            <Link className={`sidebar-link ${isActive("/sobre-nosotros")}`} to="/sobre-nosotros" onClick={closeSidebar}>
              <i className="fas fa-info-circle"></i> Sobre Nosotros
            </Link>
          </li>
          {isAdmin() && (
            <li>
              <Link className={`sidebar-link ${isActive("/admin")}`} to="/admin" onClick={closeSidebar}>
                <i className="fas fa-cog"></i> Administrar
              </Link>
            </li>
          )}
          {currentUser && (
            <li>
              <button className="sidebar-link sidebar-logout" onClick={onLogout}>
                <i className="fas fa-sign-out-alt"></i> Cerrar Sesión
              </button>
            </li>
          )}
        </ul>
      </div>

      {/* Capa oscura */}
      {open && <div className="overlay" onClick={() => setOpen(false)} />}
    </>
  );
}
