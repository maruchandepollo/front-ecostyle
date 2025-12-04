import { encryptPassword } from '../utils/encryptionUtils.js';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export const registrarUsuario = async (usuarioData) => {
  try {
    // Encriptar la contraseña antes de enviar al backend
    const passwordEncriptada = encryptPassword(usuarioData.pass);
    
    // Mapear los datos del frontend al formato del backend
    const datosMapeados = {
      nombre: usuarioData.name,
      email: usuarioData.email,
      password: passwordEncriptada,
      rut: usuarioData.rut,
    };

    const response = await fetch(`${BASE_URL}/usuarios/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(datosMapeados), 
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error al registrar usuario');
    }

    const usuario = await response.json();
    
    if (usuario.token) {
      localStorage.setItem('token', usuario.token);
    }
    
    return usuario;
  } catch (error) {
    console.error('Error en registrarUsuario:', error);
    throw error;
  }
};


export const loginUsuario = async (email, password) => {
  try {
    let passwordFinal = password;
    
    // Si es admin, no encriptar. Si es usuario normal, encriptar
    if (email !== 'admin@ecostyle.com') {
      passwordFinal = encryptPassword(password);
    }
    
    const credentials = {
      email: email,
      password: passwordFinal,
    };

    // Realizamos una petición POST al endpoint /usuarios/login
    const response = await fetch(`${BASE_URL}/usuarios/login`, {
      method: 'POST', // POST porque estamos autenticando
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials), // Enviamos email y contraseña
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Email o contraseña incorrectos');
    }

    // Obtenemos los datos del usuario del backend
    const usuario = await response.json();
    
    if (usuario.token) {
      localStorage.setItem('token', usuario.token);
      // También guardamos los datos del usuario en sesión
      localStorage.setItem('usuarioActual', JSON.stringify(usuario));
    }
    
    return usuario;
  } catch (error) {
    console.error('Error en loginUsuario:', error);
    throw error;
  }
};


export const listarUsuarios = async () => {
  try {
    const token = localStorage.getItem('token');
    
    const response = await fetch(`${BASE_URL}/usuarios/listar`, {
      method: 'GET', // GET para obtener datos
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token || ''}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error al listar usuarios');
    }

    // Retornamos el array de usuarios
    return await response.json();
  } catch (error) {
    console.error('Error en listarUsuarios:', error);
    return [];
  }
};


export const obtenerUsuarioPorEmail = async (email) => {
  try {
    // Realizamos una petición GET a /usuarios/{email}
    const response = await fetch(`${BASE_URL}/usuarios/${email}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Usuario no encontrado');
    }

    // Retornamos los datos del usuario
    return await response.json();
  } catch (error) {
    console.error('Error en obtenerUsuarioPorEmail:', error);
    throw error;
  }
};

export const actualizarUsuario = async (email, usuarioData) => {
  try {
   
    const response = await fetch(`${BASE_URL}/usuarios/editar/${email}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
      },
      body: JSON.stringify(usuarioData), 
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error al actualizar usuario');
    }

    // Obtenemos y retornamos los datos actualizados del usuario
    const usuarioActualizado = await response.json();
    
    // Actualizamos los datos en localStorage
    localStorage.setItem('usuarioActual', JSON.stringify(usuarioActualizado));
    
    return usuarioActualizado;
  } catch (error) {
    console.error('Error en actualizarUsuario:', error);
    throw error;
  }
};


export const eliminarUsuario = async (email) => {
  try {
  
    const response = await fetch(`${BASE_URL}/usuarios/eliminar/${email}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error al eliminar usuario');
    }

    // Limpiamos el localStorage al eliminar la cuenta
    localStorage.removeItem('token');
    localStorage.removeItem('usuarioActual');

    // Retornamos el mensaje de éxito del backend
    return await response.json();
  } catch (error) {
    console.error('Error en eliminarUsuario:', error);
    throw error;
  }
};


export const logoutUsuario = () => {
  // Limpiamos el token y datos del usuario del localStorage
  localStorage.removeItem('token');
  localStorage.removeItem('usuarioActual');
  
};


export const obtenerUsuarioActual = () => {
  const usuarioJSON = localStorage.getItem('usuarioActual');
  return usuarioJSON ? JSON.parse(usuarioJSON) : null;
};


export const tieneTokenValido = () => {
  return !!localStorage.getItem('token');
};
