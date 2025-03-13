// frontend/src/pages/PedirTurno.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPuntosAtencion, createTurno } from '../services/api';
import Nav from '../components/Nav';
import Footer from '../components/Footer';

const PedirTurno = ({ user: userProp, setUser }) => {
  const [puntosAtencion, setPuntosAtencion] = useState([]);
  const [puntoAtencionId, setPuntoAtencionId] = useState('');
  const [selectedPunto, setSelectedPunto] = useState(null);
  const [tipoCita, setTipoCita] = useState('medica');
  const [fechaCita, setFechaCita] = useState('');
  const [horaCita, setHoraCita] = useState('08:00');
  const [prioridad, setPrioridad] = useState('N');
  const [descripcion, setDescripcion] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const user = userProp || JSON.parse(localStorage.getItem('user')) || {};

  useEffect(() => {
    const fetchPuntos = async () => {
      try {
        const data = await getPuntosAtencion();
        console.log('Puntos de atención recibidos:', data);
        const puntosConProfesional = data.filter(p => p.profesional);
        setPuntosAtencion(puntosConProfesional);
        if (puntosConProfesional.length > 0) {
          setPuntoAtencionId(puntosConProfesional[0].id.toString());
        } else {
          setError('No hay puntos de atención disponibles con profesionales');
        }
      } catch (err) {
        setError('Error al cargar puntos de atención');
        console.error('Error fetching puntos:', err);
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
      if (!puntoAtencionId || puntoAtencionId === '') throw new Error('Debe seleccionar un punto de atención');
  
      // Construir la fecha con zona horaria UTC-5 (Colombia)
      const fechaCitaCompleta = `${fechaCita}T${horaCita}:00-05:00`; // Ej. "2025-03-13T09:00:00-05:00"
      const turnoData = {
        usuario_id: user.id,
        punto_atencion_id: parseInt(puntoAtencionId),
        tipo_cita: tipoCita,
        prioridad,
        descripcion,
        fecha_cita: fechaCitaCompleta,
      };
      console.log('Datos enviados al backend:', turnoData);
      await createTurno(turnoData, token);
      alert('Turno solicitado exitosamente');
      navigate('/');
    } catch (err) {
      console.error('Error completo:', err.response ? err.response.data : err.message);
      setError(`Error al crear el turno: ${err.response ? JSON.stringify(err.response.data) : err.message}`);
    }
  };

  const horasDisponibles = [
    '08:00', '09:00', '10:00', '11:00',
    '14:00', '15:00',
  ];

  return (
    <>
      <Nav user={user} setUser={setUser} />
      <div style={styles.pageContainer}>
        <div style={styles.container}>
          <h2 style={styles.title}>Pedir Turno</h2>
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
                  {punto.nombre} - {punto.profesional ? punto.profesional : 'Sin profesional'}
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

                <label style={styles.label}>Hora de la Cita:</label>
                <select
                  value={horaCita}
                  onChange={(e) => setHoraCita(e.target.value)}
                  style={styles.input}
                  required
                >
                  {horasDisponibles.map(hora => (
                    <option key={hora} value={hora}>{hora}</option>
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
              </>
            )}

            <button type="submit" style={styles.button} disabled={!selectedPunto}>Solicitar Turno</button>
          </form>
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
    maxWidth: '600px',
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
  error: {
    color: 'red',
    textAlign: 'center',
    fontSize: 'clamp(0.9rem, 3vw, 1rem)',
    marginBottom: '15px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    width: '100%',
  },
  label: {
    fontSize: 'clamp(1rem, 3.5vw, 1.1rem)',
    color: '#333',
  },
  input: {
    padding: '10px',
    fontSize: 'clamp(0.9rem, 3vw, 1rem)',
    borderRadius: '5px',
    border: '1px solid #ccc',
    width: '100%',
    boxSizing: 'border-box',
  },
  textarea: {
    padding: '10px',
    fontSize: 'clamp(0.9rem, 3vw, 1rem)',
    borderRadius: '5px',
    border: '1px solid #ccc',
    minHeight: '100px',
    width: '100%',
    boxSizing: 'border-box',
    resize: 'vertical',
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
  servicios: {
    fontSize: 'clamp(0.9rem, 3vw, 1rem)',
    color: '#666',
    textAlign: 'left',
    padding: '10px',
    backgroundColor: '#f5f5f5',
    borderRadius: '5px',
    width: '100%',
    boxSizing: 'border-box',
  },
};

export default PedirTurno;