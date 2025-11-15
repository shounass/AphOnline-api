import React, { useState } from 'react';
import './contacto.css'; // Crearemos este archivo de estilos

const Contacto = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    asunto: '',
    mensaje: ''
  });
  
  const [mensajeEnviado, setMensajeEnviado] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulación de envío
    console.log("Datos del formulario de Contacto:", formData);
    setMensajeEnviado(true);
    setFormData({ nombre: '', email: '', asunto: '', mensaje: '' });
  };

  return (
    <div className="contact-page">
      
      {/* --- Encabezado --- */}
      <section className="contact-hero">
        <div className="contact-hero-content">
          <h1>Ponte en Contacto</h1>
          <p>Estamos aquí para ayudarte. Resuelve tus dudas o agenda una demostración de nuestra plataforma.</p>
        </div>
      </section>

      {/* --- Contenedor Principal (Info + Form) --- */}
      <section className="contact-main-content">
        <div className="contact-grid-container">
          
          {/* --- Columna de Información --- */}
          <div className="contact-info">
            <h2>Información de Contacto</h2>
            <p>Puedes encontrarnos en nuestra oficina o contactarnos por nuestros canales digitales.</p>
            
            <div className="info-item">
              <span className="info-icon">📍</span>
              <div>
                <strong>Dirección:</strong>
                <p>Calle Ficticia #12-34, Oficina 101<br/>Yarumal, Antioquia, Colombia</p>
              </div>
            </div>
            
            <div className="info-item">
              <span className="info-icon">📧</span>
              <div>
                <strong>Email:</strong>
                <p>info@aphonline.com</p>
              </div>
            </div>
            
            <div className="info-item">
              <span className="info-icon">📞</span>
              <div>
                <strong>Teléfono:</strong>
                <p>+57 300 123 4567</p>
              </div>
            </div>

            {/* Placeholder para el Mapa */}
            <div className="map-placeholder">
              
              <p>(Aquí iría un mapa incrustado de Google Maps)</p>
            </div>
          </div>
          
          {/* --- Columna del Formulario --- */}
          <div className="contact-form-wrapper">
            {mensajeEnviado ? (
              <div className="contact-success-message">
                <h3>¡Mensaje Recibido!</h3>
                <p>Gracias por contactarnos. Te responderemos lo antes posible.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-group">
                  <label htmlFor="nombre">Nombre</label>
                  <input type="text" id="nombre" name="nombre" value={formData.nombre} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label htmlFor="asunto">Asunto</label>
                  <input type="text" id="asunto" name="asunto" value={formData.asunto} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label htmlFor="mensaje">Mensaje</label>
                  <textarea id="mensaje" name="mensaje" rows="5" value={formData.mensaje} onChange={handleChange} required></textarea>
                </div>
                <button type="submit" className="btn btn-primary contact-submit-btn">
                  Enviar Mensaje
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

    </div>
  );
};

export default Contacto;