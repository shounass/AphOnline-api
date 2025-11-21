import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import "./dashboardMedico.css";

const DashboardMedico = () => {
  const { token, usuario } = useAuth();

  const [citasHoy, setCitasHoy] = useState([]);
  const [pendientes, setPendientes] = useState(0);
  const [totalPacientes, setTotalPacientes] = useState(0);
  const [cargando, setCargando] = useState(true);

  // Modales
  const [modalReportes, setModalReportes] = useState(false);
  const [modalHorario, setModalHorario] = useState(false);

  // Estados Configuración
  const [nuevoHorario, setNuevoHorario] = useState(
    usuario?.horarioAtencion || ""
  );
  // Estado para días laborales (Array de números)
  const [diasLaborales, setDiasLaborales] = useState(
    usuario?.diasLaborales || [1, 2, 3, 4, 5]
  );

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const config = { headers: { Authorization: token } };
        const { data } = await api.get("/citas/medico", config);

        const hoyString = new Date().toISOString().split("T")[0];
        const deHoy = data.filter(
          (c) =>
            new Date(c.fecha).toISOString().split("T")[0] === hoyString &&
            c.estado !== "Cancelada"
        );
        const numPendientes = data.filter(
          (c) => c.estado === "Pendiente"
        ).length;
        const pacientesUnicos = new Set(data.map((c) => c.pacienteId?._id))
          .size;

        setCitasHoy(deHoy);
        setPendientes(numPendientes);
        setTotalPacientes(pacientesUnicos);
      } catch (error) {
        console.error(error);
      } finally {
        setCargando(false);
      }
    };
    if (token) cargarDatos();
  }, [token]);

  // --- GUARDAR CONFIGURACIÓN ---
  const guardarConfiguracion = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: token } };
      await api.put(
        "/medicos/horario",
        {
          horarioAtencion: nuevoHorario,
          diasLaborales: diasLaborales, // Enviamos los días seleccionados
        },
        config
      );
      alert("Configuración actualizada exitosamente.");
      setModalHorario(false);
    } catch (error) {
      alert("Error al guardar");
    }
  };

  // Manejar Checkboxes de Días
  const toggleDia = (diaIndex) => {
    setDiasLaborales((prev) => {
      if (prev.includes(diaIndex)) return prev.filter((d) => d !== diaIndex); // Quitar
      return [...prev, diaIndex]; // Agregar
    });
  };

  const diasSemana = [
    { id: 1, nombre: "Lunes" },
    { id: 2, nombre: "Martes" },
    { id: 3, nombre: "Miércoles" },
    { id: 4, nombre: "Jueves" },
    { id: 5, nombre: "Viernes" },
    { id: 6, nombre: "Sábado" },
    { id: 0, nombre: "Domingo" },
  ];

  return (
    <div className="medico-dash-wrapper">
      <header className="medico-dash-header">
        <div className="header-intro">
          <h1>Dr. {usuario?.apellido}</h1>
          <p>Panel de Control</p>
        </div>
        <div className="header-date">
          {new Date().toLocaleDateString("es-CO", {
            weekday: "long",
            day: "numeric",
            month: "long",
          })}
        </div>
      </header>

      <div className="stats-grid">
        <div className="stat-card-medico blue">
          <div className="icon">📅</div>
          <div className="info">
            <h3>{citasHoy.length}</h3>
            <p>Hoy</p>
          </div>
        </div>
        <div
          className={`stat-card-medico ${pendientes > 0 ? "orange" : "green"}`}
        >
          <div className="icon">🔔</div>
          <div className="info">
            <h3>{pendientes}</h3>
            <p>Pendientes</p>
          </div>
          {pendientes > 0 && (
            <Link to="/agenda-medico" className="stat-link">
              Ir &rarr;
            </Link>
          )}
        </div>
        <div className="stat-card-medico purple">
          <div className="icon">👥</div>
          <div className="info">
            <h3>{totalPacientes}</h3>
            <p>Pacientes</p>
          </div>
        </div>
      </div>

      <div className="dashboard-medico-main">
        <section className="section-today">
          <div className="section-title">
            <h2>🩺 Agenda Hoy</h2>
            <Link to="/agenda-medico" className="btn-ver-agenda">
              Calendario
            </Link>
          </div>
          {citasHoy.length === 0 ? (
            <div className="empty-today">
              <p>Sin citas hoy.</p>
            </div>
          ) : (
            <div className="today-list">
              {citasHoy.map((c) => (
                <div key={c._id} className="today-card">
                  <div className="time-box">{c.hora}</div>
                  <div className="patient-box">
                    <h4>{c.pacienteId?.nombre}</h4>
                    <span>{c.motivo}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <aside className="section-shortcuts">
          <h3>Configuración</h3>
          <div className="shortcut-grid">
            <Link to="/pacientes-medico" className="shortcut-btn">
              <span className="s-icon">🔍</span>
              <span>Pacientes</span>
            </Link>
            <button
              className="shortcut-btn"
              onClick={() => setModalHorario(true)}
            >
              <span className="s-icon">⚙️</span>
              <span>Mi Horario</span>
            </button>
          </div>
          <div className="tips-box">
            <h4>Horario Visible:</h4>
            <p>{nuevoHorario || "No configurado"}</p>
          </div>
        </aside>
      </div>

      {/* --- MODAL CONFIGURACIÓN HORARIO Y DÍAS --- */}
      {modalHorario && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>⚙️ Configurar Disponibilidad</h3>
            <form onSubmit={guardarConfiguracion}>
              {/* CHECKBOXES DÍAS */}
              <div className="form-group">
                <label>Días Laborales:</label>
                <div className="dias-grid">
                  {diasSemana.map((dia) => (
                    <label
                      key={dia.id}
                      className={`dia-check ${
                        diasLaborales.includes(dia.id) ? "active" : ""
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={diasLaborales.includes(dia.id)}
                        onChange={() => toggleDia(dia.id)}
                        style={{ display: "none" }}
                      />
                      {dia.nombre.substring(0, 3)}
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>Texto del Horario (Visible al paciente):</label>
                <textarea
                  rows="2"
                  value={nuevoHorario}
                  onChange={(e) => setNuevoHorario(e.target.value)}
                  placeholder="Ej: L-V 8am-5pm, Sábados 8am-12pm"
                ></textarea>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  onClick={() => setModalHorario(false)}
                  className="btn-cancel"
                >
                  Cancelar
                </button>
                <button type="submit" className="btn-save">
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardMedico;
