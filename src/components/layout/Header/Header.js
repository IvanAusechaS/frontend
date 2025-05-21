// frontend/src/components/Header.js
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Header.css';

const Header = ({ user, setUser }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Mismo handler que en Home para pedir turno
  const handleRequestTurno = () => {
    if (!user) {
      alert('Por favor, inicia sesión para pedir un turno.');
      navigate('/login');
    } else {
      navigate('/pedir-turno');
    }
  };

  // Scroll suave a sección o navegación si no estamos en Home
  const handleNavToSection = (sectionId) => {
    if (location.pathname !== '/') {
      navigate('/', { state: { scrollTo: sectionId } });
    } else {
      if (sectionId === 'top') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      const section = document.getElementById(sectionId);
      if (section) {
        const yOffset = -76; // altura del header
        const y = section.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }
  };


  return (
    <header className="header">
      <nav className="navbar">
        <div className="navbar-left" onClick={() => navigate('/')} style={{cursor: 'pointer'}}>
          <img src={process.env.PUBLIC_URL + '/images/eyenova-logo.png'} alt="EyeNova Logo" className="navbar-logo" />
        </div>
        <div className="navbar-links">
          <span className="navbar-link" onClick={() => handleNavToSection('top')}>Inicio</span>
          <span className="navbar-link" onClick={() => handleNavToSection('services-gallery-section')}>Servicios</span>
          <span className="navbar-link" onClick={() => handleNavToSection('about-modern-section')}>Sobre Nosotros</span>
          <span className="navbar-link" onClick={() => navigate('/contact')}>Contacto</span>
          <button className="navbar-turno-btn" onClick={handleRequestTurno}>Pedir un Turno</button>
          <button className="navbar-login-btn" onClick={() => navigate('/login')}>Iniciar Sesión</button>
        </div>
      </nav>
    </header>
  );
};

export default Header;