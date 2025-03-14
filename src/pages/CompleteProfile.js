// frontend/src/pages/CompleteProfile.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:8000/api/';

const CompleteProfile = ({ setUser }) => {
  const [cedula, setCedula] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user')) || {};

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${API_URL}update-cedula/`,
        { cedula },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const updatedUser = response.data.user;
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Error al actualizar la cédula');
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Completar Perfil</h2>
      <p>Por favor, ingresa tu cédula para continuar.</p>
      {error && <p style={styles.error}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={cedula}
          onChange={(e) => setCedula(e.target.value)}
          placeholder="Cédula"
          style={styles.input}
          required
        />
        <button type="submit" style={styles.button}>Guardar</button>
      </form>
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
  input: {
    padding: '10px',
    width: '100%',
    marginBottom: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#50C878',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default CompleteProfile;