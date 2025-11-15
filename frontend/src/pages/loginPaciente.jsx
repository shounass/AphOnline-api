import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import { useAuth } from '../context/AuthContext';
import './loginPaciente.css'; 

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
      // --- LLAMADA AL LOGIN UNIFICADO ---
      const { data } = await api.post("/auth/login", { documento, password });
      
      // Guardamos sesión
      login(data.usuario, data.token);
      
      // --- REDIRECCIÓN INTELIGENTE ---
      if (data.rol === 'medico') {
        alert(`Hola Dr. ${data.usuario.apellido}, redirigiendo a su consultorio...`);
        navigate("/dashboard-medico");
      } else {
        // Es paciente
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
        <p style={{textAlign:'center', color:'#666', marginBottom:'20px'}}>
          Pacientes y Especialistas
        </p>

        <form onSubmit={handleSubmit} className="login-form">
          
          {mensajeError && (
            <div className="error-message">{mensajeError}</div>
          )}

          <div className="form-group">
            <label htmlFor="documento">Documento de Identidad:</label>
            <input 
              id="documento"
              type="text" 
              placeholder="Ingresa tu cédula" 
              required 
              value={documento}
              onChange={(e) => setDocumento(e.target.value)} 
            />
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
            ¿Eres nuevo? <Link to="/registro-paciente">Regístrate aquí</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;