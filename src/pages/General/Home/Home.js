// frontend/src/pages/Home.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = ({ user, setUser }) => {
  const navigate = useNavigate();

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
      {/* Sección 1: Bienvenida */}
      <section className="hero-section full-screen">
        <div className="hero-content">
          <h1 className="hero-title">Hola {safeUserName}, ¡es hora de pedir tu turno!</h1>
          <p className="hero-subtitle">
            Gestiona tus turnos de manera rápida y sencilla
          </p>
          <button className="hero-button" onClick={handleRequestTurno}>
            Pedir un Turno
          </button>
        </div>
      </section>

      {/* Sección 2: Quiénes Somos */}
      <section className="about-section full-screen">
        <div className="section-content">
          <h2 className="section-title">Quiénes Somos</h2>
          <p className="section-text">
            Somos un equipo dedicado a simplificar la gestión de turnos, ofreciendo soluciones innovadoras y accesibles para todos. Nuestro objetivo es que tu experiencia sea fluida y sin complicaciones.
          </p>
        </div>
      </section>

      {/* Sección 3: Servicios */}
      <section className="services-section full-screen">
        <div className="section-content">
          <h2 className="section-title">Nuestros Servicios</h2>
          <div className="services-cards">
            <div className="service-card">
              <h3 className="card-title">Turnos en Línea</h3>
              <p className="card-text">
                Reserva tu turno desde cualquier lugar, en cualquier momento, con solo unos clics.
              </p>
            </div>
            <div className="service-card">
              <h3 className="card-title">Atención Personalizada</h3>
              <p className="card-text">
                Recibe soporte adaptado a tus necesidades por parte de nuestro equipo.
              </p>
            </div>
            <div className="service-card">
              <h3 className="card-title">Soporte 24/7</h3>
              <p className="card-text">
                Estamos disponibles todo el día para ayudarte con cualquier consulta.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sección 4: Cómo Funciona */}
      <section className="how-it-works-section full-screen">
        <div className="section-content">
          <h2 className="section-title">Cómo Funciona</h2>
          <div className="steps-container">
            <div className="step">
              <span className="step-number">1</span>
              <p className="step-text">
                Regístrate o inicia sesión con tu cuenta.
              </p>
            </div>
            <div className="step">
              <span className="step-number">2</span>
              <p className="step-text">
                Selecciona el servicio y horario que prefieres.
              </p>
            </div>
            <div className="step">
              <span className="step-number">3</span>
              <p className="step-text">
                Confirma tu turno y recíbelo en tu correo.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;