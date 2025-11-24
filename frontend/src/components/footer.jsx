import React from "react";
import { Link } from "react-router-dom";
import "./footer.css";

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        {/* Columna 1: Marca */}
        <div className="footer-section">
          <h4>Aphonline</h4>
          <p>
            Tu salud, a un clic de distancia. Gestiona tus citas y tu historial
            médico de forma fácil y segura.
          </p>
        </div>

        {/* Columna 2: Enlaces */}
        <div className="footer-section">
          <h4>Enlaces Rápidos</h4>
          <ul>
            <li>
              <Link to="/">Inicio</Link>
            </li>
            <li>
              <Link to="/acerca-de">Acerca de</Link>
            </li>
            <li>
              <Link to="/blog">Blog</Link>
            </li>
            <li>
              <Link to="/pqrs">PQRS</Link>
            </li>
            <li>
              <Link to="/contacto">Contacto</Link>
            </li>
          </ul>
        </div>

        {/* Columna 3: Contacto */}
        <div className="footer-section">
          <h4>Contacto</h4>
          <p>📧 info@aphonline.com</p>
          <p>📞 +57 300 123 4567</p>
          <p>📍 Yarumal, Antioquia</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          &copy; {new Date().getFullYear()} Aphonline. Todos los derechos
          reservados.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
