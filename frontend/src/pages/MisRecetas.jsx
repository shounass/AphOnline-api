import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import './misRecetas.css'; // CSS abajo

const MisRecetas = () => {
  const { token } = useAuth();
  const [recetas, setRecetas] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarRecetas = async () => {
      try {
        const config = { headers: { Authorization: token } };
        const { data } = await api.get('/recetas', config);
        setRecetas(data);
      } catch (error) {
        console.error("Error cargando recetas", error);
      } finally {
        setCargando(false);
      }
    };

    if (token) cargarRecetas();
  }, [token]);

  const formatearFecha = (fecha) => new Date(fecha).toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' });

  // Simulación de descarga PDF
  const descargarPDF = () => {
    alert("Simulando descarga de PDF... 📄");
  };

  return (
    <div className="recetas-wrapper">
      <div className="recetas-container">
        <header className="recetas-header">
          <h1>💊 Mis Recetas</h1>
          <p>Consulta tus prescripciones médicas vigentes e históricas.</p>
        </header>

        {cargando ? <p className="text-center">Cargando recetas...</p> : recetas.length === 0 ? (
          <div className="empty-state">
            <p>No tienes recetas registradas en el sistema.</p>
          </div>
        ) : (
          <div className="recetas-grid">
            {recetas.map((receta) => (
              <div key={receta._id} className={`receta-card ${receta.estado === 'Vencida' ? 'vencida' : ''}`}>
                
                {/* Encabezado de la Tarjeta */}
                <div className="receta-top">
                  <div className="receta-fecha">
                    <small>Expedida el:</small>
                    <span>{formatearFecha(receta.fechaExpedicion)}</span>
                  </div>
                  <span className={`badge-estado ${receta.estado.toLowerCase()}`}>
                    {receta.estado}
                  </span>
                </div>

                {/* Info del Médico */}
                <div className="receta-medico">
                  <h4>Dr. {receta.medicoId?.nombre} {receta.medicoId?.apellido}</h4>
                  <span>{receta.medicoId?.especialidad}</span>
                </div>

                <hr className="divider" />

                {/* Lista de Medicamentos */}
                <div className="medicamentos-list">
                  <h5>Medicamentos:</h5>
                  {receta.medicamentos.map((med, index) => (
                    <div key={index} className="med-item">
                      <strong>{med.nombre} ({med.dosis})</strong>
                      <p>Duración: {med.duracion}</p>
                      <p className="indicaciones">📝 {med.indicaciones}</p>
                    </div>
                  ))}
                </div>

                {/* Pie de tarjeta */}
                <div className="receta-footer">
                  <small className="vence">Vence: {formatearFecha(receta.fechaVencimiento)}</small>
                  <button onClick={descargarPDF} className="btn-pdf">
                    ⬇ Descargar PDF
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

export default MisRecetas;