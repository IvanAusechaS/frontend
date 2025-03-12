import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPuntosAtencion, createTurno } from '../services/api';

const PedirTurno = ({ user: userProp }) => {
  const [puntosAtencion, setPuntosAtencion] = useState([]);
  const [puntoAtencionId, setPuntoAtencionId] = useState('');
  const [selectedPunto, setSelectedPunto] = useState(null);
  const [tipoCita, setTipoCita] = useState('medica');
  const [fechaCita, setFechaCita] = useState('');
  const [prioridad, setPrioridad] = useState('N');
  const [descripcion, setDescripcion] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const user = userProp || JSON.parse(localStorage.getItem('user')) || {};

  useEffect(() => {
    const fetchPuntos = async () => {
      try {
        const data = await getPuntosAtencion();
        setPuntosAtencion(data.filter(p => p.profesional)); // Solo puntos con profesional
        setPuntoAtencionId(data.find(p => p.profesional)?.id || '');
      } catch (err) {
        setError('Error al cargar puntos de atención');
      }
    };
    fetchPuntos();
  }, []);

  useEffect(() => {
    const punto = puntosAtencion.find(p => p.id === parseInt(puntoAtencionId));
    setSelectedPunto(punto || null);
  }, [puntoAtencionId, puntosAtencion]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No hay token de autenticación');
      if (!user.id) throw new Error('No se encontró el ID del usuario');
      const turnoData = {
        usuario_id: user.id,
        punto_atencion_id: puntoAtencionId,
        tipo_cita: tipoCita,
        prioridad,
        descripcion,
        fecha_cita: fechaCita
      };
      console.log('Datos enviados:', turnoData);
      const response = await createTurno(turnoData, token);
      console.log('Respuesta del backend:', response);
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
        <label style={styles.label}>Punto de Atención:</label>
        <select
          value={puntoAtencionId}
          onChange={(e) => setPuntoAtencionId(e.target.value)}
          style={styles.input}
          required
        >
          <option value="">Seleccione un punto</option>
          {puntosAtencion.map((punto) => (
            <option key={punto.id} value={punto.id}>
              {punto.nombre} - {punto.profesional ? punto.profesional.nombre : 'Sin profesional'}
            </option>
          ))}
        </select>

        {selectedPunto && (
          <>
            <label style={styles.label}>Servicios Disponibles:</label>
            <p style={styles.servicios}>{selectedPunto.servicios_texto || 'No se especificaron servicios'}</p>

            <label style={styles.label}>Tipo de Cita:</label>
            <select value={tipoCita} onChange={(e) => setTipoCita(e.target.value)} style={styles.input}>
              <option value="medica">Cita Médica</option>
              <option value="odontologica">Cita Odontológica</option>
            </select>

            <label style={styles.label}>Fecha de la Cita:</label>
            <input
              type="date"
              value={fechaCita}
              onChange={(e) => setFechaCita(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              style={styles.input}
              required
            />

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
          </>
        )}

        <button type="submit" style={styles.button} disabled={!selectedPunto}>Solicitar Turno</button>
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
  servicios: { fontSize: '1em', color: '#666', textAlign: 'left', padding: '10px', backgroundColor: '#f5f5f5', borderRadius: '5px' },
};

export default PedirTurno;