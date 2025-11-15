import React, { useState, useEffect, useCallback } from 'react'; // Añadí useCallback
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import './agendaMedico.css';

const AgendaMedico = () => {
  const { token, usuario } = useAuth();
  const [citas, setCitas] = useState([]);
  // Quitamos 'cargando' si no lo estabas usando en el return, 
  // o lo usamos correctamente abajo. Aquí lo dejo para usarlo.
  const [cargando, setCargando] = useState(true); 
  
  const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date());

  // Usamos useCallback para que useEffect no se queje
  const cargarAgenda = useCallback(async () => {
    try {
      const config = { headers: { Authorization: token } };
      const { data } = await api.get('/citas/medico', config);
      setCitas(data);
    } catch (error) {
      console.error("Error cargando agenda", error);
    } finally {
      setCargando(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) cargarAgenda();
  }, [token, cargarAgenda]); // Añadimos las dependencias

  const handleAtender = async (id) => {
    if (!window.confirm("¿Finalizar consulta?")) return;
    try {
      const config = { headers: { Authorization: token } };
      await api.put(`/citas/atender/${id}`, {}, config);
      alert("Consulta finalizada.");
      cargarAgenda();
    } catch (error) {
      alert("Error al actualizar estado.");
    }
  };

  // --- LÓGICA DEL CALENDARIO ---
  const citasDelDia = citas.filter(cita => {
    const fechaCita = new Date(cita.fecha).toDateString();
    const fechaCal = fechaSeleccionada.toDateString();
    return fechaCita === fechaCal && cita.estado === 'Pendiente';
  });

  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const hayCitas = citas.some(cita => 
        new Date(cita.fecha).toDateString() === date.toDateString() && 
        cita.estado === 'Pendiente'
      );
      return hayCitas ? <div className="dot-indicator"></div> : null;
    }
  };

  const formatearFecha = (fecha) => new Date(fecha).toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <div className="agenda-wrapper">
      <header className="agenda-header">
        <h1>📅 Agenda Médica</h1>
        <p>Dr. {usuario?.nombre} {usuario?.apellido}</p>
      </header>

      <div className="agenda-grid-layout">
        
        <aside className="calendar-section">
          <div className="calendar-card">
            <Calendar 
              onChange={setFechaSeleccionada} 
              value={fechaSeleccionada}
              tileContent={tileContent}
              className="custom-calendar"
            />
          </div>
          <div className="calendar-legend">
            <span className="dot-legend"></span> Días con citas pendientes
          </div>
        </aside>

        <section className="agenda-list-section">
          <h2 className="titulo-dia">
            Pacientes para el: <span>{formatearFecha(fechaSeleccionada)}</span>
          </h2>
          
          {/* Usamos la variable 'cargando' para mostrar algo mientras carga */}
          {cargando ? <p className="text-center">Cargando agenda...</p> : citasDelDia.length === 0 ? (
            <div className="empty-day">
              <p>No hay citas programadas para este día.</p>
            </div>
          ) : (
            <div className="citas-list">
              {citasDelDia.map(cita => (
                <div key={cita._id} className="cita-medico-card pending">
                  <div className="cita-time">
                    <span className="hora">{cita.hora}</span>
                  </div>
                  
                  <div className="cita-info">
                    <h3>{cita.pacienteId?.nombre} {cita.pacienteId?.apellido}</h3>
                    <p className="doc-id">Doc: {cita.pacienteId?.documento}</p>
                    <p className="motivo">"{cita.motivo}"</p>
                    <span className={`modalidad-badge ${cita.tipo === 'Virtual' ? 'virtual' : ''}`}>
                      {cita.tipo}
                    </span>
                  </div>

                  <div className="cita-actions">
                    <button className="btn-atender" onClick={() => handleAtender(cita._id)}>
                      ✅ Atender
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

      </div>
    </div>
  );
};

export default AgendaMedico;