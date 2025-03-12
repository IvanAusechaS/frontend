// frontend/src/pages/ProfesionalDashboard.js
import React, { useState, useEffect } from 'react';
import { getTurnos, updateTurno } from '../services/api';
import Nav from '../components/Nav';
import Footer from '../components/Footer';

const ProfesionalDashboard = ({ user: userProp, setUser }) => {
  const [turnos, setTurnos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const user = userProp || JSON.parse(localStorage.getItem('user')) || {};

  useEffect(() => {
    const fetchTurnos = async () => {
      try {
        const token = localStorage.getItem('token');
        const data = await getTurnos(token);
        setTurnos(data);
        setLoading(false);
      } catch (err) {
        setError('Error al cargar turnos');
        setLoading(false);
      }
    };
    fetchTurnos();
  }, []);

  const handleEstadoChange = async (turnoId, nuevoEstado) => {
    try {
      const token = localStorage.getItem('token');
      const updatedTurno = await updateTurno(turnoId, nuevoEstado, token);
      setTurnos(turnos.map(turno =>
        turno.id === turnoId ? { ...turno, estado: updatedTurno.estado, fecha_atencion: updatedTurno.fecha_atencion } : turno
      ));
    } catch (err) {
      setError('Error al actualizar el turno');
    }
  };

  return (
    <>
      <Nav user={user} setUser={setUser} />
      <div style={styles.pageContainer}>
        <div style={styles.container}>
          <h2 style={styles.title}>Dashboard Profesional</h2>
          {loading && <p style={styles.text}>Cargando...</p>}
          {error && <p style={styles.error}>{error}</p>}
          {!loading && !error && (
            <>
              <h3 style={styles.subtitle}>Mis Turnos</h3>
              {turnos.length > 0 ? (
                <ul style={styles.list}>
                  {turnos.map((turno) => (
                    <li key={turno.id} style={styles.listItem}>
                      Turno: {turno.numero} | Paciente: {turno.usuario.nombre} | 
                      Tipo: {turno.tipo_cita} | Fecha: {new Date(turno.fecha_cita).toLocaleDateString()} | 
                      Estado: 
                      <select
                        value={turno.estado}
                        onChange={(e) => handleEstadoChange(turno.id, e.target.value)}
                        style={styles.select}
                      >
                        <option value="En espera">En espera</option>
                        <option value="En progreso">En progreso</option>
                        <option value="Atendido">Atendido</option>
                        <option value="Cancelado">Cancelado</option>
                      </select>
                    </li>
                  ))}
                </ul>
              ) : (
                <p style={styles.text}>No hay turnos asignados.</p>
              )}
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

const styles = {
  pageContainer: {
    minHeight: '100vh',
    paddingTop: '80px', // Más espacio para evitar superposición con el nav
    paddingBottom: '60px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    boxSizing: 'border-box',
  },
  container: {
    padding: '20px',
    maxWidth: '800px',
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
  subtitle: {
    fontSize: 'clamp(1.2rem, 4vw, 1.5rem)',
    textAlign: 'center',
    marginBottom: '15px',
    color: '#333',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    fontSize: 'clamp(0.9rem, 3vw, 1rem)',
    marginBottom: '15px',
  },
  text: {
    fontSize: 'clamp(0.9rem, 3vw, 1rem)',
    textAlign: 'center',
    color: '#666',
  },
  list: {
    listStyle: 'none',
    padding: 0,
    width: '100%',
    textAlign: 'left',
  },
  listItem: {
    padding: '10px',
    borderBottom: '1px solid #ccc',
    fontSize: 'clamp(0.9rem, 3vw, 1rem)',
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
    alignItems: 'center',
  },
  select: {
    padding: '5px',
    fontSize: 'clamp(0.9rem, 3vw, 1rem)',
    borderRadius: '5px',
    border: '1px solid #ccc',
  },
};

export default ProfesionalDashboard;