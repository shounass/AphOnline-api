import React, { useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import "./pacientesMedico.css";

const PacientesMedico = () => {
  const { token } = useAuth();

  const [busqueda, setBusqueda] = useState("");
  const [paciente, setPaciente] = useState(null);
  const [historia, setHistoria] = useState(null);
  const [examenesPaciente, setExamenesPaciente] = useState([]);
  const [error, setError] = useState("");

  // Modales
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modalEdicion, setModalEdicion] = useState(false);
  const [modalResultado, setModalResultado] = useState(null); // Guarda el examen a responder

  const [tabActiva, setTabActiva] = useState("resumen");

  // Formularios
  const [nuevaNota, setNuevaNota] = useState("");
  const [nuevoExamen, setNuevoExamen] = useState({
    tipo: "Laboratorio",
    nombre: "",
    observaciones: "",
  });
  const [textoResultado, setTextoResultado] = useState(""); // Para el resultado

  const [datosEditables, setDatosEditables] = useState({
    antecedentes: "",
    alergias: "",
    enfermedadesActuales: "",
    medicamentosActuales: "",
  });
  const [formPaciente, setFormPaciente] = useState({});

  // --- BUSCAR PACIENTE ---
  const handleBuscar = async (e) => {
    e.preventDefault();
    setError("");
    setPaciente(null);
    setHistoria(null);
    setExamenesPaciente([]);
    setModalAbierto(false);

    if (!busqueda) return;

    try {
      const config = { headers: { Authorization: token } };
      const { data: dataPaciente } = await api.get(
        `/pacientes/buscar/${busqueda}`,
        config
      );
      setPaciente(dataPaciente);
      setFormPaciente(dataPaciente);

      const { data: dataHistoria } = await api.get(
        `/historias/paciente/${dataPaciente._id}`,
        config
      );
      setHistoria(dataHistoria);

      setDatosEditables({
        antecedentes: dataHistoria.antecedentes || "",
        alergias: dataHistoria.alergias?.join("\n") || "",
        enfermedadesActuales:
          dataHistoria.enfermedadesActuales?.join("\n") || "",
        medicamentosActuales:
          dataHistoria.medicamentosActuales?.join("\n") || "",
      });

      const { data: dataExamenes } = await api.get(
        `/examenes/paciente/${dataPaciente._id}`,
        config
      );
      setExamenesPaciente(dataExamenes);
    } catch (err) {
      setError("Paciente no encontrado.");
    }
  };

  // --- ACCIONES EXISTENTES ---
  const handleActualizarPaciente = async (e) => {
    /* ...código igual al anterior... */ e.preventDefault();
    try {
      const config = { headers: { Authorization: token } };
      const { data } = await api.put(
        `/pacientes/gestion/${paciente._id}`,
        formPaciente,
        config
      );
      setPaciente(data.paciente);
      setModalEdicion(false);
      alert("Actualizado.");
    } catch (error) {
      alert("Error.");
    }
  };
  const handleAgregarEvolucion = async (e) => {
    /* ...código igual al anterior... */ e.preventDefault();
    if (!nuevaNota.trim()) return;
    try {
      const config = { headers: { Authorization: token } };
      const { data } = await api.post(
        `/historias/evolucion/${paciente._id}`,
        { nota: nuevaNota },
        config
      );
      setHistoria(data.historia);
      setNuevaNota("");
      alert("Nota agregada.");
    } catch (error) {
      alert("Error");
    }
  };
  const handleGuardarDatos = async (e) => {
    /* ...código igual al anterior... */ e.preventDefault();
    try {
      const config = { headers: { Authorization: token } };
      const payload = {
        antecedentes: datosEditables.antecedentes,
        alergias: datosEditables.alergias
          .split("\n")
          .filter((i) => i.trim() !== ""),
        enfermedadesActuales: datosEditables.enfermedadesActuales
          .split("\n")
          .filter((i) => i.trim() !== ""),
        medicamentosActuales: datosEditables.medicamentosActuales
          .split("\n")
          .filter((i) => i.trim() !== ""),
      };
      const { data } = await api.put(
        `/historias/datos/${paciente._id}`,
        payload,
        config
      );
      setHistoria(data.historia);
      alert("Datos actualizados.");
      setTabActiva("resumen");
    } catch (error) {
      alert("Error");
    }
  };
  const handleCrearExamen = async (e) => {
    /* ...código igual al anterior... */ e.preventDefault();
    try {
      const config = { headers: { Authorization: token } };
      const payload = { ...nuevoExamen, pacienteId: paciente._id };
      const { data } = await api.post("/examenes/ordenar", payload, config);
      setExamenesPaciente([data.examen, ...examenesPaciente]);
      setNuevoExamen({ tipo: "Laboratorio", nombre: "", observaciones: "" });
      alert("Orden generada.");
    } catch (error) {
      alert("Error");
    }
  };

  // --- NUEVO: SUBIR RESULTADO ---
  const handleSubirResultado = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: token } };
      const { data } = await api.put(
        `/examenes/${modalResultado._id}/resultado`,
        { resultado: textoResultado },
        config
      );

      // Actualizar lista localmente
      const actualizados = examenesPaciente.map((ex) =>
        ex._id === data.examen._id ? data.examen : ex
      );
      setExamenesPaciente(actualizados);

      alert("Resultados cargados exitosamente.");
      setModalResultado(null);
      setTextoResultado("");
    } catch (error) {
      alert("Error al subir resultado");
    }
  };

  // Utils
  const calcularEdad = (f) => {
    if (!f) return "--";
    const d = Date.now() - new Date(f).getTime();
    return Math.floor(d / (1000 * 60 * 60 * 24 * 365.25));
  };
  const formatearFecha = (f) => new Date(f).toLocaleDateString();

  return (
    <div className="pacientes-wrapper">
      <header className="pacientes-header">
        <h1>Gestión Clínica</h1>
        <p>Búsqueda y administración.</p>
      </header>
      <div className="search-container">
        <form onSubmit={handleBuscar} className="search-box">
          <input
            type="text"
            placeholder="Documento..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            autoFocus
          />
          <button type="submit">🔍 Buscar</button>
        </form>
        {error && <div className="error-alert">{error}</div>}
      </div>

      {paciente && (
        <div className="paciente-result-card animate-fade-up">
          <div className="paciente-avatar-col">
            <img
              src={paciente.foto || "https://via.placeholder.com/150"}
              alt="Avatar"
              className="paciente-img"
            />
          </div>
          <div className="paciente-info-col">
            <h2>
              {paciente.nombre} {paciente.apellido}
            </h2>
            <div className="tags-row">
              <span className="tag edad">
                {calcularEdad(paciente.fechaNacimiento)} Años
              </span>
              <span className="tag">{paciente.eps}</span>
            </div>
            <div className="info-grid">
              <p>
                <strong>📞 Tel:</strong> {paciente.telefono}
              </p>
              <p>
                <strong>📧 Email:</strong> {paciente.email}
              </p>
            </div>
            <div className="paciente-actions">
              <button
                className="btn-action primary"
                onClick={() => setModalAbierto(true)}
              >
                📋 Historia / Exámenes
              </button>
              <button
                className="btn-action secondary"
                onClick={() => setModalEdicion(true)}
              >
                ✏️ Editar Info
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL HISTORIA */}
      {modalAbierto && historia && (
        <div className="hc-modal-overlay">
          <div className="hc-modal-content">
            <div className="hc-header">
              <h3>Historia: {paciente.nombre}</h3>
              <button
                className="btn-close"
                onClick={() => setModalAbierto(false)}
              >
                ✕
              </button>
            </div>
            <div className="hc-tabs">
              <button
                className={`hc-tab ${tabActiva === "resumen" ? "active" : ""}`}
                onClick={() => setTabActiva("resumen")}
              >
                Resumen
              </button>
              <button
                className={`hc-tab ${
                  tabActiva === "evoluciones" ? "active" : ""
                }`}
                onClick={() => setTabActiva("evoluciones")}
              >
                Evoluciones
              </button>
              <button
                className={`hc-tab ${tabActiva === "examenes" ? "active" : ""}`}
                onClick={() => setTabActiva("examenes")}
              >
                Exámenes
              </button>
              <button
                className={`hc-tab ${tabActiva === "editar" ? "active" : ""}`}
                onClick={() => setTabActiva("editar")}
              >
                Datos
              </button>
            </div>
            <div className="hc-body">
              {tabActiva === "resumen" && (
                <div className="tab-pane">
                  <div className="info-block">
                    <strong>Antecedentes:</strong>
                    <p>{historia.antecedentes}</p>
                  </div>
                </div>
              )}
              {tabActiva === "evoluciones" && (
                <div className="tab-pane">
                  <form
                    onSubmit={handleAgregarEvolucion}
                    className="new-note-form"
                  >
                    <textarea
                      placeholder="Nueva nota..."
                      value={nuevaNota}
                      onChange={(e) => setNuevaNota(e.target.value)}
                      required
                    ></textarea>
                    <button className="btn-add-note">➕ Agregar</button>
                  </form>
                  <div className="notes-list">
                    {historia.evoluciones?.map((evo, i) => (
                      <div key={i} className="note-item">
                        <p>{evo.nota}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {tabActiva === "editar" && (
                <div className="tab-pane">
                  <form onSubmit={handleGuardarDatos} className="edit-form">
                    <div className="form-group">
                      <label>Antecedentes:</label>
                      <textarea
                        value={datosEditables.antecedentes}
                        onChange={(e) =>
                          setDatosEditables({
                            ...datosEditables,
                            antecedentes: e.target.value,
                          })
                        }
                      ></textarea>
                    </div>
                    <button className="btn-save-changes">Guardar</button>
                  </form>
                </div>
              )}

              {/* --- PESTAÑA EXÁMENES --- */}
              {tabActiva === "examenes" && (
                <div className="tab-pane">
                  <div className="order-form-container">
                    <h4>📑 Ordenar Examen</h4>
                    <form onSubmit={handleCrearExamen} className="order-form">
                      <div className="form-row-2">
                        <select
                          value={nuevoExamen.tipo}
                          onChange={(e) =>
                            setNuevoExamen({
                              ...nuevoExamen,
                              tipo: e.target.value,
                            })
                          }
                        >
                          <option>Laboratorio</option>
                          <option>Imagenología</option>
                        </select>
                        <input
                          type="text"
                          placeholder="Nombre..."
                          value={nuevoExamen.nombre}
                          onChange={(e) =>
                            setNuevoExamen({
                              ...nuevoExamen,
                              nombre: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                      <textarea
                        placeholder="Indicaciones..."
                        value={nuevoExamen.observaciones}
                        onChange={(e) =>
                          setNuevoExamen({
                            ...nuevoExamen,
                            observaciones: e.target.value,
                          })
                        }
                        rows="2"
                      ></textarea>
                      <button className="btn-generate">+ Generar Orden</button>
                    </form>
                  </div>
                  <hr style={{ margin: "20px 0" }} />
                  <h4>Historial</h4>
                  <div className="notes-list">
                    {examenesPaciente.map((ex) => (
                      <div
                        key={ex._id}
                        className="note-item"
                        style={{
                          borderLeftColor:
                            ex.estado === "Disponible" ? "#27ae60" : "#f39c12",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <div>
                          <div className="note-meta">
                            <span>{formatearFecha(ex.fechaRealizacion)}</span>
                            <span
                              className={`status-pill ${ex.estado.toLowerCase()}`}
                            >
                              {ex.estado}
                            </span>
                          </div>
                          <strong>{ex.nombre}</strong>{" "}
                          <small>({ex.tipo})</small>
                        </div>
                        {ex.estado === "Pendiente" && (
                          <button
                            className="btn-action secondary"
                            style={{ padding: "5px 10px", fontSize: "0.8rem" }}
                            onClick={() => setModalResultado(ex)}
                          >
                            📝 Cargar Resultado
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL CARGAR RESULTADO (NUEVO) --- */}
      {modalResultado && (
        <div className="hc-modal-overlay">
          <div
            className="hc-modal-content"
            style={{ maxWidth: "500px", height: "auto" }}
          >
            <div className="hc-header">
              <h3>Resultados: {modalResultado.nombre}</h3>
              <button
                className="btn-close"
                onClick={() => setModalResultado(null)}
              >
                ✕
              </button>
            </div>
            <div className="hc-body">
              <form onSubmit={handleSubirResultado}>
                <div className="form-group">
                  <label>Informe de Resultados:</label>
                  <textarea
                    rows="6"
                    style={{ width: "100%", padding: "10px" }}
                    placeholder="Describa los hallazgos, valores o conclusiones del examen..."
                    value={textoResultado}
                    onChange={(e) => setTextoResultado(e.target.value)}
                    required
                  ></textarea>
                </div>
                <button type="submit" className="btn-save-changes">
                  💾 Publicar Resultado
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal Editar Info Personal (Igual que antes) */}
      {modalEdicion && (
        <div className="hc-modal-overlay">
          <div
            className="hc-modal-content"
            style={{ maxWidth: "600px", height: "auto" }}
          >
            <div className="hc-header">
              <h3>Editar</h3>
              <button
                className="btn-close"
                onClick={() => setModalEdicion(false)}
              >
                ✕
              </button>
            </div>
            <div className="hc-body">
              <form onSubmit={handleActualizarPaciente} className="edit-form">
                <div className="form-group">
                  <label>Nombre</label>
                  <input
                    value={formPaciente.nombre}
                    onChange={(e) =>
                      setFormPaciente({
                        ...formPaciente,
                        nombre: e.target.value,
                      })
                    }
                  />
                </div>
                <button className="btn-save-changes">Guardar</button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PacientesMedico;
