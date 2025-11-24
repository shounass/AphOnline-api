import express from "express";
import { 
  registrarAdmin, 
  obtenerEstadisticas, 
  listarUsuarios, 
  eliminarUsuario,
  cambiarPasswordUsuario
} from "../controllers/adminController.js";
import auth from "../../middleware/auth.js";

const router = express.Router();

router.post("/crear-jefe", registrarAdmin);

// Rutas Privadas
router.get("/dashboard", auth, obtenerEstadisticas);
router.get("/usuarios", auth, listarUsuarios);

// 👇 RUTA CORREGIDA: Acepta ID y TIPO en la URL 👇
router.delete("/usuario/:id/:tipo", auth, eliminarUsuario);

router.put("/password", auth, cambiarPasswordUsuario);

export default router;