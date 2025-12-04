import React, { useState } from "react";

export function ModalAgregarProducto({ isOpen, onClose, onSubmit, isLoading }) {
  const [formData, setFormData] = useState({
    nombre: "",
    precio: "",
    stock: "",
    descripcion: "",
    img: "",
    descuento: 0,
    luz: "Luz indirecta",
    riego: "Riego moderado",
    altura: "Altura variable",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "precio" || name === "stock" || name === "descuento" ? Number(value) : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.nombre.trim() && formData.precio && formData.stock >= 0) {
      onSubmit(formData);
      setFormData({
        nombre: "",
        precio: "",
        stock: "",
        descripcion: "",
        img: "",
        descuento: 0,
        luz: "Luz indirecta",
        riego: "Riego moderado",
        altura: "Altura variable",
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: "white",
          borderRadius: "12px",
          padding: "30px",
          maxWidth: "600px",
          width: "90%",
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow: "0 10px 40px rgba(0, 0, 0, 0.3)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <h3 style={{ margin: 0, color: "#2e7d32" }}>Crear Nuevo Producto</h3>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              fontSize: "24px",
              cursor: "pointer",
              color: "#666",
            }}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: "15px" }}>
            <label style={{ fontWeight: "bold", display: "block", marginBottom: "5px" }}>
              Nombre del Producto *
            </label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              placeholder="Ej: Monstera Deliciosa"
              required
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid #ddd",
                borderRadius: "6px",
                fontFamily: "inherit",
              }}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px", marginBottom: "15px" }}>
            <div className="form-group">
              <label style={{ fontWeight: "bold", display: "block", marginBottom: "5px" }}>
                Precio (CLP) *
              </label>
              <input
                type="number"
                name="precio"
                value={formData.precio}
                onChange={handleChange}
                placeholder="25000"
                required
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #ddd",
                  borderRadius: "6px",
                  fontFamily: "inherit",
                }}
              />
            </div>
            <div className="form-group">
              <label style={{ fontWeight: "bold", display: "block", marginBottom: "5px" }}>
                Stock *
              </label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                placeholder="10"
                required
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #ddd",
                  borderRadius: "6px",
                  fontFamily: "inherit",
                }}
              />
            </div>
            <div className="form-group">
              <label style={{ fontWeight: "bold", display: "block", marginBottom: "5px" }}>
                Descuento (%)
              </label>
              <input
                type="number"
                name="descuento"
                value={formData.descuento}
                onChange={handleChange}
                min="0"
                max="100"
                placeholder="0"
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #ddd",
                  borderRadius: "6px",
                  fontFamily: "inherit",
                }}
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: "15px" }}>
            <label style={{ fontWeight: "bold", display: "block", marginBottom: "5px" }}>
              URL de la Imagen
            </label>
            <input
              type="text"
              name="img"
              value={formData.img}
              onChange={handleChange}
              placeholder="/assets/images/producto.jpg"
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid #ddd",
                borderRadius: "6px",
                fontFamily: "inherit",
              }}
            />
          </div>

          <div className="form-group" style={{ marginBottom: "15px" }}>
            <label style={{ fontWeight: "bold", display: "block", marginBottom: "5px" }}>
              Descripción
            </label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              rows="3"
              placeholder="Describe el producto..."
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid #ddd",
                borderRadius: "6px",
                fontFamily: "inherit",
              }}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px", marginBottom: "20px" }}>
            <div className="form-group">
              <label style={{ fontWeight: "bold", display: "block", marginBottom: "5px" }}>
                Luz
              </label>
              <input
                type="text"
                name="luz"
                value={formData.luz}
                onChange={handleChange}
                placeholder="Luz indirecta"
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #ddd",
                  borderRadius: "6px",
                  fontFamily: "inherit",
                }}
              />
            </div>
            <div className="form-group">
              <label style={{ fontWeight: "bold", display: "block", marginBottom: "5px" }}>
                Riego
              </label>
              <input
                type="text"
                name="riego"
                value={formData.riego}
                onChange={handleChange}
                placeholder="Riego moderado"
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #ddd",
                  borderRadius: "6px",
                  fontFamily: "inherit",
                }}
              />
            </div>
            <div className="form-group">
              <label style={{ fontWeight: "bold", display: "block", marginBottom: "5px" }}>
                Altura
              </label>
              <input
                type="text"
                name="altura"
                value={formData.altura}
                onChange={handleChange}
                placeholder="Altura variable"
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #ddd",
                  borderRadius: "6px",
                  fontFamily: "inherit",
                }}
              />
            </div>
          </div>

          <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              style={{
                padding: "10px 20px",
                border: "1px solid #ddd",
                borderRadius: "6px",
                backgroundColor: "#f0f0f0",
                cursor: isLoading ? "not-allowed" : "pointer",
                opacity: isLoading ? 0.6 : 1,
              }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              style={{
                padding: "10px 20px",
                border: "none",
                borderRadius: "6px",
                backgroundColor: "#2e7d32",
                color: "white",
                cursor: isLoading ? "not-allowed" : "pointer",
                opacity: isLoading ? 0.6 : 1,
              }}
            >
              {isLoading ? "Creando..." : "Crear Producto"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ModalAgregarProducto;
