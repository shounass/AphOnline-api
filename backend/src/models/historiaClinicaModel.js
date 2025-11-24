import mongoose from "mongoose";

const historiaClinicaSchema = new mongoose.Schema(
  {
    pacienteId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Paciente", 
      required: true,
      unique: true 
    },
    antecedentes: { type: String, default: "Sin antecedentes registrados." },
    
    // Arrays de strings para datos rápidos
    enfermedadesActuales: [{ type: String }], 
    medicamentosActuales: [{ type: String }], 
    cirugias: [{ type: String }],             
    alergias: [{ type: String }], // Aseguramos que este campo exista explícitamente

    // --- NUEVO: EVOLUCIONES MÉDICAS (Notas de progreso) ---
    evoluciones: [
      {
        fecha: { type: Date, default: Date.now },
        nota: { type: String, required: true },
        medico: { type: String } // Guardamos el nombre del médico que escribió
      }
    ],

    // Referencia a las citas (Automático)
    historiaCitas: [{ 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Cita" 
    }]
  },
  { timestamps: true }
);

export default mongoose.model("HistoriaClinica", historiaClinicaSchema);