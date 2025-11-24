import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

// Importar RUTAS
import pacientesRoutes from "./src/routes/pacientesRoutes.js";
import usuariosRoutes from "./src/routes/usuariosRoutes.js";
import medicosRoutes from "./src/routes/medicosRoutes.js";
import citasRoutes from "./src/routes/citasRoutes.js";
import historiasClinicasRoutes from "./src/routes/historiasClinicasRoutes.js";
import recetasRoutes from "./src/routes/recetasRoutes.js";
import examenRoutes from "./src/routes/examenRoutes.js";
import authRoutes from "./src/routes/authRoutes.js";
import adminRoutes from "./src/routes/adminRoutes.js";

// --- Configuración Inicial ---
dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;

// --- Configuración de CORS ---
// (Aquí está la magia, mi amor)
const allowedOrigins = [
  "http://localhost:3000", // Para tu PC
  "http://localhost:5173", // Para tu PC (si usas Vite)
  "https://aphonline-frontend.onrender.com", // La que teníamos antes (por si acaso)
  "https://aphonline-api-frontend.onrender.com", // <-- ¡LA BUENA! La de tu captura
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Permitir apps sin origen (como Postman)
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = "La política CORS no permite el acceso desde este origen.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

// --- Conexión a MongoDB ---
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Conectado a MongoDB"))
  .catch((error) => console.error("❌ Error al conectar a MongoDB:", error));

// --- Middlewares ---
// (Solo estos dos, ya CORS está configurado arriba)
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// --- Definición de Rutas de la API ---
app.use("/api/auth", authRoutes);
app.use("/api/pacientes", pacientesRoutes);
app.use("/api/usuarios", usuariosRoutes);
app.use("/api/medicos", medicosRoutes);
app.use("/api/citas", citasRoutes);
app.use("/api/historias", historiasClinicasRoutes);
app.use("/api/recetas", recetasRoutes);
app.use("/api/examenes", examenRoutes);
app.use("/api/admin", adminRoutes);

// Ruta raíz de prueba
app.get("/", (req, res) => {
  res.send("🩺 API de Aphonline funcionando (CORS Corregido).");
});

// --- Iniciar Servidor ---
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});