import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPuntosAtencion, createTicket } from '../services/api';

const PedirTurno = ({ user: userProp }) => {
  const [puntosAtencion, setPuntosAtencion] = useState([]);
  const [tipoCita, setTipoCita] = useState('medica');
  const [puntoAtencionId, setPuntoAtencionId] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [prioridad, setPrioridad] = useState('N');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Obtener user desde props o localStorage, con fallback a objeto vacío
  const user = userProp || JSON.parse(localStorage.getItem('user')) || {};

  useEffect(() => {
    const fetchPuntos = async () => {
      try {
        const data = await getPuntosAtencion();
        setPuntosAtencion(data);
        setPuntoAtencionId(data[0]?.id || '');
      } catch (err) {
        setError('Error al cargar puntos de atención');
      }
    };
    fetchPuntos();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No hay token de autenticación');
      if (!user.id) throw new Error('No se encontró el ID del usuario');
      const ticketData = {
        usuario_id: user.id,
        punto_atencion_id: puntoAtencionId,
        tipo_cita: tipoCita,
        prioridad,
        descripcion
      };
      console.log('Datos enviados:', ticketData); // Para depuración
      const response = await createTicket(ticketData, token);
      console.log('Respuesta del backend:', response); // Para depuración
      alert('Turno solicitado exitosamente');
      navigate('/');
    } catch (err) {
      console.error('Error completo:', err.response ? err.response.data : err.message);
      setError(`Error al crear el turno: ${err.response ? JSON.stringify(err.response.data) : err.message}`);
    }
  };

  return (
    <div style={styles.container}>
      <h2>Pedir Turno</h2>
      {error && <p style={styles.error}>{error}</p>}
      <form onSubmit={handleSubmit} style={styles.form}>
        <label style={styles.label}>Tipo de Cita:</label>
        <select value={tipoCita} onChange={(e) => setTipoCita(e.target.value)} style={styles.input}>
          <option value="medica">Cita Médica</option>
          <option value="odontologica">Cita Odontológica</option>
        </select>

        <label style={styles.label}>Punto de Atención:</label>
        <select value={puntoAtencionId} onChange={(e) => setPuntoAtencionId(e.target.value)} style={styles.input}>
          {puntosAtencion.map((punto) => (
            <option key={punto.id} value={punto.id}>{punto.nombre}</option>
          ))}
        </select>

        <label style={styles.label}>Prioridad:</label>
        <select value={prioridad} onChange={(e) => setPrioridad(e.target.value)} style={styles.input}>
          <option value="N">Normal</option>
          <option value="P">Alta</option>
        </select>

        <label style={styles.label}>Descripción:</label>
        <textarea
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          style={styles.textarea}
          required
        />

        <button type="submit" style={styles.button}>Solicitar Turno</button>
      </form>
    </div>
  );
};

const styles = {
  container: { padding: '20px', textAlign: 'center', maxWidth: '400px', margin: '0 auto' },
  form: { display: 'flex', flexDirection: 'column', gap: '15px' },
  label: { fontSize: '1.1em', color: '#333333' },
  input: { padding: '10px', fontSize: '1em', borderRadius: '5px', border: '1px solid #ccc' },
  textarea: { padding: '10px', fontSize: '1em', borderRadius: '5px', border: '1px solid #ccc', minHeight: '100px' },
  button: { padding: '10px', backgroundColor: '#50C878', color: '#FFFFFF', border: 'none', borderRadius: '5px', cursor: 'pointer' },
  error: { color: 'red' },
};

export default PedirTurno;