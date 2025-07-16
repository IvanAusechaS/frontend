import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';
import { normalizeUser, updateLocalStorage } from '../utils/authUtils';

const useAuth = () => {
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleAuthRequest = async (requestFn, successMessage, redirectPath) => {
    try {
      const response = await requestFn();
      if (redirectPath) {
        navigate(redirectPath);
        toast.success(successMessage, { autoClose: 3000 });
      }
      return response;
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'Credenciales incorrectas';
      setError(errorMessage);
      console.error('Error en la solicitud:', err.response?.data || err.message);
      return null; // Return null instead of throwing the error
    }
  };

  const login = async (email, password, setUser) => {
    const requestFn = () => api.post('login/', { email, password });
    try {
      const response = await requestFn();
      if (response && response.data) {
        const { access, refresh, user } = response.data;
        const normalizedUser = normalizeUser(user);
        updateLocalStorage(access, refresh, normalizedUser);
        setUser(normalizedUser);

        // Redirección lógica según el rol
        if (normalizedUser.rol === 'admin' || normalizedUser.is_admin) {
          navigate('/dashboard/admin');
          toast.success('Inicio de sesión como administrador', { autoClose: 3000 });
        } else if (normalizedUser.es_profesional) {
          navigate('/dashboard/profesional');
          toast.success('Inicio de sesión como profesional', { autoClose: 3000 });
        } else {
          navigate('/');
          toast.success('Inicio de sesión exitoso.', { autoClose: 3000 });
        }
        return normalizedUser;
      }
      return null;
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'Credenciales incorrectas';
      setError(errorMessage);
      console.error('Error en la solicitud:', err.response?.data || err.message);
      return { error: errorMessage };
    }
  };


  const register = async (formData, setUser) => {
    const requestFn = () => api.post('register/', formData);
    const response = await handleAuthRequest(
      requestFn,
      'Registro exitoso.',
      '/'
    );
    if (response) {
      const { access, refresh, user } = response.data;
      const normalizedUser = normalizeUser(user, formData);
      updateLocalStorage(access, refresh, normalizedUser);
      setUser(normalizedUser);
    }
  };

  const resetPassword = async (email) => {
    const requestFn = () => api.post('reset-password/', { email });
    await handleAuthRequest(
      requestFn,
      'Correo de recuperación enviado. Revisa tu bandeja de entrada.',
      '/login'
    );
  };

  const resetPasswordConfirm = async (token, newPassword, uid) => {
    const requestFn = () => api.post('reset-password-confirm/', { token, new_password: newPassword, uid });
    await handleAuthRequest(
      requestFn,
      'Contraseña restablecida exitosamente.',
      '/login'
    );
  };

  return { login, register, resetPassword, resetPasswordConfirm, error, setError };
};

export default useAuth;