import Admin from "../models/adminModel.js";
import Medico from "../models/medicoModel.js";
import Paciente from "../models/pacienteModel.js";
import Cita from "../models/citaModel.js";
import HistoriaClinica from "../models/historiaClinicaModel.js"; // Importante
import Receta from "../models/recetaModel.js"; // Importante
import Examen from "../models/examenModel.js"; // Importante
import bcrypt from "bcryptjs";

// 1. Crear Admin
export const registrarAdmin = async (req, res) => {
  try {
    const { nombre, email, password } = req.body;
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const nuevoAdmin = new Admin({ nombre, email, password: passwordHash });
    await nuevoAdmin.save();
    res.json({ msg: "Admin creado" });
  } catch (error) { 
    res.status(500).json({ msg: "Error al crear admin", error: error.message });
  }
};

// 2. Estadísticas
export const obtenerEstadisticas = async (req, res) => {
  try {
    const [totalMedicos, totalPacientes, totalCitas, citasPendientes] = await Promise.all([
      Medico.countDocuments(),
      Paciente.countDocuments(),
      Cita.countDocuments(),
      Cita.countDocuments({ estado: "Pendiente" })
    ]);
    res.json({ medicos: totalMedicos, pacientes: totalPacientes, citas: totalCitas, pendientes: citasPendientes });
  } catch (error) { res.status(500).json({ msg: "Error cargando estadísticas" }); }
};

// 3. Listar Usuarios
export const listarUsuarios = async (req, res) => {
  try {
    const medicos = await Medico.find().select("-password");
    const pacientes = await Paciente.find().select("-password");
    res.json({ medicos, pacientes });
  } catch (error) { res.status(500).json({ msg: "Error listando usuarios" }); }
};

// 4. ELIMINAR USUARIO (CORREGIDO: USA REQ.PARAMS)
export const eliminarUsuario = async (req, res) => {
  try {
    // Leemos de la URL: /api/admin/usuario/:id/:tipo
    const { id, tipo } = req.params; 
    
    if (tipo === 'medico') {
      await Medico.findByIdAndDelete(id);
      await Cita.deleteMany({ medicoId: id });
    } else {
      // Borrado en cascada para paciente
      await Paciente.findByIdAndDelete(id);
      await Cita.deleteMany({ pacienteId: id });
      await HistoriaClinica.deleteOne({ pacienteId: id });
      await Receta.deleteMany({ pacienteId: id });
      await Examen.deleteMany({ pacienteId: id });
    }
    
    res.json({ msg: "Usuario eliminado correctamente" });
  } catch (error) {
    console.error("Error en eliminarUsuario:", error);
    res.status(500).json({ msg: "Error eliminando usuario" });
  }
};

// 5. Cambiar Contraseña
export const cambiarPasswordUsuario = async (req, res) => {
  try {
    const { id, tipo, nuevaPassword } = req.body;
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(nuevaPassword, salt);

    if (tipo === 'medico') {
      await Medico.findByIdAndUpdate(id, { password: passwordHash });
    } else {
      await Paciente.findByIdAndUpdate(id, { password: passwordHash });
    }

    res.json({ msg: "Contraseña actualizada correctamente" });
  } catch (error) { res.status(500).json({ msg: "Error al cambiar contraseña" }); }
};