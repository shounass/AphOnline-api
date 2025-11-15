import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

// Importar RUTAS
// Asegúrate de que las rutas relativas sean correctas desde la raíz de /backend
import pacientesRoutes from "./src/routes/pacientesRoutes.js";
import usuariosRoutes from "./src/routes/usuariosRoutes.js"; 
import medicosRoutes from "./src/routes/medicosRoutes.js"; 
import citasRoutes from "./src/routes/citasRoutes.js";
import historiasClinicasRoutes from "./src/routes/historiasClinicasRoutes.js";
import recetasRoutes from "./src/routes/recetasRoutes.js";
import examenRoutes from "./src/routes/examenRoutes.js";
import authRoutes from "./src/routes/authRoutes.js";
// (Añade aquí las otras rutas de tu README: medicos, citas, etc.)

const cors = require('cors');

// Lista de sitios permitidos (Whitelist)
const allowedOrigins = [
  "http://localhost:3000",                         // Para cuando trabajas en tu PC
  "http://localhost:5173",                         // (Opcional) Por si usas Vite a veces
  "https://aphonline-api-frontend.onrender.com"        // <--- ¡AQUÍ PEGAS TU URL DE RENDER!
];

app.use(cors({
  origin: function (origin, callback) {
    // Permitir solicitudes sin origen (como Postman o Apps móviles)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'La política CORS no permite el acceso desde este origen.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true // Importante para las cookies o headers de autorización
}));

// --- Configuración ---
dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;

// --- Conexión a MongoDB ---
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Conectado a MongoDB"))
  .catch((error) => console.error("❌ Error al conectar a MongoDB:", error));

// --- Middlewares ---
app.use(cors()); // Permite solicitudes del frontend
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true })); // Permite a Express leer JSON del body

// --- Definición de Rutas de la API ---
// "Cuando alguien vaya a /api/pacientes, usa el archivo pacientesRoutes"
app.use("/api/auth", authRoutes);
app.use("/api/pacientes", pacientesRoutes);
app.use("/api/usuarios", usuariosRoutes);
app.use("/api/medicos", medicosRoutes);
app.use("/api/citas", citasRoutes);
app.use("/api/historias", historiasClinicasRoutes);
app.use("/api/recetas", recetasRoutes);
app.use("/api/examenes", examenRoutes);
// (Añade aquí las otras app.use(...) para tus otras rutas)

// Ruta raíz de prueba
app.get("/", (req, res) => {
  res.send("🩺 API de Aphonline funcionando.");
});

// --- Iniciar Servidor ---
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});
