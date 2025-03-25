// frontend/src/pages/Register.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Register.css';

const API_URL = 'http://localhost:8000/api/';

const Register = ({ setUser }) => {
  const [cedula, setCedula] = useState('');
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  // Normaliza el user al formato {id, cedula, email, nombre, es_profesional}
  const normalizeUser = (userData, formData) => {
    return {
      id: userData.id,
      cedula: userData.cedula || formData.cedula || '',
      email: userData.email || formData.email || '',
      nombre: userData.nombre || formData.nombre || 'Usuario',
      es_profesional: userData.es_profesional || false
    };
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const formData = { cedula, nombre, email, telefono, password };
      const response = await axios.post(`${API_URL}register/`, formData);
      const { access, refresh, user } = response.data;
      const normalizedUser = normalizeUser(user, formData); // Usa datos del formulario como fallback
      localStorage.setItem('token', access);
      localStorage.setItem('refreshToken', refresh);
      localStorage.setItem('user', JSON.stringify(normalizedUser));
      setUser(normalizedUser);
      setSuccess('Registro exitoso. Redirigiendo...');
      setError('');
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al registrarse');
      setSuccess('');
    }
  };

  const handleLoginRedirect = () => navigate('/login');

  return (
    <div className="register-container">
      <div className="register-card">
        <h1 className="register-title">Regístrate</h1>
        <p className="register-subtitle">Crea tu cuenta para comenzar</p>
        {error && <p className="register-error">{error}</p>}
        {success && <p className="register-success">{success}</p>}
        <form onSubmit={handleRegister} className="register-form">
          <div className="register-input-group">
            <label className="register-label">Cédula</label>
            <input
              type="text"
              value={cedula}
              onChange={(e) => setCedula(e.target.value)}
              placeholder="Ingresa tu cédula"
              className="register-input"
              required
            />
          </div>
          <div className="register-input-group">
            <label className="register-label">Nombre</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ingresa tu nombre"
              className="register-input"
              required
            />
          </div>
          <div className="register-input-group">
            <label className="register-label">Correo Electrónico</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Ingresa tu correo"
              className="register-input"
              required
            />
          </div>
          <div className="register-input-group">
            <label className="register-label">Teléfono</label>
            <input
              type="tel"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              placeholder="Ingresa tu número de teléfono"
              className="register-input"
              required
            />
          </div>
          <div className="register-input-group">
            <label className="register-label">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Crea una contraseña"
              className="register-input"
              required
            />
          </div>
          <button type="submit" className="register-button">Registrarse</button>
        </form>
        <p className="register-link-text">
          ¿Ya tienes cuenta?{' '}
          <span onClick={handleLoginRedirect} className="register-link">
            Inicia sesión
          </span>
        </p>
      </div>
    </div>
  );
};

export default Register;