import express from "express";
import { 
  obtenerMedicos, 
  registrarMedico, 
  loginMedico,
  obtenerReporte,    // <-- Nuevo
  actualizarHorario  // <-- Nuevo
} from "../controllers/medicoController.js";
import auth from "../../middleware/auth.js"; // <-- Importante

const router = express.Router();

// Rutas Públicas
router.get("/", obtenerMedicos);
router.post("/registro", registrarMedico);
router.post("/login", loginMedico);

// Rutas Privadas (Solo Médico Logueado)
router.get("/reporte", auth, obtenerReporte);     // Para los gráficos/datos
router.put("/horario", auth, actualizarHorario);  // Para cambiar el texto del horario

export default router;