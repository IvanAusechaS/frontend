import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

const API_URL = 'http://localhost:8000/tickets/';

const Login = ({ setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Normaliza el user al formato {id, cedula, email, nombre, es_profesional}
  const normalizeUser = (userData) => {
    return {
      id: userData.id,
      cedula: userData.cedula || '',
      email: userData.email || '',
      nombre: userData.nombre || 'Usuario',
      es_profesional: userData.es_profesional || false
    };
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}login/`, { email, password });
      const { access, refresh, user } = response.data;
      const normalizedUser = normalizeUser(user);
      localStorage.setItem('token', access);
      localStorage.setItem('refreshToken', refresh);
      localStorage.setItem('user', JSON.stringify(normalizedUser));
      setUser(normalizedUser);
      navigate('/');
    } catch (err) {
      setError('Credenciales inválidas');
      console.error('Error en login:', err.response?.data || err.message);
    }
  };

  const handleRegisterRedirect = () => navigate('/register');
  const handleResetPasswordRedirect = () => navigate('/reset-password');

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">Iniciar Sesión</h1>
        <p className="login-subtitle">Accede a tu cuenta con facilidad</p>
        {error && <p className="login-error">{error}</p>}

        {/* Formulario de login con email */}
        <form onSubmit={handleLogin} className="login-form">
          <div className="login-input-group">
            <label className="login-label">Correo Electrónico</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Ingresa tu correo"
              className="login-input"
              required
            />
          </div>
          <div className="login-input-group">
            <label className="login-label">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Ingresa tu contraseña"
              className="login-input"
              required
            />
          </div>
          <button type="submit" className="login-button">Iniciar Sesión</button>
        </form>

        {/* Enlaces adicionales */}
        <div className="login-links-container">
          <p className="login-link-text">
            ¿Olvidaste tu contraseña?{' '}
            <span onClick={handleResetPasswordRedirect} className="login-link">
              Restablecer
            </span>
          </p>
          <p className="login-link-text">
            ¿No tienes cuenta?{' '}
            <span onClick={handleRegisterRedirect} className="login-link">
              Regístrate
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;