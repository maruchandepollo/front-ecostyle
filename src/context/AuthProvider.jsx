import { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";

// Expresión regular para validar dominios permitidos
const ALLOWED_DOMAINS_RE = /@(?:duocuc\.cl|duoc\.cl|gmail\.com)$/i;

// si se registra, te reenvia a login
const AUTO_LOGIN_AFTER_REGISTER = false;

export function AuthProvider({ children }) {
  // Leer usuarios desde localStorage o cargar los predeterminados
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem("users");
    if (saved) return JSON.parse(saved);

    return [
      { name: "Admin", email: "admin@gmail.com", pass: "1234", role: "admin" },
      { name: "Usuario", email: "user@gmail.com", pass: "1234", role: "user" },
    ];
  });

  // Estado para el usuario actual
  const [currentUser, setCurrentUser] = useState(null);

  // Recuperar usuario logueado si existe
  useEffect(() => {
    const savedUser = localStorage.getItem("currentUser");
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  // Guardar usuarios en localStorage cuando cambien
  useEffect(() => {
    localStorage.setItem("users", JSON.stringify(users));
  }, [users]);

  // Validar dominio del email
  const emailDomainOk = (email) => {
    return ALLOWED_DOMAINS_RE.test((email || "").trim());
  };

  // Buscar usuario por email
  const findUserByEmail = (email) => {
    return (
      users.find(
        (u) => u.email.toLowerCase() === (email || "").toLowerCase()
      ) || null
    );
  };

  // Registrar un nuevo usuario
  const registerUser = ({ name, email, pass }) => {
    if (!name?.trim() || !email?.trim() || !pass?.trim()) {
      return {
        ok: false,
        code: "missing_fields",
        message: "Todos los campos son obligatorios",
      };
    }

    if (!emailDomainOk(email)) {
      return {
        ok: false,
        code: "bad_domain",
        message: "El correo no es válido, usa duocuc.cl, duoc.cl o gmail.com",
      };
    }

    if (findUserByEmail(email)) {
      return {
        ok: false,
        code: "already_exists",
        message: "El correo ya existe.",
      };
    }

    const newUser = {
      name: name.trim(),
      email: email.trim(),
      pass: pass.trim(),
      role: "user",
    };

    // Guardar usuario
    setUsers((prevUsers) => [...prevUsers, newUser]);

    if (AUTO_LOGIN_AFTER_REGISTER) {
      const logged = {
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      };

      setCurrentUser(logged);
      localStorage.setItem("currentUser", JSON.stringify(logged));

      return {
        ok: true,
        code: "registered_and_logged",
        message: "Usuario registrado y logueado correctamente",
      };
    }

    return { ok: true, code: "registered", user: newUser };
  };

  // Loguear usuario
  const loginUser = (email, pass) => {
    if (!email?.trim() || !pass?.trim()) {
      return {
        ok: false,
        code: "missing_fields",
        message: "Correo y contraseña son obligatorios",
      };
    }

    if (!emailDomainOk(email)) {
      return {
        ok: false,
        code: "bad_domain",
        message: "Dominio no válido",
      };
    }

    const user = findUserByEmail(email);
    if (!user) {
      return {
        ok: false,
        code: "not_found",
        message: "Este correo no está registrado.",
      };
    }

    if (user.pass !== pass) {
      return {
        ok: false,
        code: "bad_credentials",
        message: "Usuario o contraseña no válidos.",
      };
    }

    const logged = {
      name: user.name,
      email: user.email,
      role: user.role,
    };

    setCurrentUser(logged);
    localStorage.setItem("currentUser", JSON.stringify(logged));

    return { ok: true, code: "logged_in", user };
  };

  // Cerrar sesión
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("currentUser");
  };

  // Actualizar usuario
  const updateUser = (email, updatedData) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.email.toLowerCase() === email.toLowerCase()
          ? { ...user, ...updatedData }
          : user
      )
    );
    
    // Si el usuario actual fue actualizado, actualizar también su sesión
    if (currentUser?.email.toLowerCase() === email.toLowerCase()) {
      const updated = {
        name: updatedData.name || currentUser.name,
        email: updatedData.email || currentUser.email,
        role: updatedData.role || currentUser.role,
      };
      setCurrentUser(updated);
      localStorage.setItem("currentUser", JSON.stringify(updated));
    }
    
    return { ok: true, message: "Usuario actualizado correctamente" };
  };

  // Eliminar usuario
  const deleteUser = (email) => {
    setUsers((prevUsers) =>
      prevUsers.filter((user) => user.email.toLowerCase() !== email.toLowerCase())
    );
    
    // Si el usuario actual fue eliminado, cerrar sesión
    if (currentUser?.email.toLowerCase() === email.toLowerCase()) {
      logout();
    }
    
    return { ok: true, message: "Usuario eliminado correctamente" };
  };

  // Verificar si el usuario está autenticado
  const isAuthenticated = () => currentUser !== null;

  // Verificar si el usuario es admin
  const isAdmin = () => currentUser?.role === "admin";

  const value = {
    currentUser,
    users,
    registerUser,
    loginUser,
    logout,
    updateUser,
    deleteUser,
    isAuthenticated,
    isAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
