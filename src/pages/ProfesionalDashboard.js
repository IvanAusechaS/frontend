import React, { useState, useEffect } from 'react';
import { getTurnos, updateTurno } from '../services/api';

const ProfesionalDashboard = () => {
  const [turnos, setTurnos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
    <div style={styles.container}>
      <h2>Dashboard Profesional</h2>
      {loading && <p>Cargando...</p>}
      {error && <p style={styles.error}>{error}</p>}
      {!loading && !error && (
        <>
          <h3>Mis Turnos</h3>
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
            <p>No hay turnos asignados.</p>
          )}
        </>
      )}
    </div>
  );
};

const styles = {
  container: { padding: '20px', textAlign: 'center', maxWidth: '800px', margin: '0 auto' },
  error: { color: 'red' },
  list: { listStyle: 'none', padding: 0, textAlign: 'left' },
  listItem: { padding: '10px', borderBottom: '1px solid #ccc' },
  select: { marginLeft: '10px', padding: '5px' },
};

export default ProfesionalDashboard;