import React from "react";
import { Link } from "react-router-dom";
import "./inicio.css";

const Inicio = () => {
  return (
    <div className="inicio-container">
      {/* --- Sección Hero (Principal) --- */}
      <header className="hero-section">
        <div className="hero-content">
          <h1>Bienvenido a Aphonline</h1>
          <p className="subtitle">Tu salud, a un clic de distancia.</p>
          <p>
            Gestiona tus consultas médicas, accede a tu historial clínico y
            recibe recetas de forma digital. Fácil, rápido y seguro.
          </p>
          <div className="hero-cta">
            <Link to="/registro-paciente" className="btn btn-primary">
              Crear Cuenta
            </Link>
            <Link to="/acerca-de" className="btn btn-secondary">
              Conoce Más
            </Link>
          </div>
        </div>
      </header>

      {/* --- Sección de Características --- */}
      <section className="features-section">
        <h2>¿Qué te ofrecemos?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <span className="feature-icon">📅</span>
            <h3>Agenda de Citas Fácil</h3>
            <p>
              Busca médicos por especialidad y agenda tu consulta online en
              minutos.
            </p>
          </div>

          <div className="feature-card">
            <span className="feature-icon">🩺</span>
            <h3>Historial Clínico Digital</h3>
            <p>
              Accede a tu historial médico completo y resultados de exámenes en
              un solo lugar seguro.
            </p>
          </div>

          <div className="feature-card">
            <span className="feature-icon">📄</span>
            <h3>Recetas Médicas Online</h3>
            <p>
              Recibe tus recetas directamente en la plataforma, válidas y listas
              para usar.
            </p>
          </div>
        </div>
      </section>

      {/* --- Sección "Cómo Funciona" --- */}
      <section className="how-it-works">
        <h2>¿Cómo funciona?</h2>
        <ol className="steps-list">
          <li>
            <strong>1. Regístrate:</strong> Crea tu cuenta de paciente de forma
            gratuita.
          </li>
          <li>
            <strong>2. Agenda tu Cita:</strong> Elige tu médico, la fecha y la
            hora.
          </li>
          <li>
            <strong>3. Consulta:</strong> Conéctate con tu especialista desde la
            comodidad de tu hogar.
          </li>
        </ol>
      </section>

      {/* --- Sección de CTA Final --- */}
      <section className="final-cta">
        <h2>¿Listo para cuidar tu salud?</h2>
        <p>Únete a miles de pacientes que ya gestionan su salud en línea.</p>
        <Link to="/registro-paciente" className="btn btn-primary btn-large">
          Comienza Ahora
        </Link>
      </section>
    </div>
  );
};

export default Inicio;
