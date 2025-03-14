// frontend/src/pages/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import axios from 'axios';

const API_URL = 'http://localhost:8000/api/';

const Login = ({ setUser }) => {
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const idToken = await user.getIdToken();

      const response = await axios.post(`${API_URL}firebase-login/`, { id_token: idToken });
      const { access, refresh, user: backendUser } = response.data;

      localStorage.setItem('token', access);
      localStorage.setItem('refreshToken', refresh);
      localStorage.setItem('user', JSON.stringify(backendUser));
      setUser(backendUser);

      if (backendUser.needs_cedula) {
        navigate('/complete-profile'); // Redirigir a completar cédula
      } else {
        navigate('/');
      }
    } catch (err) {
      setError('Error al iniciar sesión con Google');
      console.error(err);
    }
  };

  const handleRegisterRedirect = () => {
    navigate('/register');
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Iniciar Sesión</h2>
      {error && <p style={styles.error}>{error}</p>}
      <button onClick={handleGoogleLogin} style={styles.googleButton}>
        Iniciar sesión con Google
      </button>
      <button onClick={handleRegisterRedirect} style={styles.registerButton}>
        Registrarse
      </button>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '400px',
    margin: '100px auto',
    padding: '20px',
    textAlign: 'center',
  },
  title: {
    fontSize: '2rem',
    marginBottom: '20px',
  },
  error: {
    color: 'red',
    marginBottom: '10px',
  },
  googleButton: {
    padding: '10px 20px',
    fontSize: '1rem',
    backgroundColor: '#4285f4',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginBottom: '10px',
  },
  registerButton: {
    padding: '10px 20px',
    fontSize: '1rem',
    backgroundColor: '#50C878',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default Login;