import { renderHook, act } from "@testing-library/react";
import { ProductsProvider } from "../context/ProductsProvider";
import { ProductsContext } from "../context/ProductsContext";
import { useContext } from "react";
import { describe, expect, it } from "vitest";

const useProductsContext = () => useContext(ProductsContext);

describe("ProductsProvider", () => {
  describe("Estado inicial", () => {
    it("debe inicializar con 5 productos", () => {
      const { result } = renderHook(() => useProductsContext(), {
        wrapper: ProductsProvider,
      });

      expect(result.current.products).toHaveLength(5);
      expect(result.current.getAllProducts()).toHaveLength(5);
    });

    it("debe inicializar con carrito vacío", () => {
      const { result } = renderHook(() => useProductsContext(), {
        wrapper: ProductsProvider,
      });

      expect(result.current.cart).toHaveLength(0);
      expect(result.current.getCartCount()).toBe(0);
      expect(result.current.getCartTotal()).toBe(0);
    });
  });

  describe("getProductById", () => {
    it("debe retornar producto existente", () => {
      const { result } = renderHook(() => useProductsContext(), {
        wrapper: ProductsProvider,
      });

      const product = result.current.getProductById(1001);

      expect(product).toBeDefined();
      expect(product.id).toBe(1001);
      expect(product.nombre).toBe("Monstera Deliciosa");
    });

    it("debe retornar undefined para producto inexistente", () => {
      const { result } = renderHook(() => useProductsContext(), {
        wrapper: ProductsProvider,
      });

      const product = result.current.getProductById(9999);

      expect(product).toBeUndefined();
    });
  });

  describe("addProduct", () => {
    it("debe agregar un nuevo producto", () => {
      const { result } = renderHook(() => useProductsContext(), {
        wrapper: ProductsProvider,
      });

      let response;
      act(() => {
        response = result.current.addProduct({
          nombre: "Cactus",
          precio: 5000,
          stock: 20,
          img: "/cactus.jpg",
          descripcion: "Planta desértica",
        });
      });

      expect(response.ok).toBe(true);
      expect(response.product).toBeDefined();
      expect(result.current.products).toHaveLength(6);
      expect(response.product.nombre).toBe("Cactus");
    });
  });

  describe("updateProduct", () => {
    it("debe actualizar producto existente", () => {
      const { result } = renderHook(() => useProductsContext(), {
        wrapper: ProductsProvider,
      });

      act(() => {
        result.current.updateProduct(1001, { precio: 30000, stock: 15 });
      });

      const updatedProduct = result.current.getProductById(1001);

      expect(updatedProduct.precio).toBe(30000);
      expect(updatedProduct.stock).toBe(15);
      expect(updatedProduct.nombre).toBe("Monstera Deliciosa");
    });
  });

  describe("deleteProduct", () => {
    it("debe eliminar producto existente", () => {
      const { result } = renderHook(() => useProductsContext(), {
        wrapper: ProductsProvider,
      });

      act(() => {
        result.current.deleteProduct(1001);
      });

      expect(result.current.products).toHaveLength(4);
      expect(result.current.getProductById(1001)).toBeUndefined();
    });
  });

  describe("addToCart", () => {
    it("debe agregar producto al carrito", () => {
      const { result } = renderHook(() => useProductsContext(), {
        wrapper: ProductsProvider,
      });

      let response;
      act(() => {
        response = result.current.addToCart(1001, 2);
      });

      expect(response.ok).toBe(true);
      expect(result.current.cart).toHaveLength(1);
      expect(result.current.cart[0].cantidad).toBe(2);
      expect(result.current.getCartCount()).toBe(2);
    });

    it("debe incrementar cantidad si producto ya está en carrito", () => {
      const { result } = renderHook(() => useProductsContext(), {
        wrapper: ProductsProvider,
      });

      act(() => {
        result.current.addToCart(1001, 2);
      });

      const initialCount = result.current.cart[0].cantidad;

      act(() => {
        result.current.addToCart(1001, 3);
      });

      expect(result.current.cart).toHaveLength(1);
      expect(result.current.cart[0].cantidad).toBe(5);
      expect(result.current.getCartCount()).toBe(5);
    });

    it("debe reducir stock al agregar al carrito", () => {
      const { result } = renderHook(() => useProductsContext(), {
        wrapper: ProductsProvider,
      });

      const initialStock = result.current.getProductById(1001).stock;

      act(() => {
        result.current.addToCart(1001, 3);
      });

      const newStock = result.current.getProductById(1001).stock;
      expect(newStock).toBe(initialStock - 3);
    });

    it("debe rechazar si stock es insuficiente", () => {
      const { result } = renderHook(() => useProductsContext(), {
        wrapper: ProductsProvider,
      });

      let response;
      act(() => {
        response = result.current.addToCart(1001, 100);
      });

      expect(response.ok).toBe(false);
      expect(response.message).toBe("Stock insuficiente");
      expect(result.current.cart).toHaveLength(0);
    });

    it("debe rechazar producto inexistente", () => {
      const { result } = renderHook(() => useProductsContext(), {
        wrapper: ProductsProvider,
      });

      let response;
      act(() => {
        response = result.current.addToCart(9999, 1);
      });

      expect(response.ok).toBe(false);
      expect(response.message).toBe("Producto no encontrado");
    });
  });

  describe("removeFromCart", () => {
    it("debe eliminar producto del carrito y restaurar stock", () => {
      const { result } = renderHook(() => useProductsContext(), {
        wrapper: ProductsProvider,
      });

      const initialStock = result.current.getProductById(1001).stock;

      act(() => {
        result.current.addToCart(1001, 3);
      });

      expect(result.current.cart).toHaveLength(1);

      act(() => {
        result.current.removeFromCart(1001);
      });

      expect(result.current.cart).toHaveLength(0);

      const finalStock = result.current.getProductById(1001).stock;
      expect(finalStock).toBe(initialStock);
    });
  });

  describe("updateCartQuantity", () => {
    it("debe actualizar cantidad en carrito", () => {
      const { result } = renderHook(() => useProductsContext(), {
        wrapper: ProductsProvider,
      });

      act(() => {
        result.current.addToCart(1001, 2);
      });

      const initialQuantity = result.current.cart[0].cantidad;

      act(() => {
        result.current.updateCartQuantity(1001, 5);
      });

      expect(result.current.cart[0].cantidad).toBe(5);
    });

    it("debe rechazar si stock es insuficiente", () => {
      const { result } = renderHook(() => useProductsContext(), {
        wrapper: ProductsProvider,
      });

      let response;
      act(() => {
        result.current.addToCart(1001, 2);
      });

      act(() => {
        response = result.current.updateCartQuantity(1001, 100);
      });

      expect(response.ok).toBe(false);
      expect(response.message).toBe("Stock insuficiente");
    });

    describe("clearCart", () => {
      it("debe vaciar carrito y restaurar stock", () => {
        const { result } = renderHook(() => useProductsContext(), {
          wrapper: ProductsProvider,
        });

        const initialStocks = {
          1001: result.current.getProductById(1001).stock,
          1002: result.current.getProductById(1002).stock,
        };

        act(() => {
          result.current.addToCart(1001, 3);
          result.current.addToCart(1002, 2);
        });

        expect(result.current.cart).toHaveLength(2);

        act(() => {
          result.current.clearCart();
        });

        expect(result.current.cart).toHaveLength(0);
        expect(result.current.getProductById(1001).stock).toBe(
          initialStocks[1001],
        );
        expect(result.current.getProductById(1002).stock).toBe(
          initialStocks[1002],
        );
      });
    });

    describe("getCartTotal", () => {
      it("debe calcular total del carrito correctamente", () => {
        const { result } = renderHook(() => useProductsContext(), {
          wrapper: ProductsProvider,
        });

        act(() => {
          result.current.addToCart(1001, 2); // 24990 * 2 = 49980
          result.current.addToCart(1002, 1); // 15725 * 1 = 15725
        });

        const expectedTotal = 24990 * 2 + 15725 * 1;
        expect(result.current.getCartTotal()).toBe(expectedTotal);
      });

      it("debe retornar 0 cuando el carrito está vacío", () => {
        const { result } = renderHook(() => useProductsContext(), {
          wrapper: ProductsProvider,
        });

        expect(result.current.getCartTotal()).toBe(0);
      });
    });

    describe("getCartCount", () => {
      it("debe contar total de items en carrito", () => {
        const { result } = renderHook(() => useProductsContext(), {
          wrapper: ProductsProvider,
        });

        act(() => {
          result.current.addToCart(1001, 2);
          result.current.addToCart(1002, 3);
          result.current.addToCart(1003, 1);
        });

        expect(result.current.getCartCount()).toBe(6);
      });

      it("debe retornar 0 cuando el carrito está vacío", () => {
        const { result } = renderHook(() => useProductsContext(), {
          wrapper: ProductsProvider,
        });

        expect(result.current.getCartCount()).toBe(0);
      });
    });

    describe("Validación de stock con producto sin stock", () => {
      it("no debe permitir agregar producto con stock 0", () => {
        const { result } = renderHook(() => useProductsContext(), {
          wrapper: ProductsProvider,
        });

        let response;
        act(() => {
          response = result.current.addToCart(1005, 1); // Schlumbergera tiene stock: 0
        });

        expect(response.ok).toBe(false);
        expect(response.message).toBe("Stock insuficiente");
        expect(result.current.cart).toHaveLength(0);
      });
    });
  });
});
