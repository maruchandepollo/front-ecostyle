import React, { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useProducts } from "../hooks/useProducts";
import { useNavigate } from "react-router-dom";
import { listarUsuarios, eliminarUsuario, actualizarUsuario } from "../services/UsuarioService";
import "../styles/admin.css";

export default function Admin() {
  const { currentUser, isAdmin } = useAuth();
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState("productos");
  const [showFormProduct, setShowFormProduct] = useState(false);
  const [showFormUser, setShowFormUser] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Estado del formulario de productos
  const [formProduct, setFormProduct] = useState({
    nombre: "",
    precio: "",
    stock: "",
    descripcion: "",
    img: "",
    descuento: 0,
  });

  // Estado del formulario de usuarios
  const [formUser, setFormUser] = useState({
    name: "",
    email: "",
    pass: "",
    role: "user",
  });

  // Proteger ruta: Solo admin puede acceder
  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
      return;
    }
    if (!isAdmin()) {
      navigate("/");
      return;
    }
  }, [currentUser, isAdmin, navigate]);
  
  // Cargar usuarios desde backend
  useEffect(() => {
    const cargarUsuarios = async () => {
      try {
        const usuariosDelBackend = await listarUsuarios();
        console.log("Usuarios del backend:", usuariosDelBackend);
        setUsers(usuariosDelBackend || []);
      } catch (error) {
        console.error("Error al cargar usuarios:", error);
        setUsers([]);
      }
    };

    if (isAdmin()) {
      cargarUsuarios();
    }
  }, [isAdmin]);

  const showSuccess = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  // ========== FUNCIONES PRODUCTO ==========
  const handleProductChange = (e) => {
    const { name, value } = e.target;
    let processedValue = value;
    
    // Convertir a número si es un campo numérico
    if (name === "precio" || name === "stock" || name === "descuento") {
      processedValue = value === "" ? "" : Number(value);
    }
    
    setFormProduct((prev) => ({
      ...prev,
      [name]: processedValue,
    }));
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    
    // Validar que los campos requeridos no estén vacíos
    if (!formProduct.nombre || formProduct.nombre.toString().trim() === "") {
      showSuccess("Error: El nombre del producto es obligatorio");
      return;
    }
    
    const precio = Number(formProduct.precio);
    if (isNaN(precio) || precio <= 0) {
      showSuccess("Error: El precio debe ser un número mayor a 0");
      return;
    }
    
    const stock = Number(formProduct.stock);
    if (isNaN(stock) || stock < 0) {
      showSuccess("Error: El stock debe ser un número mayor o igual a 0");
      return;
    }
    
    try {
      // Asegurar que los valores numéricos sean números válidos
      const productoAEnviar = {
        nombre: formProduct.nombre.trim(),
        precio: precio,
        stock: stock,
        descripcion: formProduct.descripcion || "",
        img: formProduct.img || "",
        descuento: Number(formProduct.descuento) || 0,
      };
      
      console.log("Enviando producto:", productoAEnviar);
      
      if (editingProduct) {
        await updateProduct(editingProduct.id, productoAEnviar);
        showSuccess("Producto actualizado correctamente");
        setEditingProduct(null);
      } else {
        await addProduct(productoAEnviar);
        showSuccess("Producto creado correctamente");
      }
      
      resetFormProduct();
      setShowFormProduct(false);
    } catch (error) {
      console.error("Error:", error);
      showSuccess("Error: " + (error.message || "No se pudo crear el producto"));
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setFormProduct(product);
    setShowFormProduct(true);
  };

  const handleDeleteProduct = (id) => {
    setDeleteConfirm({ type: "product", id });
  };

  const confirmDelete = async () => {
    try {
      if (deleteConfirm.type === "product") {
        await deleteProduct(deleteConfirm.id);
        showSuccess("Producto eliminado correctamente");
      } else if (deleteConfirm.type === "user") {
        await eliminarUsuario(deleteConfirm.id);
        setUsers(users.filter(u => u.email !== deleteConfirm.id));
        showSuccess("Usuario eliminado correctamente");
      }
    } catch (error) {
      console.error("Error al eliminar:", error);
      showSuccess("Error al eliminar: " + error.message);
    }
    setDeleteConfirm(null);
  };

  const handleCancelProductForm = () => {
    setShowFormProduct(false);
    setEditingProduct(null);
    resetFormProduct();
  };

  const resetFormProduct = () => {
    setFormProduct({
      nombre: "",
      precio: "",
      stock: "",
      descripcion: "",
      img: "",
      descuento: 0,
    });
  };

  // ========== FUNCIONES USUARIO ==========
  const handleUserChange = (e) => {
    const { name, value } = e.target;
    setFormUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUserSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        // Convertir role (admin/user) a tipo (ADMIN/USUARIO) para el backend
        const usuarioParaActualizar = {
          nombre: formUser.name,
          email: formUser.email,
          password: formUser.pass || editingUser.password,
          tipo: formUser.role === "admin" ? "ADMIN" : "USUARIO",
        };
        
        await actualizarUsuario(editingUser.email, usuarioParaActualizar);
        
        // Actualizar la lista de usuarios localmente
        const usuariosActualizados = users.map(u => 
          u.email === editingUser.email ? { 
            ...u, 
            name: formUser.name,
            tipo: formUser.role === "admin" ? "ADMIN" : "USUARIO"
          } : u
        );
        setUsers(usuariosActualizados);
        showSuccess("Usuario actualizado correctamente");
        setEditingUser(null);
      }
    } catch (error) {
      console.error("Error al actualizar usuario:", error);
      showSuccess("Error: " + error.message);
    }
    setFormUser({
      name: "",
      email: "",
      pass: "",
      role: "user",
    });
    setShowFormUser(false);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    // Convertir tipo (ADMIN/USUARIO) a role (admin/user) para el formulario
    setFormUser({
      name: user.name,
      email: user.email,
      pass: "",
      role: user.tipo?.toUpperCase() === "ADMIN" ? "admin" : "user",
    });
    setShowFormUser(true);
  };

  const handleDeleteUser = (email) => {
    setDeleteConfirm({ type: "user", id: email });
  };

  const handleCancelUserForm = () => {
    setShowFormUser(false);
    setEditingUser(null);
    setFormUser({
      name: "",
      email: "",
      pass: "",
      role: "user",
    });
  };

  return (
    <div className="admin-container" style={{
      background: 'linear-gradient(135deg, #f0f9f0 0%, #e8f5e9 100%)'
    }}>
      {/* Modal de Éxito */}
      {successMessage && (
        <div className="success-message">
          {successMessage}
        </div>
      )}

      {/* Modal de Confirmación */}
      {deleteConfirm && (
        <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Confirmar eliminación</h3>
            <p>
              {deleteConfirm.type === "product"
                ? "¿Estás seguro de que quieres eliminar este producto? Esta acción no se puede deshacer."
                : "¿Estás seguro de que quieres eliminar este usuario? Esta acción no se puede deshacer."}
            </p>
            <div className="modal-actions">
              <button className="btn-confirm" onClick={confirmDelete}>
                Sí, eliminar
              </button>
              <button className="btn-cancel-modal" onClick={() => setDeleteConfirm(null)}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="admin-header">
        <div className="header-content">
          <h1>Panel de Administración</h1>
          <p className="subtitle">Gestiona productos y usuarios del sistema</p>
        </div>
        <div className="admin-tabs">
          <button
            className={`tab-button ${activeTab === "productos" ? "active" : ""}`}
            onClick={() => setActiveTab("productos")}
          >
             Productos
          </button>
          <button
            className={`tab-button ${activeTab === "usuarios" ? "active" : ""}`}
            onClick={() => setActiveTab("usuarios")}
          >
            Usuarios
          </button>
        </div>
      </div>

      {/* ========== SECCIÓN PRODUCTOS ========== */}
      {activeTab === "productos" && (
        <div className="admin-section">
          <div className="section-header">
            <div>
              <h2>Gestión de Productos</h2>
              <p className="section-subtitle">Total: <strong>{products?.length || 0}</strong> productos</p>
            </div>
            <button
              className="btn-add"
              onClick={() => setShowFormProduct(!showFormProduct)}
            >
              {showFormProduct ? "Cancelar" : "Nuevo Producto"}
            </button>
          </div>

          {showFormProduct && (
            <form className="admin-form" onSubmit={handleProductSubmit}>
              <h3>{editingProduct ? "Editar Producto" : "Agregar Nuevo Producto"}</h3>
              
              <div className="form-group">
                <label>Nombre del Producto</label>
                <input
                  type="text"
                  name="nombre"
                  value={formProduct.nombre}
                  onChange={handleProductChange}
                  placeholder="Ej: Monstera Deliciosa"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Precio (CLP)</label>
                  <input
                    type="number"
                    name="precio"
                    value={formProduct.precio}
                    onChange={handleProductChange}
                    placeholder="25000"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Stock</label>
                  <input
                    type="number"
                    name="stock"
                    value={formProduct.stock}
                    onChange={handleProductChange}
                    placeholder="10"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Descuento (%)</label>
                  <input
                    type="number"
                    name="descuento"
                    value={formProduct.descuento}
                    onChange={handleProductChange}
                    min="0"
                    max="100"
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>URL de la Imagen</label>
                <input
                  type="text"
                  name="img"
                  value={formProduct.img}
                  onChange={handleProductChange}
                  placeholder="/assets/images/producto.jpg"
                />
              </div>

              <div className="form-group">
                <label>Descripción</label>
                <textarea
                  name="descripcion"
                  value={formProduct.descripcion}
                  onChange={handleProductChange}
                  rows="3"
                  placeholder="Describe el producto..."
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="btn-submit">
                  {editingProduct ? "Actualizar" : "Crear"}
                </button>
                <button
                  type="button"
                  className="btn-cancel-form"
                  onClick={handleCancelProductForm}
                >
                  Cancelar
                </button>
              </div>
            </form>
          )}

          <div className="products-grid">
            {products && products.length > 0 ? (
              products.map((product) => (
                <div key={product.id} className="product-card-admin">
                  <div className="product-image-admin">
                    <img src={product.img} alt={product.nombre} />
                    {product.descuento > 0 && (
                      <div className="discount-badge">{product.descuento}%</div>
                    )}
                  </div>
                  <div className="product-info-admin">
                    <h3>{product.nombre}</h3>
                    <p className="price">${(product.precio || 0).toLocaleString("es-CL")}</p>
                    <p className="stock">
                      Stock: <strong className={product.stock === 0 ? "out-of-stock" : ""}>{product.stock || 0}</strong>
                    </p>
                  </div>
                  <div className="product-actions">
                    <button
                      className="btn-edit"
                      onClick={() => handleEditProduct(product)}
                    >
                      Editar
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDeleteProduct(product.id)}
                    >
                    Eliminar
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <p>No hay productos registrados</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========== SECCIÓN USUARIOS ========== */}
      {activeTab === "usuarios" && (
        <div className="admin-section">
          <div className="section-header">
            <div>
              <h2>Gestión de Usuarios</h2>
              <p className="section-subtitle">Total: <strong>{users?.length || 0}</strong> usuarios</p>
            </div>
          </div>

          {showFormUser && (
            <form className="admin-form" onSubmit={handleUserSubmit}>
              <h3>{editingUser ? "Editar Usuario" : "Agregar Nuevo Usuario"}</h3>
              
              <div className="form-group">
                <label>Nombre</label>
                <input
                  type="text"
                  name="name"
                  value={formUser.name}
                  onChange={handleUserChange}
                  placeholder="Ej: Juan Pérez"
                  required
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formUser.email}
                  onChange={handleUserChange}
                  disabled={editingUser}
                  placeholder="usuario@duocuc.cl"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Contraseña</label>
                  <input
                    type="password"
                    name="pass"
                    value={formUser.pass}
                    onChange={handleUserChange}
                    placeholder={editingUser ? "Dejar en blanco para no cambiar" : "Ingresa contraseña"}
                  />
                </div>
                <div className="form-group">
                  <label>Rol</label>
                  <select
                    name="role"
                    value={formUser.role}
                    onChange={handleUserChange}
                  >
                    <option value="user">Usuario</option>
                    <option value="admin">Administrador</option>
                  </select>
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn-submit">
                  {editingUser ? "Actualizar" : "Crear"}
                </button>
                <button
                  type="button"
                  className="btn-cancel-form"
                  onClick={handleCancelUserForm}
                >
                  Cancelar
                </button>
              </div>
            </form>
          )}

          <div className="users-table">
            {users && users.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>RUT</th>
                    <th>Email</th>
                    <th>Rol</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.email}>
                      <td>
                        <strong>{user.name}</strong>
                      </td>
                      <td>{user.rut || "-"}</td>
                      <td>{user.email}</td>
                      <td>
                        <span className={`role-badge ${user.tipo?.toUpperCase() === "ADMIN" ? "admin" : "user"}`}>
                          {user.tipo?.toUpperCase() === "ADMIN" ? "Administrador" : "Usuario"}
                        </span>
                      </td>
                      <td className="actions">
                        <button
                          className="btn-edit"
                          onClick={() => handleEditUser(user)}
                        >
                            Editar
                        </button>
                        <button
                          className="btn-delete"
                          onClick={() => handleDeleteUser(user.email)}
                        >
                          Eliminar  
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="empty-state">
                <p>No hay usuarios registrados</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
