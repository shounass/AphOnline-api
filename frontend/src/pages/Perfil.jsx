import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import './perfil.css';

const Perfil = () => {
  const { token } = useAuth();
  const [perfil, setPerfil] = useState(null);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [cargando, setCargando] = useState(true);

  // Estado para el formulario
  const [formData, setFormData] = useState({
    email: '', telefono: '', direccion: '', biografia: '', foto: '',
    estadoCivil: '', ocupacion: '', ciudad: ''
  });

  // --- FUNCIÓN PARA CALCULAR EDAD ---
  const calcularEdad = (fechaNacimiento) => {
    if (!fechaNacimiento) return "--";
    const hoy = new Date();
    const cumple = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - cumple.getFullYear();
    const m = hoy.getMonth() - cumple.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < cumple.getDate())) {
      edad--;
    }
    return edad + " años";
  };

  // Cargar datos del perfil
  useEffect(() => {
    const cargarPerfil = async () => {
      try {
        const config = { headers: { Authorization: token } };
        const { data } = await api.get('/pacientes/perfil', config);
        setPerfil(data);
        setFormData(data); // Llenar formulario
      } catch (error) {
        console.error("Error cargando perfil", error);
      } finally {
        setCargando(false);
      }
    };
    if (token) cargarPerfil();
  }, [token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Convertir foto a Base64
  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setFormData({ ...formData, foto: reader.result });
      };
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: token } };
      const { data } = await api.put('/pacientes/perfil', formData, config);
      setPerfil(data.paciente);
      setModoEdicion(false);
      alert("¡Perfil actualizado con éxito!");
    } catch (error) {
      console.error(error);
      alert("Error al actualizar");
    }
  };

  if (cargando) return <div className="perfil-loading">Cargando perfil...</div>;
  if (!perfil) return <div className="perfil-loading">No se encontró información.</div>;

  return (
    <div className="perfil-wrapper">
      <div className="perfil-card">
        
        {/* --- ENCABEZADO --- */}
        <div className="perfil-header-bg"></div>
        <div className="perfil-avatar-container">
          <img 
            src={modoEdicion ? (formData.foto || perfil.foto) : perfil.foto} 
            alt="Foto de perfil" 
            className="perfil-avatar" 
          />
          {modoEdicion && (
            <div className="upload-btn-wrapper">
              <button className="btn-upload">📷 Cambiar</button>
              <input type="file" accept="image/*" onChange={handleFotoChange} />
            </div>
          )}
        </div>

        {/* --- CUERPO DEL PERFIL --- */}
        <div className="perfil-body">
          {!modoEdicion ? (
            // MODO VISTA
            <>
              <h1>
                {perfil.sexo === 'Femenino' ? 'Sra.' : perfil.sexo === 'Masculino' ? 'Sr.' : ''} {perfil.nombre} {perfil.apellido}
              </h1>
              <p className="perfil-bio">{perfil.biografia}</p>
              
              <div className="perfil-detalles">
                <div className="detalle-item"><strong>🎂 Edad:</strong> <span>{calcularEdad(perfil.fechaNacimiento)}</span></div>
                <div className="detalle-item"><strong>⚧ Sexo:</strong> <span>{perfil.sexo}</span></div>
                <div className="detalle-item"><strong>🏥 EPS:</strong> <span>{perfil.eps} (Estrato {perfil.estrato})</span></div>
                <div className="detalle-item"><strong>💼 Ocupación:</strong> <span>{perfil.ocupacion}</span></div>
                <div className="detalle-item"><strong>💍 Estado Civil:</strong> <span>{perfil.estadoCivil}</span></div>
                <div className="detalle-item"><strong>🏙️ Ciudad:</strong> <span>{perfil.ciudad}</span></div>
                
                <div className="detalle-item"><strong>📧 Email:</strong> <span>{perfil.email}</span></div>
                <div className="detalle-item"><strong>📞 Teléfono:</strong> <span>{perfil.telefono}</span></div>
                <div className="detalle-item"><strong>📍 Dirección:</strong> <span>{perfil.direccion}</span></div>
                <div className="detalle-item"><strong>🩸 RH:</strong> <span>{perfil.rh}</span></div>
              </div>

              <button className="btn-editar" onClick={() => setModoEdicion(true)}>
                ✏️ Editar Datos de Contacto
              </button>
            </>
          ) : (
            // MODO EDICIÓN
            <form onSubmit={handleSubmit} className="perfil-form">
              <h2>Actualizar Información</h2>
              
              <div className="form-group">
                <label>Biografía Corta</label>
                <textarea name="biografia" value={formData.biografia} onChange={handleChange} rows="2"></textarea>
              </div>

              <div className="form-grid">
                <div className="form-group"><label>Email</label><input type="email" name="email" value={formData.email} onChange={handleChange} /></div>
                <div className="form-group"><label>Teléfono</label><input type="text" name="telefono" value={formData.telefono} onChange={handleChange} /></div>
                <div className="form-group"><label>Dirección</label><input type="text" name="direccion" value={formData.direccion} onChange={handleChange} /></div>
                <div className="form-group"><label>Ciudad</label><input type="text" name="ciudad" value={formData.ciudad} onChange={handleChange} /></div>
                <div className="form-group"><label>Ocupación</label><input type="text" name="ocupacion" value={formData.ocupacion} onChange={handleChange} /></div>
                
                <div className="form-group">
                  <label>Estado Civil</label>
                  <select name="estadoCivil" value={formData.estadoCivil} onChange={handleChange}>
                    <option value="Soltero">Soltero/a</option><option value="Casado">Casado/a</option>
                    <option value="Union Libre">Unión Libre</option><option value="Viudo">Viudo/a</option><option value="Divorciado">Divorciado/a</option>
                  </select>
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="btn-cancelar" onClick={() => setModoEdicion(false)}>Cancelar</button>
                <button type="submit" className="btn-guardar">Guardar Cambios</button>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};

export default Perfil;