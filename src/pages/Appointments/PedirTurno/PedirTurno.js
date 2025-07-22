import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPuntosAtencionServices, createTurno } from '../../../services/api';
import './PedirTurno.css';

const PedirTurno = ({ user: userProp, setUser }) => {
  const [puntosServicios, setPuntosServicios] = useState({});
  const [selectedPunto, setSelectedPunto] = useState('');
  const [tipoCita, setTipoCita] = useState('');
  const [isPrioritario, setIsPrioritario] = useState(null);
  const [showPriorityModal, setShowPriorityModal] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const user = React.useMemo(() => userProp || JSON.parse(localStorage.getItem('user')) || {}, [userProp]);

  useEffect(() => {
    window.scrollTo(0, 0);
    setTimeout(() => {
      const yOffset = -76;
      window.scrollTo({ top: 0 + yOffset, behavior: 'smooth' });
    }, 250);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token || !user.id) {
          setError('Debe iniciar sesión para solicitar una cita.');
          navigate('/login');
          return;
        }
        const puntosData = await getPuntosAtencionServices();
        setPuntosServicios(puntosData);
        const initialPunto = Object.keys(puntosData)[0] || '';
        setSelectedPunto(initialPunto);
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
  }, [navigate, setUser, user.id]);

  const handleContinue = () => {
    if (!selectedPunto) {
      setError('Por favor, seleccione una sucursal.');
      return;
    }
    if (!tipoCita) {
      setError('Por favor, seleccione el tipo de servicio requerido.');
      return;
    }
    
    setError('');
    setShowPriorityModal(true);
  };

  const handlePrioritySelection = (priority) => {
    setIsPrioritario(priority);
    setShowPriorityModal(false);
    // Proceder con la solicitud inmediatamente después de seleccionar
    handleRequestTurno(priority);
  };

  const handleRequestTurno = async (priority = isPrioritario) => {
    if (!user.id) {
      setError('Usuario no autenticado. Por favor, inicie sesión.');
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
          "¿Cumples con alguna de estas condiciones: eres mayor a 60 años, estás embarazada, tienes bebé en brazos o tienes alguna discapacidad?": priority === 'yes' ? 'sí' : 'no'
        }
      };
      
      const newTurno = await createTurno(turnoData, user.id);
      const puntoNombre = puntosServicios[selectedPunto].nombre;
      setSuccess(`Cita N° ${newTurno.numero} confirmada exitosamente en ${puntoNombre}.`);
      setTipoCita('');
      setIsPrioritario(null);
      setTimeout(() => navigate('/turno-tablero'), 1500);
    } catch (err) {
      const errorDetail = err.response?.data?.detail || err.response?.data?.error || 'Error desconocido';
      setError('Error al procesar su solicitud: ' + (errorDetail || err.message));
    }
  };

  const closeModal = () => {
    setShowPriorityModal(false);
  };

  return (
    <div className="pedir-turno-page">
      <div className="pedir-turno-container">
        <header className="pedir-turno-header">
          <div className="header-icon">👓</div>
          <h1 className="pedir-turno-title">Solicitud de Cita</h1>
          <p className="pedir-turno-subtitle">Centro de Atención Visual</p>
        </header>

        {error && (
          <div className="pedir-turno-error">
            <div className="error-icon">⚠️</div>
            <p>{error}</p>
          </div>
        )}
        
        {success && (
          <div className="pedir-turno-success">
            <div className="success-icon">✓</div>
            <p>{success}</p>
          </div>
        )}

        <div className="turno-form-section">
          <div className="form-container">
            <div className="form-step">
              <span className="step-number">1</span>
              <div className="step-content">
                <label className="form-label">Sucursal de Atención</label>
                <select
                  value={selectedPunto}
                  onChange={(e) => {
                    setSelectedPunto(e.target.value);
                    setTipoCita('');
                  }}
                  className="form-select"
                >
                  <option value="">Seleccione una sucursal</option>
                  {Object.entries(puntosServicios).map(([id, punto]) => (
                    <option key={id} value={id}>{punto.nombre}</option>
                  ))}
                </select>
              </div>
            </div>

            {selectedPunto && (
              <div className="form-step">
                <span className="step-number">2</span>
                <div className="step-content">
                  <label className="form-label">Tipo de Servicio</label>
                  <select
                    value={tipoCita}
                    onChange={(e) => setTipoCita(e.target.value)}
                    className="form-select"
                  >
                    <option value="">Seleccione el servicio</option>
                    {puntosServicios[selectedPunto].servicios.map((servicio, index) => (
                      <option key={index} value={servicio.toLowerCase()}>{servicio}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {selectedPunto && tipoCita && (
              <div className="form-actions">
                <button
                  onClick={handleContinue}
                  className="continue-button"
                >
                  <span>Continuar</span>
                  <span className="button-arrow">→</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Modal de Prioridad */}
        {showPriorityModal && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="priority-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Información de Prioridad</h3>
                <button className="modal-close" onClick={closeModal}>×</button>
              </div>
              
              <div className="modal-content">
                <div className="priority-question">
                  <div className="question-icon">❓</div>
                  <p>¿Se encuentra usted en alguna de las siguientes condiciones?</p>
                </div>
                
                <div className="priority-conditions">
                  <ul>
                    <li>• Mayor de 60 años</li>
                    <li>• Estado de embarazo</li>
                    <li>• Acompañado de bebé</li>
                    <li>• Persona con discapacidad</li>
                  </ul>
                </div>
                
                <div className="modal-actions">
                  <button
                    className="priority-modal-button priority-yes"
                    onClick={() => handlePrioritySelection('yes')}
                  >
                    <span className="button-icon">✓</span>
                    Sí, aplico
                  </button>
                  <button
                    className="priority-modal-button priority-no"
                    onClick={() => handlePrioritySelection('no')}
                  >
                    <span className="button-icon">−</span>
                    No aplico
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PedirTurno;