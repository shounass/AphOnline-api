import React, { useState, useEffect, useCallback } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import "./agendaMedico.css";

const AgendaMedico = () => {
  const { token, usuario } = useAuth();
  const [citas, setCitas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date());

  // Modales
  const [modalPropuesta, setModalPropuesta] = useState(null);
  const [formPropuesta, setFormPropuesta] = useState({
    fecha: "",
    hora: "",
    mensaje: "",
  });
  const [pacienteVer, setPacienteVer] = useState(null);

  // --- HORARIOS BASE ---
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

  const cargarAgenda = useCallback(async () => {
    try {
      const config = { headers: { Authorization: token } };
      const { data } = await api.get("/citas/medico", config);
      setCitas(data);
    } catch (error) {
      console.error("Error cargando agenda", error);
    } finally {
      setCargando(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) cargarAgenda();
  }, [token, cargarAgenda]);

  const handleConfirmar = async (id) => {
    try {
      const config = { headers: { Authorization: token } };
      await api.put(`/citas/confirmar/${id}`, {}, config);
      alert("¡Cita confirmada!");
      cargarAgenda();
    } catch (error) {
      alert("Error");
    }
  };

  const handleAtender = async (id) => {
    if (!window.confirm("¿Finalizar consulta?")) return;
    try {
      const config = { headers: { Authorization: token } };
      await api.put(`/citas/atender/${id}`, {}, config);
      cargarAgenda();
    } catch (error) {
      alert("Error");
    }
  };

  const enviarPropuesta = async (e) => {
    e.preventDefault();
    if (!formPropuesta.hora) {
      alert("Por favor selecciona una hora válida.");
      return;
    }
    try {
      const config = { headers: { Authorization: token } };
      await api.put(
        `/citas/proponer/${modalPropuesta._id}`,
        formPropuesta,
        config
      );
      alert("Propuesta enviada.");
      setModalPropuesta(null);
      cargarAgenda();
    } catch (error) {
      alert("Error: " + (error.response?.data?.msg || "Intente de nuevo"));
    }
  };

  // --- FIX DE FECHAS ---
  const obtenerFechaLocal = (fechaString) => {
    const fecha = new Date(fechaString);
    return new Date(
      fecha.valueOf() + fecha.getTimezoneOffset() * 60000
    ).toDateString();
  };

  const citasDelDia = citas.filter((cita) => {
    const fechaCita = obtenerFechaLocal(cita.fecha);
    const fechaCal = fechaSeleccionada.toDateString();
    return (
      fechaCita === fechaCal &&
      ["Pendiente", "Confirmada", "Propuesta"].includes(cita.estado)
    );
  });

  const tileContent = ({ date, view }) => {
    if (view === "month") {
      const hayCitas = citas.some(
        (cita) =>
          obtenerFechaLocal(cita.fecha) === date.toDateString() &&
          ["Pendiente", "Confirmada"].includes(cita.estado)
      );
      return hayCitas ? <div className="dot-indicator"></div> : null;
    }
  };

  const formatearFecha = (fecha) =>
    new Date(fecha).toLocaleDateString("es-CO", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });

  // --- LÓGICA PARA FILTRAR HORAS EN LA PROPUESTA ---
  const getHorasDisponiblesPropuesta = () => {
    if (!formPropuesta.fecha) return [];

    const fechaObj = new Date(formPropuesta.fecha);
    // Ajuste de zona horaria para obtener el día correcto
    const diaSemana = new Date(
      fechaObj.valueOf() + fechaObj.getTimezoneOffset() * 60000
    ).getUTCDay();

    if (diaSemana === 0) return []; // Domingo no hay horas
    if (diaSemana === 6) return horasTotales.filter((h) => parseInt(h) <= 12); // Sábado solo hasta las 12
    return horasTotales; // Lunes a Viernes
  };

  return (
    <div className="agenda-wrapper">
      <header className="agenda-header">
        <h1>📅 Agenda Médica</h1>
        <p>
          Dr. {usuario?.nombre} {usuario?.apellido}
        </p>
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
        </aside>

        <section className="agenda-list-section">
          <h2 className="titulo-dia">
            Pacientes: <span>{formatearFecha(fechaSeleccionada)}</span>
          </h2>

          {cargando ? (
            <p>Cargando...</p>
          ) : citasDelDia.length === 0 ? (
            <div className="empty-day">
              <p>No hay citas para este día.</p>
            </div>
          ) : (
            <div className="citas-list">
              {citasDelDia.map((cita) => (
                <div
                  key={cita._id}
                  className={`cita-medico-card ${cita.estado.toLowerCase()}`}
                >
                  <div className="cita-time">
                    <span className="hora">{cita.hora}</span>
                  </div>
                  <div className="cita-info">
                    <h3>
                      {cita.pacienteId?.nombre} {cita.pacienteId?.apellido}
                    </h3>
                    <p className="doc-id">CC: {cita.pacienteId?.documento}</p>
                    <p className="motivo">"{cita.motivo}"</p>

                    <button
                      className="btn-ver-paciente"
                      onClick={() => setPacienteVer(cita.pacienteId)}
                    >
                      👁️ Ver Ficha
                    </button>
                  </div>

                  <div className="cita-actions">
                    {cita.estado === "Pendiente" && (
                      <>
                        <button
                          className="btn-confirmar"
                          onClick={() => handleConfirmar(cita._id)}
                        >
                          ✅ Aceptar
                        </button>
                        <button
                          className="btn-proponer"
                          onClick={() => setModalPropuesta(cita)}
                        >
                          🔄 Cambiar
                        </button>
                      </>
                    )}
                    {cita.estado === "Confirmada" && (
                      <button
                        className="btn-atender"
                        onClick={() => handleAtender(cita._id)}
                      >
                        🩺 Atender
                      </button>
                    )}
                    {cita.estado === "Propuesta" && (
                      <small className="text-muted">
                        Esperando respuesta...
                      </small>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* --- MODAL PROPUESTA (ACTUALIZADO) --- */}
      {modalPropuesta && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Proponer Cambio</h3>
            <form onSubmit={enviarPropuesta}>
              <div className="form-group">
                <label>Nueva Fecha:</label>
                <input
                  type="date"
                  required
                  min={new Date().toISOString().split("T")[0]} // No permitir pasado
                  onChange={(e) =>
                    setFormPropuesta({
                      ...formPropuesta,
                      fecha: e.target.value,
                      hora: "",
                    })
                  }
                />
              </div>

              <div className="form-group">
                <label>Nueva Hora:</label>
                <select
                  required
                  value={formPropuesta.hora}
                  onChange={(e) =>
                    setFormPropuesta({ ...formPropuesta, hora: e.target.value })
                  }
                  disabled={!formPropuesta.fecha}
                >
                  <option value="">-- Seleccione Hora --</option>
                  {getHorasDisponiblesPropuesta().length === 0 &&
                  formPropuesta.fecha ? (
                    <option disabled>Domingo sin servicio</option>
                  ) : (
                    getHorasDisponiblesPropuesta().map((h) => (
                      <option key={h} value={h}>
                        {h}
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div className="form-group">
                <label>Motivo / Razón:</label>
                <textarea
                  required
                  placeholder="Ej: Tengo una cirugía urgente..."
                  onChange={(e) =>
                    setFormPropuesta({
                      ...formPropuesta,
                      mensaje: e.target.value,
                    })
                  }
                ></textarea>
              </div>
              <div className="modal-actions">
                <button
                  type="button"
                  onClick={() => setModalPropuesta(null)}
                  className="btn-cancel"
                >
                  Cancelar
                </button>
                <button type="submit" className="btn-save">
                  Enviar Propuesta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL VER FICHA PACIENTE --- */}
      {pacienteVer && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: "650px" }}>
            <div
              style={{
                textAlign: "center",
                borderBottom: "1px solid #eee",
                paddingBottom: "15px",
                marginBottom: "15px",
              }}
            >
              <img
                src={pacienteVer.foto || "https://via.placeholder.com/100"}
                style={{
                  width: "100px",
                  height: "100px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "3px solid #3498db",
                }}
                alt="Foto"
              />
              <h3 style={{ color: "#2c3e50", margin: "10px 0 5px" }}>
                {pacienteVer.nombre} {pacienteVer.apellido}
              </h3>
              <span
                style={{
                  background: "#e8f8f5",
                  color: "#16a085",
                  padding: "4px 10px",
                  borderRadius: "15px",
                  fontSize: "0.8rem",
                  fontWeight: "bold",
                }}
              >
                {pacienteVer.eps} • Estrato {pacienteVer.estrato}
              </span>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "15px",
                fontSize: "0.9rem",
                textAlign: "left",
              }}
            >
              <div>
                <strong>🆔 Doc:</strong> {pacienteVer.tipoDocumento}{" "}
                {pacienteVer.documento}
              </div>
              <div>
                <strong>🎂 Edad:</strong>{" "}
                {pacienteVer.fechaNacimiento
                  ? new Date().getFullYear() -
                    new Date(pacienteVer.fechaNacimiento).getFullYear() +
                    " años"
                  : "--"}
              </div>
              <div>
                <strong>⚧ Sexo:</strong> {pacienteVer.sexo}
              </div>
              <div>
                <strong>💍 Estado Civil:</strong> {pacienteVer.estadoCivil}
              </div>
              <div>
                <strong>💼 Ocupación:</strong> {pacienteVer.ocupacion}
              </div>
              <div>
                <strong>🏙️ Ciudad:</strong> {pacienteVer.ciudad}
              </div>
              <div>
                <strong>🩸 RH:</strong> {pacienteVer.rh}
              </div>
              <div>
                <strong>📞 Tel:</strong> {pacienteVer.telefono}
              </div>
              <div style={{ gridColumn: "1/-1" }}>
                <strong>📧 Email:</strong> {pacienteVer.email}
              </div>
              <div style={{ gridColumn: "1/-1" }}>
                <strong>📍 Dirección:</strong> {pacienteVer.direccion}
              </div>
            </div>

            <div
              style={{
                marginTop: "20px",
                background: "#fff8e1",
                padding: "10px",
                borderRadius: "8px",
                borderLeft: "4px solid #f1c40f",
              }}
            >
              <strong style={{ color: "#d35400" }}>⚠️ Alertas Médicas:</strong>
              <div
                style={{
                  margin: "5px 0 0",
                  fontSize: "0.85rem",
                  textAlign: "left",
                }}
              >
                <p style={{ margin: "2px 0" }}>
                  <strong>Alergias:</strong>{" "}
                  {pacienteVer.alergias?.length > 0
                    ? pacienteVer.alergias.join(", ")
                    : "Ninguna"}
                </p>
                <p style={{ margin: "2px 0" }}>
                  <strong>Enfermedades:</strong>{" "}
                  {pacienteVer.enfermedades?.length > 0
                    ? pacienteVer.enfermedades.join(", ")
                    : "Ninguna"}
                </p>
              </div>
            </div>

            <div className="modal-actions">
              <button onClick={() => setPacienteVer(null)} className="btn-save">
                Cerrar Ficha
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgendaMedico;
