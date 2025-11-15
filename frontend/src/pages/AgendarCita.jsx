import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import './agendarCita.css'; // CSS que crearemos abajo

const AgendarCita = () => {
  const navigate = useNavigate();
  const { token } = useAuth(); // Necesitamos el token para pedir permiso

  // Estados
  const [medicos, setMedicos] = useState([]);
  const [formData, setFormData] = useState({
    medicoId: '',
    fecha: '',
    hora: '',
    motivo: '',
    tipo: 'Presencial' // Valor por defecto
  });
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' }); // Para éxito o error

  // 1. Cargar la lista de médicos al entrar a la página
  useEffect(() => {
    const cargarMedicos = async () => {
      try {
        const { data } = await api.get('/medicos');
        setMedicos(data);
      } catch (error) {
        console.error("Error cargando médicos", error);
      }
    };
    cargarMedicos();
  }, []);

  // Manejar cambios en los inputs
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 2. Enviar el formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!token) {
      alert("No estás autenticado. Por favor inicia sesión.");
      return;
    }

    try {
      // OJO: Enviamos el token en los 'headers' para que el middleware 'auth' nos deje pasar
      const config = {
        headers: { Authorization: token }
      };

      await api.post('/citas', formData, config);

      setMensaje({ texto: '¡Cita agendada con éxito!', tipo: 'exito' });
      
      // Redirigir al dashboard después de 2 segundos
      setTimeout(() => {
        navigate('/dashboard-paciente');
      }, 2000);

    } catch (error) {
      setMensaje({ texto: 'Error al agendar la cita. Intenta nuevamente.', tipo: 'error' });
      console.error(error);
    }
  };

  return (
    <div className="agendar-wrapper">
      <div className="agendar-card">
        <h2>🗓️ Agendar Nueva Cita</h2>

        {mensaje.texto && (
          <div className={`mensaje-alerta ${mensaje.tipo}`}>
            {mensaje.texto}
          </div>
        )}

        <form onSubmit={handleSubmit} className="agendar-form">
          
          {/* Selección de Médico */}
          <div className="form-group">
            <label>Selecciona tu Médico</label>
            <select name="medicoId" value={formData.medicoId} onChange={handleChange} required>
              <option value="">-- Elige un doctor --</option>
              {medicos.map((medico) => (
                <option key={medico._id} value={medico._id}>
                  Dr. {medico.nombre} {medico.apellido} ({medico.especialidad})
                </option>
              ))}
            </select>
          </div>

          {/* Fecha y Hora */}
          <div className="form-row">
            <div className="form-group">
              <label>Fecha</label>
              <input 
                type="date" 
                name="fecha" 
                value={formData.fecha} 
                onChange={handleChange} 
                required 
              />
            </div>
            <div className="form-group">
              <label>Hora</label>
              <input 
                type="time" 
                name="hora" 
                value={formData.hora} 
                onChange={handleChange} 
                required 
              />
            </div>
          </div>

          {/* Tipo de Cita */}
          <div className="form-group">
            <label>Modalidad</label>
            <select name="tipo" value={formData.tipo} onChange={handleChange}>
              <option value="Presencial">Presencial (Consultorio)</option>
              <option value="Virtual">Virtual (Videollamada)</option>
            </select>
          </div>

          {/* Motivo */}
          <div className="form-group">
            <label>Motivo de la consulta</label>
            <textarea 
              name="motivo" 
              rows="3" 
              placeholder="Ej: Dolor de cabeza constante..." 
              value={formData.motivo} 
              onChange={handleChange} 
              required
            ></textarea>
          </div>

          <button type="submit" className="btn-agendar">Confirmar Cita</button>
          
        </form>
      </div>
    </div>
  );
};

export default AgendarCita;