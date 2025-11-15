import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Importa el hook de autenticación para saber si hay usuario
import { useAuth } from './context/AuthContext'; 

// Componentes de Layout
import Navbar from './components/navbar.jsx';
import Footer from './components/footer.jsx';
import SessionModal from './components/SessionModal.jsx'; // El modal de seguridad

// Páginas
import Inicio from './pages/inicio.jsx';
import LoginPaciente from './pages/loginPaciente.jsx'; // Usamos el Login Unificado
import RegistroPaciente from './pages/registroPaciente.jsx';
import DashboardPaciente from './pages/DashboardPaciente.jsx';
import AcercaDe from './pages/AcercaDe.jsx';
import Blog from './pages/Blog.jsx';
import PQRS from './pages/PQRS.jsx';
import Contacto from './pages/Contacto.jsx';
import AgendarCita from './pages/AgendarCita.jsx'; // O CitasPaciente.jsx si ya lo cambiaste
import CitasPaciente from './pages/CitasPaciente.jsx'; // El panel nuevo de citas
import HistoriaClinica from './pages/HistoriaClinica.jsx';
import MisRecetas from './pages/MisRecetas.jsx';
import MisExamenes from './pages/MisExamenes.jsx';
import Perfil from './pages/Perfil.jsx';
import DashboardMedico from './pages/DashboardMedico.jsx';
import AgendaMedico from './pages/AgendaMedico.jsx';

// Placeholder
const PlaceholderPage = ({ title }) => (
  <div style={{ padding: '40px', minHeight: '60vh', textAlign: 'center' }}>
    <h2>{title}</h2>
    <p>Esta página está en construcción.</p>
  </div>
);

function App() {
  // Obtenemos el usuario para saber si ocultamos el footer
  const { usuario } = useAuth();

  return (
    <Router>
      <SessionModal /> {/* Seguridad anti-inactividad */}
      <Navbar /> 
      
      <main> 
        <Routes>
          {/* --- Rutas Públicas --- */}
          <Route path="/" element={<Inicio />} />
          <Route path="/acerca-de" element={<AcercaDe />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:postId" element={<PlaceholderPage title="Detalle del Artículo" />} />
          <Route path="/pqrs" element={<PQRS />} />
          <Route path="/contacto" element={<Contacto />} />

          {/* --- Auth --- */}
          <Route path="/login-paciente" element={<LoginPaciente />} />
          <Route path="/registro-paciente" element={<RegistroPaciente />} />

          {/* --- Rutas Paciente --- */}
          <Route path="/dashboard-paciente" element={<DashboardPaciente />} />
          <Route path="/citas" element={<CitasPaciente />} />
          <Route path="/agendar-cita" element={<AgendarCita />} /> {/* Por compatibilidad si quedó algún link suelto */}
          <Route path="/historia-clinica" element={<HistoriaClinica />} />
          <Route path="/recetas" element={<MisRecetas />} />
          <Route path="/examenes" element={<MisExamenes />} />
          <Route path="/perfil" element={<Perfil />} />

          {/* --- Rutas Médico (Futuro) --- */}
          <Route path="/dashboard-medico" element={<PlaceholderPage title="Panel Médico" />} />
          <Route path="/dashboard-medico" element={<DashboardMedico />} />

// Agrega placeholders temporales para que los links del nav no rompan la app
<Route path="/agenda-medico" element={<AgendaMedico />} />
<Route path="/pacientes-medico" element={<div style={{padding:50,textAlign:'center'}}><h1>👥 Pacientes (En Construcción)</h1></div>} />

          <Route path="*" element={<PlaceholderPage title="404 - Página no encontrada" />} />
        </Routes>
      </main>
      
      {/* --- LÓGICA: Solo mostrar Footer si NO hay usuario logueado --- */}
      {!usuario && <Footer />} 

    </Router>
  );
}

export default App;