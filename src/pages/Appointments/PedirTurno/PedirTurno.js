import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentTurnos, createTurno, getPuntosAtencionServices } from '../../../services/api';
import adPlaceholder from '../../../assets/images/publicidad.jpeg';
import './PedirTurno.css';

import { useLocation } from 'react-router-dom';

const PedirTurno = ({ user: userProp, setUser }) => {
  const [currentTurnos, setCurrentTurnos] = useState([]);
  const [puntosServicios, setPuntosServicios] = useState({});
  const [selectedPunto, setSelectedPunto] = useState('');
  const [tipoCita, setTipoCita] = useState('');
  const [isPrioritario, setIsPrioritario] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [turnosPendientes, setTurnosPendientes] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  const user = userProp || JSON.parse(localStorage.getItem('user')) || {};

  useEffect(() => {
    window.scrollTo(0, 0);
    setTimeout(() => {
      const yOffset = -76; // altura del header
      window.scrollTo({ top: 0 + yOffset, behavior: 'smooth' });
    }, 250);
  }, []);

  useEffect(() => {
    console.log('Usuario en PedirTurno:', user);
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token || !user.id) {
          setError('Debes iniciar sesión para pedir un turno.');
          navigate('/login');
          return;
        }
        // Obtener puntos de atención primero
        const puntosData = await getPuntosAtencionServices();
        setPuntosServicios(puntosData);
        const initialPunto = Object.keys(puntosData)[0] || '';
        setSelectedPunto(initialPunto);

        // Solo obtener turnos si hay un punto seleccionado
        if (initialPunto) {
          const turnosData = await getCurrentTurnos(initialPunto);
          setCurrentTurnos(turnosData.turnos || []);
        }
      } catch (err) {
        setError('Error al cargar datos: ' + (err.response?.data?.detail || err.message));
        if (err.response?.status === 401) {
          localStorage.clear();
          setUser(null);
          navigate('/login');
        }
      }
    };
    fetchData();
    const interval = setInterval(() => {
      if (selectedPunto) fetchData(); // Solo actualizar si hay un punto seleccionado
    }, 30000);
    return () => clearInterval(interval);
  }, [navigate, setUser, user.id]); // selectedPunto ya no es necesario como dependencia

  const handleRequestTurno = async () => {
    if (!selectedPunto) {
      setError('Por favor, selecciona un punto de atención.');
      return;
    }
    if (!tipoCita) {
      setError('Por favor, selecciona un tipo de servicio.');
      return;
    }
    if (isPrioritario === null) {
      setError('Por favor, indica si cumples con alguna condición prioritaria.');
      return;
    }
    if (!user.id) {
      setError('Usuario no autenticado. Por favor, inicia sesión.');
      setTimeout(() => navigate('/login'), 2000);
      return;
    }
    setError('');
    setSuccess('');
    try {
      const turnoData = {
        punto_atencion: parseInt(selectedPunto),
        tipo_cita: tipoCita,
        respuestas_prioridad: {
          "¿Cumples con alguna de estas condiciones: eres mayor a 60 años, estás embarazada, tienes bebé en brazos o tienes alguna discapacidad?": isPrioritario === 'yes' ? 'sí' : 'no'
        }
      };
      console.log('Enviando datos al backend:', turnoData);
      const newTurno = await createTurno(turnoData, user.id);
      const puntoNombre = puntosServicios[selectedPunto].nombre;
      setSuccess(`Turno ${newTurno.numero} solicitado con éxito en ${puntoNombre}.`);
      setTipoCita('');
      setIsPrioritario(null);
      setTimeout(() => navigate('/appointment-history'), 2000);
    } catch (err) {
      const errorDetail = err.response?.data?.detail || err.response?.data?.error || 'Error desconocido';
      setError('Error al solicitar turno: ' + (errorDetail || err.message));
    }
  };

  return (
    <div className="pedir-turno-page">
      <div className="pedir-turno-container">
        <header className="pedir-turno-header">
          <h1 className="pedir-turno-title">Solicitar Turno</h1>
        </header>

        {error && (
          <div className="pedir-turno-error">
            <p>{error}</p>
          </div>
        )}
        
        {success && (
          <div className="pedir-turno-success">
            <p>{success}</p>
          </div>
        )}

        <div className="turno-grid">
          {/* Left Column - Selection Options */}
          <div className="turno-options">
            <div className="options-container">
              <h2 className="section-title">Seleccionar Servicio</h2>

              <div className="form-group">
                <label className="form-label">Punto de Atención:</label>
                <select
                  value={selectedPunto}
                  onChange={(e) => {
                    setSelectedPunto(e.target.value);
                    setTipoCita('');
                    // Actualizar turnos al cambiar el punto
                    const fetchTurnos = async () => {
                      try {
                        const turnosData = await getCurrentTurnos(e.target.value);
                        setCurrentTurnos(turnosData.turnos || []);
                      } catch (err) {
                        setError('Error al cargar turnos: ' + (err.response?.data?.detail || err.message));
                      }
                    };
                    fetchTurnos();
                  }}
                  className="form-select"
                >
                  <option value="">Selecciona un punto</option>
                  {Object.entries(puntosServicios).map(([id, punto]) => (
                    <option key={id} value={id}>{punto.nombre}</option>
                  ))}
                </select>
              </div>

              {selectedPunto && (
                <>
                  <div className="form-group">
                    <label className="form-label">Tipo de Servicio:</label>
                    <select
                      value={tipoCita}
                      onChange={(e) => setTipoCita(e.target.value)}
                      className="form-select"
                    >
                      <option value="">Selecciona un servicio</option>
                      {puntosServicios[selectedPunto].servicios.map((servicio, index) => (
                        <option key={index} value={servicio.toLowerCase()}>{servicio}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">¿Cumples con alguna de estas condiciones: eres mayor a 60 años, estás embarazada, tienes bebé en brazos o tienes alguna discapacidad?</label>
                    <div className="priority-buttons">
                      <button
                        type="button"
                        onClick={() => setIsPrioritario('yes')}
                        className={`priority-button ${isPrioritario === 'yes' ? 'selected' : ''}`}
                      >
                        Sí
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsPrioritario('no')}
                        className={`priority-button ${isPrioritario === 'no' ? 'selected' : ''}`}
                      >
                        No
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Right Column - Current Turn Display */}
          <div className="turno-display">
            {selectedPunto ? (
              <div className="display-container">
                <h2 className="punto-name">
                  {puntosServicios[selectedPunto].nombre}
                </h2>
                
                <div className="turn-info-grid">
                  <div className="turn-info-box">
                    <p className="turn-info-label">TURNOS EN ESPERA</p>
                    <ul className="turn-info-value">
                      {currentTurnos.length > 0 ? currentTurnos.map(turno => (
                        <li
                          key={turno.id}
                          className={turno.prioridad === 'P' ? 'turno-prioritario' : 'turno-normal'}
                        >
                          {turno.numero} {turno.prioridad === 'P' ? '(Prioritario)' : '(Normal)'}
                        </li>
                      )) : <li>---</li>}
                    </ul>
                  </div>
                </div>

                <button
                  onClick={handleRequestTurno}
                  className="request-button"
                >
                  SOLICITAR TURNO
                </button>
              </div>
            ) : (
              <div className="empty-display">
                <p>Selecciona un punto de atención para ver la información actual</p>
              </div>
            )}

            {/* Advertisement Section */}
            <div className="advertisement-section">
              <h3 className="ad-title">Publicidad</h3>
              <div className="ad-container">
                <img 
                  src={adPlaceholder}
                  alt="Publicidad" 
                  className="ad-image"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PedirTurno;