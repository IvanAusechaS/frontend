import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getCurrentTurnos, getPuntosAtencionServices } from '../../../services/api';
import adPlaceholder from '../../../assets/images/publicidad.jpeg';
import './TurnoTablero.css';

const TurnoTablero = ({ user: userProp, setUser }) => {
  const [currentTurnos, setCurrentTurnos] = useState([]);
  const [puntosServicios, setPuntosServicios] = useState({});
  const [selectedPunto, setSelectedPunto] = useState('');
  const [userTurno, setUserTurno] = useState(null);
  const [waitingTime, setWaitingTime] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const user = React.useMemo(() => userProp || JSON.parse(localStorage.getItem('user')) || {}, [userProp]);

  useEffect(() => {
    window.scrollTo(0, 0);
    setTimeout(() => {
      const yOffset = -76;
      window.scrollTo({ top: 0 + yOffset, behavior: 'smooth' });
    }, 250);
  }, []);

  // Actualizar la hora actual cada minuto
  useEffect(() => {
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timeInterval);
  }, []);

  // Calcular tiempo de espera aproximado
  const calculateWaitingTime = (turnos, userTurnoNumber) => {
    if (!userTurnoNumber || !turnos.length) return null;
    
    const userTurnoIndex = turnos.findIndex(turno => turno.numero === userTurnoNumber);
    if (userTurnoIndex === -1) return null;
    
    const minutesPerTurn = 10;
    const turnosAhead = userTurnoIndex;
    const estimatedMinutes = turnosAhead * minutesPerTurn;
    
    return {
      position: userTurnoIndex + 1,
      totalTurnos: turnos.length,
      estimatedMinutes,
      estimatedTime: new Date(Date.now() + estimatedMinutes * 60000)
    };
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token || !user.id) {
          setError('Debe iniciar sesión para acceder al tablero de citas.');
          navigate('/login');
          return;
        }
        
        const puntosData = await getPuntosAtencionServices();
        setPuntosServicios(puntosData);
        const initialPunto = location.state?.selectedPunto || Object.keys(puntosData)[0] || '';
        setSelectedPunto(initialPunto);

        if (initialPunto) {
          const turnosData = await getCurrentTurnos(initialPunto);
          const turnos = turnosData.turnos || [];
          setCurrentTurnos(turnos);
          
          const userCurrentTurno = turnos.find(turno => turno.usuario.id === user.id);
          setUserTurno(userCurrentTurno);
          
          if (userCurrentTurno) {
            const waitTime = calculateWaitingTime(turnos, userCurrentTurno.numero);
            setWaitingTime(waitTime);
          } else {
            setWaitingTime(null);
          }
        }
      } catch (err) {
        setError('Error al cargar la información: ' + (err.response?.data?.detail || err.message));
        if (err.response?.status === 401) {
          localStorage.clear();
          setUser(null);
          navigate('/login');
        }
      }
    };
    
    fetchData();
    const interval = setInterval(() => {
      if (selectedPunto) fetchData();
    }, 30000);
    
    return () => clearInterval(interval);
  }, [navigate, setUser, user.id, location.state?.selectedPunto]);

  const handlePuntoChange = async (puntoId) => {
    try {
      setSelectedPunto(puntoId);
      const turnosData = await getCurrentTurnos(puntoId);
      const turnos = turnosData.turnos || [];
      setCurrentTurnos(turnos);
      
      const userCurrentTurno = turnos.find(turno => turno.usuario.id === user.id);
      setUserTurno(userCurrentTurno);
      
      if (userCurrentTurno) {
        const waitTime = calculateWaitingTime(turnos, userCurrentTurno.numero);
        setWaitingTime(waitTime);
      } else {
        setWaitingTime(null);
      }
    } catch (err) {
      setError('Error al cambiar de punto de atención: ' + (err.response?.data?.detail || err.message));
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('es-CO', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  const getStatusMessage = () => {
    if (!userTurno) {
      return {
        type: 'info',
        message: 'No tiene citas pendientes en esta sucursal'
      };
    }
    
    if (waitingTime && waitingTime.position === 1) {
      return {
        type: 'active',
        message: '¡Su turno está siendo atendido!'
      };
    }
    
    return {
      type: 'waiting',
      message: `Su cita será atendida aproximadamente a las ${formatTime(waitingTime?.estimatedTime || new Date())}`
    };
  };

  const statusInfo = getStatusMessage();

  return (
    <div className="turno-tablero-page">
      <div className="turno-tablero-container">
        <header className="turno-tablero-header">
          <div className="header-icon">👓</div>
          <h1 className="turno-tablero-title">Tablero de Turnos</h1>
          <p className="turno-tablero-subtitle">Centro de Atención</p>
          <div className="current-time">
            <span className="time-label">Hora actual:</span>
            <span className="time-value">{formatTime(currentTime)}</span>
          </div>
        </header>

        {error && (
          <div className="turno-tablero-error">
            <div className="error-icon">⚠️</div>
            <p>{error}</p>
          </div>
        )}

        {userTurno && (
          <div className={`user-status-card ${statusInfo.type}`}>
            <div className="status-header">
              <div className="status-icon">
                {statusInfo.type === 'active' ? '🔔' : statusInfo.type === 'waiting' ? '⏰' : 'ℹ️'}
              </div>
              <div className="status-content">
                <h3>Su Turno N° {userTurno.numero}</h3>
                <p className="status-message">{statusInfo.message}</p>
                {waitingTime && waitingTime.position > 1 && (
                  <div className="waiting-details">
                    <span>Posición en cola: {waitingTime.position} de {waitingTime.totalTurnos}</span>
                    <span>Tiempo estimado: ~{waitingTime.estimatedMinutes} minutos</span>
                  </div>
                )}
              </div>
            </div>
            <div className="priority-badge">
              {userTurno.prioridad === 'P' ? 'Prioritario' : 'Regular'}
            </div>
          </div>
        )}

        <div className="tablero-controls">
          <div className="punto-selector-card">
            <label className="selector-label">
              <span className="label-icon">🏢</span>
              Punto de Atención
            </label>
            <select
              value={selectedPunto}
              onChange={(e) => handlePuntoChange(e.target.value)}
              className="form-select-modern"
            >
              <option value="">Selecciona un punto</option>
              {Object.entries(puntosServicios).map(([id, punto]) => (
                <option key={id} value={id}>{punto.nombre}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="main-content">
          <div className="turnos-display-section">
            {selectedPunto ? (
              <div className="display-board">
                <div className="board-header">
                  <h2 className="sucursal-name">
                    📍 {puntosServicios[selectedPunto].nombre}
                  </h2>
                  <div className="refresh-indicator">
                    <span className="refresh-text">Actualización automática cada 30s</span>
                    <div className="pulse-dot"></div>
                  </div>
                </div>
                
                <div className="turnos-grid">
                  <div className="turnos-section">
                    <div className="section-header">
                      <h3>🔔 Turnos en Atención</h3>
                      <span className="section-badge">
                        {currentTurnos.filter(turno => turno.estado === 'En progreso').length}
                      </span>
                    </div>
                    <div className="turnos-list">
                      {currentTurnos.filter(turno => turno.estado === 'En progreso').length > 0 ? (
                        currentTurnos
                          .filter(turno => turno.estado === 'En progreso')
                          .map(turno => (
                            <div key={turno.id} className="turno-card active">
                              <span className="turno-number">N° {turno.numero}</span>
                              <span className={`priority-indicator ${turno.prioridad === 'P' ? 'priority' : 'regular'}`}>
                                {turno.prioridad === 'P' ? 'Prioritario' : 'Regular'}
                              </span>
                            </div>
                          ))
                      ) : (
                        <div className="empty-state">
                          <span>Sin turnos en atención</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="turnos-section">
                    <div className="section-header">
                      <h3>📋 Turnos en Espera</h3>
                      <span className="section-badge">
                        {currentTurnos.filter(turno => turno.estado === 'En espera').length}
                      </span>
                    </div>
                    <div className="turnos-list waiting">
                      {currentTurnos.filter(turno => turno.estado === 'En espera').length > 0 ? (
                        currentTurnos
                          .filter(turno => turno.estado === 'En espera')
                          .slice(0, 6)
                          .map(turno => (
                            <div key={turno.id} className={`turno-card waiting ${turno.usuario.id === user.id ? 'user-turno' : ''}`}>
                              <span className="turno-number">N° {turno.numero}</span>
                              <span className={`priority-indicator ${turno.prioridad === 'P' ? 'priority' : 'regular'}`}>
                                {turno.prioridad === 'P' ? 'Prioritario' : 'Regular'}
                              </span>
                              {turno.usuario.id === user.id && (
                                <span className="user-indicator">Su turno</span>
                              )}
                            </div>
                          ))
                      ) : (
                        <div className="empty-state">
                          <span>Sin turnos en espera</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="empty-board">
                <div className="empty-icon">🏢</div>
                <h3>Selecciona un Punto de Atención</h3>
                <p>Elige un punto para visualizar los turnos actuales</p>
              </div>
            )}
          </div>

          <aside className="sidebar">
            <div className="info-section">
              <h3 className="info-title">
                <span className="info-icon">💡</span>
                Información Importante
              </h3>
              <div className="info-content">
                <div className="info-item">
                  <strong>Horarios de Atención:</strong>
                  <p>Lunes a Viernes: 8:00 - 18:00<br/>Sábados: 8:00 - 14:00</p>
                </div>
                <div className="info-item">
                  <strong>Tiempo Promedio:</strong>
                  <p>Cada turno dura aproximadamente 10-15 minutos</p>
                </div>
                <div className="info-item">
                  <strong>Turnos Prioritarios:</strong>
                  <p>Adultos mayores, embarazadas y personas con discapacidad</p>
                </div>
              </div>
            </div>

            <div className="advertisement-section">
              <h3 className="ad-title">
                <span className="ad-icon">📢</span>
                Publicidad
              </h3>
              <div className="ad-container">
                <img 
                  src={adPlaceholder}
                  alt="Publicidad" 
                  className="ad-image"
                />
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default TurnoTablero;