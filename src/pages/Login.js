import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/api';

const Login = ({ setUser }) => {
  const [cedula, setCedula] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await loginUser(cedula, password);
      localStorage.setItem('token', data.access);
      localStorage.setItem('user', JSON.stringify({ id: data.user.id, nombre: data.user.nombre, es_profesional: data.user.es_profesional }));
      setUser({ id: data.user.id, nombre: data.user.nombre, es_profesional: data.user.es_profesional });
      navigate('/');
    } catch (err) {
      setError('Credenciales inválidas');
      console.error('Error de login:', err.response?.data || err.message);
    }
  };

  return (
    <div style={styles.container}>
      <h2>Iniciar Sesión</h2>
      {error && <p style={styles.error}>{error}</p>}
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          placeholder="Cédula"
          value={cedula}
          onChange={(e) => setCedula(e.target.value)}
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />
        <button type="submit" style={styles.button}>Iniciar Sesión</button>
      </form>
    </div>
  );
};


const styles = {
  container: { padding: '20px', textAlign: 'center', maxWidth: '400px', margin: '0 auto' },
  form: { display: 'flex', flexDirection: 'column', gap: '15px' },
  label: { fontSize: '1.1em', color: '#333333' },
  input: { padding: '10px', fontSize: '1em', borderRadius: '5px', border: '1px solid #ccc' },
  button: { padding: '10px', backgroundColor: '#50C878', color: '#FFFFFF', border: 'none', borderRadius: '5px', cursor: 'pointer' },
  error: { color: 'red' },
};

export default Login;