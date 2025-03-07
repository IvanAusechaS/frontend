import React, { useState, useEffect } from 'react';
import { getPuntosAtencion, getTurnos } from '../services/api';

const ProfesionalDashboard = () => {
  const [puntosAtencion, setPuntosAtencion] = useState([]);
  const [turnos, setTurnos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const [puntosData, turnosData] = await Promise.all([
          getPuntosAtencion(),
          getTurnos(token)
        ]);
        setPuntosAtencion(puntosData);
        setTurnos(turnosData);
        setLoading(false);
      } catch (err) {
        setError('Error al cargar datos');
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div style={styles.container}>
      <h2>Dashboard Profesional</h2>
      {loading && <p>Cargando...</p>}
      {error && <p style={styles.error}>{error}</p>}
      {!loading && !error && (
        <>
          <h3>Puntos de Atención</h3>
          <ul style={styles.list}>
            {puntosAtencion.map((punto) => (
              <li key={punto.id} style={styles.listItem}>
                {punto.nombre} - {punto.ubicacion} (Servicios: {punto.servicios.join(', ')})
              </li>
            ))}
          </ul>
          <h3>Turnos Pendientes</h3>
          {turnos.length > 0 ? (
            <ul style={styles.list}>
              {turnos.map((turno) => (
                <li key={turno.id} style={styles.listItem}>
                  Turno: {turno.ticket.numero} | Paciente: {turno.ticket.usuario.nombre} | 
                  Punto: {turno.punto_atencion.nombre} | Tipo: {turno.ticket.tipo_cita} | 
                  Estado: {turno.estado} | Fecha: {new Date(turno.fecha_asignacion).toLocaleString()}
                </li>
              ))}
            </ul>
          ) : (
            <p>No hay turnos pendientes.</p>
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
};

export default ProfesionalDashboard;