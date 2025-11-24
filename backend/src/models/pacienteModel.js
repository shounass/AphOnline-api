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
    
    fechaNacimiento: { type: Date, required: true },
    sexo: { type: String, required: true, enum: ["Masculino", "Femenino", "Otro"] },
    eps: { type: String, required: true },
    estrato: { type: Number, required: true },
    ciudad: { type: String, required: true },
    estadoCivil: { type: String, default: "Soltero" },
    ocupacion: { type: String, default: "Hogar" },
    telefono: { type: String, required: true },
    
    // Email simple (sin regex complicada en BD si prefieres, o déjala si funciona bien)
    email: {
      type: String,
      trim: true,
      lowercase: true,
      required: true
    },
    
    direccion: { type: String, required: true },
    rh: { type: String, required: true },
    
    foto: { type: String, default: "" },
    biografia: { type: String, default: "" },
    
    enfermedades: { type: [String], default: [] },
    alergias: { type: [String], default: [] },
    tratamientos: { type: [String], default: [] },
    
    rol: { type: String, default: "paciente" },
    estado: { type: Boolean, default: true },

    // --- CAMBIO: CONFIRMADO POR DEFECTO TRUE ---
    confirmado: { type: Boolean, default: true }, 
    tokenConfirmacion: { type: String, default: "" }
  },
  { timestamps: true }
);

pacienteSchema.methods.toJSON = function () {
  const paciente = this.toObject();
  delete paciente.password;
  delete paciente.__v;
  delete paciente.tokenConfirmacion;
  return paciente;
};

export default mongoose.model("Paciente", pacienteSchema);