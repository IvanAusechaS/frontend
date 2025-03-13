// frontend/src/pages/ProfesionalDashboard.js
import React, { useState, useEffect } from 'react';
import { getTurnos, updateTurno } from '../services/api';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import './ProfesionalDashboard.css'; // Nuevo archivo CSS

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
      console.error('Error al actualizar el turno:', err.response?.data || err.message);
      setError(`Error al actualizar el turno: ${err.response?.data?.detail || err.message}`);
    }
  };

  return (
    <>
      <Nav user={user} setUser={setUser} />
      <div className="dashboard-container">
        <h2 className="dashboard-title">Dashboard Profesional</h2>
        {loading && <p className="dashboard-text">Cargando...</p>}
        {error && <p className="dashboard-error">{error}</p>}
        {!loading && !error && (
          <div className="turnos-table-wrapper">
            <h3 className="dashboard-subtitle">Mis Turnos</h3>
            {turnos.length > 0 ? (
              <table className="turnos-table">
                <thead>
                  <tr>
                    <th>Número</th>
                    <th>Paciente</th>
                    <th>Tipo</th>
                    <th>Fecha</th>
                    <th>Estado</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {turnos.map((turno) => (
                    <tr key={turno.id} className={`turno-row estado-${turno.estado.toLowerCase().replace(' ', '-')}`}>
                      <td>{turno.numero}</td>
                      <td>{turno.usuario.nombre}</td>
                      <td>{turno.tipo_cita}</td>
                      <td>{new Date(turno.fecha_cita).toLocaleDateString()}</td>
                      <td>{turno.estado}</td>
                      <td>
                        <select
                          value={turno.estado}
                          onChange={(e) => handleEstadoChange(turno.id, e.target.value)}
                          className="estado-select"
                        >
                          <option value="En espera">En espera</option>
                          <option value="En progreso">En progreso</option>
                          <option value="Atendido">Atendido</option>
                          <option value="Cancelado">Cancelado</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="dashboard-text">No hay turnos asignados.</p>
            )}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default ProfesionalDashboard;