import React, { useState } from 'react';
import './pqrs.css'; // Crearemos este archivo de estilos

const PQRS = () => {
  const [formData, setFormData] = useState({
    tipo: 'peticion',
    nombre: '',
    email: '',
    telefono: '',
    mensaje: ''
  });
  
  const [mensajeEnviado, setMensajeEnviado] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // --- Lógica de envío (simulada por ahora) ---
    // En el futuro, aquí llamarías a tu API:
    // await api.post('/pqrs', formData);
    
    console.log("Datos del formulario PQRS:", formData);
    
    // Mostramos un mensaje de éxito en la página
    setMensajeEnviado(true);
    
    // Opcional: Limpiar el formulario después de enviar
    setFormData({
      tipo: 'peticion',
      nombre: '',
      email: '',
      telefono: '',
      mensaje: ''
    });
  };

  return (
    <div className="pqrs-page">
      
      {/* --- Encabezado --- */}
      <section className="pqrs-hero">
        <div className="pqrs-hero-content">
          <h1>Contáctanos</h1>
          <p>Tu opinión es muy importante para nosotros. Usa este formulario para tus peticiones, quejas, reclamos o sugerencias.</p>
        </div>
      </section>

      {/* --- Formulario --- */}
      <section className="pqrs-form-container">
        
        {/* Mostramos el mensaje de éxito aquí */}
        {mensajeEnviado ? (
          <div className="pqrs-success-message">
            <h3>¡Gracias por tu mensaje!</h3>
            <p>Hemos recibido tu solicitud y te contactaremos pronto.</p>
          </div>
        ) : (
          // Si no se ha enviado, mostramos el formulario
          <form onSubmit={handleSubmit} className="pqrs-form">
            <h2>Formulario de PQRS</h2>

            <div className="form-group">
              <label htmlFor="tipo">Tipo de Solicitud</label>
              <select 
                id="tipo" 
                name="tipo" 
                value={formData.tipo} 
                onChange={handleChange}
                required
              >
                <option value="peticion">Petición</option>
                <option value="queja">Queja</option>
                <option value="reclamo">Reclamo</option>
                <option value="sugerencia">Sugerencia</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="nombre">Nombre Completo</label>
              <input 
                type="text" 
                id="nombre" 
                name="nombre" 
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Tu nombre completo" 
                required 
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Correo Electrónico</label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                value={formData.email}
                onChange={handleChange}
                placeholder="tu@correo.com" 
                required 
              />
            </div>

            <div className="form-group">
              <label htmlFor="telefono">Teléfono (Opcional)</label>
              <input 
                type="tel" 
                id="telefono" 
                name="telefono" 
                value={formData.telefono}
                onChange={handleChange}
                placeholder="300 123 4567" 
              />
            </div>

            <div className="form-group">
              <label htmlFor="mensaje">Mensaje</label>
              <textarea 
                id="mensaje" 
                name="mensaje" 
                value={formData.mensaje}
                onChange={handleChange}
                rows="6" 
                placeholder="Escribe tu mensaje aquí..." 
                required
              ></textarea>
            </div>

            <button type="submit" className="btn btn-primary pqrs-submit-btn">
              Enviar Solicitud
            </button>
            
          </form>
        )}
      </section>
      
    </div>
  );
};

export default PQRS;