import Medico from "../models/medicoModel.js";
import Cita from "../models/citaModel.js"; 
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// ... (registrarMedico, loginMedico, obtenerMedicos IGUALES) ...
// Solo cambia la función de abajo y agrega obtenerReporte si no estaba

export const obtenerMedicos = async (req, res) => {
  try {
    const medicos = await Medico.find({ estado: true }).select("-password");
    res.json(medicos);
  } catch (error) {
    res.status(500).json({ msg: "Error al obtener médicos" });
  }
};

export const obtenerReporte = async (req, res) => {
  try {
    const medicoId = req.usuario.id;
    const total = await Cita.countDocuments({ medicoId });
    const completadas = await Cita.countDocuments({ medicoId, estado: "Completada" });
    const pendientes = await Cita.countDocuments({ medicoId, estado: "Pendiente" });
    const canceladas = await Cita.countDocuments({ medicoId, estado: "Cancelada" });
    
    const citas = await Cita.find({ medicoId }).select("pacienteId");
    const pacientesUnicos = new Set(citas.map(c => c.pacienteId.toString())).size;

    res.json({ total, completadas, pendientes, canceladas, pacientesUnicos });
  } catch (error) {
    res.status(500).json({ msg: "Error reporte" });
  }
};

// --- ACTUALIZADA: Guardar Días Laborales ---
export const actualizarHorario = async (req, res) => {
  try {
    const { horarioAtencion, diasLaborales } = req.body;
    
    const medico = await Medico.findByIdAndUpdate(
      req.usuario.id,
      { horarioAtencion, diasLaborales }, // Actualizamos ambos
      { new: true }
    ).select("-password");

    res.json({ msg: "Configuración de agenda actualizada", medico });
  } catch (error) {
    res.status(500).json({ msg: "Error al actualizar horario" });
  }
};

// ... (Asegúrate de tener registrarMedico y loginMedico al inicio del archivo como antes)
// VOY A PONERLAS AQUÍ RESUMIDAS PARA QUE EL ARCHIVO ESTÉ COMPLETO SI COPIAS Y PEGAS:

export const registrarMedico = async (req, res) => {
  /* ... (Lógica de registro igual a la anterior) ... */
  try {
    const { nombre, apellido, especialidad, numeroLicencia, email, password, telefono, consultorio, documento } = req.body;
    const existe = await Medico.findOne({ email });
    if (existe) return res.status(400).json({ msg: "Email registrado" });
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const nuevo = new Medico({ ...req.body, password: passwordHash, rol: "medico" });
    await nuevo.save();
    res.status(201).json({ msg: "Médico registrado" });
  } catch (e) { res.status(500).json({msg:"Error"}); }
};

export const loginMedico = async (req, res) => {
   /* ... (Lógica de login igual a la anterior) ... */
   try {
    const { documento, password } = req.body; // O email, según tu login unificado usa documento
    // Si usas email en loginMedico específico:
    const { email } = req.body; 
    // Nota: Si usas login unificado en authController, esto es redundante pero útil para pruebas.
    // Asumiremos la lógica estándar:
    const medico = await Medico.findOne({ email }); // O documento
    if(!medico) return res.status(404).json({msg:"No encontrado"});
    const passOK = await bcrypt.compare(password, medico.password);
    if(!passOK) return res.status(400).json({msg:"Password mal"});
    const token = jwt.sign({id:medico._id, rol:"medico"}, process.env.JWT_SECRET, {expiresIn:"12h"});
    res.json({msg:"Login ok", medico, token});
   } catch(e) { res.status(500).json({msg:"Error"}); }
};