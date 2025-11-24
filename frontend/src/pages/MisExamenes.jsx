import React, { useState, useEffect } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { PDFDownloadLink } from "@react-pdf/renderer";

// Importamos AMBOS diseños de PDF
import OrdenExamenPDF from "../components/OrdenExamenPDF";
import ResultadoPDF from "../components/ResultadoPDF";

import "./misExamenes.css";

const MisExamenes = () => {
  const { token } = useAuth();
  const [examenes, setExamenes] = useState([]);
  const [pacienteInfo, setPacienteInfo] = useState(null); // Info del paciente para el PDF de la orden
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const config = { headers: { Authorization: token } };

        // 1. Cargar Exámenes
        const { data: dataExamenes } = await api.get("/examenes", config);
        setExamenes(dataExamenes);

        // 2. Cargar Perfil (Necesario para poner el nombre del paciente en la Orden PDF)
        const { data: dataPerfil } = await api.get("/pacientes/perfil", config);
        setPacienteInfo(dataPerfil);
      } catch (error) {
        console.error("Error cargando datos", error);
      } finally {
        setCargando(false);
      }
    };
    if (token) cargarDatos();
  }, [token]);

  const formatearFecha = (fecha) =>
    new Date(fecha).toLocaleDateString("es-CO", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  return (
    <div className="examenes-wrapper">
      <header className="examenes-header">
        <h1>🔬 Resultados de Exámenes</h1>
        <p>Descarga tus órdenes médicas o consulta tus resultados listos.</p>
      </header>

      <div className="examenes-container">
        {cargando ? (
          <p className="text-center">Cargando historial...</p>
        ) : examenes.length === 0 ? (
          <div className="empty-state">
            No tienes exámenes registrados en el sistema.
          </div>
        ) : (
          <div className="examenes-list">
            {examenes.map((examen) => (
              <div key={examen._id} className="examen-row">
                {/* Icono según tipo */}
                <div
                  className={`examen-icon ${
                    examen.tipo === "Laboratorio" ? "lab" : "img"
                  }`}
                >
                  {examen.tipo === "Laboratorio" ? "🩸" : "🩻"}
                </div>

                {/* Información */}
                <div className="examen-info">
                  <h3>{examen.nombre}</h3>
                  <p className="examen-meta">
                    {examen.tipo} • {formatearFecha(examen.fechaRealizacion)}
                  </p>
                  <p className="examen-doctor">
                    Ordenado por: Dr. {examen.medicoId?.nombre}{" "}
                    {examen.medicoId?.apellido}
                  </p>
                  {examen.observaciones && (
                    <small className="examen-obs">
                      "{examen.observaciones}"
                    </small>
                  )}
                </div>

                {/* Estado y Botones de Acción */}
                <div className="examen-status">
                  <span
                    className={`status-pill ${examen.estado.toLowerCase()}`}
                  >
                    {examen.estado}
                  </span>

                  {/* --- LÓGICA DE BOTONES --- */}

                  {examen.estado === "Pendiente" ? (
                    // CASO 1: PENDIENTE -> Descargar ORDEN
                    <PDFDownloadLink
                      document={
                        <OrdenExamenPDF
                          examen={examen}
                          paciente={pacienteInfo}
                        />
                      }
                      fileName={`Orden_${examen.nombre.replace(
                        /\s/g,
                        "_"
                      )}.pdf`}
                      style={{ textDecoration: "none", width: "100%" }}
                    >
                      {({ loading }) => (
                        <button className="btn-ver orden" disabled={loading}>
                          {loading ? "..." : "⬇ Descargar Orden"}
                        </button>
                      )}
                    </PDFDownloadLink>
                  ) : (
                    // CASO 2: DISPONIBLE -> Descargar RESULTADO
                    <PDFDownloadLink
                      document={<ResultadoPDF examen={examen} />}
                      fileName={`Resultado_${examen.nombre.replace(
                        /\s/g,
                        "_"
                      )}.pdf`}
                      style={{ textDecoration: "none", width: "100%" }}
                    >
                      {({ loading }) => (
                        <button
                          className="btn-ver resultado"
                          disabled={loading}
                        >
                          {loading ? "..." : "📄 Ver Resultado"}
                        </button>
                      )}
                    </PDFDownloadLink>
                  )}
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
