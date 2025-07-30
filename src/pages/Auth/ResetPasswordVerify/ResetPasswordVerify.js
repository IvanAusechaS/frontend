import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import './ResetPasswordVerify.css';

const API_URL = 'http://localhost:8000/api/tickets/';

const ResetPasswordVerify = () => {
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState(1); // 1: verificar código, 2: cambiar contraseña
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const email = searchParams.get('email');

  useEffect(() => {
    if (!email) {
      navigate('/reset-password');
    }
  }, [email, navigate]);

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    if (!code || code.length !== 6) {
      setError('El código debe tener 6 dígitos');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await axios.post(`${API_URL}verify-reset-code/`, { email, code });
      setMessage('Código verificado correctamente');
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.error || 'Código inválido');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (newPassword.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${API_URL}reset-password-confirm/`, {
        email,
        code,
        new_password: newPassword
      });
      
      setMessage(response.data.message);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al restablecer la contraseña');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setLoading(true);
    try {
      await axios.post(`${API_URL}reset-password/`, { email });
      setMessage('Nuevo código enviado a tu correo');
      setError('');
    } catch (err) {
      setError('Error al reenviar el código');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-password-verify-container">
      {step === 1 ? (
        <>
          <h2 className="reset-password-verify-title">Verificar Código</h2>
          <p className="reset-password-verify-description">
            Hemos enviado un código de 6 dígitos a: <strong>{email}</strong>
          </p>
          
          {message && <div className="alert alert-success">{message}</div>}
          {error && <div className="alert alert-error">{error}</div>}
          
          <form onSubmit={handleVerifyCode} className="reset-password-verify-form">
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="Código de 6 dígitos"
              className="reset-password-verify-input code-input"
              maxLength="6"
              pattern="[0-9]{6}"
              required
              disabled={loading}
            />
            <button 
              type="submit" 
              className="reset-password-verify-button"
              disabled={loading || code.length !== 6}
            >
              {loading ? 'Verificando...' : 'Verificar código'}
            </button>
          </form>
          
          <div className="reset-password-verify-actions">
            <button 
              onClick={handleResendCode} 
              className="resend-code-button"
              disabled={loading}
            >
              Reenviar código
            </button>
            <button 
              onClick={() => navigate('/reset-password')} 
              className="back-button"
            >
              Cambiar correo
            </button>
          </div>
        </>
      ) : (
        <>
          <h2 className="reset-password-verify-title">Nueva Contraseña</h2>
          <p className="reset-password-verify-description">
            Ingresa tu nueva contraseña
          </p>
          
          {message && <div className="alert alert-success">{message}</div>}
          {error && <div className="alert alert-error">{error}</div>}
          
          <form onSubmit={handleResetPassword} className="reset-password-verify-form">
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Nueva contraseña"
              className="reset-password-verify-input"
              minLength="8"
              required
              disabled={loading}
            />
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirmar contraseña"
              className="reset-password-verify-input"
              minLength="8"
              required
              disabled={loading}
            />
            <button 
              type="submit" 
              className="reset-password-verify-button"
              disabled={loading}
            >
              {loading ? 'Actualizando...' : 'Cambiar contraseña'}
            </button>
          </form>
        </>
      )}
    </div>
  );
};
export default ResetPasswordVerify;
