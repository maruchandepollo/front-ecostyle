import React from "react";
import "../styles/index.css";
import { useNavigate } from "react-router-dom";

function Index() {
  const navigate = useNavigate();

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
            onClick={() => navigate("/productos")}
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
            onClick={() => navigate("/ofertas")}
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
        id="carouselTrabajos"
        className="carousel slide"
        data-bs-ride="carousel"
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
          borderRadius: "15px",
          overflow: "hidden",
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)"
        }}
      >
        <div className="carousel-inner">

          {/* IMG 1 */}
          <div className="carousel-item active">
            <img
              src="/assets/images/trabajo1.jpg"
              className="d-block w-100 carousel-img"
              alt="Trabajo 1"
            />
          </div>

          {/* IMG 2 */}
          <div className="carousel-item">
            <img
              src="/assets/images/trabajo2.jpg"
              className="d-block w-100 carousel-img"
              alt="Trabajo 2"
            />
          </div>

          {/* IMG 3 */}
          <div className="carousel-item">
            <img
              src="/assets/images/trabajo3.jpg"
              className="d-block w-100 carousel-img"
              alt="Trabajo 3"
            />
          </div>

        </div>

        <button className="carousel-control-prev" type="button" data-bs-target="#carouselTrabajos" data-bs-slide="prev">
          <span className="carousel-control-prev-icon"></span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#carouselTrabajos" data-bs-slide="next">
          <span className="carousel-control-next-icon"></span>
        </button>
      </div>

      <br /><br />

    </div>
  );
}

export default Index;
