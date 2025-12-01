import React from "react";
import "../styles/sobrenosotros.css";

function SobreNosotros() {
  return (
    <div style={{
      background: 'linear-gradient(135deg, #f0f9f0 0%, #e8f5e9 100%)',
      minHeight: '100vh',
      paddingTop: '2rem',
      paddingBottom: '2rem'
    }} className="sobre-container flex justify-center">
      <div className="sobre-content max-w-3xl bg-white rounded-2xl shadow-xl p-10 border border-green-200">

        <h1 className="title text-4xl font-extrabold text-green-700 mb-6 text-center drop-shadow-sm">
          Sobre Nosotros
        </h1>

        <p className="text text-gray-700 leading-relaxed mb-8 text-lg">
          <strong className="text-green-800">Tu Espacio Verde, a un Clic y en tu Hogar.</strong><br />
          En EcoStyle, somos apasionados por transformar y embellecer tus espacios con la naturaleza como protagonista.
          Desde 2024, combinamos la comodidad de una tienda online con servicios expertos en paisajismo para llevar la
          serenidad y frescura del mundo natural directamente a tu vida.
        </p>

        <h2 className="subtitle text-2xl font-bold text-green-600 mb-3 border-l-4 border-green-400 pl-3">
          Nuestra Tienda Online
        </h2>
        <p className="text text-gray-700 leading-relaxed mb-8 text-lg">
          Descubre una cuidada selección de plantas de interior y exterior, maceteros de diseño, herramientas de
          jardinería esenciales y elementos decorativos únicos. Explora nuestro catálogo digital y recibe todo lo que
          necesitas para tu oasis personal directamente en tu puerta. Comprar plantas nunca ha sido tan sencillo.
        </p>

        <h2 className="subtitle text-2xl font-bold text-green-600 mb-3 border-l-4 border-green-400 pl-3">
          Servicios de Paisajismo
        </h2>
        <p className="text text-gray-700 leading-relaxed mb-8 text-lg">
          ¿Buscas una transformación completa? En EcoStyle no solo vendemos productos; <strong className="text-green-800">creamos experiencias.</strong><br />
          Nuestro equipo de expertos ofrece servicios de paisajismo personalizados, desde el diseño conceptual hasta la
          ejecución y el mantenimiento. Ya sea un pequeño balcón, un jardín residencial o un espacio comercial,
          trabajamos contigo para diseñar y materializar el entorno verde de tus sueños.
        </p>

        <h2 className="subtitle text-2xl font-bold text-green-600 mb-3 border-l-4 border-green-400 pl-3">
          EcoStyle: Vive verde, vive bien
        </h2>
        <p className="text text-gray-700 leading-relaxed mb-10 text-lg">
          Explora nuestra tienda virtual o contáctanos para una consulta de paisajismo. Estamos aquí para ayudarte a
          llevar naturaleza, armonía y diseño a tu vida diaria.
        </p>

        <div className="sobre-img-box flex justify-center mt-6">
          <img
            src="/assets/images/logoecostyle.jpg"
            alt="EcoStyle"
            className="sobre-img w-40 h-40 object-cover rounded-full shadow-md border-4 border-green-300"
          />
        </div>

      </div>
    </div>
  );
}

export default SobreNosotros;
