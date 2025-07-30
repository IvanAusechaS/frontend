// ResetPassword.js - Solicitar código
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ResetPassword.css';

const API_URL = 'http://localhost:8000/api/tickets/';

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await axios.post(`${API_URL}reset-password/`, { email });
      setMessage(response.data.message);
      // Redirigir a la página de verificación con el email
      setTimeout(() => {
        navigate(`/reset-password-verify?email=${encodeURIComponent(email)}`);
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al solicitar el restablecimiento');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-password-container">
      <h2 className="reset-password-title">Restablecer Contraseña</h2>
      <p className="reset-password-description">
        Ingresa tu correo electrónico y te enviaremos un código de verificación.
      </p>
      
      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-error">{error}</div>}
      
      <form onSubmit={handleResetPassword} className="reset-password-form">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Correo electrónico"
          className="reset-password-input"
          required
          disabled={loading}
        />
        <button 
          type="submit" 
          className="reset-password-button"
          disabled={loading}
        >
          {loading ? 'Enviando...' : 'Enviar código'}
        </button>
      </form>
      
      <button 
        onClick={() => navigate('/login')} 
        className="reset-password-back-button"
      >
        Volver al inicio de sesión
      </button>
    </div>
  );
};
export default ResetPassword;
