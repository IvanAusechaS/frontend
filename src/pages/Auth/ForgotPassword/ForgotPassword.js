import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../services/api'; // Import the API service
import './ForgotPassword.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleResetPassword = async () => {
    try {
      // Call the backend API to send a password reset email
      await api.post('/tickets/reset-password/', { email });
      setMessage('Correo de recuperación enviado. Revisa tu bandeja de entrada.');
      setError('');
      setTimeout(() => navigate('/login'), 3000); // Redirect to login after 3 seconds
    } catch (err) {
      setError(err.response?.data?.error || 'Error al enviar el correo de recuperación');
      setMessage('');
    }
  };

  return (
    <div className="forgot-password-container">
      <h2 className="forgot-password-title">Recuperar Contraseña</h2>
      {message && <div className="forgot-password-message success">{message}</div>}
      {error && <div className="forgot-password-message error">{error}</div>}
      <div className="forgot-password-form">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Ingresa tu correo electrónico"
          className="forgot-password-input"
          required
        />
        <button onClick={handleResetPassword} className="forgot-password-button">
          Recuperar contraseña
        </button>
      </div>
      <p className="forgot-password-link-text">
        ¿Recordaste tu contraseña?{' '}
        <span onClick={() => navigate('/login')} className="forgot-password-link">
          Inicia sesión
        </span>
      </p>
    </div>
  );
};

export default ForgotPassword;