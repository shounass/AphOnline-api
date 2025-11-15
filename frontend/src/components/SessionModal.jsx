import React from 'react';
import { useAuth } from '../context/AuthContext';
import './SessionModal.css'; // CSS abajo

const SessionModal = () => {
  const { mostrarAlertaSesion, extenderSesion, logout, usuario } = useAuth();

  // Si el estado es falso, no renderizamos nada (oculto)
  if (!mostrarAlertaSesion || !usuario) return null;
  return (
    <div className="session-modal-overlay">
      <div className="session-modal-content">
        <div className="session-icon">⏳</div>
        <h3>Tu sesión está por expirar</h3>
        <p>Por seguridad, cerraremos tu sesión en unos minutos debido a la inactividad.</p>
        <p>¿Deseas continuar conectado?</p>
        
        <div className="session-actions">
          <button onClick={logout} className="btn-cerrar">
            Cerrar Sesión Ahora
          </button>
          <button onClick={extenderSesion} className="btn-extender">
            Extender Sesión
          </button>
        </div>
      </div>
    </div>
  );
};

export default SessionModal;