// frontend/src/components/Footer.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <p className="footer-text">
        © {new Date().getFullYear()} Sistema de Turnos - Todos los derechos reservados
      </p>
      <div className="footer-links">
        <span className="footer-link">Política de Privacidad</span>
        <span className="footer-link">Términos de Servicio</span>
        <Link to="/contact" className="footer-link">Contacto</Link>
      </div>
    </footer>
  );
};

export default Footer;