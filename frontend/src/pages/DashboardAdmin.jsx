import React, { useState, useEffect } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import "./dashboardAdmin.css";

const DashboardAdmin = () => {
  const { token, usuario } = useAuth();
  const [stats, setStats] = useState(null);
  const [listas, setListas] = useState({ medicos: [], pacientes: [] });
  const [tabActiva, setTabActiva] = useState("resumen");

  const [nuevoMedico, setNuevoMedico] = useState({
    nombre: "",
    apellido: "",
    email: "",
    password: "",
    especialidad: "",
    numeroLicencia: "",
    documento: "",
  });

  const [modalPass, setModalPass] = useState(false);
  const [usuarioEditando, setUsuarioEditando] = useState(null);
  const [nuevaPass, setNuevaPass] = useState("");

  const cargarData = async () => {
    try {
      const config = { headers: { Authorization: token } };
      const resStats = await api.get("/admin/dashboard", config);
      const resListas = await api.get("/admin/usuarios", config);
      setStats(resStats.data);
      setListas(resListas.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (token) cargarData();
  }, [token]);

  const validarPasswordSegura = (password) => {
    const fuerte = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!fuerte.test(password)) {
      alert(
        "🚫 Contraseña débil. Requisitos:\n- Min 8 caracteres\n- 1 Mayúscula\n- 1 Número\n- 1 Símbolo"
      );
      return false;
    }
    return true;
  };

  const handleCrearMedico = async (e) => {
    e.preventDefault();
    if (!validarPasswordSegura(nuevoMedico.password)) return;
    try {
      await api.post("/medicos/registro", nuevoMedico);
      alert("✅ Médico creado exitosamente.");
      setNuevoMedico({
        nombre: "",
        apellido: "",
        email: "",
        password: "",
        especialidad: "",
        numeroLicencia: "",
        documento: "",
      });
      cargarData();
    } catch (error) {
      alert(
        "Error al crear médico: " +
          (error.response?.data?.msg || "Error desconocido")
      );
    }
  };

  // --- ELIMINAR USUARIO (CORREGIDO) ---
  const handleEliminar = async (id, tipo) => {
    if (
      !window.confirm(
        `¿Seguro que deseas eliminar a este ${tipo}? Se borrará TODO su historial.`
      )
    )
      return;

    try {
      const config = { headers: { Authorization: token } };

      // 👇 URL CORRECTA CON BACKTICKS (`) 👇
      await api.delete(`/admin/usuario/${id}/${tipo}`, config);

      alert("Usuario eliminado correctamente.");
      cargarData();
    } catch (error) {
      console.error("Error en frontend:", error);
      alert("Error al eliminar usuario.");
    }
  };

  const abrirModalPass = (user, tipo) => {
    setUsuarioEditando({ ...user, tipo });
    setNuevaPass("");
    setModalPass(true);
  };

  const handleGuardarPass = async (e) => {
    e.preventDefault();
    if (!nuevaPass) return alert("Escribe una contraseña");
    if (!validarPasswordSegura(nuevaPass)) return;
    try {
      const config = { headers: { Authorization: token } };
      await api.put(
        "/admin/password",
        {
          id: usuarioEditando._id,
          tipo: usuarioEditando.tipo,
          nuevaPassword: nuevaPass,
        },
        config
      );
      alert("🔐 Contraseña actualizada.");
      setModalPass(false);
    } catch (error) {
      alert("Error al actualizar");
    }
  };

  return (
    <div className="admin-wrapper">
      <header className="admin-header">
        <h1>👑 Panel de Administración</h1>
        <p>Bienvenido, {usuario?.nombre}</p>
      </header>

      <div className="admin-tabs">
        <button
          className={tabActiva === "resumen" ? "active" : ""}
          onClick={() => setTabActiva("resumen")}
        >
          📊 Estadísticas
        </button>
        <button
          className={tabActiva === "medicos" ? "active" : ""}
          onClick={() => setTabActiva("medicos")}
        >
          👨‍⚕️ Gestión Médicos
        </button>
        <button
          className={tabActiva === "pacientes" ? "active" : ""}
          onClick={() => setTabActiva("pacientes")}
        >
          👥 Gestión Pacientes
        </button>
      </div>

      <div className="admin-content">
        {tabActiva === "resumen" && stats && (
          <div className="stats-container">
            <div className="stat-box green">
              <h3>{stats.medicos}</h3>
              <p>Médicos Activos</p>
            </div>
            <div className="stat-box blue">
              <h3>{stats.pacientes}</h3>
              <p>Pacientes Registrados</p>
            </div>
            <div className="stat-box orange">
              <h3>{stats.pendientes}</h3>
              <p>Citas Pendientes</p>
            </div>
            <div className="stat-box purple">
              <h3>{stats.citas}</h3>
              <p>Total Citas Históricas</p>
            </div>
          </div>
        )}

        {tabActiva === "medicos" && (
          <div className="gestion-panel">
            <div className="form-crear-medico">
              <h3>Registrar Nuevo Especialista</h3>
              <form onSubmit={handleCrearMedico}>
                <div className="row-2">
                  <input
                    placeholder="Nombre"
                    value={nuevoMedico.nombre}
                    onChange={(e) =>
                      setNuevoMedico({ ...nuevoMedico, nombre: e.target.value })
                    }
                    required
                  />
                  <input
                    placeholder="Apellido"
                    value={nuevoMedico.apellido}
                    onChange={(e) =>
                      setNuevoMedico({
                        ...nuevoMedico,
                        apellido: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="row-2">
                  <input
                    placeholder="Cédula"
                    value={nuevoMedico.documento}
                    onChange={(e) =>
                      setNuevoMedico({
                        ...nuevoMedico,
                        documento: e.target.value,
                      })
                    }
                    required
                  />
                  <input
                    placeholder="Especialidad"
                    value={nuevoMedico.especialidad}
                    onChange={(e) =>
                      setNuevoMedico({
                        ...nuevoMedico,
                        especialidad: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="row-2">
                  <input
                    placeholder="Email"
                    value={nuevoMedico.email}
                    onChange={(e) =>
                      setNuevoMedico({ ...nuevoMedico, email: e.target.value })
                    }
                    required
                  />
                  <div className="password-wrapper">
                    <input
                      placeholder="Contraseña Segura"
                      type="password"
                      value={nuevoMedico.password}
                      onChange={(e) =>
                        setNuevoMedico({
                          ...nuevoMedico,
                          password: e.target.value,
                        })
                      }
                      required
                      style={{ border: "2px solid #f1c40f" }}
                    />
                  </div>
                </div>
                <input
                  placeholder="Licencia Médica"
                  value={nuevoMedico.numeroLicencia}
                  onChange={(e) =>
                    setNuevoMedico({
                      ...nuevoMedico,
                      numeroLicencia: e.target.value,
                    })
                  }
                  required
                />
                <button type="submit">Crear Médico</button>
              </form>
            </div>
            <div className="lista-usuarios">
              <h3>Médicos Registrados</h3>
              <table>
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Esp</th>
                    <th>Email</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {listas.medicos.map((m) => (
                    <tr key={m._id}>
                      <td>
                        {m.nombre} {m.apellido}
                      </td>
                      <td>{m.especialidad}</td>
                      <td>{m.email}</td>
                      <td>
                        <button
                          className="btn-key"
                          onClick={() => abrirModalPass(m, "medico")}
                          title="Cambiar Contraseña"
                        >
                          🔑
                        </button>
                        <button
                          className="btn-delete"
                          onClick={() => handleEliminar(m._id, "medico")}
                          title="Eliminar"
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tabActiva === "pacientes" && (
          <div className="gestion-panel">
            <h3>Directorio de Pacientes</h3>
            <div className="lista-usuarios">
              <table>
                <thead>
                  <tr>
                    <th>Doc</th>
                    <th>Nombre</th>
                    <th>Email</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {listas.pacientes.map((p) => (
                    <tr key={p._id}>
                      <td>{p.documento}</td>
                      <td>
                        {p.nombre} {p.apellido}
                      </td>
                      <td>{p.email}</td>
                      <td>
                        <button
                          className="btn-key"
                          onClick={() => abrirModalPass(p, "paciente")}
                          title="Cambiar Contraseña"
                        >
                          🔑
                        </button>
                        <button
                          className="btn-delete"
                          onClick={() => handleEliminar(p._id, "paciente")}
                          title="Eliminar"
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {modalPass && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Cambiar Contraseña</h3>
            <p>
              Usuario: <strong>{usuarioEditando?.nombre}</strong>
            </p>
            <form onSubmit={handleGuardarPass}>
              <div className="form-group">
                <label>Nueva Contraseña:</label>
                <input
                  type="text"
                  placeholder="Ej: P@ssw0rd123!"
                  value={nuevaPass}
                  onChange={(e) => setNuevaPass(e.target.value)}
                  required
                />
              </div>
              <div className="modal-actions">
                <button
                  type="button"
                  onClick={() => setModalPass(false)}
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

export default DashboardAdmin;
