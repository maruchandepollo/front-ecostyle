import { renderHook, act } from "@testing-library/react";
import { AuthProvider } from "./AuthProvider";
import { AuthContext } from "./AuthContext";
import { useContext } from "react";
import { describe, expect, it } from "vitest";

// Hook helper para acceder al contexto
const useAuthContext = () => useContext(AuthContext);

describe("AuthProvider", () => {
  describe("Estado inicial", () => {
    it("debe inicializar con usuarios predefinidos", () => {
      const { result } = renderHook(() => useAuthContext(), {
        wrapper: AuthProvider,
      });

      expect(result.current.users).toHaveLength(2);
      expect(result.current.users[0].email).toBe("admin@gmail.com");
      expect(result.current.users[1].email).toBe("user@gmail.com");
    });

    it("debe inicializar sin usuario autenticado", () => {
      const { result } = renderHook(() => useAuthContext(), {
        wrapper: AuthProvider,
      });

      expect(result.current.currentUser).toBeNull();
      expect(result.current.isAuthenticated()).toBe(false);
    });
  });

  describe("registerUser", () => {
    it("debe registrar un nuevo usuario correctamente", () => {
      const { result } = renderHook(() => useAuthContext(), {
        wrapper: AuthProvider,
      });

      let response;
      act(() => {
        response = result.current.registerUser({
          name: "Nuevo Usuario",
          email: "nuevo@duocuc.cl",
          pass: "1234",
        });
      });

      expect(response.ok).toBe(true);
      expect(response.code).toBe("registered_and_logged");
      expect(result.current.users).toHaveLength(3);
    });

    it("debe rechazar registro con campos vacíos", () => {
      const { result } = renderHook(() => useAuthContext(), {
        wrapper: AuthProvider,
      });

      let response;
      act(() => {
        response = result.current.registerUser({
          name: "",
          email: "test@duocuc.cl",
          pass: "1234",
        });
      });

      expect(response.ok).toBe(false);
      expect(response.code).toBe("missing_fields");
      expect(response.message).toBe("Todos los campos son obligatorios");
    });

    it("debe rechazar dominio no permitido", () => {
      const { result } = renderHook(() => useAuthContext(), {
        wrapper: AuthProvider,
      });

      let response;
      act(() => {
        response = result.current.registerUser({
          name: "Test",
          email: "test@hotmail.com",
          pass: "1234",
        });
      });

      expect(response.ok).toBe(false);
      expect(response.code).toBe("bad_domain");
    });

    it("debe rechazar correo ya registrado", () => {
      const { result } = renderHook(() => useAuthContext(), {
        wrapper: AuthProvider,
      });

      let response;
      act(() => {
        response = result.current.registerUser({
          name: "Test",
          email: "admin@gmail.com",
          pass: "1234",
        });
      });

      expect(response.ok).toBe(false);
      expect(response.code).toBe("already_exists");
      expect(response.message).toBe("El correo ya existe.");
    });

    it("debe aceptar dominios válidos: duocuc.cl, duoc.cl, gmail.com", () => {
      const { result } = renderHook(() => useAuthContext(), {
        wrapper: AuthProvider,
      });

      const domains = ["duocuc.cl", "duoc.cl", "gmail.com"];

      domains.forEach((domain, index) => {
        let response;
        act(() => {
          response = result.current.registerUser({
            name: `Usuario ${index}`,
            email: `test${index}@${domain}`,
            pass: "1234",
          });
        });

        expect(response.ok).toBe(true);
      });
    });
  });

  describe("loginUser", () => {
    it("debe autenticar usuario con credenciales correctas", () => {
      const { result } = renderHook(() => useAuthContext(), {
        wrapper: AuthProvider,
      });

      let response;
      act(() => {
        response = result.current.loginUser("admin@gmail.com", "1234");
      });

      expect(response.ok).toBe(true);
      expect(response.code).toBe("logged_in");
      expect(result.current.currentUser).not.toBeNull();
      expect(result.current.currentUser.email).toBe("admin@gmail.com");
      expect(result.current.isAuthenticated()).toBe(true);
    });

    it("debe rechazar login con contraseña incorrecta", () => {
      const { result } = renderHook(() => useAuthContext(), {
        wrapper: AuthProvider,
      });

      let response;
      act(() => {
        response = result.current.loginUser("admin@gmail.com", "wrongpass");
      });

      expect(response.ok).toBe(false);
      expect(response.code).toBe("bad_credentials");
      expect(result.current.currentUser).toBeNull();
    });

    it("debe rechazar login con usuario no registrado", () => {
      const { result } = renderHook(() => useAuthContext(), {
        wrapper: AuthProvider,
      });

      let response;
      act(() => {
        response = result.current.loginUser("noexiste@gmail.com", "1234");
      });

      expect(response.ok).toBe(false);
      expect(response.code).toBe("not_found");
      expect(response.message).toBe("Este correo no está registrado.");
    });

    it("debe rechazar login con campos vacíos", () => {
      const { result } = renderHook(() => useAuthContext(), {
        wrapper: AuthProvider,
      });

      let response;
      act(() => {
        response = result.current.loginUser("", "");
      });

      expect(response.ok).toBe(false);
      expect(response.code).toBe("missing_fields");
    });

    it("debe rechazar dominio no válido en login", () => {
      const { result } = renderHook(() => useAuthContext(), {
        wrapper: AuthProvider,
      });

      let response;
      act(() => {
        response = result.current.loginUser("test@hotmail.com", "1234");
      });

      expect(response.ok).toBe(false);
      expect(response.code).toBe("bad_domain");
    });
  });

  describe("logout", () => {
    it("debe cerrar sesión correctamente", () => {
      const { result } = renderHook(() => useAuthContext(), {
        wrapper: AuthProvider,
      });

      // Primero hacer login
      act(() => {
        result.current.loginUser("admin@gmail.com", "1234");
      });

      expect(result.current.currentUser).not.toBeNull();

      // Luego logout
      act(() => {
        result.current.logout();
      });

      expect(result.current.currentUser).toBeNull();
      expect(result.current.isAuthenticated()).toBe(false);
    });
  });

  describe("isAdmin", () => {
    it("debe retornar true para usuario admin", () => {
      const { result } = renderHook(() => useAuthContext(), {
        wrapper: AuthProvider,
      });

      act(() => {
        result.current.loginUser("admin@gmail.com", "1234");
      });

      expect(result.current.isAdmin()).toBe(true);
    });

    it("debe retornar false para usuario normal", () => {
      const { result } = renderHook(() => useAuthContext(), {
        wrapper: AuthProvider,
      });

      act(() => {
        result.current.loginUser("user@gmail.com", "1234");
      });

      expect(result.current.isAdmin()).toBe(false);
    });

    it("debe retornar false cuando no hay usuario autenticado", () => {
      const { result } = renderHook(() => useAuthContext(), {
        wrapper: AuthProvider,
      });

      expect(result.current.isAdmin()).toBe(false);
    });
  });
});
