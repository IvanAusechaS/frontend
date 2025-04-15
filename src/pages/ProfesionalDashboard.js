import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTurnos, updateTurno } from '../services/api';
import './ProfesionalDashboard.css';
import { FaUser, FaCalendarAlt, FaStethoscope, FaClock, FaMapMarkerAlt } from 'react-icons/fa';
import { MdPriorityHigh } from 'react-icons/md';
import EstadisticasGraficas from './EstadisticasGraficas';

const ProfesionalDashboard = ({ user: userProp, setUser }) => {
  const [turnos, setTurnos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterEstado, setFilterEstado] = useState('all');
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
  }, [navigate, user.es_profesional, handleError]);

  const handleEstadoChange = async (turnoId, nuevoEstado) => {
    try {
      const turno = turnos.find(t => t.id === turnoId);
      if (!turno) throw new Error('Turno no encontrado');
  
      const data = {
        estado: nuevoEstado,
      };
  
      const updatedTurno = await updateTurno(turnoId, data);
      const updatedTurnos = turnos.map(t =>
        t.id === turnoId ? { ...t, ...updatedTurno } : t
      );
      setTurnos(updatedTurnos);
      setError('');
    } catch (err) {
      console.error('Error al actualizar el turno:', err);
      setError(`Error al actualizar el turno: ${err.response?.data?.detail || err.message}`);
    }
  };

  useEffect(() => {
    fetchTurnos();
    const interval = setInterval(fetchTurnos, 30000);
    return () => clearInterval(interval);
  }, [fetchTurnos]);

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    const offsetColombia = -5 * 60; // UTC-5 en minutos
    const dateColombia = new Date(date.getTime() + offsetColombia * 60 * 1000);
    return `${dateColombia.toLocaleDateString('es-CO')} ${dateColombia.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}`;
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const offsetColombia = -5 * 60; // UTC-5 en minutos
    const dateColombia = new Date(date.getTime() + offsetColombia * 60 * 1000);
    return dateColombia.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });
  };

  const turnoActual = turnos.find(turno => turno.estado === 'En progreso') ||
                      turnos.filter(turno => turno.estado === 'En espera')
                            .sort((a, b) => {
                              if (a.prioridad === b.prioridad) return a.numero.localeCompare(b.numero);
                              return a.prioridad === 'P' ? -1 : 1;
                            })[0];
  
  const turnosEnEspera = turnos.filter(turno => turno.estado === 'En espera')
                               .sort((a, b) => {
                                 if (a.prioridad === b.prioridad) return a.numero.localeCompare(b.numero);
                                 return a.prioridad === 'P' ? -1 : 1;
                               });

  const turnosCompletados = turnos.filter(turno => turno.estado === 'Atendido');
  const turnosCancelados = turnos.filter(turno => turno.estado === 'Cancelado');

  // Filtrar turnos para el día actual y horario laboral
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const turnosParaGraficas = turnos.filter(turno => {
    const fechaUTC = new Date(turno.fecha_cita);
    const offsetColombia = -5 * 60;
    const fechaColombia = new Date(fechaUTC.getTime() + offsetColombia * 60 * 1000);
    const fechaTurno = new Date(fechaColombia);
    fechaTurno.setHours(0, 0, 0, 0);
  
    const esHoy = fechaTurno.getTime() === today.getTime();
    return esHoy; // Eliminar la restricción de horario
  });
  
  // Filtrar la lista de todos los turnos
  const getFilteredTurnos = () => {
    if (filterEstado === 'all') return turnos;
    return turnos.filter(turno => turno.estado === filterEstado);
  };

  const filteredTurnos = getFilteredTurnos();

  return (
    <div className="profesional-dashboard">
      <header className="dashboard-header">
        <h1 className="dashboard-title">
          <FaStethoscope className="title-icon" /> Panel de Control
        </h1>
        <div className="profesional-info">
          <FaUser className="user-icon" />
          <span>Dr. {user.nombre || 'Profesional'}</span>
        </div>
      </header>

      {loading && (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Cargando turnos...</p>
        </div>
      )}
      
      {error && <div className="error-alert">{error}</div>}
      
      {!loading && !error && (
        <div className="dashboard-content">
          <section className="dashboard-cards">
            <div className="card turno-actual-card">
              <h2>Turno Actual</h2>
              {turnoActual ? (
                <div className="turno-actual-content">
                  <div className="numero-turno">{turnoActual.numero}</div>
                  <div className="turno-info">
                    <p><FaUser /> <strong>Paciente:</strong> {typeof turnoActual.usuario === 'object' ? turnoActual.usuario.nombre : turnoActual.usuario}</p>
                    <p><FaStethoscope /> <strong>Tipo:</strong> {turnoActual.tipo_cita}</p>
                    <p><FaCalendarAlt /> <strong>Fecha:</strong> {formatDateTime(turnoActual.fecha_cita)}</p>
                    {turnoActual.prioridad === 'P' && (
                      <p className="prioridad">
                        <MdPriorityHigh /> <strong>Prioritario</strong>
                      </p>
                    )}
                  </div>
                  <div className="turno-actions">
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
                </div>
              ) : (
                <div className="no-turno">
                  <p>No hay turno en atención actualmente</p>
                </div>
              )}
            </div>

            <div className="card turnos-espera-card">
              <h2>Sala de Espera <span className="count-badge">{turnosEnEspera.length}</span></h2>
              {turnosEnEspera.length > 0 ? (
                <ul className="turnos-list">
                  {turnosEnEspera.map(turno => (
                    <li key={turno.id} className={`turno-item ${turno.prioridad === 'P' ? 'prioritario' : ''}`}>
                      <div className="turno-info-container">
                        <span className="turno-numero">{turno.numero}</span>
                        <div className="turno-detalles">
                          <p className="turno-paciente">{typeof turno.usuario === 'object' ? turno.usuario.nombre : turno.usuario}</p>
                          <p className="turno-tipo">{turno.tipo_cita} - {formatTime(turno.fecha_cita)}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleEstadoChange(turno.id, 'En progreso')}
                        className="btn-atender"
                      >
                        Atender
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="no-turnos">
                  <p>No hay pacientes en espera</p>
                </div>
              )}
            </div>
          </section>

          <section className="dashboard-secondary">
            <div className="card punto-atencion-card">
              <h2><FaMapMarkerAlt /> Punto de Atención</h2>
              <div className="map-container">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31862.39117719055!2d-76.56485070755377!3d3.399190280820112!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e30a16339317a83%3A0x16bb00e43b737e69!2sIPS%20Melendez!5e0!3m2!1ses!2sco!4v1744311909764!5m2!1ses!2sco"
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Ubicación IPS Meléndez"
                ></iframe>
              </div>
              <div className="location-info">
                <p><strong>Dirección:</strong> Calle 36 #83-100, Barrio Meléndez</p>
                <p><strong>Teléfono:</strong> (602) 318-2000</p>
              </div>
            </div>

            <div className="card resumen-card">
              <h2><FaClock /> Resumen del Día</h2>
              <div className="stats-container">
                <div className="stat-item">
                  <div className="stat-value">{turnosEnEspera.length}</div>
                  <div className="stat-label">En espera</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">{turnosCompletados.length}</div>
                  <div className="stat-label">Atendidos</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">{turnosCancelados.length}</div>
                  <div className="stat-label">Cancelados</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">{turnos.length}</div>
                  <div className="stat-label">Total</div>
                </div>
              </div>
            </div>
          </section>

          <section className="dashboard-analytics">
            <div className="card graficas-card">
              <h2>Estadísticas</h2>
              <EstadisticasGraficas turnos={turnosParaGraficas} />
            </div>
          </section>

          <section className="all-turnos-section">
            <div className="card all-turnos-card">
              <div className="turnos-header">
                <h2>Todos los Turnos</h2>
                <div className="filter-controls">
                  <select 
                    value={filterEstado} 
                    onChange={(e) => setFilterEstado(e.target.value)}
                    className="filter-select"
                  >
                    <option value="all">Todos</option>
                    <option value="En espera">En espera</option>
                    <option value="En progreso">En progreso</option>
                    <option value="Atendido">Atendidos</option>
                    <option value="Cancelado">Cancelados</option>
                  </select>
                </div>
              </div>
              
              <div className="turnos-table-container">
                <table className="turnos-table">
                  <thead>
                    <tr>
                      <th>Número</th>
                      <th>Paciente</th>
                      <th>Tipo</th>
                      <th>Hora</th>
                      <th>Estado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTurnos.length > 0 ? (
                      filteredTurnos.map(turno => (
                        <tr key={turno.id} className={turno.prioridad === 'P' ? 'prioritario-row' : ''}>
                          <td className="numero-column">
                            {turno.numero}
                            {turno.prioridad === 'P' && <MdPriorityHigh className="priority-icon" />}
                          </td>
                          <td>{typeof turno.usuario === 'object' ? turno.usuario.nombre : turno.usuario}</td>
                          <td>{turno.tipo_cita}</td>
                          <td>{formatTime(turno.fecha_cita)}</td>
                          <td>
                            <span className={`estado-badge estado-${turno.estado.toLowerCase().replace(' ', '-')}`}>
                              {turno.estado}
                            </span>
                          </td>
                          <td>
                            <select
                              value={turno.estado}
                              onChange={(e) => handleEstadoChange(turno.id, e.target.value)}
                              className="table-estado-select"
                            >
                              <option value="En espera">En espera</option>
                              <option value="En progreso">En progreso</option>
                              <option value="Atendido">Atendido</option>
                              <option value="Cancelado">Cancelado</option>
                            </select>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="no-data-cell">No hay turnos que mostrar</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

export default ProfesionalDashboard;