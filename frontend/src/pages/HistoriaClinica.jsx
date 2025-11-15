import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import './historiaClinica.css'; // CSS abajo

const HistoriaClinica = () => {
  const { token } = useAuth();
  const [historia, setHistoria] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHistoria = async () => {
      try {
        const config = { headers: { Authorization: token } };
        const { data } = await api.get('/historias', config);
        setHistoria(data);
      } catch (err) {
        console.error(err);
        // Si es 404 es que no tiene historia creada aún
        if (err.response && err.response.status === 404) {
            setError("Aún no tienes una historia clínica registrada en el sistema.");
        } else {
            setError("Error al cargar la información.");
        }
      } finally {
        setCargando(false);
      }
    };

    if (token) fetchHistoria();
  }, [token]);

  if (cargando) return <div className="loading-msg">Cargando expediente...</div>;
  if (error) return <div className="error-msg">{error}</div>;
  if (!historia) return null;

  return (
    <div className="historia-wrapper">
      <div className="historia-container">
        <header className="historia-header">
          <h1>🩺 Historia Clínica</h1>
          <p>Expediente Médico Digital</p>
        </header>

        <div className="historia-grid">
          
          {/* --- SECCIÓN 1: ANTECEDENTES --- */}
          <div className="historia-card full-width">
            <h3>Antecedentes Familiares y Personales</h3>
            <p className="texto-antecedentes">{historia.antecedentes}</p>
          </div>

          {/* --- SECCIÓN 2: DETALLES CLÍNICOS --- */}
          <div className="historia-card">
            <h3>🦠 Enfermedades Actuales</h3>
            {historia.enfermedadesActuales.length > 0 ? (
              <ul className="lista-medica">
                {historia.enfermedadesActuales.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            ) : <p className="text-muted">Ninguna registrada.</p>}
          </div>

          <div className="historia-card">
            <h3>💊 Medicamentos en Uso</h3>
            {historia.medicamentosActuales.length > 0 ? (
              <ul className="lista-medica">
                {historia.medicamentosActuales.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            ) : <p className="text-muted">Ninguno registrado.</p>}
          </div>

          <div className="historia-card">
            <h3>🔪 Cirugías Previas</h3>
            {historia.cirugias.length > 0 ? (
              <ul className="lista-medica">
                {historia.cirugias.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            ) : <p className="text-muted">Ninguna registrada.</p>}
          </div>

          {/* --- SECCIÓN 3: HISTORIAL DE CITAS (Relacionado por ID) --- */}
          <div className="historia-card full-width">
            <h3>📅 Historial de Consultas</h3>
            {historia.historiaCitas && historia.historiaCitas.length > 0 ? (
              <table className="tabla-historia">
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Médico</th>
                    <th>Motivo</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {historia.historiaCitas.map(cita => (
                    <tr key={cita._id}>
                      <td>{new Date(cita.fecha).toLocaleDateString()}</td>
                      <td>Dr. {cita.medicoId?.nombre} {cita.medicoId?.apellido}</td>
                      <td>{cita.motivo}</td>
                      <td>{cita.estado}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-muted">No hay consultas previas vinculadas a este expediente.</p>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default HistoriaClinica;