// frontend/src/pages/ResetPasswordConfirm.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import './ResetPasswordConfirm.css';

const API_URL = 'http://localhost:8000/api/';

const ResetPasswordConfirm = () => {
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setError('Token inválido o faltante');
    }
  }, [token]);

  const handleResetPasswordConfirm = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}reset-password-confirm/`, {
        token,
        new_password: newPassword,
      });
      setMessage(response.data.message);
      setError('');
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al restablecer la contraseña');
      setMessage('');
    }
  };

  return (
    <div className="reset-password-confirm-container">
      <h2 className="reset-password-confirm-title">Restablecer Contraseña</h2>
      {message && <p className="reset-password-confirm-success">{message}</p>}
      {error && <p className="reset-password-confirm-error">{error}</p>}
      <form onSubmit={handleResetPasswordConfirm} className="reset-password-confirm-form">
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Nueva contraseña"
          className="reset-password-confirm-input"
          required
        />
        <button type="submit" className="reset-password-confirm-button">
          Restablecer Contraseña
        </button>
      </form>
    </div>
  );
};

export default ResetPasswordConfirm;