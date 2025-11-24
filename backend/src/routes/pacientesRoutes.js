import express from "express";
// 1. IMPORTACIÓN ÚNICA (Aquí están todas las funciones juntas)
import { 
  registrarPaciente, 
  loginPaciente, 
  obtenerPerfil, 
  actualizarPerfil, 
  buscarPorDocumento,
  actualizarPacientePorId,
  confirmarCuenta 
} from "../controllers/pacienteController.js";

import auth from "../../middleware/auth.js"; 

const router = express.Router();

// --- Rutas Públicas ---
router.post("/registrar", registrarPaciente);
router.post("/login", loginPaciente);
router.get("/confirmar/:token", confirmarCuenta);

// --- Rutas Privadas (Paciente) ---
router.get("/perfil", auth, obtenerPerfil);
router.put("/perfil", auth, actualizarPerfil);

// --- Rutas para Médicos ---
router.get("/buscar/:documento", auth, buscarPorDocumento);
router.put("/gestion/:id", auth, actualizarPacientePorId);

export default router;