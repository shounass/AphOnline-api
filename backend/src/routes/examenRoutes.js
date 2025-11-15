import express from "express";
import { obtenerMisExamenes, crearExamen } from "../controllers/examenController.js";
import auth from "../../middleware/auth.js";

const router = express.Router();

router.get("/", auth, obtenerMisExamenes);
router.post("/", crearExamen);

export default router;