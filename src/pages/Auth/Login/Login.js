import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../../hooks/useAuth';
import './Login.css';

const Login = ({ setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, error, success } = useAuth(); // Add for the Delay
  const navigate = useNavigate();

  // 🔐 Estado para controlar intentos
  const [attempts, setAttempts] = useState(0);
  const [lockTime, setLockTime] = useState(0); // en segundos
  const [isLocked, setIsLocked] = useState(false);
  
  

  useEffect(() => {
    let timer;
    if (isLocked && lockTime > 0) {
      timer = setTimeout(() => {
        setLockTime((prev) => prev - 1);
      }, 1000);
    } else if (lockTime === 0 && isLocked) {
      setIsLocked(false);
    }
    return () => clearTimeout(timer);
  }, [lockTime, isLocked]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (isLocked) return;

    const result = await login(email, password, setUser);

    if (!result || result.error) {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);

      if (newAttempts >= 3) {
        const waitTime = 10 * Math.pow(2, newAttempts - 3); // Ej: 10s, 20s, 40s...
        setLockTime(waitTime);
        setIsLocked(true);
      }
    } else {
      // Resetear estado al iniciar sesión con éxito
      setAttempts(0);
      setIsLocked(false);
      setLockTime(0);
    }
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
        {isLocked && (
          <p className="login-warning">
            Demasiados intentos. Intenta nuevamente en {lockTime} segundos.
          </p>
        )}
          
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
                disabled={isLocked} // Deshabilitar el campo si está bloqueado
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
                disabled={isLocked}

              />
            </div>
            <button type="submit" className="login-button" disabled={isLocked}>
              Iniciar Sesión
              </button>
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