import mongoose from "mongoose";

const medicoSchema = new mongoose.Schema(
  {
    // --- NUEVO CAMPO UNIFICADOR ---
    documento: { type: String, required: true, unique: true }, 
    // ------------------------------
    
    nombre: { type: String, required: true },
    apellido: { type: String, required: true },
    especialidad: { type: String, required: true },
    numeroLicencia: { type: String, required: true, unique: true },
    telefono: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    
    rol: { type: String, default: "medico" }, // El rol define a dónde va
    
    consultorio: { type: String },
    horarioAtencion: { type: String, default: "8:00 AM - 5:00 PM" },
    estado: { type: Boolean, default: true },
    foto: { type: String, default: "" }
  },
  { timestamps: true }
);

medicoSchema.methods.toJSON = function () {
  const medico = this.toObject();
  delete medico.password;
  delete medico.__v;
  return medico;
};

export default mongoose.model("Medico", medicoSchema);