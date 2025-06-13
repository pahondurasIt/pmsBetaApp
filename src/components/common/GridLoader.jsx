// GridLoader.jsx - Componente de loader personalizado con cubos animados
// Este componente proporciona un loader visual atractivo para procesos de carga
import React from 'react';
import '../css/GridLoader.css';

const GridLoader = ({ 
  isVisible = false, 
  text = "Cargando...", 
  type = "login" // "login" o "logout"
}) => {
  
  // Si no es visible, no renderizar nada
  if (!isVisible) {
    return null;
  }

  // Determinar las clases CSS según el tipo de loader
  const overlayClass = type === "logout" ? "logout-overlay" : "loader-overlay";
  const textClass = type === "logout" ? "logout-text" : "loader-text";
  const loaderClass = type === "logout" ? "grid-loader logout" : "grid-loader";

  return (
    <div className={overlayClass}>
      {/* Grid de 9 cubos animados */}
      <div className={loaderClass}>
        <div className="cube"></div>
        <div className="cube"></div>
        <div className="cube"></div>
        <div className="cube"></div>
        <div className="cube"></div>
        <div className="cube"></div>
        <div className="cube"></div>
        <div className="cube"></div>
        <div className="cube"></div>
      </div>
      
      {/* Texto descriptivo del proceso */}
      <div className={textClass}>
        {text}
      </div>
    </div>
  );
};

export default GridLoader;