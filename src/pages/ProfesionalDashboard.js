import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTurnos, updateTurno } from '../services/api';
import './ProfesionalDashboard.css';
import { FaUser } from 'react-icons/fa';
import EstadisticasGraficas from './EstadisticasGraficas';

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
      console.log('Datos de turnos:', data);
      setTurnos(data);
      setLoading(false);
    } catch (err) {
      handleError(err);
    }
  }, [navigate, setUser, user.es_profesional, handleError]);

  const handleEstadoChange = async (turnoId, nuevoEstado) => {
    try {
      const turno = turnos.find(t => t.id === turnoId);
      if (!turno) throw new Error('Turno no encontrado');

      const puntoAtencionId = turno.punto_atencion_id_read;
      if (!puntoAtencionId) {
        throw new Error('No se encontró punto_atencion_id_read en el turno');
      }

      if (!turno.tipo_cita) throw new Error('El campo tipo_cita es requerido');
      if (!turno.numero) throw new Error('El campo numero es requerido');
      if (!turno.usuario) throw new Error('El campo usuario es requerido');
      if (!turno.fecha_cita) throw new Error('El campo fecha_cita es requerido');
      if (!turno.prioridad) throw new Error('El campo prioridad es requerido');

      const data = {
        estado: nuevoEstado,
        punto_atencion_id: puntoAtencionId,
        tipo_cita: turno.tipo_cita,
        numero: turno.numero,
        usuario: turno.usuario,
        fecha_cita: turno.fecha_cita,
        prioridad: turno.prioridad,
        descripcion: turno.descripcion || '',
      };

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
                              return a.prioridad === 'P' ? -1 : 1;
                            })[0];
  const turnosEnEspera = turnos.filter(turno => turno.estado === 'En espera')
                               .sort((a, b) => {
                                 if (a.prioridad === b.prioridad) return a.numero.localeCompare(b.numero);
                                 return a.prioridad === 'P' ? -1 : 1;
                               });

  return (
    <div className="profesional-dashboard">
      <h2 className="dashboard-title">Dashboard Profesional</h2>
      {loading && <p className="dashboard-loading">Cargando...</p>}
      {error && <p className="dashboard-error">{error}</p>}
      {!loading && !error && (
        <div className="dashboard-grid">
          <div className="top-section">
            <div className="dashboard-card turno-actual">
              <h3>Turno Actual</h3>
              {turnoActual ? (
                <div className="turno-details">
                  <p><strong><FaUser style={{ marginRight: '5px' }} />Usuario:</strong> {turnoActual.usuario}</p>
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
          </div>

          <div className="dashboard-card punto-atencion">
            <h3>Punto de Atención</h3>
            <div className="map-container">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31862.39117719055!2d-76.56485070755377!3d3.399190280820112!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e30a16339317a83%3A0x16bb00e43b737e69!2sIPS%20Melendez!5e0!3m2!1ses!2sco!4v1744311909764!5m2!1ses!2sco"
                width="100%"
                height="200"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Ubicación de la Universidad del Valle - Sede Meléndez"
              ></iframe>
            </div>
          </div>

          <EstadisticasGraficas />
        </div>
      )}
    </div>
  );
};

export default ProfesionalDashboard;