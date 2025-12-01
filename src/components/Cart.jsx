import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useProducts } from "../hooks/useProducts";
import "../styles/carrito.css";

const Cart = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const {
    cart,
    clearCart,
    removeFromCart,
    updateCartQuantity,
    getCartTotal,
  } = useProducts();

  const [purchaseComplete, setPurchaseComplete] = useState(false);

  const fmt = new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  });

  const handleRemoveItem = (productId) => {
    removeFromCart(productId);
  };

  const handleUpdateQuantity = (productId, newQty) => {
    if (newQty <= 0) {
      removeFromCart(productId);
    } else {
      updateCartQuantity(productId, newQty);
    }
  };

  const handleConfirmPurchase = () => {
    const total = getCartTotal();
    sessionStorage.setItem("LAST_ORDER_TOTAL", fmt.format(total));
    clearCart();
    setPurchaseComplete(true);
  };

  const handleContinueShopping = () => {
    navigate("/products");
  };

  const handleBackToHome = () => {
    navigate("/");
  };

  // Si la compra se completó, mostrar mensaje de éxito
  if (purchaseComplete) {
    return (
      <div style={{
        background: 'linear-gradient(135deg, #f0f9f0 0%, #e8f5e9 100%)',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem'
      }}>
        <div style={{
          background: 'white',
          padding: '3rem',
          borderRadius: '12px',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
          maxWidth: '500px',
          width: '100%',
          textAlign: 'center',
          border: '3px solid #2e7d32'
        }}>
          <h1 style={{
            color: '#2e7d32',
            fontSize: '2.5rem',
            marginBottom: '1rem',
            fontWeight: 'bold'
          }}>
            Compra Exitosa
          </h1>
          
          <p style={{
            fontSize: '1.1rem',
            color: '#666',
            marginBottom: '0.5rem'
          }}>
            Tu pedido ha sido confirmado correctamente
          </p>

          <p style={{
            fontSize: '0.95rem',
            color: '#999',
            marginBottom: '2rem'
          }}>
            Te enviaremos un correo de confirmación pronto
          </p>

          <p style={{
            fontSize: '1.3rem',
            fontWeight: 'bold',
            color: '#2e7d32',
            marginBottom: '2rem',
            padding: '1rem',
            background: '#e8f5e9',
            borderRadius: '8px'
          }}>
            Total pagado: {sessionStorage.getItem("LAST_ORDER_TOTAL")}
          </p>

          <div style={{
            display: 'flex',
            gap: '1rem',
            flexDirection: 'column'
          }}>
            <button
              onClick={handleContinueShopping}
              style={{
                padding: '0.8rem 1.5rem',
                background: '#2e7d32',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => e.target.style.background = '#1b5e20'}
              onMouseOut={(e) => e.target.style.background = '#2e7d32'}
            >
              Seguir comprando
            </button>
            
            <button
              onClick={handleBackToHome}
              style={{
                padding: '0.8rem 1.5rem',
                background: '#f0f0f0',
                color: '#666',
                border: '2px solid #e0e0e0',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => e.target.style.background = '#e0e0e0'}
              onMouseOut={(e) => e.target.style.background = '#f0f0f0'}
            >
              Volver al inicio
            </button>
          </div>
        </div>
      </div>
    );
  }

  const total = getCartTotal();
  const isEmpty = cart.length === 0;

  return (
    <div style={{
      background: 'linear-gradient(135deg, #f0f9f0 0%, #e8f5e9 100%)',
      minHeight: '100vh',
      paddingTop: '2rem',
      paddingBottom: '2rem'
    }}>
      <div className="container" style={{ maxWidth: '1000px' }}>
        
        {/* Header */}
        <div style={{
          marginBottom: '2rem'
        }}>
          <button
            onClick={() => navigate('/products')}
            style={{
              background: 'none',
              border: 'none',
              color: '#2e7d32',
              fontSize: '1.1rem',
              cursor: 'pointer',
              fontWeight: '600',
              marginBottom: '1rem'
            }}
          >
            {'< Volver al catálogo'}
          </button>
          
          <h1 style={{
            color: '#2e7d32',
            fontSize: '2rem',
            fontWeight: 'bold',
            margin: 0
          }}>
            Carrito de Compras
          </h1>
        </div>

        {isEmpty ? (
          <div style={{
            background: 'white',
            padding: '2rem',
            borderRadius: '10px',
            textAlign: 'center',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
          }}>
            <p style={{
              fontSize: '1.1rem',
              color: '#666',
              margin: 0
            }}>
              Tu carrito está vacío
            </p>
            <button
              onClick={() => navigate('/products')}
              style={{
                marginTop: '1.5rem',
                padding: '0.8rem 1.5rem',
                background: '#2e7d32',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Ir al catálogo
            </button>
          </div>
        ) : (
          <div style={{
            background: 'white',
            borderRadius: '10px',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
            overflow: 'hidden'
          }}>
            {/* Tabla de productos */}
            <div style={{
              overflowX: 'auto'
            }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse'
              }}>
                <thead>
                  <tr style={{
                    background: '#f5f5f5',
                    borderBottom: '2px solid #e0e0e0'
                  }}>
                    <th style={{
                      padding: '1rem',
                      textAlign: 'left',
                      color: '#2e7d32',
                      fontWeight: '600'
                    }}>
                      Producto
                    </th>
                    <th style={{
                      padding: '1rem',
                      textAlign: 'right',
                      color: '#2e7d32',
                      fontWeight: '600'
                    }}>
                      Precio
                    </th>
                    <th style={{
                      padding: '1rem',
                      textAlign: 'center',
                      color: '#2e7d32',
                      fontWeight: '600'
                    }}>
                      Cantidad
                    </th>
                    <th style={{
                      padding: '1rem',
                      textAlign: 'right',
                      color: '#2e7d32',
                      fontWeight: '600'
                    }}>
                      Subtotal
                    </th>
                    <th style={{
                      padding: '1rem',
                      textAlign: 'center',
                      color: '#2e7d32',
                      fontWeight: '600'
                    }}>
                      Accion
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item) => {
                    const subtotal = item.precio * item.cantidad;
                    return (
                      <tr
                        key={item.id}
                        style={{
                          borderBottom: '1px solid #e8f5e9'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.background = '#f9f9f9'}
                        onMouseOut={(e) => e.currentTarget.style.background = 'white'}
                      >
                        <td style={{
                          padding: '1rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '1rem'
                        }}>
                          <img
                            src={item.img}
                            alt={item.nombre}
                            style={{
                              width: '70px',
                              height: '70px',
                              objectFit: 'cover',
                              borderRadius: '8px'
                            }}
                          />
                          <span style={{
                            color: '#333',
                            fontWeight: '500'
                          }}>
                            {item.nombre}
                          </span>
                        </td>
                        <td style={{
                          padding: '1rem',
                          textAlign: 'right',
                          color: '#666'
                        }}>
                          {fmt.format(item.precio)}
                        </td>
                        <td style={{
                          padding: '1rem',
                          textAlign: 'center'
                        }}>
                          <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: '0.5rem'
                          }}>
                            <button
                              onClick={() => handleUpdateQuantity(item.id, item.cantidad - 1)}
                              style={{
                                padding: '0.4rem 0.8rem',
                                background: '#f0f0f0',
                                border: '1px solid #e0e0e0',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '1rem'
                              }}
                            >
                              -
                            </button>
                            <span style={{
                              minWidth: '40px',
                              textAlign: 'center',
                              fontWeight: '600'
                            }}>
                              {item.cantidad}
                            </span>
                            <button
                              onClick={() => handleUpdateQuantity(item.id, item.cantidad + 1)}
                              style={{
                                padding: '0.4rem 0.8rem',
                                background: '#f0f0f0',
                                border: '1px solid #e0e0e0',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '1rem'
                              }}
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td style={{
                          padding: '1rem',
                          textAlign: 'right',
                          color: '#2e7d32',
                          fontWeight: '600'
                        }}>
                          {fmt.format(subtotal)}
                        </td>
                        <td style={{
                          padding: '1rem',
                          textAlign: 'center'
                        }}>
                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            style={{
                              padding: '0.5rem 1rem',
                              background: '#ffebee',
                              color: '#d32f2f',
                              border: '1px solid #ffcdd2',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontWeight: '600',
                              transition: 'all 0.3s ease'
                            }}
                            onMouseOver={(e) => {
                              e.target.style.background = '#d32f2f';
                              e.target.style.color = 'white';
                            }}
                            onMouseOut={(e) => {
                              e.target.style.background = '#ffebee';
                              e.target.style.color = '#d32f2f';
                            }}
                          >
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Total y botones */}
            <div style={{
              padding: '2rem',
              background: '#f9f9f9',
              borderTop: '2px solid #e8f5e9',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1.5rem'
            }}>
              <div style={{
                fontSize: '1.2rem',
                color: '#333'
              }}>
                <span style={{ color: '#666' }}>Total a pagar: </span>
                <span style={{
                  fontWeight: 'bold',
                  color: '#2e7d32',
                  fontSize: '1.5rem'
                }}>
                  {fmt.format(total)}
                </span>
              </div>

              <div style={{
                display: 'flex',
                gap: '1rem',
                flexWrap: 'wrap'
              }}>
                <button
                  onClick={() => navigate('/products')}
                  style={{
                    padding: '0.8rem 1.5rem',
                    background: '#f0f0f0',
                    color: '#666',
                    border: '2px solid #e0e0e0',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '1rem',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={(e) => e.target.style.background = '#e0e0e0'}
                  onMouseOut={(e) => e.target.style.background = '#f0f0f0'}
                >
                  Seguir comprando
                </button>

                <button
                  onClick={handleConfirmPurchase}
                  style={{
                    padding: '0.8rem 2rem',
                    background: '#2e7d32',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '1rem',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 2px 8px rgba(46, 125, 50, 0.3)'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.background = '#1b5e20';
                    e.target.style.boxShadow = '0 4px 12px rgba(46, 125, 50, 0.4)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.background = '#2e7d32';
                    e.target.style.boxShadow = '0 2px 8px rgba(46, 125, 50, 0.3)';
                  }}
                >
                  Confirmar compra
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
