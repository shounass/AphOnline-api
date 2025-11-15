import mongoose from "mongoose";

const recetaSchema = new mongoose.Schema(
  {
    pacienteId: { type: mongoose.Schema.Types.ObjectId, ref: "Paciente", required: true },
    medicoId: { type: mongoose.Schema.Types.ObjectId, ref: "Medico", required: true },
    citaId: { type: mongoose.Schema.Types.ObjectId, ref: "Cita" }, // Opcional, para saber de qué cita salió
    
    medicamentos: [
      {
        nombre: { type: String, required: true }, // Ej: Acetaminofén
        dosis: { type: String, required: true },  // Ej: 500mg
        duracion: { type: String, required: true }, // Ej: Cada 8 horas por 3 días
        indicaciones: { type: String } // Ej: Tomar con comidas
      }
    ],
    
    fechaExpedicion: { type: Date, default: Date.now },
    fechaVencimiento: { type: Date }, // Para saber si la receta sigue vigente
    estado: { type: String, enum: ["Activa", "Vencida", "Reclamada"], default: "Activa" }
  },
  { timestamps: true }
);

export default mongoose.model("Receta", recetaSchema);