import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Navbar from "./components/navbar.jsx";
import Footer from "./components/footer.jsx";
import SessionModal from "./components/SessionModal.jsx";

// Páginas
import Inicio from "./pages/inicio.jsx";
import AcercaDe from "./pages/AcercaDe.jsx";
import Blog from "./pages/Blog.jsx";
import PQRS from "./pages/PQRS.jsx";
import Contacto from "./pages/Contacto.jsx";
import Login from "./pages/loginPaciente.jsx";
import RegistroPaciente from "./pages/registroPaciente.jsx";
import ConfirmarCuenta from "./pages/ConfirmarCuenta.jsx"; // <-- IMPORTAR

import DashboardPaciente from "./pages/DashboardPaciente.jsx";
import CitasPaciente from "./pages/CitasPaciente.jsx";
import HistoriaClinica from "./pages/HistoriaClinica.jsx";
import MisRecetas from "./pages/MisRecetas.jsx";
import MisExamenes from "./pages/MisExamenes.jsx";
import Perfil from "./pages/Perfil.jsx";
import DashboardMedico from "./pages/DashboardMedico.jsx";
import AgendaMedico from "./pages/AgendaMedico.jsx";
import PacientesMedico from "./pages/PacientesMedico.jsx";
import DashboardAdmin from "./pages/DashboardAdmin.jsx";

const PlaceholderPage = ({ title }) => (
  <div style={{ padding: "40px", textAlign: "center" }}>
    <h2>🚧 {title}</h2>
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
          {/* Públicas */}
          <Route path="/" element={<Inicio />} />
          <Route path="/acerca-de" element={<AcercaDe />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/pqrs" element={<PQRS />} />
          <Route path="/contacto" element={<Contacto />} />
          {/* Auth */}
          <Route path="/login-paciente" element={<Login />} />
          <Route path="/registro-paciente" element={<RegistroPaciente />} />
          <Route path="/confirmar/:token" element={<ConfirmarCuenta />} />{" "}
          {/* <-- RUTA NUEVA */}
          {/* Paciente */}
          <Route path="/dashboard-paciente" element={<DashboardPaciente />} />
          <Route path="/citas" element={<CitasPaciente />} />
          <Route path="/agendar-cita" element={<CitasPaciente />} />
          <Route path="/historia-clinica" element={<HistoriaClinica />} />
          <Route path="/recetas" element={<MisRecetas />} />
          <Route path="/examenes" element={<MisExamenes />} />
          <Route path="/perfil" element={<Perfil />} />
          {/* Médico */}
          <Route path="/dashboard-medico" element={<DashboardMedico />} />
          <Route path="/agenda-medico" element={<AgendaMedico />} />
          <Route path="/pacientes-medico" element={<PacientesMedico />} />
          {/* Admin */}
          <Route path="/dashboard-admin" element={<DashboardAdmin />} />
          <Route path="*" element={<PlaceholderPage title="404" />} />
        </Routes>
      </main>
      {!usuario && <Footer />}
    </Router>
  );
}

export default App;
