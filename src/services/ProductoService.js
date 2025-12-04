// URL base del backend 
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';


const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
};


export const crearProducto = async (productoData) => {
  try {
    // Validar datos antes de enviar
    if (!productoData.nombre || !productoData.precio || productoData.stock === undefined) {
      throw new Error("Datos del producto incompletos");
    }
    
    const headers = getAuthHeaders();
    console.log("Headers enviados:", headers);
    console.log("Token en localStorage:", localStorage.getItem('token'));
    
    // Realizamos una petición POST al endpoint /productos/crear
    const response = await fetch(`${BASE_URL}/productos/crear`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(productoData),
    });

    // Verificamos si la respuesta fue exitosa (status 201 CREATED)
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error al crear el producto');
    }

    // Si todo está bien, convertimos la respuesta a JSON y la retornamos
    return await response.json();
  } catch (error) {
    // Capturamos cualquier error y lo mostramos en consola
    console.error('Error en crearProducto:', error);
    throw error;
  }
};


export const listarProductos = async () => {
  try {
    // Realizamos una petición GET al endpoint /productos/listar
    const response = await fetch(`${BASE_URL}/productos/listar`, {
      method: 'GET', 
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error al listar productos');
    }

    return await response.json();
  } catch (error) {
    console.error('Error en listarProductos:', error);
    throw error;
  }
};


export const obtenerProductoPorId = async (id) => {
  try {
   
    const response = await fetch(`${BASE_URL}/productos/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Si el producto no existe, error
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Producto no encontrado');
    }

    // Retornamos los datos del producto
    return await response.json();
  } catch (error) {
    console.error('Error en obtenerProductoPorId:', error);
    throw error;
  }
};


export const actualizarProducto = async (id, productoData) => {
  try {
    
    const response = await fetch(`${BASE_URL}/productos/editar/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(productoData), // Enviamos los nuevos datos
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error al actualizar el producto');
    }

    // Retornamos el producto actualizado
    return await response.json();
  } catch (error) {
    console.error('Error en actualizarProducto:', error);
    throw error;
  }
};


export const eliminarProducto = async (id) => {
  try {
  
    const response = await fetch(`${BASE_URL}/productos/eliminar/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error al eliminar el producto');
    }

    // Retornamos el mensaje de éxito del backend
    return await response.json();
  } catch (error) {
    console.error('Error en eliminarProducto:', error);
    throw error;
  }
};
