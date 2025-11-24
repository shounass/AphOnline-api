import express from "express";
import { 
  verMiHistoria, 
  crearHistoria, 
  verHistoriaPorPacienteId,
  agregarEvolucion,       // <-- Nuevo
  actualizarDatosClinicos // <-- Nuevo
} from "../controllers/historiaClinicaController.js";
import auth from "../../middleware/auth.js";

const router = express.Router();

// Rutas Paciente
router.get("/", auth, verMiHistoria);

// Rutas Médico
router.get("/paciente/:id", auth, verHistoriaPorPacienteId); // Ver
router.post("/", crearHistoria); // Crear base
router.post("/evolucion/:id", auth, agregarEvolucion); // Agregar nota (ID Paciente)
router.put("/datos/:id", auth, actualizarDatosClinicos); // Editar datos (ID Paciente)

export default router;