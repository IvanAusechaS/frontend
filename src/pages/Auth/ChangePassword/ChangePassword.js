// frontend/src/pages/ChangePassword.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../services/api';
import './ChangePassword.css';

const ChangePassword = ({ user, setUser }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  console.log('Usuario en ChangePassword:', user); // Depuración

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('change-password/', {
        current_password: currentPassword,
        new_password: newPassword,
      });
      setMessage(response.data.message);
      setError('');
      setTimeout(() => navigate('/'), 2000); // Redirige a home tras 2 segundos
    } catch (err) {
      setError(err.response?.data?.error || 'Error al cambiar la contraseña');
      setMessage('');
    }
  };

  return (
    <div className="change-password-container">
      <h2 className="change-password-title">Cambiar Contraseña</h2>
      {message && <p className="change-password-success">{message}</p>}
      {error && <p className="change-password-error">{error}</p>}
      <form onSubmit={handleSubmit} className="change-password-form">
        <input
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          placeholder="Contraseña actual"
          className="change-password-input"
          required
        />
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Nueva contraseña"
          className="change-password-input"
          required
        />
        <button type="submit" className="change-password-button">Cambiar</button>
      </form>
    </div>
  );
};

export default ChangePassword;