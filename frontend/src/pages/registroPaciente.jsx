import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import "./registroPaciente.css";

const RegistroPaciente = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    tipoDocumento: "",
    documento: "",
    nombre: "",
    apellido: "",
    fechaNacimiento: "",
    sexo: "",
    eps: "",
    estrato: "",
    ciudad: "",
    estadoCivil: "",
    ocupacion: "",
    email: "",
    telefono: "",
    direccion: "",
    rh: "",
    enfermedades: "",
    alergias: "",
    tratamientos: "",
    password: "",
    confirmarContraseña: "",
  });

  const [mensajeError, setMensajeError] = useState("");
  const [mensajeExito, setMensajeExito] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- 🛡️ VALIDACIÓN DE CONTRASEÑA ---
  const validarPasswordSegura = (password) => {
    const fuerte = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    return fuerte.test(password);
  };

  // --- 📧 VALIDACIÓN DE EMAIL ---
  const validarEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensajeError("");
    setMensajeExito("");

    // 1. Validar coincidencia
    if (formData.password !== formData.confirmarContraseña) {
      setMensajeError("Las contraseñas no coinciden.");
      return;
    }

    // 2. Validar seguridad pass
    if (!validarPasswordSegura(formData.password)) {
      setMensajeError(
        "⚠️ La contraseña es muy débil. Requisito: 8+ chars, 1 Mayús, 1 Num, 1 Símbolo."
      );
      return;
    }

    // 3. Validar Email
    if (formData.email && !validarEmail(formData.email)) {
      setMensajeError("📧 El correo electrónico no tiene un formato válido.");
      return;
    }

    const payload = { ...formData };
    delete payload.confirmarContraseña;
    if (payload.email === "") delete payload.email;

    payload.enfermedades = formData.enfermedades
      ? formData.enfermedades.split("\n")
      : [];
    payload.alergias = formData.alergias ? formData.alergias.split("\n") : [];
    payload.tratamientos = formData.tratamientos
      ? formData.tratamientos.split("\n")
      : [];

    try {
      await api.post("/pacientes/registrar", payload);
      setMensajeExito("¡Registro exitoso! Tu perfil ha sido creado.");
      setTimeout(() => navigate("/login-paciente"), 3000);
    } catch (error) {
      const msg = error.response?.data?.msg || "Error al registrarse.";
      if (error.response?.data?.error?.includes("email")) {
        setMensajeError("El correo ingresado no es válido según el servidor.");
      } else {
        setMensajeError(msg);
      }
    }
  };

  return (
    <div className="registro-page-wrapper">
      <div className="registro-form-container">
        {mensajeExito ? (
          <div className="registro-success-message">
            <h3>¡Registro Completo!</h3>
            <p>{mensajeExito}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="registro-form">
            <h2>Nuevo Expediente</h2>

            <div className="registro-grid">
              {/* --- DATOS PERSONALES --- */}
              <div className="form-group">
                <label>Tipo Doc.</label>
                <select
                  name="tipoDocumento"
                  value={formData.tipoDocumento}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccione...</option>
                  <option value="CC">Cédula</option>
                  <option value="TI">Tarjeta Identidad</option>
                  <option value="CE">Cédula Extranjería</option>
                  <option value="PP">Pasaporte</option>
                </select>
              </div>
              <div className="form-group">
                <label>Documento</label>
                <input
                  type="text"
                  name="documento"
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Nombre</label>
                <input
                  type="text"
                  name="nombre"
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Apellido</label>
                <input
                  type="text"
                  name="apellido"
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Fecha Nacimiento</label>
                <input
                  type="date"
                  name="fechaNacimiento"
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Sexo Biológico</label>
                <select
                  name="sexo"
                  value={formData.sexo}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccione...</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Femenino">Femenino</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>

              <div className="form-group">
                <label>Ciudad</label>
                <input
                  type="text"
                  name="ciudad"
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Estado Civil</label>
                <select
                  name="estadoCivil"
                  value={formData.estadoCivil}
                  onChange={handleChange}
                >
                  <option value="">Seleccione...</option>
                  <option value="Soltero">Soltero/a</option>
                  <option value="Casado">Casado/a</option>
                  <option value="Union Libre">Unión Libre</option>
                  <option value="Viudo">Viudo/a</option>
                </select>
              </div>

              <div className="form-group">
                <label>Ocupación</label>
                <input type="text" name="ocupacion" onChange={handleChange} />
              </div>

              {/* --- DATOS AFILIACIÓN --- */}
              <div className="form-group">
                <label>EPS</label>
                <input
                  type="text"
                  name="eps"
                  placeholder="Ej: Sura, Sanitas..."
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Estrato</label>
                <select
                  name="estrato"
                  value={formData.estrato}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccione...</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                  <option value="6">6</option>
                </select>
              </div>

              {/* --- CONTACTO (Aquí está el ÚNICO Email) --- */}
              <div className="form-group">
                <label>Dirección</label>
                <input
                  type="text"
                  name="direccion"
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Teléfono</label>
                <input
                  type="text"
                  name="telefono"
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  onChange={handleChange}
                  placeholder="ejemplo@correo.com"
                />
              </div>

              {/* --- DATOS CLÍNICOS --- */}
              <div className="form-group">
                <label>RH</label>
                <select
                  name="rh"
                  value={formData.rh}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccione...</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                </select>
              </div>

              <div className="form-group form-group-full">
                <label>Enfermedades</label>
                <textarea
                  name="enfermedades"
                  rows="2"
                  onChange={handleChange}
                ></textarea>
              </div>
              <div className="form-group">
                <label>Alergias</label>
                <textarea
                  name="alergias"
                  rows="2"
                  onChange={handleChange}
                ></textarea>
              </div>
              <div className="form-group">
                <label>Tratamientos</label>
                <textarea
                  name="tratamientos"
                  rows="2"
                  onChange={handleChange}
                ></textarea>
              </div>

              {/* --- PASSWORD --- */}
              <div className="form-group">
                <label>Contraseña</label>
                <input
                  type="password"
                  name="password"
                  onChange={handleChange}
                  required
                  style={{ border: "2px solid #f1c40f" }}
                />
                <small style={{ color: "#7f8c8d", fontSize: "0.75rem" }}>
                  Requisito: 8+ caracteres, 1 Mayúscula, 1 Número, 1 Símbolo.
                </small>
              </div>

              <div className="form-group">
                <label>Confirmar</label>
                <input
                  type="password"
                  name="confirmarContraseña"
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Mensaje de Error */}
              {mensajeError && (
                <div className="registro-error-message">{mensajeError}</div>
              )}

              <button
                type="submit"
                className="btn btn-primary registro-submit-btn"
              >
                Registrar Paciente
              </button>
              <div className="login-link">
                ¿Ya tienes cuenta?{" "}
                <Link to="/login-paciente">Inicia sesión</Link>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default RegistroPaciente;
