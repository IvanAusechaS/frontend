// Archivo eliminado por solicitud del usuario
import { useNavigate, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Scroll suave a la sección correspondiente
  const handleScrollTo = (sectionId) => {
    if (location.pathname !== '/') {
      navigate('/', { state: { scrollTo: sectionId } });
    } else {
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-left" onClick={() => navigate('/')}
        style={{cursor: 'pointer'}}>
        <img src={process.env.PUBLIC_URL + '/images/eyenova-logo.png'} alt="EyeNova Logo" className="navbar-logo" />
        <span className="navbar-brand">EyeNova</span>
      </div>
      <div className="navbar-links">
        <span className="navbar-link" onClick={() => navigate('/')}>Inicio</span>
        <span className="navbar-link" onClick={() => handleScrollTo('services-gallery-section')}>Servicios</span>
        <span className="navbar-link" onClick={() => handleScrollTo('about-modern-section')}>Sobre Nosotros</span>
        <button className="navbar-contact-btn" onClick={() => navigate('/contact')}>Contacto</button>
        <button className="navbar-login-btn" onClick={() => navigate('/login')}>Iniciar Sesión</button>
      </div>
    </nav>
  );
};

export default Navbar;
