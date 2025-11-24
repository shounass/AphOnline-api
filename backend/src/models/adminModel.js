import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    rol: { type: String, default: "admin" },
    foto: { type: String, default: "https://cdn-icons-png.flaticon.com/512/2304/2304226.png" } // Avatar de jefe
  },
  { timestamps: true }
);

export default mongoose.model("Admin", adminSchema);