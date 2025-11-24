import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";

const ConfirmarCuenta = () => {
  const { token } = useParams();
  const [mensaje, setMensaje] = useState("Verificando tu cuenta...");
  const [error, setError] = useState(false);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const confirmar = async () => {
      try {
        const { data } = await api.get(`/pacientes/confirmar/${token}`);
        setMensaje(data.msg);
        setError(false);
      } catch (error) {
        setMensaje(
          error.response?.data?.msg || "El enlace no es válido o ya expiró."
        );
        setError(true);
      } finally {
        setCargando(false);
      }
    };
    confirmar();
  }, [token]);

  return (
    <div
      style={{
        textAlign: "center",
        marginTop: "80px",
        padding: "40px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {cargando ? (
        <h2>⏳ Verificando...</h2>
      ) : (
        <>
          <h1
            style={{
              color: error ? "#e74c3c" : "#27ae60",
              fontSize: "3rem",
              marginBottom: "20px",
            }}
          >
            {error ? "Error" : "¡Cuenta Confirmada!"}
          </h1>

          <p
            style={{ fontSize: "1.2rem", color: "#555", marginBottom: "40px" }}
          >
            {mensaje}
          </p>

          {error ? (
            <Link
              to="/registro-paciente"
              style={{
                color: "#3498db",
                fontWeight: "bold",
                textDecoration: "none",
                border: "1px solid #3498db",
                padding: "10px 20px",
                borderRadius: "5px",
              }}
            >
              Volver al Registro
            </Link>
          ) : (
            <Link
              to="/login-paciente"
              style={{
                backgroundColor: "#3498db",
                color: "white",
                padding: "15px 30px",
                textDecoration: "none",
                borderRadius: "5px",
                fontWeight: "bold",
                fontSize: "1.1rem",
              }}
            >
              Iniciar Sesión
            </Link>
          )}
        </>
      )}
    </div>
  );
};

export default ConfirmarCuenta;
