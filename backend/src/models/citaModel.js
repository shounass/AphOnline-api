import mongoose from "mongoose";

const citaSchema = new mongoose.Schema(
 {
    pacienteId: { type: mongoose.Schema.Types.ObjectId, ref: "Paciente", required: true },
    medicoId: { type: mongoose.Schema.Types.ObjectId, ref: "Medico", required: true },
    fecha: { type: Date, required: true },
    hora: { type: String, required: true },
    motivo: { type: String, required: true },
    tipo: { type: String, enum: ["Presencial", "Virtual"], default: "Presencial" },
    
    // --- NUEVOS ESTADOS Y CAMPOS ---
    estado: { 
      type: String, 
      // Pendiente: Paciente pidió, médico no ha visto.
      // Confirmada: Médico aceptó (¡Notificación!).
      // Propuesta: Médico sugiere otra hora (¡Notificación!).
      // Completada: Ya pasó.
      // Cancelada: Se borró.
      enum: ["Pendiente", "Confirmada", "Propuesta", "Completada", "Cancelada"], 
      default: "Pendiente" 
    },
    
    // Si el médico propone cambio, guardamos aquí la nueva opción
    propuesta: {
      fecha: { type: Date },
      hora: { type: String },
      mensaje: { type: String }
    },
    
    notas: { type: String }
  },
  { timestamps: true }
);

// 1. Agendar (Con validación de disponibilidad)
export const agendarCita = async (req, res) => {
  try {
    const { medicoId, fecha, hora, motivo, tipo } = req.body;

    // VERIFICAR DISPONIBILIDAD: ¿El médico ya tiene cita a esa hora?
    const ocupado = await Cita.findOne({
      medicoId,
      fecha,
      hora,
      estado: { $in: ["Pendiente", "Confirmada"] } // Si está pendiente o confirmada, está ocupado
    });

    if (ocupado) {
      return res.status(400).json({ msg: "El médico no está disponible en ese horario." });
    }

    const nuevaCita = new Cita({
      pacienteId: req.usuario.id,
      medicoId,
      fecha,
      hora,
      motivo,
      tipo
    });

    await nuevaCita.save();
    res.status(201).json({ msg: "Solicitud enviada al médico", cita: nuevaCita });
  } catch (error) {
    res.status(500).json({ msg: "Error al agendar" });
  }
};

// 2. Médico Confirma la Cita
export const confirmarCita = async (req, res) => {
  try {
    // Solo cambiamos estado a Confirmada
    const cita = await Cita.findByIdAndUpdate(req.params.id, { estado: "Confirmada" }, { new: true });
    res.json({ msg: "Cita confirmada", cita });
  } catch (error) {
    res.status(500).json({ msg: "Error al confirmar" });
  }
};

// 3. Médico Propone Cambio (Reprogramación Sugerida)
export const proponerCambio = async (req, res) => {
  try {
    const { fecha, hora, mensaje } = req.body;
    
    // Verificar que el médico esté libre en la NUEVA fecha
    const ocupado = await Cita.findOne({
      medicoId: req.usuario.id, // Soy yo, el médico
      fecha,
      hora,
      estado: { $in: ["Pendiente", "Confirmada"] }
    });

    if (ocupado) return res.status(400).json({ msg: "Ya tienes otra cita en el horario que propones." });

    const cita = await Cita.findByIdAndUpdate(
      req.params.id,
      { 
        estado: "Propuesta", // Cambia estado para notificar al paciente
        propuesta: { fecha, hora, mensaje }
      },
      { new: true }
    );
    res.json({ msg: "Propuesta enviada al paciente", cita });
  } catch (error) {
    res.status(500).json({ msg: "Error al proponer cambio" });
  }
};

// 4. Paciente Acepta la Propuesta
export const aceptarPropuesta = async (req, res) => {
  try {
    const citaOriginal = await Cita.findById(req.params.id);
    
    if (!citaOriginal.propuesta.fecha) return res.status(400).json({ msg: "No hay propuesta para aceptar" });

    // Actualizamos la cita con los datos de la propuesta y la confirmamos
    citaOriginal.fecha = citaOriginal.propuesta.fecha;
    citaOriginal.hora = citaOriginal.propuesta.hora;
    citaOriginal.estado = "Confirmada";
    citaOriginal.propuesta = undefined; // Borramos la propuesta ya aceptada
    
    await citaOriginal.save();
    res.json({ msg: "Cita reprogramada exitosamente", cita: citaOriginal });
  } catch (error) {
    res.status(500).json({ msg: "Error al aceptar propuesta" });
  }
};

export default mongoose.model("Cita", citaSchema);