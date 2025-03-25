// frontend/src/pages/PedirTurno.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentTurnos, createTurno, getPuntosAtencionServices } from '../services/api';
import './PedirTurno.css';

const PedirTurno = ({ user: userProp, setUser }) => {
  const [currentTurnos, setCurrentTurnos] = useState({ melendez: 'Ninguno', polvorines: 'Ninguno' });
  const [estimatedTime, setEstimatedTime] = useState({ melendez: 0, polvorines: 0 });
  const [puntosServicios, setPuntosServicios] = useState({});
  const [selectedPunto, setSelectedPunto] = useState('');
  const [tipoCita, setTipoCita] = useState('');
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
        setCurrentTurnos({
          melendez: turnosData.melendez,
          polvorines: turnosData.polvorines,
        });
        setEstimatedTime({
          melendez: turnosData.melendezTime,
          polvorines: turnosData.polvorinesTime,
        });

        const puntosData = await getPuntosAtencionServices();
        setPuntosServicios(puntosData);
        setSelectedPunto(Object.keys(puntosData)[0] || ''); // Selecciona el primer punto por defecto
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
    const interval = setInterval(() => fetchData(), 30000); // Actualiza cada 30 segundos
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
    setError('');
    setSuccess('');
    try {
      const turnoData = {
        punto_atencion: parseInt(selectedPunto),  // ID del punto
        tipo_cita: tipoCita,
      };
      const newTurno = await createTurno(turnoData);
      const puntoNombre = puntosServicios[selectedPunto].nombre;
      setSuccess(`Turno ${newTurno.numero} solicitado con éxito en ${puntoNombre}.`);
      setTipoCita('');
      setTimeout(() => navigate('/appointment-history'), 2000);
    } catch (err) {
      setError('Error al solicitar turno: ' + (err.response?.data?.detail || JSON.stringify(err.response?.data) || err.message));
    }
  };
  
  return (
    <div className="pedir-turno-page">
      <div className="pedir-turno-container">
        <h2 className="pedir-turno-title">Solicitar Turno - Día Actual</h2>
        {error && <p className="pedir-turno-error">{error}</p>}
        {success && <p className="pedir-turno-success">{success}</p>}

        {/* Selector de Punto de Atención */}
        <div className="punto-selector">
          <label className="pedir-turno-label">Punto de Atención:</label>
          <select
            value={selectedPunto}
            onChange={(e) => {
              setSelectedPunto(e.target.value);
              setTipoCita(''); // Resetear servicio al cambiar punto
            }}
            className="pedir-turno-input"
          >
            <option value="">Selecciona un punto</option>
            {Object.entries(puntosServicios).map(([id, punto]) => (
              <option key={id} value={id}>{punto.nombre}</option>
            ))}
          </select>
        </div>

        {/* Turnos Actuales y Servicios */}
        {selectedPunto && (
          <>
            <div className="current-turnos">
              <div className="turno-info">
                <h3>{puntosServicios[selectedPunto].nombre}</h3>
                <p>Turno Actual: {selectedPunto === '1' ? currentTurnos.melendez : currentTurnos.polvorines}</p>
                <p>Tiempo Estimado: {selectedPunto === '1' ? estimatedTime.melendez : estimatedTime.polvorines} minutos</p>
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

            <button
              className="request-button"
              onClick={handleRequestTurno}
            >
              Solicitar Turno
            </button>
          </>
        )}

        {/* Publicidad */}
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