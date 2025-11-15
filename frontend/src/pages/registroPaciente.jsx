import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import './registroPaciente.css';

const RegistroPaciente = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    tipoDocumento: "", documento: "", nombre: "", apellido: "",
    fechaNacimiento: "", sexo: "", // Nuevo
    eps: "", estrato: "", ciudad: "", // Nuevos
    estadoCivil: "", ocupacion: "", // Nuevos
    email: "", telefono: "", direccion: "", rh: "",
    enfermedades: "", alergias: "", tratamientos: "",
    password: "", confirmarContraseña: "",
  });

  const [mensajeError, setMensajeError] = useState("");
  const [mensajeExito, setMensajeExito] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensajeError(""); setMensajeExito("");

    if (formData.password !== formData.confirmarContraseña) {
      setMensajeError("Las contraseñas no coinciden");
      return;
    }

    const payload = { ...formData };
    delete payload.confirmarContraseña;
    if (payload.email === '') delete payload.email;
    payload.enfermedades = formData.enfermedades ? formData.enfermedades.split('\n') : [];
    payload.alergias = formData.alergias ? formData.alergias.split('\n') : [];
    payload.tratamientos = formData.tratamientos ? formData.tratamientos.split('\n') : [];

    try {
      await api.post("/pacientes/registrar", payload);
      setMensajeExito("¡Registro exitoso! Tu perfil ha sido creado.");
      setTimeout(() => navigate("/login-paciente"), 3000);
    } catch (error) {
      const msg = error.response?.data?.msg || "Error al registrarse. Verifica tus datos.";
      setMensajeError(msg);
    }
  };

  return (
    <div className="registro-page-wrapper">
      <div className="registro-form-container">
        {mensajeExito ? (
          <div className="registro-success-message"><h3>¡Registro Completo!</h3><p>{mensajeExito}</p></div>
        ) : (
          <form onSubmit={handleSubmit} className="registro-form">
            <h2>Nuevo Expediente</h2>
            {mensajeError && <div className="registro-error-message">{mensajeError}</div>}

            <div className="registro-grid">
              
              {/* --- DATOS PERSONALES --- */}
              <div className="form-group">
                <label>Tipo Doc.</label>
                <select name="tipoDocumento" value={formData.tipoDocumento} onChange={handleChange} required>
                  <option value="">Seleccione...</option>
                  <option value="CC">Cédula</option><option value="TI">Tarjeta Identidad</option>
                  <option value="CE">Cédula Extranjería</option><option value="PP">Pasaporte</option>
                </select>
              </div>
              <div className="form-group"><label>Documento</label><input type="text" name="documento" onChange={handleChange} required /></div>
              <div className="form-group"><label>Nombre</label><input type="text" name="nombre" onChange={handleChange} required /></div>
              <div className="form-group"><label>Apellido</label><input type="text" name="apellido" onChange={handleChange} required /></div>
              
              <div className="form-group"><label>Fecha Nacimiento</label><input type="date" name="fechaNacimiento" onChange={handleChange} required /></div>
              
              {/* --- NUEVOS CAMPOS --- */}
              <div className="form-group">
                <label>Sexo Biológico</label>
                <select name="sexo" value={formData.sexo} onChange={handleChange} required>
                  <option value="">Seleccione...</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Femenino">Femenino</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>

              <div className="form-group"><label>Ciudad</label><input type="text" name="ciudad" onChange={handleChange} required /></div>
              
              <div className="form-group">
                <label>Estado Civil</label>
                <select name="estadoCivil" value={formData.estadoCivil} onChange={handleChange}>
                  <option value="">Seleccione...</option>
                  <option value="Soltero">Soltero/a</option><option value="Casado">Casado/a</option>
                  <option value="Union Libre">Unión Libre</option><option value="Viudo">Viudo/a</option>
                </select>
              </div>

              <div className="form-group"><label>Ocupación</label><input type="text" name="ocupacion" onChange={handleChange} /></div>

              {/* --- DATOS AFILIACIÓN --- */}
              <div className="form-group"><label>EPS</label><input type="text" name="eps" placeholder="Ej: Sura, Sanitas..." onChange={handleChange} required /></div>
              <div className="form-group">
                <label>Estrato</label>
                <select name="estrato" value={formData.estrato} onChange={handleChange} required>
                  <option value="">Seleccione...</option>
                  <option value="1">1</option><option value="2">2</option><option value="3">3</option>
                  <option value="4">4</option><option value="5">5</option><option value="6">6</option>
                </select>
              </div>

              {/* --- CONTACTO --- */}
              <div className="form-group"><label>Dirección</label><input type="text" name="direccion" onChange={handleChange} required /></div>
              <div className="form-group"><label>Teléfono</label><input type="text" name="telefono" onChange={handleChange} required /></div>
              <div className="form-group"><label>Email</label><input type="email" name="email" onChange={handleChange} /></div>
              
              <div className="form-group">
                <label>RH</label>
                <select name="rh" value={formData.rh} onChange={handleChange} required>
                  <option value="">Seleccione...</option>
                  <option value="O+">O+</option><option value="O-">O-</option>
                  <option value="A+">A+</option><option value="A-">A-</option>
                  <option value="B+">B+</option><option value="B-">B-</option>
                  <option value="AB+">AB+</option><option value="AB-">AB-</option>
                </select>
              </div>

              {/* --- CLÍNICOS --- */}
              <div className="form-group form-group-full"><label>Enfermedades</label><textarea name="enfermedades" rows="2" onChange={handleChange}></textarea></div>
              <div className="form-group"><label>Alergias</label><textarea name="alergias" rows="2" onChange={handleChange}></textarea></div>
              <div className="form-group"><label>Tratamientos</label><textarea name="tratamientos" rows="2" onChange={handleChange}></textarea></div>

              {/* --- PASSWORD --- */}
              <div className="form-group"><label>Contraseña</label><input type="password" name="password" onChange={handleChange} required /></div>
              <div className="form-group"><label>Confirmar</label><input type="password" name="confirmarContraseña" onChange={handleChange} required /></div>

              <button type="submit" className="btn btn-primary registro-submit-btn">Registrar Paciente</button>
              <div className="login-link">¿Ya tienes cuenta? <Link to="/login-paciente">Inicia sesión</Link></div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default RegistroPaciente;