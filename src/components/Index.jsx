import React, { useState, useEffect } from "react";
import "../styles/index.css";
import { useNavigate } from "react-router-dom";

function Index() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  // Función para navegar a ofertas (productos con descuento)
  const handleNavigateToOffers = () => {
    navigate("/products?filter=ofertas");
  };

  // Función para navegar según el slide actual del segundo carrusel
  const handleSecondCarouselClick = () => {
    if (currentSlide === 0) {
      navigate("/products");
    } else if (currentSlide === 1) {
      navigate("/products?filter=ofertas");
    } else if (currentSlide === 2) {
      navigate("/sobre-nosotros");
    }
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, #f0f9f0 0%, #e8f5e9 100%)',
      minHeight: '100vh',
      paddingBottom: '2rem'
    }}>

      {/* === PRIMER CARRUSEL PRINCIPAL === */}
      <div
        id="carouselMain"
        className="carousel slide carousel-fade mt-3"
        data-bs-ride="carousel"
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          borderRadius: "15px",
          overflow: "hidden",
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
          cursor: "pointer"
        }}
      >
        <div className="carousel-inner">

          {/* 1 */}
          <div
            className="carousel-item active"
            onClick={() => navigate("/products")}
          >
            <img
              src="/assets/images/1.jpg"
              className="d-block w-100 carousel-img"
              alt="Precio"
            />
            <div className="carousel-caption d-none d-md-block">
              <h2 className="fw-bold">Tus plantas favoritas al mejor precio</h2>
            </div>
          </div>

          {/* 2 */}
          <div
            className="carousel-item"
            onClick={handleNavigateToOffers}
          >
            <img
              src="/assets/images/4.jpg"
              className="d-block w-100 carousel-img"
              alt="Ofertas"
            />
            <div className="carousel-caption d-none d-md-block">
              <h2 className="fw-bold">Ofertas especiales</h2>
            </div>
          </div>

          {/* 3 */}
          <div
            className="carousel-item"
            onClick={() => navigate("/sobre-nosotros")}
          >
            <img
              src="/assets/images/fondoindex.jpg"
              className="d-block w-100 carousel-img"
              alt="Sobre nosotros"
            />
            <div className="carousel-caption d-none d-md-block">
              <h2 className="fw-bold">Sobre nosotros</h2>
            </div>
          </div>
        </div>

        <button className="carousel-control-prev" type="button" data-bs-target="#carouselMain" data-bs-slide="prev">
          <span className="carousel-control-prev-icon"></span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#carouselMain" data-bs-slide="next">
          <span className="carousel-control-next-icon"></span>
        </button>
      </div>

      {/* === TÍTULO SEGUNDO CARRUSEL === */}
      <h3 className="eco-title">
        Conoce nuestros trabajos
      </h3>

      {/* === LOGO CENTRAL === */}
      <div style={{
        textAlign: 'center',
        margin: '1.5rem 0',
        padding: '1rem'
      }}>
        <img
          src="/assets/images/logoecostyle.jpg"
          alt="EcoStyle Logo"
          style={{
            width: "120px",
            height: "120px",
            borderRadius: "50%",
            border: "4px solid #2e7d32",
            boxShadow: "0 4px 12px rgba(46, 125, 50, 0.2)",
            objectFit: "cover"
          }}
        />
      </div>

      {/* === SEGUNDO CARRUSEL === */}
      <div
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
          borderRadius: "15px",
          overflow: "hidden",
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
          cursor: "pointer"
        }}
      >
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '400px',
            overflow: 'hidden'
          }}
          onClick={handleSecondCarouselClick}
        >
          {/* Imagen del carrusel actual */}
          <img
            src={[
              "/assets/images/trabajo1.jpg",
              "/assets/images/trabajo2.jpg",
              "/assets/images/trabajo3.jpg"
            ][currentSlide]}
            alt={`Trabajo ${currentSlide + 1}`}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'opacity 0.5s ease-in-out'
            }}
          />

          {/* Indicadores */}
          <div style={{
            position: 'absolute',
            bottom: '15px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: '8px'
          }}>
            {[0, 1, 2].map((index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentSlide(index);
                }}
                style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  border: 'none',
                  background: index === currentSlide ? '#2e7d32' : 'rgba(255, 255, 255, 0.6)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              />
            ))}
          </div>

          {/* Botones de navegación */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setCurrentSlide((prev) => (prev - 1 + 3) % 3);
            }}
            style={{
              position: 'absolute',
              left: '15px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'rgba(0, 0, 0, 0.5)',
              color: 'white',
              border: 'none',
              fontSize: '24px',
              padding: '10px 15px',
              borderRadius: '4px',
              cursor: 'pointer',
              zIndex: 10
            }}
          >
            &#10094;
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setCurrentSlide((prev) => (prev + 1) % 3);
            }}
            style={{
              position: 'absolute',
              right: '15px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'rgba(0, 0, 0, 0.5)',
              color: 'white',
              border: 'none',
              fontSize: '24px',
              padding: '10px 15px',
              borderRadius: '4px',
              cursor: 'pointer',
              zIndex: 10
            }}
          >
            &#10095;
          </button>
        </div>
      </div>

      <br /><br />

    </div>
  );
}

export default Index;
