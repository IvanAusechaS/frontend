// frontend/src/pages/CompleteProfile.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../services/api';
import './CompleteProfile.css';

const CompleteProfile = ({ setUser }) => {
  const [cedula, setCedula] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user')) || {};

  console.log('Usuario en CompleteProfile:', user); // Depuración

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('update-cedula/', { cedula });
      const updatedUser = response.data.user;
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Error al actualizar la cédula');
    }
  };

  return (
    <div className="complete-profile-container">
      <h2 className="complete-profile-title">Completar Perfil</h2>
      <p>Por favor, ingresa tu cédula para continuar.</p>
      {error && <p className="complete-profile-error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={cedula}
          onChange={(e) => setCedula(e.target.value)}
          placeholder="Cédula"
          className="complete-profile-input"
          required
        />
        <button type="submit" className="complete-profile-button">Guardar</button>
      </form>
    </div>
  );
};

export default CompleteProfile;