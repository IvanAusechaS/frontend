import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentTurnos, createTurno, getServicios } from '../../../services/api';
import './PedirTurno.css';

const PedirTurno = ({ user: userProp, setUser }) => {
  const [currentTurnos, setCurrentTurnos] = useState({});
  //const [estimatedTime, setEstimatedTime] = useState({});
  //const [puntosServicios, setPuntosServicios] = useState({});
  //const [selectedPunto, setSelectedPunto] = useState('');
  const [servicios, setServicios] = useState([]);
  const [tipoCita, setTipoCita] = useState(''); 
  const [fechaCita, setFechaCita] = useState(''); // New state for fecha_cita
  const [hasDisability, setHasDisability] = useState(null);
  const [disabilityType, setDisabilityType] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const user = React.useMemo(() => userProp || JSON.parse(localStorage.getItem('user')) || {}, [userProp]);// se agrega userProp para evitar warning de dependencias
  //const user = userProp || JSON.parse(localStorage.getItem('user')) || {};
  const handleCreateTurno = async () => {
    setLoading(true);
    try {
      // tu código de creación
    } finally {
      setLoading(false);
    }
  }
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
        //setEstimatedTime(turnosData.estimated_times || {});

        //obtiene servicios disponibles
        const serviciosData = await getServicios(); // Asegúrate de que esta API devuelva los servicios
        setServicios(serviciosData || []); // Asigna los servicios al estado

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
  }, [navigate, setUser, user, user.id]);//se agrega user.id para evitar warning de dependencias

  const handleRequestTurno = async () => {
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
      // Convert the local datetime to UTC
      const localDate = new Date(fechaCita);
      //const utcDate = localDate.toISOString(); // Converts to UTC with Z suffix (e.g., "2025-04-19T20:00:00.000Z")
    
      const turnoData = {
        //punto_atencion: parseInt(selectedPunto),
        punto_atencion_id: null,
        tipo_cita: tipoCita,
        fecha_cita: localDate, // Include fecha_cita in the request
        prioridad: hasDisability === 'yes' ? 'P' : 'N',
      };
      console.log('Solicitando creación de turno...');
      const newTurno = await createTurno(turnoData, user.id);
      
      //const puntoNombre = puntosServicios[selectedPunto.nombre];
      //const puntoNombre = puntosServicios?.nombre || 'el punto de atención seleccionado';
      //setSuccess(`Turno ${newTurno.numero} solicitado con éxito en ${puntoNombre}.`);
      setSuccess(`Turno ${newTurno.numero} solicitado con éxito.`); // Mensaje de éxito sin usar punto de atención
    
      setTipoCita('');
      setFechaCita(''); // Reset fechaCita
      setHasDisability(null);
      setDisabilityType('');
      setTimeout(() => navigate('/appointment-history'), 2000);
    
    } catch (err) {
      const errorDetail = err.response?.data?.detail || err.response?.data?.fecha?.[0] || 'Error desconocido';
      setError('Error al solicitar turno: ' + (errorDetail || err.message));
    }
  };    

  // const disabilityOptions = [
  //   'Movilidad Reducida',
  //   'Discapacidad Visual',
  //   'Discapacidad Auditiva',
  //   'Otra',
  // ];

  return (
    <div className="pedir-turno-page">
      <div className="pedir-turno-container">
        <header className="pedir-turno-header">
          <h1 className="pedir-turno-title">Solicitar Turno</h1>
        </header>
  
        {error && <div className="pedir-turno-error"><p>{error}</p></div>}
        {success && <div className="pedir-turno-success"><p>{success}</p></div>}
  
        <div className="form-group">
          <h3 className="form-label">
            ¿Tienes más de 61 años, alguna discapacidad, estás embarazada o llevas un niño en brazos?
          </h3>
          <div className="disability-buttons">
            <button 
              onClick={() => setHasDisability(true)} 
              className={`disability-button ${hasDisability === true ? 'selected' : ''}`}
            >
              Sí
            </button>
            <button 
              onClick={() => setHasDisability(false)} 
              className={`disability-button ${hasDisability === false ? 'selected' : ''}`}
            >
              No
            </button>
          </div>
        </div>
  
        <div className="form-group">
          <h3 className="form-label">Tipo de Servicio:</h3>
          <select
            value={tipoCita}
            onChange={(e) => setTipoCita(e.target.value)}
            className="form-input"
          >
            <option value="" disabled>Selecciona un servicio</option>
            {servicios.map((servicio) => (
              <option key={servicio.id} value={servicio.nombre}>
                {servicio.nombre}
              </option>
            ))}
          </select>
        </div>
  
        <button onClick={handleRequestTurno} className="request-button">
          SOLICITAR TURNO
        </button>

      </div> {/* Cierre de pedir-turno-container */}
  
      <div className="turno-display">
        <div className="display-container">
          <h2 className="punto-name">Información del Turno</h2>
          <p className="turn-info-value">
            Tu prioridad será evaluada automáticamente según tus respuestas.
          </p>
        </div>
  
        <div className="advertisement-section">
          <h3 className="ad-title">Publicidad</h3>
          <div className="ad-container">
            <img 
              src="https://via.placeholder.com/800x450" 
              alt="Publicidad" 
              className="ad-image" 
            />
          </div>
        </div>
      </div> {/* Cierre de turno-display */}
    </div> // cierre pedir-turno-page
  );
}
export default PedirTurno;
