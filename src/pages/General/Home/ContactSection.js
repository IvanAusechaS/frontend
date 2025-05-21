import React from 'react';
import './ContactSection.css';

const ContactSection = () => (
  <section className="contact-section">
    <h2 className="contact-title">Contáctanos</h2>
    <p className="contact-subtitle">Estamos aquí para ayudarte. Contáctanos para cualquier consulta o para programar una cita.</p>
    <div className="contact-grid">
      <div className="contact-info-card">
        <h3 className="contact-info-title">Información de Contacto</h3>
        <hr className="contact-divider" />
        <div className="contact-info-item">
          <span className="contact-info-icon" role="img" aria-label="Teléfono">📞</span>
          <div>
            <span className="contact-info-label">Línea de Atención</span>
            <span className="contact-info-value">01 8000 123 456</span>
          </div>
        </div>
        <div className="contact-info-item">
          <span className="contact-info-icon" role="img" aria-label="Email">✉️</span>
          <div>
            <span className="contact-info-label">Email</span>
            <span className="contact-info-value">EyeNova@gmail.com</span>
          </div>
        </div>
        <div className="contact-info-item">
          <span className="contact-info-icon" role="img" aria-label="Dirección">📍</span>
          <div>
            <span className="contact-info-label">Dirección</span>
            <span className="contact-info-value">Calle Principal #123, Ciudad</span>
          </div>
        </div>
        <div className="contact-info-hours">
          Nuestro horario de atención es de lunes a viernes de 8:00 AM a 6:00 PM y sábados de 9:00 AM a 1:00 PM.
        </div>
      </div>
      <form className="contact-form-card">
        <h3 className="contact-form-title">Envíanos un mensaje</h3>
        <hr className="contact-divider" />
        <div className="contact-form-row">
          <input type="text" className="contact-input" placeholder="Nombre completo *" required />
          <input type="email" className="contact-input" placeholder="Email *" required />
        </div>
        <input type="text" className="contact-input" placeholder="Asunto" />
        <textarea className="contact-input contact-textarea" placeholder="Mensaje *" required></textarea>
        <button type="submit" className="contact-btn">Enviar mensaje &rarr;</button>
      </form>
    </div>
  </section>
);

export default ContactSection;
