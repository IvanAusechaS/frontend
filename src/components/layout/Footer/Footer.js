// frontend/src/components/Footer.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-main">
        <div className="footer-brand">
          <span className="footer-logo">👁️ EyeNova</span>
          <span className="footer-slogan">Cuidando tu visión, mejorando tu vida</span>
        </div>
        <nav className="footer-nav">
          <Link to="/" className="footer-link">Inicio</Link>
          <Link to="/servicios" className="footer-link">Servicios</Link>
          <Link to="/equipo" className="footer-link">Nuestro Equipo</Link>
          <Link to="/pedir-turno" className="footer-link">Pedir Turno</Link>
          <Link to="/appointment-history" className="footer-link">Historial de Turnos</Link>
          <Link to="/profile" className="footer-link">Perfil</Link>
          <Link to="/login" className="footer-link">Iniciar Sesión</Link>
          <Link to="/register" className="footer-link">Registrarse</Link>
          <Link to="/contact" className="footer-link">Contacto</Link>
        </nav>
      </div>
      <div className="footer-bottom">
        <span className="footer-copyright">
          {new Date().getFullYear()} EyeNova - Todos los derechos reservados
        </span>
        <div className="footer-legal">
          <span className="footer-link">Política de Privacidad</span>
          <span className="footer-link">Términos de Servicio</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;