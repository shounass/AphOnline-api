import express from "express";
import { obtenerMedicos, registrarMedico, loginMedico } from "../controllers/medicoController.js";

const router = express.Router();

// Rutas Públicas
router.get("/", obtenerMedicos); // Para que los pacientes vean la lista
router.post("/registro", registrarMedico); // Para crear doctores (Idealmente sería admin, pero lo usaremos para crear tu cuenta)
router.post("/login", loginMedico); // Para entrar al dash

export default router;