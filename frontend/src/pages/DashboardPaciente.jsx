import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import './dashboardPaciente.css';

const DashboardPaciente = () => {
  const { token } = useAuth();
  
  // --- ESTADOS PARA DATOS REALES ---
  const [perfil, setPerfil] = useState(null);
  const [citas, setCitas] = useState([]);
  const [recetas, setRecetas] = useState([]);
  const [historial, setHistorial] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarTodo = async () => {
      try {
        const config = { headers: { Authorization: token } };

        // Usamos Promise.all para cargar todo en paralelo (es más rápido)
        const [resPerfil, resCitas, resRecetas] = await Promise.all([
          api.get('/pacientes/perfil', config),
          api.get('/citas', config),
          api.get('/recetas', config)
        ]);

        setPerfil(resPerfil.data);
        
        // Filtramos citas
        const todasLasCitas = resCitas.data;
        setCitas(todasLasCitas.filter(c => c.estado === 'Pendiente'));

        // Recetas
        setRecetas(resRecetas.data);

        // Intentamos cargar la historia (puede fallar si es nuevo y no tiene)
        try {
          const resHistoria = await api.get('/historias', config);
          // Tomamos las últimas 3 citas del historial
          setHistorial(resHistoria.data.historiaCitas.slice(0, 3));
        } catch (err) {
          console.log("El paciente aún no tiene historia clínica creada.");
          setHistorial([]);
        }

      } catch (error) {
        console.error("Error cargando dashboard:", error);
      } finally {
        setCargando(false);
      }
    };

    if (token) cargarTodo();
  }, [token]);

  // --- UTILS ---
  const formatearFecha = (fecha) => new Date(fecha).toLocaleDateString('es-CO', { day: 'numeric', month: 'short' });
  
  // Calculamos recetas activas
  const recetasActivas = recetas.filter(r => r.estado === 'Activa').length;

  // Obtenemos la próxima cita (la primera de la lista pendiente)
  const proximaCita = citas.length > 0 ? citas[0] : null;

  if (cargando) return <div className="dashboard-loading">Cargando tu información...</div>;

  return (
    <div className="dashboard-wrapper">
      
      {/* --- HEADER CON PERFIL REAL --- */}
      <div className="welcome-banner">
        <div className="welcome-info">
          <img 
            src={perfil?.foto || "https://via.placeholder.com/150"} 
            alt="Avatar" 
            className="dashboard-avatar"
          />
          <div>
            <h1>Hola, {perfil?.nombre} 👋</h1>
            <p>{perfil?.biografia || "Bienvenido a tu portal de salud."}</p>
          </div>
        </div>
        
        <div className="quick-stats">
          <div className="stat-card">
            <span className="stat-number">{citas.length}</span>
            <span className="stat-label">Citas Pendientes</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{recetasActivas}</span>
            <span className="stat-label">Recetas Activas</span>
          </div>
        </div>
      </div>

      <div className="dashboard-overview-grid">

        {/* --- COLUMNA 1: PRÓXIMA CITA --- */}
        <section className="panel-section">
          <div className="section-header">
            <h2>📅 Tu Próxima Cita</h2>
            <Link to="/agendar-cita" className="btn-mini">+ Agendar</Link>
          </div>
          
          <div className="section-body">
            {proximaCita ? (
              <div className="next-appointment-card">
                <div className="date-big">
                  <span>{new Date(proximaCita.fecha).getDate()}</span>
                  <small>{new Date(proximaCita.fecha).toLocaleDateString('es-CO', {month:'short'}).toUpperCase()}</small>
                </div>
                <div className="info-big">
                  <h3>Dr. {proximaCita.medicoId?.nombre} {proximaCita.medicoId?.apellido}</h3>
                  <p className="esp">{proximaCita.medicoId?.especialidad}</p>
                  <p className="hora">⏰ {proximaCita.hora} • {proximaCita.tipo}</p>
                </div>
              </div>
            ) : (
              <div className="empty-state">
                <p>No tienes citas programadas.</p>
                <Link to="/agendar-cita" className="btn btn-outline">Agendar Ahora</Link>
              </div>
            )}
          </div>
        </section>

        {/* --- COLUMNA 2: ÚLTIMAS RECETAS --- */}
        <section className="panel-section">
          <div className="section-header">
            <h2>💊 Últimas Recetas</h2>
            <Link to="/recetas" className="link-ver-todo">Ver todas</Link>
          </div>
          <div className="section-body">
            {recetas.length === 0 ? (
              <p className="text-muted">No hay recetas registradas.</p>
            ) : (
              <div className="list-container">
                {recetas.slice(0, 2).map(receta => ( // Solo mostramos las 2 últimas
                  <div key={receta._id} className="list-item receta-item">
                    <div className="icon-box">💊</div>
                    <div className="info-box">
                      {/* Mostramos el primer medicamento de la receta */}
                      <h4>{receta.medicamentos[0]?.nombre}</h4>
                      <p>{receta.medicamentos[0]?.dosis}</p>
                      <small>Dr. {receta.medicoId?.nombre}</small>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* --- COLUMNA 3 (Abajo): HISTORIAL RECIENTE --- */}
        <section className="panel-section full-width">
          <div className="section-header">
            <h2>📋 Historial Reciente</h2>
            <Link to="/historia-clinica" className="link-ver-todo">Ver historial completo</Link>
          </div>
          <div className="section-body">
             {historial.length === 0 ? (
               <p className="text-muted text-center">No hay atenciones pasadas para mostrar.</p>
             ) : (
               <table className="simple-table">
                 <thead>
                   <tr>
                     <th>Fecha</th>
                     <th>Médico</th>
                     <th>Motivo</th>
                     <th>Estado</th>
                   </tr>
                 </thead>
                 <tbody>
                   {historial.map(cita => (
                     <tr key={cita._id}>
                       <td>{formatearFecha(cita.fecha)}</td>
                       <td>Dr. {cita.medicoId?.nombre} {cita.medicoId?.apellido}</td>
                       <td>{cita.motivo}</td>
                       <td><span className={`badge ${cita.estado.toLowerCase()}`}>{cita.estado}</span></td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             )}
          </div>
        </section>

      </div>
    </div>
  );
};

export default DashboardPaciente;