import mongoose from "mongoose";

const citaSchema = new mongoose.Schema(
  {
    pacienteId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Paciente", 
      required: true 
    },
    medicoId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Medico", 
      required: true 
    },
    fecha: { type: Date, required: true }, // Ej: 2025-11-15
    hora: { type: String, required: true },  // Ej: "10:00"
    motivo: { type: String, required: true },
    tipo: { 
      type: String, 
      enum: ["Presencial", "Virtual"], 
      default: "Presencial" 
    },
    estado: { 
      type: String, 
      enum: ["Pendiente", "Confirmada", "Cancelada", "Completada"], 
      default: "Pendiente" 
    },
    notas: { type: String }
  },
  { timestamps: true }
);

export default mongoose.model("Cita", citaSchema);