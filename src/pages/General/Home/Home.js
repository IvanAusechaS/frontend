// frontend/src/pages/Home.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import './ServiciosGallery.css';
import './AboutModern.css';
import './Testimonials.css';
import './TeamSection.css';
import './ContactSection.css';
import './HeroWelcome.css';
import ImageCarousel from '../../../components/ImageCarousel';

import { useEffect } from 'react';

const Home = ({ user, setUser }) => {
  const navigate = useNavigate();

  // Scroll suave si se navega desde otra ruta con scrollTo en el estado
  useEffect(() => {
    if (window.history.state && window.history.state.usr && window.history.state.usr.scrollTo) {
      const sectionId = window.history.state.usr.scrollTo;
      setTimeout(() => {
        if (sectionId === 'top') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          const section = document.getElementById(sectionId);
          if (section) {
            const yOffset = -76; // altura del header
            const y = section.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
          }
        }
      }, 250);
    }
  }, []);

  const handleRequestTurno = () => {
    if (!user) {
      alert('Por favor, inicia sesión para pedir un turno.');
      navigate('/login');
    } else {
      navigate('/pedir-turno');
    }
  };

  const safeUserName = user && typeof user === 'object' ? user.nombre || 'Usuario' : 'Usuario';

  return (
    <div className="home-page">
      {/* Carrusel visual */}
      <ImageCarousel />

      {/* Nuestros Servicios */}
      <section className="services-gallery-section" id="services-gallery-section">
        <h2 className="services-gallery-title">Nuestros Servicios</h2>
        <p className="services-gallery-subtitle">Brindamos una atención integral y de calidad para tu salud Ocular.</p>
        <div className="services-gallery-grid">
          <div className="service-image-card" onClick={() => navigate('/servicios', { state: { scrollTo: 'urgencias' } })} style={{ cursor: 'pointer' }}>
            <img src={process.env.PUBLIC_URL + '/images/urgencias.jpg'} alt="Urgencias Oftalmológicas" />
            <div className="service-image-overlay">
              <h3>Atención de Urgencias Oftalmológicas</h3>
              <p>Contamos con un equipo especializado disponible 24/7 para atender cualquier emergencia oftalmológica. Nuestro servicio incluye diagnóstico inmediato, tratamiento de lesiones oculares, y seguimiento personalizado.</p>
            </div>
          </div>
          <div className="service-image-card" onClick={() => navigate('/servicios', { state: { scrollTo: 'lentes' } })} style={{ cursor: 'pointer' }}>
            <img src={process.env.PUBLIC_URL + '/images/lentes.jpg'} alt="Obtención de Gafas Formuladas" />
            <div className="service-image-overlay">
              <h3>Obtención de Gafas Formuladas</h3>
              <p>Accede a lentes diseñados a tu medida con tecnología de alta calidad. Ofrecemos asesoría profesional para garantizar la mejor elección según tus necesidades visuales.</p>
            </div>
          </div>
          <div className="service-image-card" onClick={() => navigate('/servicios', { state: { scrollTo: 'cirugia' } })} style={{ cursor: 'pointer' }}>
            <img src={process.env.PUBLIC_URL + '/images/cirugia.jpg'} alt="Cirugía Refractiva" />
            <div className="service-image-overlay">
              <h3>Cirugía Refractiva</h3>
              <p>Corrige problemas como miopía, astigmatismo e hipermetropía con procedimientos modernos y seguros. Recupera tu visión sin depender de gafas o lentes de contacto.</p>
            </div>
          </div>
          <div className="service-image-card" onClick={() => navigate('/servicios', { state: { scrollTo: 'atencion' } })} style={{ cursor: 'pointer' }}>
            <img src={process.env.PUBLIC_URL + '/images/atencion.jpg'} alt="Consulta Oftalmológica" />
            <div className="service-image-overlay">
              <h3>Consulta Oftalmológica</h3>
              <p>Evaluaciones completas para el diagnóstico y tratamiento de enfermedades oculares. Nuestros especialistas te guiarán en el mejor cuidado para preservar tu salud visual.</p>
            </div>
          </div>
        </div>
      </section>
      {/* Sección 1: Bienvenida */}
      <section className="hero-section-welcome">
        <div className="hero-welcome-grid">
          <div className="hero-welcome-left">
            <h1 className="hero-welcome-title">Hola {safeUserName}, ¡es hora de pedir tu turno!</h1>
            <p className="hero-welcome-subtitle">
              Gestiona tus turnos de manera rápida y sencilla
            </p>
            <button className="hero-welcome-button" onClick={handleRequestTurno}>
              Pedir un Turno
            </button>
          </div>
          <div className="hero-welcome-right">
            {/* Animación de robot con viñetas explicativas */}
            <div className="robot-animation-container">
              <img src={process.env.PUBLIC_URL + '/images/robot.png'} alt="Asistente Virtual" className="robot-lottie-img" />
              <div className="robot-speech-bubbles">
                <div className="robot-bubble">
                  <span className="robot-bubble-step">1</span> Ingresa o regístrate
                </div>
                <div className="robot-bubble">
                  <span className="robot-bubble-step">2</span> Elige el servicio que necesitas
                </div>
                <div className="robot-bubble">
                  <span className="robot-bubble-step">3</span> Selecciona fecha y hora
                </div>
                <div className="robot-bubble">
                  <span className="robot-bubble-step">4</span> ¡Listo! Recibe confirmación
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sección 2: Sobre Nosotros */}
      <section className="about-modern-section" id="about-modern-section">
        <div className="about-modern-container">
          <div className="about-modern-left">
            <h2 className="about-modern-title">Sobre Nosotros</h2>
            <h3 className="about-modern-subtitle">Cuidando tu salud visual desde 2010</h3>
            <p className="about-modern-desc">
              En EyeNova, nos dedicamos a proporcionar servicios oftalmológicos de alta calidad, combinando la experiencia médica con la última tecnología en el campo de la salud visual.<br/><br/>
              Nuestro equipo está formado por especialistas altamente calificados, comprometidos con brindar la mejor atención y soluciones personalizadas para cada paciente.
            </p>
            <div className="about-modern-stats">
              <div className="about-modern-stat-card">
                <span className="about-modern-stat-num">8</span>
                <span className="about-modern-stat-label">Especialistas</span>
              </div>
              <div className="about-modern-stat-card">
                <span className="about-modern-stat-num">+5000</span>
                <span className="about-modern-stat-label">Pacientes</span>
              </div>
              <div className="about-modern-stat-card">
                <span className="about-modern-stat-num">15</span>
                <span className="about-modern-stat-label">Años</span>
              </div>
            </div>
          </div>
          <div className="about-modern-right">
            <div className="about-modern-feature-card">
              <span className="about-modern-feature-icon" role="img" aria-label="Visión">👁️</span>
              <div>
                <h4 className="about-modern-feature-title">Nuestra Visión</h4>
                <p className="about-modern-feature-desc">Ser líderes en servicios oftalmológicos, reconocidos por nuestra excelencia y compromiso con la salud visual.</p>
              </div>
            </div>
            <div className="about-modern-feature-card">
              <span className="about-modern-feature-icon" role="img" aria-label="Compromiso">💙</span>
              <div>
                <h4 className="about-modern-feature-title">Nuestro Compromiso</h4>
                <p className="about-modern-feature-desc">Brindar atención personalizada y de calidad, utilizando la más avanzada tecnología en beneficio de nuestros pacientes.</p>
              </div>
            </div>
            <div className="about-modern-feature-card">
              <span className="about-modern-feature-icon" role="img" aria-label="Experiencia">⭐</span>
              <div>
                <h4 className="about-modern-feature-title">Nuestra Experiencia</h4>
                <p className="about-modern-feature-desc">Más de una década de experiencia respaldada por un equipo de especialistas altamente calificados.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sección 3: Testimonios de Pacientes */}
      <section className="testimonials-section">
        <h2 className="testimonials-title">Lo que dicen nuestros pacientes</h2>
        <p className="testimonials-subtitle">Experiencias reales de personas que han confiado en nosotros</p>
        <div className="testimonials-grid">
          <div className="testimonial-card">
            <div className="testimonial-header">
              <span className="testimonial-avatar">M</span>
              <div>
                <span className="testimonial-name">María González</span>
                <span className="testimonial-city">Bogotá</span>
              </div>
              <span className="testimonial-quote">“</span>
            </div>
            <div className="testimonial-stars">★★★★★</div>
            <p className="testimonial-text">"La atención fue excepcional. El doctor fue muy profesional y resolvió mi problema de visión en una sola consulta. El personal administrativo también fue muy amable y eficiente."</p>
          </div>
          <div className="testimonial-card">
            <div className="testimonial-header">
              <span className="testimonial-avatar">C</span>
              <div>
                <span className="testimonial-name">Carlos Rodríguez</span>
                <span className="testimonial-city">Medellín</span>
              </div>
              <span className="testimonial-quote">“</span>
            </div>
            <div className="testimonial-stars">★★★★★</div>
            <p className="testimonial-text">"Hace años que no veía tan bien. El proceso fue rápido y el resultado superó mis expectativas. Recomiendo ampliamente sus servicios a cualquiera que necesite atención oftalmológica."</p>
          </div>
          <div className="testimonial-card">
            <div className="testimonial-header">
              <span className="testimonial-avatar">L</span>
              <div>
                <span className="testimonial-name">Laura Martínez</span>
                <span className="testimonial-city">Cali</span>
              </div>
              <span className="testimonial-quote">“</span>
            </div>
            <div className="testimonial-stars">★★★★☆</div>
            <p className="testimonial-text">"Muy buena experiencia en general. El doctor fue muy atento y explicó todo el proceso detalladamente. La única razón por la que no doy 5 estrellas es porque la espera fue un poco larga."</p>
          </div>
          <div className="testimonial-card">
            <div className="testimonial-header">
              <span className="testimonial-avatar">J</span>
              <div>
                <span className="testimonial-name">Juan Pérez</span>
                <span className="testimonial-city">Barranquilla</span>
              </div>
              <span className="testimonial-quote">“</span>
            </div>
            <div className="testimonial-stars">★★★★★</div>
            <p className="testimonial-text">"Increíble servicio. Desde la recepción hasta la consulta con el especialista, todo fue perfecto. El diagnóstico fue preciso y el tratamiento funcionó mejor de lo esperado. ¡Gracias por devolverme la visión!"</p>
          </div>
          <div className="testimonial-card">
            <div className="testimonial-header">
              <span className="testimonial-avatar">A</span>
              <div>
                <span className="testimonial-name">Ana Silva</span>
                <span className="testimonial-city">Cartagena</span>
              </div>
              <span className="testimonial-quote">“</span>
            </div>
            <div className="testimonial-stars">★★★★☆</div>
            <p className="testimonial-text">"Excelente atención médica y profesionalismo. El doctor fue muy cuidadoso y el resultado fue muy bueno. El único detalle fue que hubo un pequeño retraso en la programación de la cita."</p>
          </div>
        </div>
      </section>

      {/* Sección 4: Nuestro Equipo */}
      <div className="equipo-home-btn-container" style={{ textAlign: 'center', margin: '32px 0' }}>
        <button
          className="equipo-home-btn"
          style={{ background: '#1976d2', color: '#fff', border: 'none', borderRadius: '20px', padding: '12px 32px', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer', boxShadow: '0 2px 8px rgba(25, 118, 210, 0.12)' }}
          onClick={() => navigate('/equipo')}
        >
          Ver todo nuestro equipo
        </button>
      </div>
      <section className="team-section">
        <h2 className="team-title">Nuestro Equipo</h2>
        <p className="team-subtitle">Conoce a nuestros especialistas altamente calificados, comprometidos con tu salud visual</p>
        <div className="team-grid">
          <div className="team-card">
            <div className="team-img-container">
              <img src={process.env.PUBLIC_URL + '/images/doctors/doctor1.jpg'} alt="Dra. Ana María Rodríguez" />
              <span className="team-badge team-badge-general">Consultas Generales</span>
            </div>
            <div className="team-info">
              <h3 className="team-name">Dra. Ana María Rodríguez</h3>
              <a href="#" className="team-specialty team-specialty-general">Oftalmología General</a>
              <p className="team-desc">Especialista en diagnóstico y tratamiento de enfermedades oculares comunes.</p>
            </div>
          </div>
          <div className="team-card">
            <div className="team-img-container">
              <img src={process.env.PUBLIC_URL + '/images/doctors/doctor2.jpg'} alt="Dr. Carlos Eduardo Martínez" />
              <span className="team-badge team-badge-cirugia">Cirugías Oftalmológicas</span>
            </div>
            <div className="team-info">
              <h3 className="team-name">Dr. Carlos Eduardo Martínez</h3>
              <a href="#" className="team-specialty team-specialty-cirugia">Cirugía Refractiva</a>
              <p className="team-desc">Experto en técnicas avanzadas de cirugía láser para corrección de la visión.</p>
            </div>
          </div>
          <div className="team-card">
            <div className="team-img-container">
              <img src={process.env.PUBLIC_URL + '/images/doctors/doctor3.jpg'} alt="Dra. Laura Patricia Sánchez" />
              <span className="team-badge team-badge-contacto">Lentes de Contacto</span>
            </div>
            <div className="team-info">
              <h3 className="team-name">Dra. Laura Patricia Sánchez</h3>
              <a href="#" className="team-specialty team-specialty-contacto">Contactología</a>
              <p className="team-desc">Especialista en adaptación de lentes de contacto para diferentes condiciones oculares.</p>
            </div>
          </div>
        </div>
        <div className="team-btn-container">
          <button className="team-btn" onClick={() => navigate('/equipo')}>Ver Todo Nuestro Equipo &rarr;</button>
        </div>
      </section>


    </div>
  );
};

export default Home;