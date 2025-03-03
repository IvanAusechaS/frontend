import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { buscarUsuarioPorCedula, createTicket, getPuntosAtencion } from '../services/api';

const PedirTurno = () => {
  const navigate = useNavigate();
  const [cedula, setCedula] = useState('');
  const [usuario, setUsuario] = useState(null);
  const [tipoCita, setTipoCita] = useState('');
  const [puntoAtencion, setPuntoAtencion] = useState('');
  const [discapacidad, setDiscapacidad] = useState('');
  const [puntosAtencion, setPuntosAtencion] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPuntosAtencion = async () => {
      try {
        const data = await getPuntosAtencion();
        setPuntosAtencion(data);
      } catch (err) {
        setError('Error al cargar puntos de atención');
      }
    };
    fetchPuntosAtencion();
  }, []);

  const verificarCedula = async () => {
    try {
      const data = await buscarUsuarioPorCedula(cedula);
      setUsuario(data);
      setError('');
    } catch (err) {
      setError('Usuario no encontrado. Por favor, regístrate.');
      setTimeout(() => navigate('/registrarse'), 2000);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!usuario) return;

    const prioridad = discapacidad ? 'P' : 'N'; // Prioridad alta si hay discapacidad
    const ticketData = {
      usuario: usuario.id,
      punto_atencion: puntoAtencion,
      tipo_cita: tipoCita,
      prioridad: prioridad,
      descripcion: `${tipoCita} - ${discapacidad || 'Sin discapacidad'}`,
      estado: 'Pendiente',
    };

    try {
      await createTicket(ticketData);
      alert('Turno solicitado con éxito');
      setCedula('');
      setUsuario(null);
      setTipoCita('');
      setPuntoAtencion('');
      setDiscapacidad('');
    } catch (err) {
      setError('Error al solicitar turno');
    }
  };

  const discapacidades = [
    'Ninguna',
    'Motriz',
    'Visual',
    'Auditiva',
    'Intelectual',
    'Psicosocial',
    'Múltiple',
  ];

  return (
    <div style={styles.container}>
      <h2>Pedir Turno</h2>
      {error && <p style={styles.error}>{error}</p>}

      {!usuario ? (
        <div>
          <label style={styles.label}>Número de Cédula:</label>
          <input
            type="text"
            value={cedula}
            onChange={(e) => setCedula(e.target.value)}
            style={styles.input}
          />
          <button onClick={verificarCedula} style={styles.button}>Verificar</button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={styles.form}>
          <p>Bienvenido, {usuario.nombre}</p>

          <label style={styles.label}>Tipo de Cita:</label>
          <select
            value={tipoCita}
            onChange={(e) => setTipoCita(e.target.value)}
            style={styles.select}
            required
          >
            <option value="">Seleccione</option>
            <option value="medica">Cita Médica</option>
            <option value="odontologica">Cita Odontológica</option>
          </select>

          <label style={styles.label}>Punto de Atención:</label>
          <select
            value={puntoAtencion}
            onChange={(e) => setPuntoAtencion(e.target.value)}
            style={styles.select}
            required
          >
            <option value="">Seleccione</option>
            {puntosAtencion.map((punto) => (
              <option key={punto.id} value={punto.id}>{punto.nombre}</option>
            ))}
          </select>

          <label style={styles.label}>Discapacidad:</label>
          <select
            value={discapacidad}
            onChange={(e) => setDiscapacidad(e.target.value)}
            style={styles.select}
          >
            <option value="">Seleccione</option>
            {discapacidades.map((disc) => (
              <option key={disc} value={disc}>{disc}</option>
            ))}
          </select>

          <button type="submit" style={styles.button}>Solicitar Turno</button>
        </form>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    textAlign: 'center',
    maxWidth: '600px',
    margin: '0 auto',
  },
  form: { display: 'flex', flexDirection: 'column', gap: '15px' },
  label: { fontSize: '1.1em', color: '#333333' },
  input: { padding: '10px', fontSize: '1em', borderRadius: '5px', border: '1px solid #ccc' },
  select: { padding: '10px', fontSize: '1em', borderRadius: '5px', border: '1px solid #ccc' },
  button: {
    padding: '10px 20px',
    backgroundColor: '#50C878',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1.1em',
  },
  error: { color: 'red', marginBottom: '10px' },
};

export default PedirTurno;