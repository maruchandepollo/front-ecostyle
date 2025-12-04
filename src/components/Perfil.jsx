import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import "../styles/perfil.css";

export default function Perfil() {
  const { currentUser, updateUser, logout } = useAuth();
  
  const [nombre, setNombre] = useState(currentUser?.name || "");
  const [email, setEmail] = useState(currentUser?.email || "");
  const [foto, setFoto] = useState(null);
  const [preview, setPreview] = useState(null);
  
  const [passwordActual, setPasswordActual] = useState("");
  const [passwordNueva, setPasswordNueva] = useState("");
  const [passwordConfirmar, setPasswordConfirmar] = useState("");
  
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFoto(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const showSuccess = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const showError = (message) => {
    setErrorMessage(message);
    setTimeout(() => setErrorMessage(""), 3000);
  };

  const handleGuardarCambios = () => {
    if (!nombre || !email) {
      showError("El nombre y email son requeridos");
      return;
    }

    const updatedData = {
      name: nombre,
      email: email
    };

    const result = updateUser(currentUser.email, updatedData);
    if (result.ok) {
      showSuccess("Perfil actualizado correctamente ✓");
    } else {
      showError(result.message || "Error al actualizar el perfil");
    }
  };

  const handleCambiarPassword = () => {
    if (!passwordActual || !passwordNueva || !passwordConfirmar) {
      showError("Todos los campos de contraseña son requeridos");
      return;
    }

    if (passwordActual !== currentUser.pass) {
      showError("La contraseña actual es incorrecta");
      return;
    }

    if (passwordNueva !== passwordConfirmar) {
      showError("Las nuevas contraseñas no coinciden");
      return;
    }

    if (passwordNueva.length < 4) {
      showError("La nueva contraseña debe tener al menos 4 caracteres");
      return;
    }

    const result = updateUser(currentUser.email, { pass: passwordNueva });
    if (result.ok) {
      setPasswordActual("");
      setPasswordNueva("");
      setPasswordConfirmar("");
      showSuccess("Contraseña cambiada correctamente ✓");
    } else {
      showError(result.message || "Error al cambiar la contraseña");
    }
  };

  const handleDeleteAccount = () => {
    setDeleteConfirm(null);
    const result = updateUser(currentUser.email, { deleted: true });
    if (result.ok) {
      showSuccess("Cuenta eliminada correctamente");
      setTimeout(() => logout(), 1500);
    } else {
      showError("Error al eliminar la cuenta");
    }
  };

  return (
    <div className="perfil-container">
      {/* Header */}
      <div className="perfil-header">
        <h1>Mi Perfil</h1>
        <p>Gestiona tu información personal</p>
      </div>

      {/* Tarjeta Principal */}
      <div className="perfil-card">
        {/* Sección de Información del Usuario */}
        <div className="perfil-user-info">
          <div className="user-info-content">
            <h3>Bienvenido/a</h3>
            <p className="user-name">{currentUser?.name || currentUser?.nombre || "Usuario"}</p>
            <p className="user-email">{currentUser?.email}</p>
          </div>
        </div>

        {/* Sección de Foto */}
        <div className="perfil-photo-section">
          <div className="perfil-photo-container">
            {preview ? (
              <img src={preview} alt="Foto de perfil" className="perfil-photo" />
            ) : (
              <div className="perfil-photo" style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                fontSize: '3rem'
              }}>
              </div>
            )}
          </div>
          <div className="perfil-photo-upload">
            <input 
              type="file" 
              id="file-input" 
              accept="image/*" 
              onChange={handleFotoChange}
            />
            <label htmlFor="file-input" className="photo-upload-label">
              Cambiar foto
            </label>
          </div>
        </div>

        {/* Sección de Cambio de Contraseña */}
        <div className="perfil-section">
          <h2 className="perfil-section-title">Cambiar Contraseña</h2>
          <div className="password-section">
            <form className="perfil-form">
              <div className="form-group">
                <label>Contraseña actual</label>
                <input 
                  type="password" 
                  value={passwordActual}
                  onChange={(e) => setPasswordActual(e.target.value)}
                  placeholder="Ingresa tu contraseña actual"
                />
              </div>

              <div className="form-group">
                <label>Nueva contraseña</label>
                <input 
                  type="password" 
                  value={passwordNueva}
                  onChange={(e) => setPasswordNueva(e.target.value)}
                  placeholder="Ingresa la nueva contraseña"
                />
              </div>

              <div className="form-group">
                <label>Confirmar nueva contraseña</label>
                <input 
                  type="password" 
                  value={passwordConfirmar}
                  onChange={(e) => setPasswordConfirmar(e.target.value)}
                  placeholder="Confirma la nueva contraseña"
                />
              </div>

              <button 
                type="button"
                onClick={handleCambiarPassword}
                className="btn-save"
              >
                Cambiar contraseña
              </button>
            </form>
          </div>
        </div>

        {/* Sección de Acciones */}
        <div className="perfil-actions">
          <button 
            onClick={() => logout()}
            className="btn-logout"
          >
            Cerrar Sesión
          </button>
          <button 
            onClick={() => setDeleteConfirm(true)}
            className="btn-logout"
            style={{ background: '#b71c1c', borderColor: '#ffcdd2' }}
          >
            Eliminar Cuenta
          </button>
        </div>
      </div>

      {/* Mensaje de Éxito */}
      {successMessage && (
        <div className="success-message">
          {successMessage}
        </div>
      )}

      {/* Mensaje de Error */}
      {errorMessage && (
        <div className="error-message">
          {errorMessage}
        </div>
      )}

      {/* Modal de Confirmación */}
      {deleteConfirm && (
        <div className="modal-overlay" onClick={() => setDeleteConfirm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Eliminar Cuenta</h3>
            <p>¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer.</p>
            <div className="modal-actions">
              <button 
                className="btn-confirm" 
                onClick={handleDeleteAccount}
                style={{ background: '#b71c1c' }}
              >
                Sí, eliminar
              </button>
              <button 
                className="btn-cancel-modal" 
                onClick={() => setDeleteConfirm(false)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
