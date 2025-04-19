// frontend/src/pages/Contact.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Contact.css';

const API_URL = 'http://localhost:8000/api/';

const Contact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}contact/`, {
        name,
        email,
        message,
      });
      setSuccess(response.data.message);
      setError('');
      setName('');
      setEmail('');
      setMessage('');
      setTimeout(() => navigate('/'), 2000); // Redirige a home tras 2 segundos
    } catch (err) {
      setError(err.response?.data?.error || 'Error al enviar el mensaje');
      setSuccess('');
    }
  };

  return (
    <div className="contact-container">
      <h2 className="contact-title">Contáctanos</h2>
      {success && <p className="contact-success">{success}</p>}
      {error && <p className="contact-error">{error}</p>}
      <form onSubmit={handleSubmit} className="contact-form">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Tu nombre"
          className="contact-input"
          required
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Tu correo electrónico"
          className="contact-input"
          required
        />
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Tu mensaje"
          className="contact-textarea"
          rows="5"
          required
        />
        <button type="submit" className="contact-button">Enviar Mensaje</button>
      </form>
    </div>
  );
};

export default Contact;