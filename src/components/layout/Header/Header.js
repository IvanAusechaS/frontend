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


  const [menuOpen, setMenuOpen] = React.useState(false);

  // Cierra el menú al navegar (opcional, UX)
  const handleMenuNav = (fn) => {
    fn();
    setMenuOpen(false);
  };

  return (
    <header className="header">
      <nav className="navbar">
        <div className="navbar-left" onClick={() => {navigate('/'); setMenuOpen(false);}} style={{cursor: 'pointer'}}>
          <img src={process.env.PUBLIC_URL + '/images/eyenova-logo.png'} alt="EyeNova Logo" className="navbar-logo" />
        </div>
        <button className="navbar-hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Abrir menú">
          <span className="navbar-hamburger-bar"></span>
          <span className="navbar-hamburger-bar"></span>
          <span className="navbar-hamburger-bar"></span>
        </button>
        <div className={`navbar-links${menuOpen ? ' open' : ''}`}>
          <span className="navbar-link" onClick={() => handleMenuNav(() => handleNavToSection('top'))}>Inicio</span>
          <span className="navbar-link" onClick={() => handleMenuNav(() => handleNavToSection('services-gallery-section'))}>Servicios</span>
          <span className="navbar-link" onClick={() => handleMenuNav(() => handleNavToSection('about-modern-section'))}>Sobre Nosotros</span>
          <span className="navbar-link" onClick={() => handleMenuNav(() => navigate('/contact'))}>Contacto</span>
          <button className="navbar-turno-btn" onClick={() => handleMenuNav(handleRequestTurno)}>Pedir un Turno</button>

          {/* Botones según tipo de usuario */}
          {!user && (
            <>
              <button className="navbar-login-btn" onClick={() => handleMenuNav(() => navigate('/login'))}>Iniciar Sesión</button>
              <button className="navbar-login-btn" onClick={() => handleMenuNav(() => navigate('/register'))}>Registrarse</button>
            </>
          )}
          {user && (
            <>
              {/* Botones específicos por rol */}
              {user.es_profesional && !user.is_admin && (
                <button className="navbar-login-btn" onClick={() => handleMenuNav(() => navigate('/profesional'))}>
                  Dashboard
                </button>
              )}
              {user.is_admin && (
                <button className="navbar-login-btn" onClick={() => handleMenuNav(() => navigate('/admin'))}>
                  Panel Administrativo
                </button>
              )}
              {/* Botón de Cerrar Sesión para todos los usuarios autenticados */}
              <button 
                className="navbar-login-btn" 
                onClick={() => {
                  localStorage.removeItem('token');
                  localStorage.removeItem('refreshToken');
                  setUser(null);
                  navigate('/');
                  window.location.reload();
                }}
              >
                Cerrar Sesión
              </button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;