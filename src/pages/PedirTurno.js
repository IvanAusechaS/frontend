import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentTurnos, createTurno, getPuntosAtencionServices } from '../services/api';
import './PedirTurno.css';

const PedirTurno = ({ user: userProp, setUser }) => {
  const [currentTurnos, setCurrentTurnos] = useState({});
  const [estimatedTime, setEstimatedTime] = useState({});
  const [puntosServicios, setPuntosServicios] = useState({});
  const [selectedPunto, setSelectedPunto] = useState('');
  const [tipoCita, setTipoCita] = useState('');
  const [hasDisability, setHasDisability] = useState(null);  // null, 'yes', 'no'
  const [disabilityType, setDisabilityType] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const user = userProp || JSON.parse(localStorage.getItem('user')) || {};

  useEffect(() => {
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
    setError('');
    setSuccess('');
    try {
      const turnoData = {
        punto_atencion: parseInt(selectedPunto),
        tipo_cita: tipoCita,
        prioridad: hasDisability === 'yes' ? 'P' : 'N',
      };
      const newTurno = await createTurno(turnoData);
      const puntoNombre = puntosServicios[selectedPunto].nombre;
      setSuccess(`Turno ${newTurno.numero} solicitado con éxito en ${puntoNombre}.`);
      setTipoCita('');
      setHasDisability(null);
      setDisabilityType('');
      setTimeout(() => navigate('/appointment-history'), 2000);
    } catch (err) {
      setError('Error al solicitar turno: ' + (err.response?.data?.detail || JSON.stringify(err.response?.data) || err.message));
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
        <h2 className="pedir-turno-title">Solicitar Turno - Día Actual</h2>
        {error && <p className="pedir-turno-error">{error}</p>}
        {success && <p className="pedir-turno-success">{success}</p>}

        <div className="punto-selector">
          <label className="pedir-turno-label">Punto de Atención:</label>
          <select
            value={selectedPunto}
            onChange={(e) => {
              setSelectedPunto(e.target.value);
              setTipoCita('');
            }}
            className="pedir-turno-input"
          >
            <option value="">Selecciona un punto</option>
            {Object.entries(puntosServicios).map(([id, punto]) => (
              <option key={id} value={id}>{punto.nombre}</option>
            ))}
          </select>
        </div>

        {selectedPunto && (
          <>
            <div className="current-turnos">
              <div className="turno-info">
                <h3>{puntosServicios[selectedPunto].nombre}</h3>
                <p>Turno Actual: {currentTurnos[selectedPunto] || 'Ninguno'}</p>
                <p>Tiempo Estimado: {estimatedTime[selectedPunto] || 0} minutos</p>
              </div>
            </div>

            <div className="service-selector">
              <label className="pedir-turno-label">Tipo de Servicio:</label>
              <select
                value={tipoCita}
                onChange={(e) => setTipoCita(e.target.value)}
                className="pedir-turno-input"
              >
                <option value="">Selecciona un servicio</option>
                {puntosServicios[selectedPunto].servicios.map((servicio, index) => (
                  <option key={index} value={servicio.toLowerCase()}>{servicio}</option>
                ))}
              </select>
            </div>

            <div className="disability-selector">
              <label className="pedir-turno-label">¿Tienes alguna discapacidad?</label>
              <div className="disability-buttons">
                <button
                  className={`disability-button ${hasDisability === 'yes' ? 'selected' : ''}`}
                  onClick={() => setHasDisability('yes')}
                >
                  Sí
                </button>
                <button
                  className={`disability-button ${hasDisability === 'no' ? 'selected' : ''}`}
                  onClick={() => { setHasDisability('no'); setDisabilityType(''); }}
                >
                  No
                </button>
              </div>
              {hasDisability === 'yes' && (
                <select
                  value={disabilityType}
                  onChange={(e) => setDisabilityType(e.target.value)}
                  className="pedir-turno-input"
                >
                  <option value="">Selecciona el tipo</option>
                  {disabilityOptions.map((option, index) => (
                    <option key={index} value={option.toLowerCase()}>{option}</option>
                  ))}
                </select>
              )}
            </div>

            <button className="request-button" onClick={handleRequestTurno}>
              Solicitar Turno
            </button>
          </>
        )}

        <div className="advertisement">
          <h3>Publicidad</h3>
          <img
            src="https://media.giphy.com/media/3o7TKz9bDaN3jksX6o/giphy.gif"
            alt="Publicidad"
            className="ad-gif"
          />
        </div>
      </div>
    </div>
  );
};

export default PedirTurno;