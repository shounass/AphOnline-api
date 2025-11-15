import e from "express";
import mongoose from "mongoose";

const usuarioSchema = new mongoose.Schema({
  nombre: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  rol: {
    type: String,
    enum: ["admin", "medico", "paciente"],
    required: true,
  },
  
});

export default mongoose.model("Usuario", usuarioSchema);
