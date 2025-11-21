import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import "./Notificaciones.css";

const Notificaciones = () => {
  const { token, usuario } = useAuth();
  const navigate = useNavigate();
  const [notificaciones, setNotificaciones] = useState([]);
  const [abierto, setAbierto] = useState(false);

  // Tiempo de expiración: 15 minutos (en milisegundos)
  const TIEMPO_EXPIRACION = 15 * 60 * 1000;

  // --- CARGAR Y FILTRAR ---
  const cargarNotificaciones = async () => {
    try {
      const config = { headers: { Authorization: token } };
      let rawData = [];

      // 1. Obtener datos crudos del backend
      if (usuario.rol === "paciente") {
        const { data } = await api.get("/citas", config);
        // Paciente ve: Confirmadas o Propuestas
        rawData = data.filter(
          (c) => c.estado === "Confirmada" || c.estado === "Propuesta"
        );
      } else {
        const { data } = await api.get("/citas/medico", config);
        // Médico ve: Pendientes
        rawData = data.filter((c) => c.estado === "Pendiente");
      }

      // 2. FILTRO DE TIEMPO (Lógica de los 15 minutos)
      const leidasStorage =
        JSON.parse(localStorage.getItem("notificaciones_leidas")) || {};
      const ahora = Date.now();

      const filtradas = rawData.filter((item) => {
        const key = `${item._id}-${item.estado}`; // Clave única por cita y estado
        const fechaLectura = leidasStorage[key];

        // Si nunca se ha leído, mostrarla
        if (!fechaLectura) return true;

        // Si se leyó, verificar si ya pasaron 15 minutos
        const tiempoTranscurrido = ahora - fechaLectura;

        // Si pasó menos de 15 mins, SE MUESTRA. Si pasó más, SE OCULTA.
        return tiempoTranscurrido < TIEMPO_EXPIRACION;
      });

      setNotificaciones(filtradas);
    } catch (error) {
      console.error(error);
    }
  };

  // Polling cada 30 segundos
  useEffect(() => {
    if (token) cargarNotificaciones();
    const intervalo = setInterval(cargarNotificaciones, 30000);
    return () => clearInterval(intervalo);
  }, [token, usuario.rol]);

  // --- MANEJAR CLIC (MARCAR COMO LEÍDA) ---
  const handleNotificacionClick = (cita) => {
    setAbierto(false);

    // 1. Guardar marca de tiempo en LocalStorage
    const leidasStorage =
      JSON.parse(localStorage.getItem("notificaciones_leidas")) || {};
    const key = `${cita._id}-${cita.estado}`; // Usamos estado para que si cambia, vuelva a salir

    // Solo guardamos la fecha si es la primera vez que se clickea
    if (!leidasStorage[key]) {
      leidasStorage[key] = Date.now();
      localStorage.setItem(
        "notificaciones_leidas",
        JSON.stringify(leidasStorage)
      );
    }

    // 2. Redirigir
    if (usuario.rol === "medico") {
      navigate("/agenda-medico");
    } else {
      navigate("/citas");
    }

    // Recargar para aplicar cambios visuales (opcional, el polling lo hará luego)
    cargarNotificaciones();
  };

  return (
    <div className="notificacion-wrapper">
      <div className="campana-icon" onClick={() => setAbierto(!abierto)}>
        🔔
        {notificaciones.length > 0 && (
          <span className="badge-count">{notificaciones.length}</span>
        )}
      </div>

      {abierto && (
        <div className="dropdown-notificaciones">
          <h4>Notificaciones</h4>
          {notificaciones.length === 0 ? (
            <p className="no-notif">Sin novedades.</p>
          ) : (
            <ul>
              {notificaciones.map((n) => (
                <li
                  key={n._id}
                  className="notif-item"
                  onClick={() => handleNotificacionClick(n)}
                >
                  {usuario.rol === "paciente"
                    ? n.estado === "Confirmada"
                      ? `✅ Tu cita del ${new Date(
                          n.fecha
                        ).toLocaleDateString()} fue confirmada.`
                      : `⚠️ El médico propone un cambio para tu cita.`
                    : `📅 Solicitud pendiente: ${
                        n.pacienteId?.nombre || "Paciente"
                      } solicita cita.`}

                  <span className="click-hint">Ver detalles &rarr;</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default Notificaciones;
