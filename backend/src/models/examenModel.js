import mongoose from "mongoose";

const examenSchema = new mongoose.Schema(
  {
    pacienteId: { type: mongoose.Schema.Types.ObjectId, ref: "Paciente", required: true },
    medicoId: { type: mongoose.Schema.Types.ObjectId, ref: "Medico", required: true },
    
    tipo: { 
      type: String, 
      enum: ["Laboratorio", "Imagenología", "Procedimiento", "Otro"], 
      required: true 
    },
    nombre: { type: String, required: true }, // Ej: "Hemograma Completo"
    resultado: { type: String, default: "Pendiente" }, // O URL del archivo en el futuro
    observaciones: { type: String },
    
    fechaRealizacion: { type: Date, default: Date.now },
    estado: { type: String, enum: ["Pendiente", "Disponible"], default: "Pendiente" }
  },
  { timestamps: true }
);

export default mongoose.model("Examen", examenSchema);