// frontend/src/pages/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import axios from 'axios';
import './Login.css';

const API_URL = 'http://localhost:8000/api/';

const Login = ({ setUser }) => {
  const [cedula, setCedula] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Normaliza el user al formato {id, cedula, email, nombre, es_profesional}
  const normalizeUser = (userData, inputCedula = '') => {
    return {
      id: userData.id,
      cedula: userData.cedula || inputCedula || '',
      email: userData.email || '',
      nombre: userData.nombre || 'Usuario',
      es_profesional: userData.es_profesional || false
    };
  };

  const handleManualLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}login/`, { cedula, password });
      const { access, refresh, user } = response.data;
      const normalizedUser = normalizeUser(user, cedula); // Usa la cédula del formulario si no viene
      localStorage.setItem('token', access);
      localStorage.setItem('refreshToken', refresh);
      localStorage.setItem('user', JSON.stringify(normalizedUser));
      setUser(normalizedUser);
      navigate('/');
    } catch (err) {
      setError('Credenciales inválidas');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();
      const response = await axios.post(`${API_URL}firebase-login/`, { id_token: idToken });
      const { access, refresh, user } = response.data;
      const normalizedUser = normalizeUser(user); // Normaliza el user de Firebase
      localStorage.setItem('token', access);
      localStorage.setItem('refreshToken', refresh);
      localStorage.setItem('user', JSON.stringify(normalizedUser));
      setUser(normalizedUser);
      if (user.needs_cedula) {
        navigate('/complete-profile');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError('Error al iniciar sesión con Google');
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

        {/* Formulario de login manual */}
        <form onSubmit={handleManualLogin} className="login-form">
          <div className="login-input-group">
            <label className="login-label">Cédula</label>
            <input
              type="text"
              value={cedula}
              onChange={(e) => setCedula(e.target.value)}
              placeholder="Ingresa tu cédula"
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

        {/* Botón de login con Google */}
        <button onClick={handleGoogleLogin} className="login-google-button">
          <span className="login-google-icon">G</span> Iniciar con Google
        </button>

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