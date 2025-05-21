import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../../hooks/useAuth';
import './Login.css';

import { useLocation } from 'react-router-dom';

const Login = ({ setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, error, success } = useAuth(); // Add for the Delay
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    setTimeout(() => {
      const yOffset = -76; // altura del header
      window.scrollTo({ top: 0 + yOffset, behavior: 'smooth' });
    }, 250);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    await login(email, password, setUser);
  };

  const handleRegisterRedirect = () => navigate('/register');
  const handleResetPasswordRedirect = () => navigate('/reset-password');

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">Iniciar Sesión</h1>
        <p className="login-subtitle">Accede a tu cuenta con facilidad</p>
        {success && <p className="login-success">{success}</p>} {/* Add success message */}
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