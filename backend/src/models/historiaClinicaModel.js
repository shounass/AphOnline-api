import mongoose from "mongoose";

const historiaClinicaSchema = new mongoose.Schema(
  {
    pacienteId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Paciente", 
      required: true,
      unique: true // Un paciente solo tiene UNA historia clínica (documento principal)
    },
    antecedentes: { type: String, default: "Sin antecedentes registrados." },
    enfermedadesActuales: [{ type: String }], // Array de strings
    medicamentosActuales: [{ type: String }], // Array de strings
    cirugias: [{ type: String }],             // Array de strings
    
    // Referencia a las citas pasadas
    historiaCitas: [{ 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Cita" 
    }]
  },
  { timestamps: true }
);

export default mongoose.model("HistoriaClinica", historiaClinicaSchema);