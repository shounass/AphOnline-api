import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import './misExamenes.css'; // CSS abajo

const MisExamenes = () => {
  const { token } = useAuth();
  const [examenes, setExamenes] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarExamenes = async () => {
      try {
        const config = { headers: { Authorization: token } };
        const { data } = await api.get('/examenes', config);
        setExamenes(data);
      } catch (error) {
        console.error("Error cargando exámenes", error);
      } finally {
        setCargando(false);
      }
    };
    if (token) cargarExamenes();
  }, [token]);

  const formatearFecha = (fecha) => new Date(fecha).toLocaleDateString('es-CO', { year: 'numeric', month: 'short', day: 'numeric' });

  const verResultado = (estado) => {
    if (estado === 'Disponible') {
      alert("Abriendo archivo PDF del resultado... 📄");
    } else {
      alert("Este resultado aún está en proceso. Vuelve más tarde. ⏳");
    }
  };

  return (
    <div className="examenes-wrapper">
      <header className="examenes-header">
        <h1>🔬 Resultados de Exámenes</h1>
        <p>Historial de laboratorio e imágenes diagnósticas.</p>
      </header>

      <div className="examenes-container">
        {cargando ? <p className="text-center">Cargando resultados...</p> : examenes.length === 0 ? (
          <div className="empty-state">No tienes exámenes registrados.</div>
        ) : (
          <div className="examenes-list">
            {examenes.map((examen) => (
              <div key={examen._id} className="examen-row">
                
                {/* Icono según tipo */}
                <div className={`examen-icon ${examen.tipo === 'Laboratorio' ? 'lab' : 'img'}`}>
                  {examen.tipo === 'Laboratorio' ? '🩸' : '🩻'}
                </div>

                <div className="examen-info">
                  <h3>{examen.nombre}</h3>
                  <p className="examen-meta">
                    {examen.tipo} • {formatearFecha(examen.fechaRealizacion)}
                  </p>
                  <p className="examen-doctor">Ordenado por: Dr. {examen.medicoId?.nombre} {examen.medicoId?.apellido}</p>
                  {examen.observaciones && <small className="examen-obs">"{examen.observaciones}"</small>}
                </div>

                <div className="examen-status">
                  <span className={`status-pill ${examen.estado.toLowerCase()}`}>
                    {examen.estado}
                  </span>
                  <button 
                    onClick={() => verResultado(examen.estado)} 
                    className={`btn-ver ${examen.estado === 'Pendiente' ? 'disabled' : ''}`}
                  >
                    {examen.estado === 'Disponible' ? 'Ver Resultado' : 'En Proceso'}
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MisExamenes;