import React, { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

function Login() {
  const { loginUser, registerUser } = useAuth();
  const navigate = useNavigate();

  const [showRegister, setShowRegister] = useState(false);

  // Login
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Registro
  const [name, setName] = useState("");
  const [rut, setRut] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [loginMsg, setLoginMsg] = useState({ text: "", type: "" });
  const [registerMsg, setRegisterMsg] = useState({ text: "", type: "" });

  useEffect(() => {
    document.body.classList.add("login-page");
    return () => document.body.classList.remove("login-page");
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    const result = await loginUser(email, password);

    if (result.ok) {
      setLoginMsg({ text: "¡Inicio de sesión exitoso!", type: "success" });
      setTimeout(() => navigate("/"), 1000);
    } else {
      setLoginMsg({ text: result.message, type: "danger" });
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (regPassword !== confirmPassword) {
      setPasswordError("Las contraseñas no coinciden");
      return;
    }

    const result = await registerUser({
      name,
      rut,
      email: regEmail,
      pass: regPassword,
    });

    if (result.ok) {
      setRegisterMsg({
        text: "¡Registro exitoso! Ahora puedes iniciar sesión",
        type: "success",
      });

      setTimeout(() => {
        setShowRegister(false);
        setRegisterMsg({ text: "", type: "" });
        setEmail(regEmail);
        setLoginMsg({
          text: "Cuenta creada. Inicia sesión con tu nueva cuenta.",
          type: "info",
        });
      }, 2000);
    } else {
      setRegisterMsg({ text: result.message, type: "danger" });
    }
  };

  const toggleForm = () => {
    setShowRegister(!showRegister);
    setLoginMsg({ text: "", type: "" });
    setRegisterMsg({ text: "", type: "" });

    // Limpiar campos
    setRegPassword("");
    setConfirmPassword("");
    setPasswordError("");
  };

  return (
    <div className="eco-login-bg">
      <div className="eco-card">
        <div className="eco-left">
          <h2 className="eco-title">EcoStyle</h2>
          <p className="eco-subtitle">Cultiva, Riega, Ama tu paisaje</p>
          <p className="eco-quote">“La tierra ríe en flores.” — Ralph Waldo Emerson</p>
        </div>

        <div className="eco-right">
          {!showRegister ? (
            <>
              {/* LOGIN */}
              <div className="eco-form">
                <h4>Iniciar Sesión</h4>

                {loginMsg.text && (
                  <div className={`alert alert-${loginMsg.type}`}>
                    {loginMsg.text}
                  </div>
                )}

                <form onSubmit={handleLogin}>
                  <input
                    type="email"
                    className="eco-input"
                    placeholder="Correo"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />

                  <input
                    type="password"
                    className="eco-input"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />

                  <button className="eco-btn-dark" type="submit">
                    Iniciar
                  </button>
                </form>

                <p className="eco-switch">
                  ¿No tienes cuenta? <span onClick={toggleForm}>Regístrate</span>
                </p>
              </div>
            </>
          ) : (
            <>
              {/* REGISTRO */}
              <div className="eco-form">
                <h4>Crear Cuenta</h4>

                {registerMsg.text && (
                  <div className={`alert alert-${registerMsg.type}`}>
                    {registerMsg.text}
                  </div>
                )}

                {/* Alerta de contraseñas */}
                {passwordError && (
                  <p style={{ color: "red", marginBottom: "10px" }}>
                    {passwordError}
                  </p>
                )}

                <form onSubmit={handleRegister}>
                  <input
                    type="text"
                    className="eco-input"
                    placeholder="Nombre completo"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />

                  <input
                    type="text"
                    className="eco-input"
                    placeholder="RUT (ej: 12345678-K)"
                    value={rut}
                    onChange={(e) => setRut(e.target.value)}
                    required
                  />

                  <input
                    type="email"
                    className="eco-input"
                    placeholder="Correo"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    required
                  />

                  <input
                    type="password"
                    className="eco-input"
                    placeholder="Contraseña"
                    value={regPassword}
                    onChange={(e) => {
                      setRegPassword(e.target.value);
                      if (confirmPassword && e.target.value !== confirmPassword) {
                        setPasswordError("Las contraseñas no coinciden");
                      } else {
                        setPasswordError("");
                      }
                    }}
                    required
                  />

                  <input
                    type="password"
                    className="eco-input"
                    placeholder="Confirmar Contraseña"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (regPassword !== e.target.value) {
                        setPasswordError("Las contraseñas no coinciden");
                      } else {
                        setPasswordError("");
                      }
                    }}
                    required
                  />

                  <button
                    className="eco-btn-green"
                    type="submit"
                    disabled={passwordError !== ""}
                  >
                    Crear Cuenta
                  </button>
                </form>

                <p className="eco-switch">
                  ¿Ya tienes cuenta? <span onClick={toggleForm}>Inicia sesión</span>
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Login;
