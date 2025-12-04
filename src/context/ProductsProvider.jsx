import { useState, useEffect } from "react";
import { ProductsContext } from "./ProductsContext";
import { createContext } from "react";
import { listarProductos, crearProducto, actualizarProducto, eliminarProducto } from "../services/ProductoService";

// Productos locales por defecto
const PRODUCTOS_INICIALES = [
  {
    id: 1001,
    nombre: "Monstera Deliciosa",
    precio: 24990,
    precioOriginal: 19990, 
    estado: "oferta",     
    stock: 10,
    img: "/assets/images/monstera2.jpg",
    descripcion: "Planta tropical de hojas perforadas",
    descuento: 20,
  },
  {
    id: 1002,
    nombre: "Sansevieria Trifasciata",
    precio: 15725,
    stock: 15,
    img: "/assets/images/sansevieria-trifasciata.jpg",
    descripcion: "Lengua de tigre - Purificadora de aire",
    descuento: 0,
  },
  {
    id: 1003,
    nombre: "Poto Dorado",
    precio: 13590,
    precioOriginal: 13590,
    estado: "oferta",
    stock: 5,
    img: "/assets/images/Poto-dorado.jpg",
    descripcion: "Planta colgante de fácil cuidado",
    descuento: 0,
  },
  {
    id: 1004,
    nombre: "Alocasia Polly",
    precio: 32500,
    precioOriginal: 22750, 
    estado: "oferta",    
    stock: 8,
    img: "/assets/images/alocasia-polly.jpg",
    descripcion: "Planta ornamental de hojas grandes",
    descuento: 30,
  },
  {
    id: 1005,
    nombre: "Schlumbergera Truncata",
    precio: 21990,
    stock: 0,
    img: "/assets/images/schlumbergera-truncata.jpg",
    descripcion: "Una planta muy apreciada por su belleza",
    descuento: 0,
  },
  {
    id: 1006,
    nombre: "Ficus Lyrata",
    precio: 28990,
    stock: 12,
    img: "/assets/images/ficuslyrata.jpg",
    descuento: 0,
  },
  {
    id: 1007,
    nombre: "Areca Palm",
    precio: 33990,
    stock: 0,
    img: "/assets/images/arecapalm.JPG",
    descripcion: "Palmera purificadora que da un toque tropical al hogar",
    descuento: 0,
  },
  {
    id: 1008,
    nombre: "Calathea Orbifolia",
    precio: 27500,
    stock: 7,
    img: "/assets/images/calathea-orbifolia.jpg",
    descripcion: "Planta de hojas anchas y patrón elegante, necesita humedad",
    descuento: 0,
  },
  {
    id: 1009,
    nombre: "Helecho Boston",
    precio: 16990,
    precioOriginal: 12740,
    estado: "oferta",
    stock: 0,
    img: "/assets/images/helecho-boston.jpg",
    descripcion: "Helecho frondoso ideal para mejorar la calidad del aire",
    descuento: 25,
  },
  {
    id: 1010,
    nombre: "Hoya Carnosa",
    precio: 18990,
    stock: 3,
    img: "/assets/images/hoya-carnosa.jpg",
    descripcion: "Planta colgante resistente con hojas cerosas y flores aromáticas",
    descuento: 0,
  },
  {
    id: 1011,
    nombre: "Bambú de la Suerte",
    precio: 12990,
    stock: 20,
    img: "/assets/images/bambu.jpg",
    descripcion: "Planta de interior que atrae la buena suerte",
    descuento: 0,
  },
];

export function ProductsProvider({ children }) {
  // Productos iniciales con imágenes mapeadas
  const PRODUCTOS_CON_IMAGENES = PRODUCTOS_INICIALES.map(p => ({
    ...p,
    img: p.img || getImagenPorProducto(p.nombre),
  }));

  const [products, setProducts] = useState(PRODUCTOS_CON_IMAGENES);
  const [cart, setCart] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mapear nombre de producto a imagen por defecto
  const getImagenPorProducto = (nombre) => {
    if (!nombre) return "/assets/images/1.jpg";
    
    const nombreLower = nombre.toLowerCase().trim();
    const mapeoImagenes = {
      "monstera deliciosa": "/assets/images/monstera2.jpg",
      "sansevieria trifasciata": "/assets/images/sansevieria-trifasciata.jpg",
      "poto dorado": "/assets/images/Poto-dorado.jpg",
      "alocasia polly": "/assets/images/alocasia-polly.jpg",
      "schlumbergera truncata": "/assets/images/schlumbergera-truncata.jpg",
      "ficus lyrata": "/assets/images/ficuslyrata.jpg",
      "areca palm": "/assets/images/arecapalm.JPG",
      "calathea orbifolia": "/assets/images/calathea-orbifolia.jpg",
      "helecho boston": "/assets/images/helecho-boston.jpg",
      "bambú de la suerte": "/assets/images/bambu.jpg",
      "hoya carnosa": "/assets/images/hoya-carnosa.jpg",
    };
    
    // Buscar coincidencia exacta
    if (mapeoImagenes[nombreLower]) {
      return mapeoImagenes[nombreLower];
    }
    
    // Buscar coincidencia parcial
    for (const [key, value] of Object.entries(mapeoImagenes)) {
      if (nombreLower.includes(key) || key.includes(nombreLower)) {
        return value;
      }
    }
    
    return "/assets/images/1.jpg";
  };

  // Cargar productos del backend al montar el componente
  useEffect(() => {
    const cargarProductos = async () => {
      try {
        setIsLoading(true);
        console.log("Iniciando carga de productos del backend...");
        const productosDelBackend = await listarProductos();
        console.log("Productos recibidos del backend:", productosDelBackend);
        
        if (productosDelBackend && productosDelBackend.length > 0) {
          console.log("Se cargaron " + productosDelBackend.length + " productos del backend");
          // Mapear y asegurar que todos los productos tengan imagen
          const productosConImagenes = productosDelBackend.map((p) => ({
            ...p,
            img: p.img || getImagenPorProducto(p.nombre),
          }));
          console.log("Productos con imágenes mapeadas:", productosConImagenes);
          setProducts(productosConImagenes);
        } else {
          console.log("No hay productos en el backend, usando productos iniciales");
          setProducts(PRODUCTOS_INICIALES);
        }
        setError(null);
      } catch (err) {
        console.error("Error al cargar productos del backend:", err);
        console.error("Error detail:", err.message);
        setError(err.message);
        // Mantener los productos locales como fallback
        console.log("Usando productos locales como fallback");
        setProducts(PRODUCTOS_INICIALES);
      } finally {
        setIsLoading(false);
      }
    };

    cargarProductos();
  }, []);

  const getAllProducts = () => {
    return products;
  };

  const getProductById = (id) => {
    return products.find((p) => p.id === parseInt(id));
  };

  const addProduct = (producto) => {
    try {
      // Validar que el producto tenga datos requeridos
      if (!producto.nombre || !producto.precio || producto.stock === undefined) {
        throw new Error("Faltan datos requeridos del producto");
      }
      
      // Asegurar que sean números
      const productoValidado = {
        nombre: producto.nombre,
        precio: Number(producto.precio),
        stock: Number(producto.stock),
        descripcion: producto.descripcion || "",
        img: producto.img || getImagenPorProducto(producto.nombre) || "",
        descuento: Number(producto.descuento) || 0,
      };
      
      // Llamar al servicio del backend para crear el producto
      crearProducto(productoValidado)
        .then((productoCreado) => {
          // Asegurar que el producto creado tenga imagen
          const productoConImagen = {
            ...productoCreado,
            img: productoCreado.img || getImagenPorProducto(productoCreado.nombre),
          };
          // Agregar producto localmente con el ID del backend
          setProducts((prev) => [...prev, productoConImagen]);
        })
        .catch((error) => {
          console.error("Error al crear producto en backend:", error);
          // Fallback: agregar localmente si falla el backend
          const productoLocal = {
            ...productoValidado,
            id: Math.max(...products.map(p => p.id), 0) + 1,
          };
          setProducts((prev) => [...prev, productoLocal]);
        });
      
      return { ok: true, product: productoValidado };
    } catch (error) {
      console.error("Error al crear producto:", error);
      return { ok: false, message: error.message };
    }
  };

  const updateProduct = (id, updatedData) => {
    try {
      // Llamar al servicio del backend para actualizar el producto
      actualizarProducto(id, updatedData)
        .then(() => {
          // Actualizar producto localmente
          setProducts((prev) =>
            prev.map((p) => (p.id === parseInt(id) ? { ...p, ...updatedData } : p)),
          );
        })
        .catch((error) => {
          console.error("Error al actualizar producto en backend:", error);
          // Fallback: actualizar localmente si falla el backend
          setProducts((prev) =>
            prev.map((p) => (p.id === parseInt(id) ? { ...p, ...updatedData } : p)),
          );
        });
      
      return { ok: true };
    } catch (error) {
      console.error("Error al actualizar producto:", error);
      return { ok: false, message: error.message };
    }
  };

  const deleteProduct = (id) => {
    try {
      const idNum = parseInt(id);
      
      // Primero eliminar localmente
      setProducts((prev) => prev.filter((p) => p.id !== idNum));
      
      // Luego intentar eliminar del backend
      eliminarProducto(id)
        .then(() => {
          console.log("Producto eliminado del backend:", id);
        })
        .catch((error) => {
          console.error("Error al eliminar producto en backend:", error);
          // El producto ya fue eliminado localmente, así que no hay rollback necesario
        });
      
      return { ok: true };
    } catch (error) {
      console.error("Error al eliminar producto:", error);
      return { ok: false, message: error.message };
    }
  };

  const addToCart = (productId, cantidad = 1) => {
    const product = getProductById(productId);

    if (!product) {
      return { ok: false, message: "Producto no encontrado" };
    }

    if (product.stock < cantidad) {
      return { ok: false, message: "Stock insuficiente" };
    }

    setCart((prev) => {
      const existingItem = prev.find((item) => item.id === productId);

      if (existingItem) {
        return prev.map((item) =>
          item.id === productId
            ? { ...item, cantidad: item.cantidad + cantidad }
            : item,
        );
      }

      return [...prev, { ...product, cantidad }];
    });

    updateProduct(productId, { stock: product.stock - cantidad });
    return { ok: true, message: "Producto agregado al carrito" };
  };

  const removeFromCart = (productId) => {
    const cartItem = cart.find((item) => item.id === productId);

    if (cartItem) {
      const product = getProductById(productId);
      if (product) {
        updateProduct(productId, { stock: product.stock + cartItem.cantidad });
      }
    }

    setCart((prev) => prev.filter((item) => item.id !== productId));
    return { ok: true };
  };

  const updateCartQuantity = (productId, nuevaCantidad) => {
    const cartItem = cart.find((item) => item.id === productId);
    const product = getProductById(productId);

    if (!cartItem || !product) return { ok: false };

    const diferencia = nuevaCantidad - cartItem.cantidad;

    if (product.stock < diferencia) {
      return { ok: false, message: "Stock insuficiente" };
    }

    setCart((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, cantidad: nuevaCantidad } : item,
      ),
    );

    updateProduct(productId, { stock: product.stock - diferencia });
    return { ok: true };
  };

  const clearCart = () => {
    cart.forEach((item) => {
      const product = getProductById(item.id);
      if (product) {
        updateProduct(item.id, { stock: product.stock + item.cantidad });
      }
    });

    setCart([]);
    return { ok: true };
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.precio * item.cantidad, 0);
  };

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.cantidad, 0);
  };

  const value = {
    products,
    cart,
    getAllProducts,
    getProductById,
    addProduct,
    updateProduct,
    deleteProduct,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    getCartTotal,
    getCartCount,
    isLoading,
    error,
  };

  return (
    <ProductsContext.Provider value={value}>
      {children}
    </ProductsContext.Provider>
  );
}
