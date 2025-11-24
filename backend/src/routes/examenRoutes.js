import express from "express";
import { obtenerMisExamenes, crearOrdenExamen, verExamenesPorPaciente, subirResultado } from "../controllers/examenController.js";
import auth from "../../middleware/auth.js";


const router = express.Router();

// Rutas Paciente
router.get("/", auth, obtenerMisExamenes);

// Rutas Médico
router.post("/ordenar", auth, crearOrdenExamen);       // Crear nueva orden
router.get("/paciente/:id", auth, verExamenesPorPaciente); // Ver historial de un paciente
router.put("/:id/resultado", auth, subirResultado);

export default router;