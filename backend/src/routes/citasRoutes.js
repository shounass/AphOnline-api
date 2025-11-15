import express from "express";
// 👇 AQUÍ ESTABA EL ERROR: Faltaba importar verCitasMedico y atenderCita
import { 
  agendarCita, 
  obtenerMisCitas, 
  cancelarCita, 
  reprogramarCita,
  verCitasMedico, // <--- AGREGA ESTA
  atenderCita     // <--- AGREGA ESTA
} from "../controllers/citaController.js";

import auth from "../../middleware/auth.js";

const router = express.Router();

// ... (resto de tus rutas) ...
router.post("/", auth, agendarCita);
router.get("/", auth, obtenerMisCitas);
router.put("/cancelar/:id", auth, cancelarCita);
router.put("/reprogramar/:id", auth, reprogramarCita);

// Rutas Médico
router.get("/medico", auth, verCitasMedico);
router.put("/atender/:id", auth, atenderCita);

export default router;