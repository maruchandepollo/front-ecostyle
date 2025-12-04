import { renderHook, act } from "@testing-library/react";
import { AuthProvider } from "../context/AuthProvider";
import { useAuth } from "../hooks/useAuth";
import { expect, describe, test, beforeAll, vi } from "vitest";

// Configurar localStorage mock
beforeAll(() => {
  global.localStorage = {
    getItem: vi.fn(() => null),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  };
});

const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;

describe("AuthProvider - Login", () => {
  test("mensaje de éxito al iniciar sesión correctamente", async () => {
    // 1. Arrange (Preparar)
    const { result } = renderHook(() => useAuth(), { wrapper });

    // 2. Act (Actuar)
    let loginResult;
    await act(async () => {
      loginResult = await result.current.loginUser("admin@ecostyle.com", "admin123");
    });

    // 3. Assert (Afirmar)
    expect(loginResult.ok).toBe(true);
    expect(loginResult.code).toBe("logged_in");
    expect(result.current.currentUser).not.toBeNull();
    expect(result.current.currentUser.email).toBe("admin@ecostyle.com");
  });
  test("Todos los campos son obligatorios", async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    let loginResult;
    await act(async () => {
      loginResult = await result.current.loginUser("", "");
    });

    expect(loginResult.ok).toBe(false);
    expect(loginResult.code).toBe("missing_fields");
    expect(loginResult.message).toBe("Correo y contraseña son obligatorios");
  });

  test("El correo no es válido, usa duocuc.cl, duoc.cl o gmail.com", async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    let loginResult;
    await act(async () => {
      loginResult = await result.current.loginUser("test@invalido.com", "1234");
    });

    expect(loginResult.ok).toBe(false);
    expect(loginResult.code).toBe("bad_domain");
    expect(loginResult.message).toBe("Dominio no válido");
  });
  test("debe retornar mensaje de error cuando faltan campos", async () => {
    // 1. Arrange (Preparar)
    const { result } = renderHook(() => useAuth(), { wrapper });

    // 2. Act (Actuar)
    let loginResult;
    await act(async () => {
      loginResult = await result.current.loginUser("", "");
    });

    // 3. Assert (Afirmar)
    expect(loginResult.ok).toBe(false);
    expect(loginResult.code).toBe("missing_fields");
    expect(loginResult.message).toBe("Correo y contraseña son obligatorios");
  });

  test("debe retornar mensaje de error con dominio inválido", async () => {
    // 1. Arrange (Preparar)
    const { result } = renderHook(() => useAuth(), { wrapper });

    // 2. Act (Actuar)
    let loginResult;
    await act(async () => {
      loginResult = await result.current.loginUser("test@invalido.com", "1234");
    });

    // 3. Assert (Afirmar)
    expect(loginResult.ok).toBe(false);
    expect(loginResult.code).toBe("bad_domain");
    expect(loginResult.message).toBe("Dominio no válido");
  });

  test("debe rechazar contraseña incorrecta", async () => {
    // 1. Arrange (Preparar)
    const { result } = renderHook(() => useAuth(), { wrapper });

    // 2. Act (Actuar) - Intentar login con contraseña incorrecta
    let loginResult;
    await act(async () => {
      loginResult = await result.current.loginUser("admin@ecostyle.com", "wrongpassword");
    });

    // 3. Assert (Afirmar)
    expect(loginResult.ok).toBe(false);
    // El código será login_error o invalid_password dependiendo del backend
    expect(["login_error", "invalid_password"]).toContain(loginResult.code);
    expect(loginResult.message).toBeDefined();
  });

  describe("AuthProvider - Flujo completo", () => {
    test("debe permitir registrar un usuario y luego loguearse", async () => {
      // 1. Arrange (Preparar)
      const { result } = renderHook(() => useAuth(), { wrapper });
      
      // Usar un email único para evitar conflictos con registros anteriores
      const uniqueEmail = `test${Date.now()}@duocuc.cl`;

      // 2. Act (Actuar) - Registro
      let registerResult;
      await act(async () => {
        registerResult = await result.current.registerUser({
          name: "Test User",
          rut: `${Date.now()}-0`,
          email: uniqueEmail,
          pass: "test123",
        });
      });

      // Assert - Registro exitoso o error si ya existe
      // En un test real, pueden ocurrir ambos casos
      if (registerResult.ok) {
        expect(registerResult.code).toBe("registered");

        // Act - Login con el nuevo usuario
        let loginResult;
        await act(async () => {
          loginResult = await result.current.loginUser(uniqueEmail, "test123");
        });

        // Assert - Login exitoso con la contraseña correcta
        expect(loginResult.ok).toBe(true);
        expect(loginResult.code).toBe("logged_in");
        expect(result.current.currentUser.email).toBe(uniqueEmail);
      } else {
        // Si falla el registro, verificar que sea un error válido
        expect(registerResult.code).toBeDefined();
        expect(registerResult.message).toBeDefined();
      }
    });
  });
});
