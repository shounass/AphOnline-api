import React from "react";
import { Link } from "react-router-dom";
import "./inicio.css";

const Inicio = () => {
  return (
    <div className="home-page">
      {/* --- Sección Hero --- */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Bienvenido a Aphonline</h1>
          <p className="hero-description">
            La plataforma integral para tu salud. Gestiona tus consultas
            médicas, accede a tu historial clínico y recibe tus recetas de forma
            digital, fácil y segura.
          </p>
          <div className="hero-actions">
            <Link to="/registro-paciente" className="btn btn-primary">
              Crear Cuenta
            </Link>
            <Link
              to="/acerca-de"
              className="btn btn-outline"
              style={{ borderColor: "#2c3e50", color: "#2c3e50" }}
            >
              Conoce Más
            </Link>
          </div>
        </div>
      </section>

      {/* --- Sección de Características --- */}
      <section className="features-section">
        <h2>¿Qué te ofrecemos?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <span className="feature-icon">📅</span>
            <h3>Agenda Fácil</h3>
            <p>
              Busca médicos por especialidad y agenda tu consulta online en
              minutos, sin llamadas ni filas.
            </p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">🩺</span>
            <h3>Historial Digital</h3>
            <p>
              Tu información médica segura y accesible 24/7. Antecedentes,
              diagnósticos y evoluciones.
            </p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">📄</span>
            <h3>Recetas y Órdenes</h3>
            <p>
              Descarga tus fórmulas médicas y órdenes de exámenes directamente
              desde la plataforma.
            </p>
          </div>
        </div>
      </section>

      {/* --- Sección "Cómo Funciona" (MEJORADA) --- */}
      <section className="how-it-works">
        <h2>¿Cómo funciona?</h2>

        <div className="steps-container">
          {/* Paso 1 */}
          <div className="step-card">
            <div className="step-number">1</div>
            <h3>Regístrate</h3>
            <p>
              Crea tu cuenta de paciente de forma gratuita llenando tus datos
              básicos y clínicos.
            </p>
          </div>

          {/* Paso 2 */}
          <div className="step-card">
            <div className="step-number">2</div>
            <h3>Agenda tu Cita</h3>
            <p>
              Elige tu médico de preferencia, selecciona la fecha y hora que más
              te convenga.
            </p>
          </div>

          {/* Paso 3 */}
          <div className="step-card">
            <div className="step-number">3</div>
            <h3>Consulta</h3>
            <p>
              Asiste a tu cita presencial o virtual y recibe tu diagnóstico y
              tratamiento al instante.
            </p>
          </div>
        </div>
      </section>

      {/* --- Sección de CTA Final (MEJORADA) --- */}
      <section className="final-cta">
        <div className="cta-content">
          <h2>¿Listo para cuidar tu salud?</h2>
          <p>
            Únete a miles de pacientes que ya gestionan su bienestar de forma
            inteligente con Aphonline.
          </p>
          <Link to="/registro-paciente" className="btn btn-large">
            Comienza Ahora
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Inicio;
