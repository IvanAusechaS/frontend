import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../services/api';

const Registrarse = () => {
  const [cedula, setCedula] = useState('');
  const [email, setEmail] = useState('');
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerUser(cedula, email, nombre, telefono, password);
      alert('Usuario registrado exitosamente');
      navigate('/login');
    } catch (err) {
      setError('Error al registrar usuario. Verifica los datos.');
    }
  };

  return (
    <div style={styles.container}>
      <h2>Registrarse</h2>
      {error && <p style={styles.error}>{error}</p>}
      <form onSubmit={handleSubmit} style={styles.form}>
        <label style={styles.label}>Cédula:</label>
        <input
          type="text"
          value={cedula}
          onChange={(e) => setCedula(e.target.value)}
          style={styles.input}
          required
        />
        <label style={styles.label}>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
          required
        />
        <label style={styles.label}>Nombre:</label>
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          style={styles.input}
          required
        />
        <label style={styles.label}>Teléfono:</label>
        <input
          type="text"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
          style={styles.input}
        />
        <label style={styles.label}>Contraseña:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
          required
        />
        <button type="submit" style={styles.button}>Registrarse</button>
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

export default Registrarse;