// frontend/src/pages/ResetPassword.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ResetPassword.css';

const API_URL = 'http://localhost:8000/api/';

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}reset-password/`, { email });
      setMessage(response.data.message);
      setError('');
      setTimeout(() => navigate('/login'), 3000); // Redirige al login tras 3 segundos
    } catch (err) {
      setError(err.response?.data?.error || 'Error al solicitar el restablecimiento');
      setMessage('');
    }
  };

  const handleBackToLogin = () => navigate('/login');

  return (
    <div className="reset-password-container">
      <h2 className="reset-password-title">Restablecer Contraseña</h2>
      {message && <p className="reset-password-success">{message}</p>}
      {error && <p className="reset-password-error">{error}</p>}
      <form onSubmit={handleResetPassword} className="reset-password-form">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Correo electrónico"
          className="reset-password-input"
          required
        />
        <button type="submit" className="reset-password-button">Enviar solicitud</button>
      </form>
      <button onClick={handleBackToLogin} className="reset-password-back-button">
        Volver al inicio de sesión
      </button>
    </div>
  );
};

export default ResetPassword;