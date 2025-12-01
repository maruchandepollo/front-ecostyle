import { renderHook, act } from "@testing-library/react";
import { AuthProvider } from "../context/AuthProvider";
import { useAuth } from "../hooks/useAuth";

const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;

describe("AuthProvider - Login", () => {
  test("mensaje de éxito al iniciar sesión correctamente", () => {
    // 1. Arrange (Preparar)
    const { result } = renderHook(() => useAuth(), { wrapper });

    // 2. Act (Actuar)
    let loginResult;
    act(() => {
      loginResult = result.current.loginUser("admin@gmail.com", "1234");
    });

    // 3. Assert (Afirmar)
    expect(loginResult.ok).toBe(true);
    expect(loginResult.code).toBe("logged_in");
    expect(result.current.currentUser).not.toBeNull();
    expect(result.current.currentUser.email).toBe("admin@gmail.com");
  });
  test("Todos los campos son obligatorios", () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    let loginResult;
    act(() => {
      loginResult = result.current.loginUser("", "");
    });

    expect(loginResult.ok).toBe(false);
    expect(loginResult.code).toBe("missing_fields");
    expect(loginResult.message).toBe("Correo y contraseña son obligatorios");
  });

  test("El correo no es válido, usa duocuc.cl, duoc.cl o gmail.com", () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    let loginResult;
    act(() => {
      loginResult = result.current.loginUser("test@invalido.com", "1234");
    });

    expect(loginResult.ok).toBe(false);
    expect(loginResult.code).toBe("bad_domain");
    expect(loginResult.message).toBe("Dominio no válido");
  });
  test("debe retornar mensaje de error cuando faltan campos", () => {
    // 1. Arrange (Preparar)
    const { result } = renderHook(() => useAuth(), { wrapper });

    // 2. Act (Actuar)
    let loginResult;
    act(() => {
      loginResult = result.current.loginUser("", "");
    });

    // 3. Assert (Afirmar)
    expect(loginResult.ok).toBe(false);
    expect(loginResult.code).toBe("missing_fields");
    expect(loginResult.message).toBe("Correo y contraseña son obligatorios");
  });

  test("debe retornar mensaje de error con dominio inválido", () => {
    // 1. Arrange (Preparar)
    const { result } = renderHook(() => useAuth(), { wrapper });

    // 2. Act (Actuar)
    let loginResult;
    act(() => {
      loginResult = result.current.loginUser("test@invalido.com", "1234");
    });

    // 3. Assert (Afirmar)
    expect(loginResult.ok).toBe(false);
    expect(loginResult.code).toBe("bad_domain");
    expect(loginResult.message).toBe("Dominio no válido");
  });

  describe("AuthProvider - Flujo completo", () => {
    test("debe permitir registrar un usuario y luego loguearse", () => {
      // 1. Arrange (Preparar)
      const { result } = renderHook(() => useAuth(), { wrapper });

      // 2. Act (Actuar) - Registro
      let registerResult;
      act(() => {
        registerResult = result.current.registerUser({
          name: "Soren Kierkegaard",
          email: "kierkegardiano@duocuc.cl",
          pass: "123",
        });
      });

      // Assert - Registro exitoso
      expect(registerResult.ok).toBe(true);
      expect(registerResult.code).toBe("registered");

      // Act - Login con el nuevo usuario
      let loginResult;
      act(() => {
        loginResult = result.current.loginUser(
          "kierkegardiano@duocuc.cl",
          "123",
        );
      });
    });
  });
});
