import mongoose from "mongoose";

const pacienteSchema = new mongoose.Schema(
  {
    tipoDocumento: {
      type: String,
      required: [true, "El tipo de documento es obligatorio"],
      enum: ["CC", "CE", "TI", "PP", "RC"]
    },
    documento: {
      type: String,
      required: [true, "El número de documento es obligatorio"],
      unique: true,
      trim: true
    },
    password: {
      type: String,
      required: true,
      minlength: 6
    },
    nombre: { type: String, required: true, trim: true },
    apellido: { type: String, required: true, trim: true },
    
    // --- CAMPOS NUEVOS Y ACTUALIZADOS ---
    fechaNacimiento: { type: Date, required: true },
    sexo: { 
      type: String, 
      required: true, 
      enum: ["Masculino", "Femenino", "Otro"] 
    },
    eps: { type: String, required: true },
    estrato: { type: Number, required: true, min: 1, max: 6 },
    ciudad: { type: String, required: true },
    estadoCivil: { 
      type: String, 
      enum: ["Soltero", "Casado", "Union Libre", "Viudo", "Divorciado"],
      default: "Soltero"
    },
    ocupacion: { type: String, default: "Hogar" },
    telefono: { type: String, required: true },
    email: { type: String, trim: true, lowercase: true },
    direccion: { type: String, required: true },
    rh: { type: String, required: true },
    
    // --- PERFIL ---
    foto: { type: String, default: "" },
    biografia: { type: String, default: "" },
    
    // --- MÉDICOS ---
    enfermedades: { type: [String], default: [] },
    alergias: { type: [String], default: [] },
    tratamientos: { type: [String], default: [] },
    
    rol: { type: String, default: "paciente" },
    estado: { type: Boolean, default: true }
  },
  { timestamps: true }
);

pacienteSchema.methods.toJSON = function () {
  const paciente = this.toObject();
  delete paciente.password;
  delete paciente.__v;
  return paciente;
};

export default mongoose.model("Paciente", pacienteSchema);