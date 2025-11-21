import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Notificaciones from "./Notificaciones";
import "./navbar.css";

const Navbar = () => {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();
  const [click, setClick] = useState(false);

  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);

  const handleLogout = () => {
    logout();
    closeMobileMenu();
    navigate("/");
  };

  // Determinar a dónde va el logo según el rol
  const getHomeLink = () => {
    if (!usuario) return "/";
    if (usuario.rol === "medico") return "/dashboard-medico";
    return "/dashboard-paciente";
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* --- LOGO --- */}
        <Link
          to={getHomeLink()}
          className="navbar-logo"
          onClick={closeMobileMenu}
        >
          APHONLINE
        </Link>

        {/* --- HAMBURGUESA (Móvil) --- */}
        <div className="menu-icon" onClick={handleClick}>
          <span className={click ? "fas fa-times" : "fas fa-bars"}>
            {click ? "✕" : "☰"}
          </span>
        </div>

        {/* --- MENÚ PRINCIPAL --- */}
        <div
          className={click ? "nav-menu-container active" : "nav-menu-container"}
        >
          {/* === LÓGICA DE MENÚS POR ROL === */}

          {!usuario ? (
            // 🟢 MENÚ PÚBLICO (Nadie logueado)
            <>
              <ul className="nav-menu">
                <li className="nav-item">
                  <Link to="/" className="nav-link" onClick={closeMobileMenu}>
                    Inicio
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    to="/acerca-de"
                    className="nav-link"
                    onClick={closeMobileMenu}
                  >
                    Acerca de
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    to="/blog"
                    className="nav-link"
                    onClick={closeMobileMenu}
                  >
                    Blog
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    to="/pqrs"
                    className="nav-link"
                    onClick={closeMobileMenu}
                  >
                    PQRS
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    to="/contacto"
                    className="nav-link"
                    onClick={closeMobileMenu}
                  >
                    Contacto
                  </Link>
                </li>
              </ul>
              <div className="nav-auth">
                <Link
                  to="/login-paciente"
                  className="btn btn-outline-mobile"
                  onClick={closeMobileMenu}
                >
                  Iniciar Sesión
                </Link>
                <Link
                  to="/registro-paciente"
                  className="btn btn-primary-mobile"
                  onClick={closeMobileMenu}
                >
                  Registrarse
                </Link>
              </div>
            </>
          ) : usuario.rol === "medico" ? (
            // 🔵 MENÚ DE MÉDICO
            <>
              <ul className="nav-menu">
                <li className="nav-item">
                  <Link
                    to="/dashboard-medico"
                    className="nav-link"
                    onClick={closeMobileMenu}
                  >
                    Panel Médico
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    to="/agenda-medico"
                    className="nav-link"
                    onClick={closeMobileMenu}
                  >
                    Mi Agenda
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    to="/pacientes-medico"
                    className="nav-link"
                    onClick={closeMobileMenu}
                  >
                    Pacientes
                  </Link>
                </li>
              </ul>

              <div className="nav-auth">
                <Notificaciones />
                <span className="nav-welcome">Dr. {usuario.apellido}</span>
                <button
                  onClick={handleLogout}
                  className="btn btn-outline-mobile"
                >
                  Salir
                </button>
              </div>
            </>
          ) : (
            // 🟠 MENÚ DE PACIENTE (Aquí estaban los perdidos)
            <>
              <ul className="nav-menu">
                <li className="nav-item">
                  <Link
                    to="/dashboard-paciente"
                    className="nav-link"
                    onClick={closeMobileMenu}
                  >
                    Inicio
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    to="/citas"
                    className="nav-link"
                    onClick={closeMobileMenu}
                  >
                    Citas
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    to="/historia-clinica"
                    className="nav-link"
                    onClick={closeMobileMenu}
                  >
                    Historia Clínica
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    to="/recetas"
                    className="nav-link"
                    onClick={closeMobileMenu}
                  >
                    Recetas
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    to="/examenes"
                    className="nav-link"
                    onClick={closeMobileMenu}
                  >
                    Resultados
                  </Link>
                </li>
              </ul>

              <div className="nav-auth">
                <Notificaciones />
                <Link
                  to="/perfil"
                  className="nav-welcome-link"
                  onClick={closeMobileMenu}
                >
                  <span className="nav-welcome">Hola, {usuario.nombre}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="btn btn-outline-mobile"
                >
                  Cerrar Sesión
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
