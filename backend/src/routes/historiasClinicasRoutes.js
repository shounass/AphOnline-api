import express from "express";
import { verMiHistoria, crearHistoria } from "../controllers/historiaClinicaController.js";
import auth from "../../middleware/auth.js";

const router = express.Router();

// GET /api/historias -> Ver mi propia historia (Requiere Token)
router.get("/", auth, verMiHistoria);

// POST /api/historias -> Crear historia (Para pruebas, lo dejamos público o puedes poner auth si prefieres)
router.post("/", crearHistoria);

export default router;