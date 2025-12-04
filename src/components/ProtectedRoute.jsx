import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

/**
 * @param {React.Component} Component - Componente a renderizar si tiene permiso
 * @param {boolean} requireAdmin - Si true, solo admins pueden acceder
 * @param {string} redirectTo - Ruta a la que redirigir si no tiene permiso (default: "/login")
 */
export function ProtectedRoute({ Component, requireAdmin = false, redirectTo = "/login" }) {
  const { currentUser, isAdmin } = useAuth();

  // Si no está autenticado, redirigir a login
  if (!currentUser) {
    return <Navigate to={redirectTo} replace />;
  }

  // Si requiere ser admin y no lo es, redirigir al home
  if (requireAdmin && !isAdmin()) {
    return <Navigate to="/" replace />;
  }

  // Si tiene permiso, renderizar el componente
  return <Component />;
}

export default ProtectedRoute;
