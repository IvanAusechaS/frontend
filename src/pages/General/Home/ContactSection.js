import React, { useState } from 'react';
import { enviarMensajeContacto } from '../../../services/api'; // Ajusta la ruta según tu estructura
import './ContactSection.css';

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar mensaje de error/éxito cuando el usuario empiece a escribir
    if (message.text) {
      setMessage({ type: '', text: '' });
    }
  };

  const validateForm = () => {
    const errors = [];

    if (!formData.name.trim()) {
      errors.push('El nombre es obligatorio');
    } else if (formData.name.trim().length < 2) {
      errors.push('El nombre debe tener al menos 2 caracteres');
    }

    if (!formData.email.trim()) {
      errors.push('El email es obligatorio');
    } else {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(formData.email)) {
        errors.push('Por favor ingresa un email válido');
      }
    }

    if (!formData.message.trim()) {
      errors.push('El mensaje es obligatorio');
    } else if (formData.message.trim().length < 10) {
      errors.push('El mensaje debe tener al menos 10 caracteres');
    }

    if (formData.name.length > 100) {
      errors.push('El nombre no puede exceder 100 caracteres');
    }

    if (formData.subject.length > 200) {
      errors.push('El asunto no puede exceder 200 caracteres');
    }

    if (formData.message.length > 1000) {
      errors.push('El mensaje no puede exceder 1000 caracteres');
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('Formulario enviado', formData); // Debug
    
    const errors = validateForm();
    if (errors.length > 0) {
      alert(errors.join('\n'));
      return;
    }

    setIsLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // Preparar los datos en el formato que espera tu vista
      const dataToSend = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        message: formData.subject ? 
          `Asunto: ${formData.subject}\n\n${formData.message.trim()}` : 
          formData.message.trim()
      };
      
      console.log('Enviando datos:', dataToSend); // Debug
      
      // Usar el servicio de api.js
      const result = await enviarMensajeContacto(dataToSend);
      
      console.log('Respuesta:', result); // Debug

      alert('¡Mensaje enviado correctamente! Te contactaremos pronto.');
      
      // Limpiar formulario
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });

    } catch (error) {
      console.error('Error enviando mensaje:', error);
      alert(`Error al enviar el mensaje: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="contact-section">
      <h2 className="contact-title">Contáctanos</h2>
      <p className="contact-subtitle">
        Estamos aquí para ayudarte. Contáctanos para cualquier consulta o para programar una cita.
      </p>
      
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
            Nuestro horario de atención es de lunes a viernes de 8:00 AM a 6:00 PM 
            y sábados de 9:00 AM a 1:00 PM.
          </div>
        </div>

        <form className="contact-form-card" onSubmit={handleSubmit}>
          <h3 className="contact-form-title">Envíanos un mensaje</h3>
          <hr className="contact-divider" />
          
          <div className="contact-form-row">
            <input
              type="text"
              name="name"
              className="contact-input"
              placeholder="Nombre completo *"
              value={formData.name}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
            <input
              type="email"
              name="email"
              className="contact-input"
              placeholder="Email *"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </div>
          
          <input
            type="text"
            name="subject"
            className="contact-input"
            placeholder="Asunto"
            value={formData.subject}
            onChange={handleChange}
            disabled={isLoading}
          />
          
          <textarea
            name="message"
            className="contact-input contact-textarea"
            placeholder="Mensaje *"
            value={formData.message}
            onChange={handleChange}
            required
            disabled={isLoading}
          ></textarea>
          
          <button 
            type="submit" 
            className="contact-btn"
            disabled={isLoading}
          >
            {isLoading ? 'Enviando...' : 'Enviar mensaje →'}
          </button>
        </form>
      </div>
    </section>
  );
};

export default ContactSection;