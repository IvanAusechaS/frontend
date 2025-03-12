// frontend/src/pages/Register.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../services/api';
import Nav from '../components/Nav';
import Footer from '../components/Footer';

const Register = ({ setUser }) => {
  const [cedula, setCedula] = useState('');
  const [nombre, setNombre] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }
    try {
      const data = await registerUser({ cedula, nombre, password });
      localStorage.setItem('token', data.access);
      localStorage.setItem('user', JSON.stringify({ id: data.user.id, nombre: data.user.nombre, es_profesional: data.user.es_profesional }));
      setUser({ id: data.user.id, nombre: data.user.nombre, es_profesional: data.user.es_profesional });
      navigate('/');
    } catch (err) {
      setError('Error al registrarse. Verifica tus datos.');
      console.error('Error de registro:', err.response?.data || err.message);
    }
  };

  return (
    <>
      <Nav user={null} setUser={setUser} />
      <div style={styles.pageContainer}>
        <div style={styles.container}>
          <h2 style={styles.title}>Registrarse</h2>
          {error && <p style={styles.error}>{error}</p>}
          <form onSubmit={handleSubmit} style={styles.form}>
            <input
              type="text"
              placeholder="Cédula"
              value={cedula}
              onChange={(e) => setCedula(e.target.value)}
              style={styles.input}
              required
            />
            <input
              type="text"
              placeholder="Nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              style={styles.input}
              required
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              required
            />
            <input
              type="password"
              placeholder="Confirmar Contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={styles.input}
              required
            />
            <button type="submit" style={styles.button}>Registrarse</button>
          </form>
          <button
            style={styles.loginButton}
            onClick={() => navigate('/login')}
          >
            ¿Ya tienes cuenta? Inicia sesión
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
};

const styles = {
  pageContainer: {
    minHeight: '100vh',
    paddingTop: '80px',
    paddingBottom: '60px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    boxSizing: 'border-box',
  },
  container: {
    padding: '20px',
    maxWidth: '400px',
    width: '100%',
    margin: '0 auto',
    boxSizing: 'border-box',
  },
  title: {
    fontSize: 'clamp(1.5rem, 5vw, 2rem)',
    textAlign: 'center',
    marginBottom: '20px',
    color: '#333',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    width: '100%',
  },
  input: {
    padding: '10px',
    fontSize: 'clamp(0.9rem, 3vw, 1rem)',
    borderRadius: '5px',
    border: '1px solid #ccc',
    width: '100%',
    boxSizing: 'border-box',
  },
  button: {
    padding: '10px',
    backgroundColor: '#50C878',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: 'clamp(1rem, 3.5vw, 1.1rem)',
    width: '100%',
    maxWidth: '200px',
    margin: '0 auto',
    transition: 'background-color 0.3s',
  },
  loginButton: {
    padding: '10px',
    backgroundColor: '#FFFFFF',
    color: '#50C878',
    border: '1px solid #50C878',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: 'clamp(1rem, 3.5vw, 1.1rem)',
    width: '100%',
    maxWidth: '200px',
    margin: '15px auto 0',
    display: 'block',
    transition: 'background-color 0.3s',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    fontSize: 'clamp(0.9rem, 3vw, 1rem)',
    marginBottom: '15px',
  },
};

export default Register;