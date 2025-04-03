import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTurnos, updateTurno } from '../services/api';
import './ProfesionalDashboard.css';

const ProfesionalDashboard = ({ user: userProp, setUser }) => {
  const [turnos, setTurnos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const user = userProp || JSON.parse(localStorage.getItem('user')) || {};

  const handleError = useCallback((err) => {
    if (err.response?.status === 401) {
      setError('Sesión expirada. Por favor, inicia sesión nuevamente.');
      localStorage.clear();
      setUser(null);
      navigate('/login');
    } else {
      setError(`Error: ${err.response?.data?.detail || err.message}`);
    }
    setLoading(false);
  }, [navigate, setUser]);

  const fetchTurnos = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token || !user.es_profesional) {
        setError('Debes ser un profesional autenticado para acceder.');
        navigate('/login');
        return;
      }
      const data = await getTurnos();
      setTurnos(data);
      setLoading(false);
    } catch (err) {
      handleError(err);
    }
  }, [navigate, setUser, user.es_profesional, handleError]);

  const handleEstadoChange = async (turnoId, nuevoEstado) => {
    try {
      const data = { estado: nuevoEstado };
      console.log('Actualizando turno:', { id: turnoId, data });
      const updatedTurno = await updateTurno(turnoId, data);
      const updatedTurnos = turnos.map(turno =>
        turno.id === turnoId ? { ...turno, ...updatedTurno } : turno
      );
      setTurnos(updatedTurnos);
      setError('');
    } catch (err) {
      console.error('Error completo:', err.response?.data || err.message);
      setError(`Error al actualizar el turno: ${err.response?.data?.detail || JSON.stringify(err.response?.data) || err.message}`);
    }
  };

  useEffect(() => {
    fetchTurnos();
    const interval = setInterval(fetchTurnos, 30000);
    return () => clearInterval(interval);
  }, [fetchTurnos]);

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString('es-CO')} ${date.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}`;
  };

  const turnoActual = turnos.find(turno => turno.estado === 'En progreso') ||
                      turnos.filter(turno => turno.estado === 'En espera')
                            .sort((a, b) => {
                              if (a.prioridad === b.prioridad) return a.numero.localeCompare(b.numero);
                              return a.prioridad === 'P' ? -1 : 1; // Prioridad 'P' primero
                            })[0];
  const turnosEnEspera = turnos.filter(turno => turno.estado === 'En espera')
                               .sort((a, b) => {
                                 if (a.prioridad === b.prioridad) return a.numero.localeCompare(b.numero);
                                 return a.prioridad === 'P' ? -1 : 1;
                               });
  const puntoAtencion = turnos.length > 0 ? turnos[0].punto_atencion : 'No asignado';

  return (
    <div className="profesional-dashboard">
      <h2 className="dashboard-title">Dashboard Profesional</h2>
      {loading && <p className="dashboard-loading">Cargando...</p>}
      {error && <p className="dashboard-error">{error}</p>}
      {!loading && !error && (
        <div className="dashboard-grid">
          <div className="dashboard-card turno-actual">
            <h3>Turno Actual</h3>
            {turnoActual ? (
              <div className="turno-details">
                <p><strong>Número:</strong> {turnoActual.numero}</p>
                <p><strong>Paciente:</strong> {turnoActual.usuario}</p>
                <p><strong>Tipo:</strong> {turnoActual.tipo_cita}</p>
                <p><strong>Fecha:</strong> {formatDateTime(turnoActual.fecha_cita)}</p>
                <p><strong>Estado:</strong> {turnoActual.estado}</p>
                <select
                  value={turnoActual.estado}
                  onChange={(e) => handleEstadoChange(turnoActual.id, e.target.value)}
                  className="estado-select"
                >
                  <option value="En espera">En espera</option>
                  <option value="En progreso">En progreso</option>
                  <option value="Atendido">Atendido</option>
                  <option value="Cancelado">Cancelado</option>
                </select>
              </div>
            ) : (
              <p>No hay turno actual.</p>
            )}
          </div>

          <div className="dashboard-card turnos-espera">
            <h3>Turnos en Espera ({turnosEnEspera.length})</h3>
            {turnosEnEspera.length > 0 ? (
              <ul className="turno-list">
                {turnosEnEspera.map(turno => (
                  <li key={turno.id} className="turno-item">
                    <span>{turno.numero} ({turno.prioridad === 'P' ? 'Prioritario' : 'Normal'}) - {turno.usuario} ({turno.tipo_cita})</span>
                    <button
                      onClick={() => handleEstadoChange(turno.id, 'En progreso')}
                      className="action-button"
                    >
                      Atender
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No hay turnos en espera.</p>
            )}
          </div>

          <div className="dashboard-card punto-atencion">
            <h3>Punto de Atención</h3>
            <p>{puntoAtencion}</p>
          </div>

          <div className="dashboard-card perfil">
            <h3>Perfil</h3>
            <p><strong>Nombre:</strong> {user.nombre}</p>
            <p><strong>Cédula:</strong> {user.cedula}</p>
            <p><strong>Email:</strong> {user.email || 'No disponible'}</p>
            <button onClick={() => navigate('/update-profile')} className="profile-button">
              Editar Perfil
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfesionalDashboard;