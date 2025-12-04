import { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import { 
  loginUsuario, 
  registrarUsuario, 
  logoutUsuario,
  actualizarUsuario,
  eliminarUsuario
} from "../services/UsuarioService";

// si se registra, te reenvia a login
const AUTO_LOGIN_AFTER_REGISTER = false;

export function AuthProvider({ children }) {
  // Estado para el usuario actual
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  // Almacenar usuarios registrados para validar en login
  const [registeredUsers, setRegisteredUsers] = useState(() => {
    // Usuario admin por defecto
    return [
      {
        email: "admin@ecostyle.com",
        password: "admin123",
        nombre: "Admin",
        rut: "00000000-0",
      }
    ];
  });

  // Recuperar usuario logueado si existe al cargar la app
  useEffect(() => {
    const savedUser = localStorage.getItem("usuarioActual");
    const token = localStorage.getItem("token");
    
    // Solo recuperar si hay usuario Y token válido
    if (savedUser && token) {
      try {
        const parsed = JSON.parse(savedUser);
        // Verificar si el tipo es ADMIN o admin (case-insensitive)
        const isAdminUser = parsed.tipo?.toUpperCase() === "ADMIN";
        setCurrentUser({
          email: parsed.email,
          nombre: parsed.nombre,
          role: isAdminUser ? "admin" : "user",
        });
      } catch (error) {
        console.error("Error al recuperar usuario:", error);
        localStorage.removeItem("usuarioActual");
        localStorage.removeItem("token");
      }
    }
  }, []);

  // Validar dominio del email
  const emailDomainOk = (email) => {
    // Validar que sea email y que sea de dominio permitido
    const validDomains = ["duocuc.cl", "duoc.cl", "gmail.com", "ecostyle.com"];
    const emailTrimmed = (email || "").trim().toLowerCase();
    
    // Verificar formato de email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTrimmed)) {
      return false;
    }
    
    // Verificar dominio permitido
    const domain = emailTrimmed.split("@")[1];
    return validDomains.includes(domain);
  };

  // Registrar un nuevo usuario usando el servicio del backend
  const registerUser = async ({ name, rut, email, pass }) => {
    if (!name?.trim() || !rut?.trim() || !email?.trim() || !pass?.trim()) {
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
        message: "Dominio no válido",
      };
    }

    // Verificar si el email ya está registrado localmente
    if (registeredUsers.some(u => u.email.toLowerCase() === email.trim().toLowerCase())) {
      return {
        ok: false,
        code: "email_exists",
        message: "El email ya está registrado",
      };
    }

    try {
      setIsLoading(true);
      // Llamar al servicio del backend para registrar
      const newUser = await registrarUsuario({
        name: name.trim(),
        rut: rut.trim(),
        email: email.trim(),
        pass: pass.trim(),
      });

      // Agregar a la lista de usuarios registrados localmente
      setRegisteredUsers([...registeredUsers, {
        email: email.trim(),
        password: pass.trim(),
        nombre: name.trim(),
        rut: rut.trim(),
      }]);

      if (AUTO_LOGIN_AFTER_REGISTER) {
        setCurrentUser({
          email: newUser.email || email.trim(),
          nombre: newUser.nombre || name.trim(),
          role: "user",
        });
      }

      return {
        ok: true,
        code: "registered",
        user: newUser,
      };
    } catch (error) {
      console.error("Error al registrar usuario:", error);
      return {
        ok: false,
        code: "registration_error",
        message: error.message || "Error al registrar el usuario",
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Loguear usuario usando el servicio del backend
  const loginUser = async (email, pass) => {
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

    try {
      setIsLoading(true);
      // Llamar al servicio del backend para loguear
      const user = await loginUsuario(email.trim(), pass.trim());

      setCurrentUser({
        email: user.email,
        nombre: user.nombre || user.name,
        role: user.tipo?.toUpperCase() === "ADMIN" ? "admin" : "user",
      });

      return {
        ok: true,
        code: "logged_in",
        user: user,
      };
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      return {
        ok: false,
        code: "login_error",
        message: error.message || "Error al iniciar sesión",
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Cerrar sesión
  const logout = () => {
    logoutUsuario(); // Limpia localStorage
    setCurrentUser(null);
  };

  // Actualizar usuario
  const updateUser = async (email, updatedData) => {
    try {
      setIsLoading(true);
      // Llamar al servicio del backend para actualizar
      const result = await actualizarUsuario(email, updatedData);
      
      // Actualizar el usuario en contexto si es el usuario actual
      if (currentUser?.email === email) {
        const updated = {
          email: result.email || currentUser.email,
          nombre: result.nombre || currentUser.nombre,
          role: result.role || currentUser.role,
        };
        setCurrentUser(updated);
      }
      
      return { ok: true, message: "Usuario actualizado correctamente" };
    } catch (error) {
      console.error("Error al actualizar usuario:", error);
      return { ok: false, message: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  // Eliminar usuario
  const deleteUser = async (email) => {
    try {
      setIsLoading(true);
      // Llamar al servicio del backend para eliminar
      await eliminarUsuario(email);
      
      // Si el usuario actual fue eliminado, cerrar sesión
      if (currentUser?.email === email) {
        logout();
      }
      
      return { ok: true, message: "Usuario eliminado correctamente" };
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
      return { ok: false, message: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  // Verificar si el usuario está autenticado
  const isAuthenticated = () => currentUser !== null;

  // Verificar si el usuario es admin
  const isAdmin = () => currentUser?.role === "admin";

  const value = {
    currentUser,
    registerUser,
    loginUser,
    logout,
    updateUser,
    deleteUser,
    isAuthenticated,
    isAdmin,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
