import express from "express";
import { 
  agendarCita, 
  obtenerMisCitas, 
  cancelarCita, 
  reprogramarCita,
  verCitasMedico, 
  atenderCita,
  confirmarCita,
  proponerCambio,
  aceptarPropuesta,
  obtenerHorasOcupadas // <-- NUEVA IMPORTACIÓN
} from "../controllers/citaController.js";

import auth from "../../middleware/auth.js";

const router = express.Router();

// Rutas Generales
router.post("/", auth, agendarCita);
router.get("/", auth, obtenerMisCitas);
router.put("/cancelar/:id", auth, cancelarCita);
router.put("/reprogramar/:id", auth, reprogramarCita);

// --- NUEVA RUTA PARA VER DISPONIBILIDAD (Pública o Privada, la dejaremos con auth) ---
router.get("/disponibilidad", auth, obtenerHorasOcupadas);

// Rutas Paciente
router.put("/aceptar-propuesta/:id", auth, aceptarPropuesta);

// Rutas Médico
router.get("/medico", auth, verCitasMedico);
router.put("/atender/:id", auth, atenderCita);
router.put("/confirmar/:id", auth, confirmarCita);
router.put("/proponer/:id", auth, proponerCambio);

export default router;