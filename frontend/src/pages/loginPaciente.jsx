import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import "./loginPaciente.css";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [documento, setDocumento] = useState("");
  const [password, setPassword] = useState("");
  const [mensajeError, setMensajeError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensajeError("");

    if (!documento || !password) {
      setMensajeError("Por favor ingresa tus datos.");
      return;
    }

    try {
      const { data } = await api.post("/auth/login", { documento, password });

      login(data.usuario, data.token);

      if (data.rol === "admin") {
        navigate("/dashboard-admin");
      } else if (data.rol === "medico") {
        navigate("/dashboard-medico");
      } else {
        navigate("/dashboard-paciente");
      }
    } catch (error) {
      const msg = error.response?.data?.msg || "Credenciales incorrectas";
      setMensajeError(msg);
    }
  };

  return (
    <div className="login-page-wrapper">
      <div className="login-container">
        <h2>Acceso Aphonline</h2>
        <p style={{ textAlign: "center", color: "#666", marginBottom: "20px" }}>
          Plataforma de Gestión Médica
        </p>

        <form onSubmit={handleSubmit} className="login-form">
          {mensajeError && <div className="error-message">{mensajeError}</div>}

          <div className="form-group">
            <label htmlFor="documento">Usuario:</label>
            <input
              id="documento"
              type="text"
              // Placeholder claro para guiar al usuario
              placeholder="Tu documento"
              required
              value={documento}
              onChange={(e) => setDocumento(e.target.value)}
            />
            <small style={{ color: "#888", fontSize: "0.8rem" }}>
              * Médicos y Admins usar correo institucional.
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña:</label>
            <input
              id="password"
              type="password"
              placeholder="Tu contraseña"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="login-button">
            Ingresar
          </button>

          <p className="register-link">
            ¿Eres paciente nuevo?{" "}
            <Link to="/registro-paciente">Regístrate aquí</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
