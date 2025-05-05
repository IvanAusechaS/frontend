import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentTurnos, createTurno, getPuntosAtencionServices, getPendingTurnosByService } from '../../../services/api';
import adPlaceholder from '../../../assets/images/publicidad.jpeg'; // Ajusta la ruta según tu estructura
import './PedirTurno.css';

const PedirTurno = ({ user: userProp, setUser }) => {
  const [currentTurnos, setCurrentTurnos] = useState({});
  const [estimatedTime, setEstimatedTime] = useState({});
  const [puntosServicios, setPuntosServicios] = useState({});
  const [selectedPunto, setSelectedPunto] = useState('');
  const [tipoCita, setTipoCita] = useState('');
  const [hasDisability, setHasDisability] = useState(null);
  const [disabilityType, setDisabilityType] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [turnosPendientes, setTurnosPendientes] = useState([]);
  const navigate = useNavigate();

  const user = userProp || JSON.parse(localStorage.getItem('user')) || {};

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
        const turnosData = await getCurrentTurnos();
        setCurrentTurnos(turnosData.current_turnos || {});
        setEstimatedTime(turnosData.estimated_times || {});

        const puntosData = await getPuntosAtencionServices();
        setPuntosServicios(puntosData);
        setSelectedPunto(Object.keys(puntosData)[0] || '');

        const turnosPendientes = await getPendingTurnosByService();// muestra los turnos pendientes por servicio
      setTurnosPendientes(turnosPendientes);
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
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [navigate, setUser, user.id]);

  const handleRequestTurno = async () => {
    if (!selectedPunto) {
      setError('Por favor, selecciona un punto de atención.');
      return;
    }
    if (!tipoCita) {
      setError('Por favor, selecciona un tipo de servicio.');
      return;
    }
    if (hasDisability === null) {
      setError('Por favor, indica si tienes alguna discapacidad.');
      return;
    }
    if (hasDisability === 'yes' && !disabilityType) {
      setError('Por favor, selecciona el tipo de discapacidad.');
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
        prioridad: hasDisability === 'yes' ? 'P' : 'N',
      };
      const newTurno = await createTurno(turnoData, user.id);
      const puntoNombre = puntosServicios[selectedPunto].nombre;
      setSuccess(`Turno ${newTurno.numero} solicitado con éxito en ${puntoNombre}.`);
      setTipoCita('');
      setHasDisability(null);
      setDisabilityType('');
      setTimeout(() => navigate('/appointment-history'), 2000);
    } catch (err) {
      // Check if the error is due to the time range validation
      const errorDetail = err.response?.data?.detail || err.response?.data?.fecha_cita?.[0] || 'Error desconocido';
      if (errorDetail.includes('Los turnos solo pueden ser entre')) {
        setError('No se puede solicitar un turno en este momento. Los turnos solo están disponibles de 8:00 a 22:00.');
      } else {
        setError('Error al solicitar turno: ' + (errorDetail || err.message));
      }
    }
  };

  const disabilityOptions = [
    'Movilidad Reducida',
    'Discapacidad Visual',
    'Discapacidad Auditiva',
    'Otra',
  ];

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
              
              {/* Add informational message about the time range */}
              <div className="time-info">
                <p>Nota: Los turnos solo pueden ser solicitados entre las 8:00 y las 22:00.</p>
              </div>

              <div className="form-group">
                <label className="form-label">Punto de Atención:</label>
                <select
                  value={selectedPunto}
                  onChange={(e) => {
                    setSelectedPunto(e.target.value);
                    setTipoCita('');
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
                    <label className="form-label">¿Tienes alguna discapacidad?</label>
                    <div className="disability-buttons">
                      <button
                        type="button"
                        onClick={() => setHasDisability('yes')}
                        className={`disability-button ${hasDisability === 'yes' ? 'selected' : ''}`}
                      >
                        Sí
                      </button>
                      <button
                        type="button"
                        onClick={() => { setHasDisability('no'); setDisabilityType(''); }}
                        className={`disability-button ${hasDisability === 'no' ? 'selected' : ''}`}
                      >
                        No
                      </button>
                    </div>

                    {hasDisability === 'yes' && (
                      <select
                        value={disabilityType}
                        onChange={(e) => setDisabilityType(e.target.value)}
                        className="form-select disability-select"
                      >
                        <option value="">Selecciona el tipo</option>
                        {disabilityOptions.map((option, index) => (
                          <option key={index} value={option.toLowerCase()}>{option}</option>
                        ))}
                      </select>
                    )}
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
                    <p className="turn-info-label">TURNO ACTUAL</p>
                    <p className="turn-info-value">{currentTurnos[selectedPunto] || "---"}</p>
                  </div>
                  
                  <div className="turn-info-box">
                    <p className="turn-info-label">TIEMPO ESTIMADO</p>
                    <p className="turn-info-value">{estimatedTime[selectedPunto] || "0"} <span className="minute-label">min</span></p>
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
            src={adPlaceholder} // Usa la imagen local
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