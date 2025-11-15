import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import './citasPaciente.css'; // CSS nuevo

const CitasPaciente = () => {
  const { token } = useAuth();
  
  // --- ESTADOS ---
  const [activeTab, setActiveTab] = useState('mis-citas'); // 'mis-citas' o 'agendar'
  const [citas, setCitas] = useState([]);
  const [medicos, setMedicos] = useState([]);
  const [cargando, setCargando] = useState(true);

  // Estado para Agendar Nueva
  const [formNueva, setFormNueva] = useState({ medicoId: '', fecha: '', hora: '', motivo: '', tipo: 'Presencial' });
  
  // Estado para Reprogramar
  const [citaEditando, setCitaEditando] = useState(null);
  const [formEdicion, setFormEdicion] = useState({ fecha: '', hora: '' });

  // Estados de Mensajes
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });

  // --- CARGAR DATOS INICIALES ---
  const cargarDatos = async () => {
    setCargando(true);
    try {
      const config = { headers: { Authorization: token } };
      
      // 1. Cargar Citas
      const { data: dataCitas } = await api.get('/citas', config);
      setCitas(dataCitas);

      // 2. Cargar Médicos (para el formulario)
      const { data: dataMedicos } = await api.get('/medicos');
      setMedicos(dataMedicos);

    } catch (error) {
      console.error("Error cargando datos:", error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    if (token) cargarDatos();
  }, [token]);

  // --- ACCIONES: AGENDAR ---
  const handleAgendar = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: token } };
      await api.post('/citas', formNueva, config);
      
      setMensaje({ texto: '¡Cita agendada exitosamente!', tipo: 'success' });
      setFormNueva({ medicoId: '', fecha: '', hora: '', motivo: '', tipo: 'Presencial' }); // Limpiar form
      cargarDatos(); // Recargar lista
      setActiveTab('mis-citas'); // Volver a la lista
      
    } catch (error) {
      setMensaje({ texto: 'Error al agendar la cita.', tipo: 'error' });
    }
  };

  // --- ACCIONES: CANCELAR ---
  const handleCancelar = async (id) => {
    if (!window.confirm("¿Estás seguro de cancelar esta cita?")) return;
    try {
      const config = { headers: { Authorization: token } };
      await api.put(`/citas/cancelar/${id}`, {}, config);
      alert("Cita cancelada.");
      cargarDatos();
    } catch (error) {
      alert("Error al cancelar.");
    }
  };

  // --- ACCIONES: REPROGRAMAR ---
  const abrirModalEdicion = (cita) => {
    setCitaEditando(cita);
    setFormEdicion({ fecha: cita.fecha.split('T')[0], hora: cita.hora });
  };

  const handleReprogramar = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: token } };
      await api.put(`/citas/reprogramar/${citaEditando._id}`, formEdicion, config);
      alert("Cita reprogramada.");
      setCitaEditando(null);
      cargarDatos();
    } catch (error) {
      alert("Error al reprogramar.");
    }
  };

  // --- UTILS ---
  const formatearFecha = (fecha) => new Date(fecha).toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  
  // Filtros
  const pendientes = citas.filter(c => c.estado === 'Pendiente');
  const historial = citas.filter(c => c.estado !== 'Pendiente');

  return (
    <div className="citas-page-wrapper">
      <div className="citas-container">
        
        <header className="citas-header">
          <h1>Gestión de Citas</h1>
          <p>Administra tus consultas médicas en un solo lugar.</p>
        </header>

        {/* --- PESTAÑAS DE NAVEGACIÓN --- */}
        <div className="tabs-header">
          <button 
            className={`tab-btn ${activeTab === 'mis-citas' ? 'active' : ''}`} 
            onClick={() => setActiveTab('mis-citas')}
          >
            📅 Mis Citas
          </button>
          <button 
            className={`tab-btn ${activeTab === 'agendar' ? 'active' : ''}`} 
            onClick={() => setActiveTab('agendar')}
          >
            ➕ Nueva Cita
          </button>
        </div>

        {/* --- CONTENIDO PESTAÑA 1: MIS CITAS --- */}
        {activeTab === 'mis-citas' && (
          <div className="tab-content animate-fade">
            
            {/* Sección Pendientes */}
            <section className="citas-section">
              <h3>📌 Próximas Citas</h3>
              {pendientes.length === 0 ? <p className="empty-msg">No tienes citas pendientes.</p> : (
                <div className="citas-grid">
                  {pendientes.map(cita => (
                    <div key={cita._id} className="cita-card pending-card">
                      <div className="card-top">
                        <span className="fecha-badge">{formatearFecha(cita.fecha)}</span>
                        <span className="hora-badge">{cita.hora}</span>
                      </div>
                      <div className="card-body">
                        <h4>Dr. {cita.medicoId?.nombre} {cita.medicoId?.apellido}</h4>
                        <p className="esp">{cita.medicoId?.especialidad}</p>
                        <p className="tipo">Modalidad: {cita.tipo}</p>
                        <p className="motivo">"{cita.motivo}"</p>
                      </div>
                      <div className="card-actions">
                        <button onClick={() => abrirModalEdicion(cita)} className="btn-edit">Reprogramar</button>
                        <button onClick={() => handleCancelar(cita._id)} className="btn-cancel">Cancelar</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Sección Historial */}
            <section className="citas-section">
              <h3>📂 Historial</h3>
              <table className="historial-table">
                <thead>
                  <tr><th>Fecha</th><th>Médico</th><th>Estado</th></tr>
                </thead>
                <tbody>
                  {historial.map(cita => (
                    <tr key={cita._id}>
                      <td>{formatearFecha(cita.fecha)}</td>
                      <td>{cita.medicoId?.nombre} {cita.medicoId?.apellido}</td>
                      <td><span className={`badge ${cita.estado.toLowerCase()}`}>{cita.estado}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          </div>
        )}

        {/* --- CONTENIDO PESTAÑA 2: AGENDAR NUEVA --- */}
        {activeTab === 'agendar' && (
          <div className="tab-content animate-fade">
            <form onSubmit={handleAgendar} className="form-agendar">
              <h3>Agendar Nueva Cita</h3>
              
              {mensaje.texto && <div className={`alert ${mensaje.tipo}`}>{mensaje.texto}</div>}

              <div className="form-group">
                <label>Selecciona Médico:</label>
                <select 
                  value={formNueva.medicoId} 
                  onChange={(e) => setFormNueva({...formNueva, medicoId: e.target.value})} 
                  required
                >
                  <option value="">-- Seleccione --</option>
                  {medicos.map(m => (
                    <option key={m._id} value={m._id}>Dr. {m.nombre} {m.apellido} - {m.especialidad}</option>
                  ))}
                </select>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Fecha:</label>
                  <input type="date" value={formNueva.fecha} onChange={(e) => setFormNueva({...formNueva, fecha: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Hora:</label>
                  <input type="time" value={formNueva.hora} onChange={(e) => setFormNueva({...formNueva, hora: e.target.value})} required />
                </div>
              </div>

              <div className="form-group">
                <label>Modalidad:</label>
                <select value={formNueva.tipo} onChange={(e) => setFormNueva({...formNueva, tipo: e.target.value})}>
                  <option>Presencial</option><option>Virtual</option>
                </select>
              </div>

              <div className="form-group">
                <label>Motivo:</label>
                <textarea rows="3" value={formNueva.motivo} onChange={(e) => setFormNueva({...formNueva, motivo: e.target.value})} required></textarea>
              </div>

              <button type="submit" className="btn-submit">Confirmar Cita</button>
            </form>
          </div>
        )}

      </div>

      {/* --- MODAL DE EDICIÓN --- */}
      {citaEditando && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Cambiar Fecha</h3>
            <p>Cita con Dr. {citaEditando.medicoId?.nombre}</p>
            <form onSubmit={handleReprogramar}>
              <input type="date" value={formEdicion.fecha} onChange={e => setFormEdicion({...formEdicion, fecha: e.target.value})} required />
              <input type="time" value={formEdicion.hora} onChange={e => setFormEdicion({...formEdicion, hora: e.target.value})} required />
              <div className="modal-btns">
                <button type="button" onClick={() => setCitaEditando(null)}>Cancelar</button>
                <button type="submit" className="btn-save">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default CitasPaciente;