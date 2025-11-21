import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Contexto
import { useAuth } from "./context/AuthContext";

// Componentes Globales
import Navbar from "./components/navbar.jsx";
import Footer from "./components/footer.jsx";
import SessionModal from "./components/SessionModal.jsx";

// Páginas Públicas
import Inicio from "./pages/inicio.jsx";
import AcercaDe from "./pages/AcercaDe.jsx";
import Blog from "./pages/Blog.jsx";
import PQRS from "./pages/PQRS.jsx";
import Contacto from "./pages/Contacto.jsx";

// Páginas de Autenticación
import Login from "./pages/loginPaciente.jsx"; // Login Unificado
import RegistroPaciente from "./pages/registroPaciente.jsx";

// Páginas del PACIENTE
import DashboardPaciente from "./pages/DashboardPaciente.jsx";
import CitasPaciente from "./pages/CitasPaciente.jsx";
import HistoriaClinica from "./pages/HistoriaClinica.jsx";
import MisRecetas from "./pages/MisRecetas.jsx";
import MisExamenes from "./pages/MisExamenes.jsx";
import Perfil from "./pages/Perfil.jsx";

// Páginas del MÉDICO (¡Aquí están las nuevas!)
import DashboardMedico from "./pages/DashboardMedico.jsx";
import AgendaMedico from "./pages/AgendaMedico.jsx";
import PacientesMedico from "./pages/PacientesMedico.jsx";

// Placeholder para rutas no terminadas (por si acaso)
const PlaceholderPage = ({ title }) => (
  <div
    style={{
      padding: "40px",
      minHeight: "60vh",
      textAlign: "center",
      color: "#666",
    }}
  >
    <h2>🚧 {title}</h2>
    <p>Esta página está en construcción o no existe.</p>
  </div>
);

function App() {
  const { usuario } = useAuth();

  return (
    <Router>
      <SessionModal />
      <Navbar />

      <main>
        <Routes>
          {/* --- RUTAS PÚBLICAS --- */}
          <Route path="/" element={<Inicio />} />
          <Route path="/acerca-de" element={<AcercaDe />} />
          <Route path="/blog" element={<Blog />} />
          <Route
            path="/blog/:postId"
            element={<PlaceholderPage title="Detalle del Artículo" />}
          />
          <Route path="/pqrs" element={<PQRS />} />
          <Route path="/contacto" element={<Contacto />} />
          {/* --- AUTH --- */}
          <Route path="/login-paciente" element={<Login />} />
          <Route path="/registro-paciente" element={<RegistroPaciente />} />
          {/* --- RUTAS PACIENTE --- */}
          <Route path="/dashboard-paciente" element={<DashboardPaciente />} />
          <Route path="/citas" element={<CitasPaciente />} />
          <Route path="/agendar-cita" element={<CitasPaciente />} />{" "}
          {/* Redirección por compatibilidad */}
          <Route path="/historia-clinica" element={<HistoriaClinica />} />
          <Route path="/recetas" element={<MisRecetas />} />
          <Route path="/examenes" element={<MisExamenes />} />
          <Route path="/perfil" element={<Perfil />} />
          {/* --- RUTAS MÉDICO (¡CONECTADAS!) --- */}
          <Route path="/dashboard-medico" element={<DashboardMedico />} />
          <Route path="/agenda-medico" element={<AgendaMedico />} />
          <Route path="/pacientes-medico" element={<PacientesMedico />} />
          {/* --- 404 --- */}
          <Route
            path="*"
            element={<PlaceholderPage title="404 - Página no encontrada" />}
          />
        </Routes>
      </main>

      {/* Ocultar footer si hay usuario logueado */}
      {!usuario && <Footer />}
    </Router>
  );
}

export default App;
