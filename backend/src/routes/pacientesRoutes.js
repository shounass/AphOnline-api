import express from "express";
import { registrarPaciente, loginPaciente, obtenerPerfil, actualizarPerfil } from "../controllers/pacienteController.js";
import auth from "../../middleware/auth.js"; 

const router = express.Router();

// Rutas públicas (no necesitan token)
router.post("/registrar", registrarPaciente);
router.post("/login", loginPaciente);

// Rutas privadas (necesitan 'auth')
router.get("/perfil", auth, obtenerPerfil);
router.put("/perfil", auth, actualizarPerfil);

export default router;