import express from "express";
import { obtenerMisRecetas, crearReceta } from "../controllers/recetaController.js";
import auth from "../../middleware/auth.js";

const router = express.Router();

// GET /api/recetas (Protegida)
router.get("/", auth, obtenerMisRecetas);

// POST /api/recetas (Pública por ahora para pruebas)
router.post("/", crearReceta);

export default router;