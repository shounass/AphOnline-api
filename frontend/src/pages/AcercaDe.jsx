import React from 'react';
import { Link } from 'react-router-dom';
import './acercaDe.css'; // Crearemos este archivo de estilos

// Opcional: Si tienes una imagen del equipo o de la oficina
// import teamImage from '../assets/team-photo.jpg';

const AcercaDe = () => {
  return (
    <div className="about-page">
      
      {/* --- Sección Hero --- */}
      <section className="about-hero">
        <div className="about-hero-content">
          <h1>Conectando Pacientes y Profesionales de la Salud</h1>
          <p className="subtitle">
            Nuestra misión es simplificar la gestión de la salud, haciéndola más accesible, segura y humana para todos.
          </p>
        </div>
      </section>

      {/* --- Sección Misión y Visión (Dos Columnas) --- */}
      <section className="mission-vision">
        <div className="mission-vision-container">
          <div className="mission-card">
            <h2>Nuestra Misión</h2>
            <p>
              Facilitar el acceso a la atención médica de calidad a través de una plataforma digital intuitiva y segura. Creemos que la tecnología puede cerrar brechas y mejorar la relación médico-paciente.
            </p>
          </div>
          <div className="vision-card">
            <h2>Nuestra Visión</h2>
            <p>
              Ser la plataforma líder en Latinoamérica para la gestión de consultorios médicos online, reconocida por nuestra innovación, confiabilidad y el impacto positivo en la salud de millones de personas.
            </p>
          </div>
        </div>
      </section>

      {/* --- Sección de Valores --- */}
      <section className="values-section">
        <h2>Nuestros Valores</h2>
        <div className="values-grid">
          <div className="value-item">
            <span className="value-icon">🛡️</span>
            <h3>Confianza y Seguridad</h3>
            <p>La privacidad de tus datos es nuestra máxima prioridad. Usamos encriptación de nivel bancario.</p>
          </div>
          <div className="value-item">
            <span className="value-icon">💡</span>
            <h3>Innovación</h3>
            <p>Buscamos constantemente nuevas formas de mejorar la experiencia de salud digital.</p>
          </div>
          <div className="value-item">
            <span className="value-icon">❤️</span>
            <h3>Empatía</h3>
            <p>Diseñamos nuestra plataforma pensando siempre en las necesidades reales de pacientes y médicos.</p>
          </div>
        </div>
      </section>

      {/* --- Sección 'Conoce al Equipo' (Placeholder) --- */}
      <section className="team-section">
        <h2>Detrás de Aphonline</h2>
        <p>
          Somos un equipo de desarrolladores, diseñadores y profesionales de la salud apasionados por transformar la atención médica.
        </p>
        {/* <div className="team-image-placeholder">
          <img src={teamImage} alt="Nuestro equipo" />
        </div> 
        */}
      </section>

      {/* --- Sección CTA Final --- */}
      <section className="about-cta">
        <h2>Únete a la revolución de la salud digital</h2>
        <p>Descubre todo lo que Aphonline puede hacer por ti.</p>
        <Link to="/registro-paciente" className="btn btn-primary">
          Regístrate Ahora
        </Link>
      </section>

    </div>
  );
};

export default AcercaDe;