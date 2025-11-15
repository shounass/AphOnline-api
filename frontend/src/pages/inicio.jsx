import React from 'react';
import { Link } from 'react-router-dom';
import './inicio.css'; // Crearemos este CSS

const Inicio = () => {
  return (
    <div className="home-page">
      
      {/* Sección Hero */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Tu Salud, Nuestra Prioridad</h1>
          <p className="hero-description">
            Gestiona tus citas médicas y tu historial de forma fácil, segura y al alcance de tu mano.
          </p>
          <div className="hero-actions">
            <Link to="/registro-paciente" className="btn btn-primary">
              Regístrate Gratis
            </Link>
            <Link to="/acerca-de" className="btn btn-outline">
              Conoce Más
            </Link>
          </div>
        </div>
      </section>

      {/* Sección de Características (Ejemplo) */}
      <section className="features-section">
        <div className="features-grid">
          <div className="feature-card">
            <h3>Citas Online</h3>
            <p>Agenda tus consultas con tus médicos favoritos sin salir de casa.</p>
          </div>
          <div className="feature-card">
            <h3>Historial Seguro</h3>
            <p>Accede a tu información médica cuando la necesites, de forma confidencial.</p>
          </div>
          <div className="feature-card">
            <h3>Atención Personalizada</h3>
            <p>Encuentra profesionales que se adapten a tus necesidades.</p>
          </div>
        </div>
      </section>

      {/* Sección CTA (Llamada a la Acción) */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>¿Listo para empezar?</h2>
          <p>Únete a Aphonline y transforma la forma en que gestionas tu salud.</p>
          <Link to="/registro-paciente" className="btn btn-secondary-mint">
            Empieza Ahora
          </Link>
        </div>
      </section>

    </div>
  );
};

export default Inicio;