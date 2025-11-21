import React, { useState, useEffect } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import "./citasPaciente.css";

const CitasPaciente = () => {
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState("mis-citas");
  const [citas, setCitas] = useState([]);
  const [medicos, setMedicos] = useState([]);

  // Estado del formulario
  const [formNueva, setFormNueva] = useState({
    medicoId: "",
    fecha: "",
    hora: "",
    motivo: "",
    tipo: "Presencial",
  });

  const [mensaje, setMensaje] = useState({ texto: "", tipo: "" });

  // --- HORARIOS MAESTROS (Base) ---
  const horasTotales = [
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
  ];

  const [horasLibres, setHorasLibres] = useState([]);
  const [cargandoHoras, setCargandoHoras] = useState(false);

  const fechaHoy = new Date().toISOString().split("T")[0];

  // 1. Cargar datos iniciales
  const cargarDatos = async () => {
    try {
      const config = { headers: { Authorization: token } };
      const { data: dataCitas } = await api.get("/citas", config);
      setCitas(dataCitas);
      const { data: dataMedicos } = await api.get("/medicos");
      setMedicos(dataMedicos);
    } catch (error) {
      console.error("Error", error);
    }
  };

  useEffect(() => {
    if (token) cargarDatos();
  }, [token]);

  // ============================================================
  // 2. EFECTO INTELIGENTE (FILTRO SÁBADOS + OCUPADOS)
  // ============================================================
  useEffect(() => {
    const consultarDisponibilidad = async () => {
      if (formNueva.medicoId && formNueva.fecha) {
        setCargandoHoras(true);
        setHorasLibres([]);

        try {
          const config = {
            headers: { Authorization: token },
            params: { medicoId: formNueva.medicoId, fecha: formNueva.fecha },
          };

          // Petición al backend (Nos dice qué horas están OCUPADAS)
          const { data } = await api.get("/citas/disponibilidad", config);

          if (data.bloqueado) {
            // Si el médico no trabaja ese día (ej. Domingo)
            setMensaje({ texto: `🚫 ${data.mensaje}`, tipo: "error" });
            setHorasLibres([]);
          } else {
            setMensaje({ texto: "", tipo: "" });

            // --- PASO 1: DEFINIR HORARIO BASE SEGÚN EL DÍA ---
            const diaSemana = new Date(formNueva.fecha).getUTCDay(); // 6 = Sábado
            let horasDelDia = [...horasTotales];

            // Si es Sábado (6), cortamos a las 12:00
            if (diaSemana === 6) {
              horasDelDia = horasDelDia.filter(
                (h) => parseInt(h.split(":")[0]) <= 12
              );
            }

            // --- PASO 2: QUITAR LAS OCUPADAS ---
            const disponibles = horasDelDia.filter(
              (hora) => !data.horasOcupadas.includes(hora)
            );

            setHorasLibres(disponibles);
          }

          // Resetear la hora seleccionada si ya no es válida
          setFormNueva((prev) => ({ ...prev, hora: "" }));
        } catch (error) {
          console.error("Error verificando horario", error);
        } finally {
          setCargandoHoras(false);
        }
      }
    };

    consultarDisponibilidad();
  }, [formNueva.medicoId, formNueva.fecha, token]);
  // ============================================================

  // --- ACCIONES ---
  const handleAgendar = async (e) => {
    e.preventDefault();
    setMensaje({ texto: "", tipo: "" });

    if (!formNueva.hora) {
      setMensaje({
        texto: "Por favor selecciona una hora válida.",
        tipo: "error",
      });
      return;
    }

    try {
      const config = { headers: { Authorization: token } };
      await api.post("/citas", formNueva, config);

      setMensaje({
        texto: "¡Solicitud enviada! Espera confirmación.",
        tipo: "success",
      });
      setFormNueva({
        medicoId: "",
        fecha: "",
        hora: "",
        motivo: "",
        tipo: "Presencial",
      });
      cargarDatos();
      setActiveTab("mis-citas");
    } catch (error) {
      const msgServidor = error.response?.data?.msg || "Error al agendar.";
      setMensaje({ texto: msgServidor, tipo: "error" });
    }
  };

  const handleAceptarPropuesta = async (id) => {
    try {
      const config = { headers: { Authorization: token } };
      await api.put(`/citas/aceptar-propuesta/${id}`, {}, config);
      alert("¡Nuevo horario confirmado!");
      setCitas([]);
      setTimeout(() => cargarDatos(), 100);
    } catch (error) {
      alert("Error al aceptar");
    }
  };

  const handleCancelar = async (id) => {
    if (!window.confirm("¿Seguro que deseas cancelar?")) return;
    try {
      const config = { headers: { Authorization: token } };
      await api.put(`/citas/cancelar/${id}`, {}, config);
      cargarDatos();
    } catch (error) {
      alert("Error al cancelar");
    }
  };

  const formatearFecha = (fechaString) => {
    if (!fechaString) return "--";
    const fecha = new Date(fechaString);
    const fechaUsuario = new Date(
      fecha.valueOf() + fecha.getTimezoneOffset() * 60000
    );
    return fechaUsuario.toLocaleDateString("es-CO", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
  };

  const pendientes = citas.filter((c) =>
    ["Pendiente", "Confirmada", "Propuesta"].includes(c.estado)
  );
  const historial = citas.filter((c) =>
    ["Cancelada", "Completada"].includes(c.estado)
  );

  return (
    <div className="citas-page-wrapper">
      <div className="citas-container">
        <header className="citas-header">
          <h1>Gestión de Citas</h1>
          <p>Administra tus consultas médicas.</p>
        </header>

        <div className="tabs-header">
          <button
            className={`tab-btn ${activeTab === "mis-citas" ? "active" : ""}`}
            onClick={() => setActiveTab("mis-citas")}
          >
            📅 Mis Citas
          </button>
          <button
            className={`tab-btn ${activeTab === "agendar" ? "active" : ""}`}
            onClick={() => setActiveTab("agendar")}
          >
            ➕ Nueva Cita
          </button>
        </div>

        {activeTab === "mis-citas" && (
          <div className="tab-content">
            <section className="citas-section">
              <h3>📌 Próximas Citas</h3>
              {pendientes.length === 0 ? (
                <p className="empty-msg">No tienes citas activas.</p>
              ) : (
                <div className="citas-grid">
                  {pendientes.map((cita) => (
                    <div
                      key={cita._id}
                      className={`cita-card ${cita.estado.toLowerCase()}`}
                    >
                      <div className="card-top">
                        <span className="fecha-badge">
                          {formatearFecha(cita.fecha)}
                        </span>
                        <span className="hora-badge">{cita.hora}</span>
                      </div>

                      <div className="card-body">
                        <h4>
                          Dr. {cita.medicoId?.nombre} {cita.medicoId?.apellido}
                        </h4>
                        <p className="motivo">"{cita.motivo}"</p>

                        {cita.estado === "Pendiente" && (
                          <div className="alerta alerta-pendiente">
                            ⏳ Esperando confirmación del médico...
                          </div>
                        )}

                        {cita.estado === "Confirmada" && (
                          <div className="alerta alerta-exito">
                            ✅ <strong>¡Cita Confirmada!</strong>
                          </div>
                        )}

                        {cita.estado === "Propuesta" && (
                          <div className="alerta alerta-propuesta">
                            <div className="propuesta-titulo">
                              ⚠️ Propuesta de cambio:
                            </div>
                            <p>
                              Nueva fecha:{" "}
                              <strong>
                                {formatearFecha(cita.propuesta.fecha)}
                              </strong>{" "}
                              a las <strong>{cita.propuesta.hora}</strong>
                            </p>
                            <button
                              onClick={() => handleAceptarPropuesta(cita._id)}
                              className="btn-si"
                            >
                              ✅ Aceptar Cambio
                            </button>
                          </div>
                        )}
                      </div>

                      <div className="card-actions">
                        <button
                          onClick={() => handleCancelar(cita._id)}
                          className="btn-cancel"
                        >
                          Cancelar Cita
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className="citas-section">
              <h3>📂 Historial</h3>
              <table className="historial-table">
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Médico</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {historial.map((cita) => (
                    <tr key={cita._id}>
                      <td>{formatearFecha(cita.fecha)}</td>
                      <td>{cita.medicoId?.nombre}</td>
                      <td>
                        <span className={`badge ${cita.estado.toLowerCase()}`}>
                          {cita.estado}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          </div>
        )}

        {activeTab === "agendar" && (
          <div className="tab-content">
            <form onSubmit={handleAgendar} className="form-agendar">
              <h3>Agendar Nueva Cita</h3>

              {mensaje.texto && (
                <div className={`alert ${mensaje.tipo}`}>{mensaje.texto}</div>
              )}

              <div className="form-group">
                <label>Médico:</label>
                <select
                  value={formNueva.medicoId}
                  onChange={(e) =>
                    setFormNueva({ ...formNueva, medicoId: e.target.value })
                  }
                  required
                >
                  <option value="">-- Seleccione un Doctor --</option>
                  {medicos.map((m) => (
                    <option key={m._id} value={m._id}>
                      Dr. {m.nombre} {m.apellido} ({m.especialidad})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Fecha:</label>
                  <input
                    type="date"
                    min={fechaHoy}
                    value={formNueva.fecha}
                    onChange={(e) =>
                      setFormNueva({ ...formNueva, fecha: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Hora:</label>
                  <select
                    value={formNueva.hora}
                    onChange={(e) =>
                      setFormNueva({ ...formNueva, hora: e.target.value })
                    }
                    required
                    disabled={
                      !formNueva.fecha ||
                      !formNueva.medicoId ||
                      cargandoHoras ||
                      horasLibres.length === 0
                    }
                  >
                    <option value="">
                      {cargandoHoras
                        ? "Verificando..."
                        : !formNueva.fecha
                        ? "-- Elija fecha primero --"
                        : "-- Seleccione Hora --"}
                    </option>

                    {!cargandoHoras &&
                      horasLibres.map((h) => (
                        <option key={h} value={h}>
                          {h}
                        </option>
                      ))}

                    {!cargandoHoras &&
                      formNueva.fecha &&
                      horasLibres.length === 0 && (
                        <option disabled>🚫 No hay citas disponibles</option>
                      )}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Motivo de consulta:</label>
                <textarea
                  value={formNueva.motivo}
                  onChange={(e) =>
                    setFormNueva({ ...formNueva, motivo: e.target.value })
                  }
                  required
                  placeholder="Describe brevemente tus síntomas..."
                ></textarea>
              </div>

              <button
                type="submit"
                className="btn-submit"
                disabled={horasLibres.length === 0}
              >
                Agendar Cita
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default CitasPaciente;
