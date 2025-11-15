import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import './dashboardMedico.css'; // CSS abajo

const DashboardMedico = () => {
  const { usuario } = useAuth();

  return (
    <div className="medico-wrapper">
      <header className="medico-header">
        <h1>👨‍⚕️ Consultorio Virtual</h1>
        <p>Bienvenido, Dr. {usuario?.nombre} {usuario?.apellido}</p>
      </header>

      <div className="medico-grid">
        {/* Tarjeta de Resumen */}
        <div className="medico-card">
          <h3>📅 Agenda de Hoy</h3>
          <p className="empty-msg">No hay citas programadas para hoy.</p>
          <Link to="/agenda-medico" className="btn-action">Ver Agenda Completa</Link>
        </div>

        {/* Tarjeta de Pacientes */}
        <div className="medico-card">
          <h3>👥 Gestión de Pacientes</h3>
          <p>Busca historias clínicas y registra atenciones.</p>
          <Link to="/pacientes-medico" className="btn-action">Buscar Paciente</Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardMedico;