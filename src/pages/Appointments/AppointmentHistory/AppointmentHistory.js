import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../services/api';
import { cancelTurno } from '../../../services/api';
import './AppointmentHistory.css';

const AppointmentHistory = ({ user, setUser }) => {
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [filterEstado, setFilterEstado] = useState('');
  const [filterTipo, setFilterTipo] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAppointments = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token');
        if (!token || !user) {
          setError('Debes iniciar sesión para ver tu historial.');
          navigate('/login');
          return;
        }
        const response = await api.get('turnos/'); // Cambiar a /turnos/
        console.log('Turnos obtenidos en AppointmentHistory:', response.data); // Añadir log para depurar
        setAppointments(response.data || []);
        setError('');
      } catch (err) {
        if (err.response?.status === 401) {
          setError('Sesión expirada. Por favor, inicia sesión nuevamente.');
          localStorage.clear();
          setUser(null);
          navigate('/login');
        } else {
          setError('Error al cargar el historial de citas: ' + (err.response?.data?.detail || err.message));
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchAppointments();
  }, [user, navigate, setUser]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    // Forzar a que se muestre como UTC para evitar desplazamientos de zona horaria
    return date.toLocaleString('es-CO', {
      timeZone: 'UTC', // Ajusta según la zona horaria del backend (probablemente UTC)
      dateStyle: 'medium',
      timeStyle: 'short',
      hour12: true,
    });
  };

  const isFutureTurno = (fechaCita) => {
    const now = new Date();
    const citaDate = new Date(fechaCita);
    return citaDate > now;
  };

  const handleCancel = async (turnoId) => {
    setError('');
    setSuccess('');
    try {
      await cancelTurno(turnoId);
      setSuccess('Turno cancelado exitosamente.');
      setAppointments(appointments.map(appointment =>
        appointment.id === turnoId ? { ...appointment, estado: 'Cancelado' } : appointment
      ));
    } catch (err) {
      setError('Error al cancelar el turno: ' + (err.response?.data?.detail || err.message));
    }
  };

  const getStatusClass = (status) => {
    switch(status.toLowerCase()) {
      case 'atendido':
        return 'status-completed';
      case 'en espera':
        return 'status-waiting';
      case 'cancelado':
        return 'status-cancelled';
      default:
        return '';
    }
  };

  // Filtrar turnos según estado y tipo
  const filteredAppointments = appointments.filter(appointment => {
    return (
      (filterEstado ? appointment.estado === filterEstado : true) &&
      (filterTipo ? appointment.tipo_cita === filterTipo : true)
    );
  });

  return (
    <div className="appointment-history-container">
      <h2 className="appointment-history-title">Historial de Citas</h2>
      
      {error && <div className="appointment-message error">{error}</div>}
      {success && <div className="appointment-message success">{success}</div>}

      <div className="filters-section">
        <h3 className="filters-title">Filtros</h3>
        <div className="filters-container">
          <div className="filter-group">
            <label htmlFor="filter-estado">Estado:</label>
            <select 
              id="filter-estado"
              value={filterEstado} 
              onChange={(e) => setFilterEstado(e.target.value)}
              className="filter-select"
            >
              <option value="">Todos</option>
              <option value="En espera">En espera</option>
              <option value="Atendido">Atendido</option>
              <option value="Cancelado">Cancelado</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label htmlFor="filter-tipo">Tipo:</label>
            <select 
              id="filter-tipo"
              value={filterTipo} 
              onChange={(e) => setFilterTipo(e.target.value)}
              className="filter-select"
            >
              <option value="">Todos</option>
              <option value="medica">Médica</option>
              <option value="administrativa">Administrativa</option>
            </select>
          </div>
          
          {(filterEstado || filterTipo) && (
            <button 
              className="clear-filters-button"
              onClick={() => {
                setFilterEstado('');
                setFilterTipo('');
              }}
            >
              Limpiar filtros
            </button>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Cargando citas...</p>
        </div>
      ) : filteredAppointments.length === 0 ? (
        <div className="no-appointments">
          <p>No tienes citas registradas con estos filtros.</p>
          <button 
            onClick={() => navigate('/nueva-cita')} 
            className="new-appointment-button"
          >
            Programar una cita
          </button>
        </div>
      ) : (
        <div className="appointments-section">
          {/* Desktop view */}
          <div className="appointment-table desktop-view">
            <div className="table-header">
              <div className="header-cell">Turno</div>
              <div className="header-cell">Punto</div>
              <div className="header-cell">Tipo</div>
              <div className="header-cell">Fecha</div>
              <div className="header-cell">Estado</div>
              <div className="header-cell">Prioridad</div>
              <div className="header-cell">Acciones</div>
            </div>
            
            <div className="table-body">
              {filteredAppointments.map((appointment) => (
                <div key={appointment.id} className="table-row">
                  <div className="table-cell">{appointment.numero}</div>
                  <div className="table-cell">{appointment.punto_atencion.nombre}</div>
                  <div className="table-cell">{appointment.tipo_cita}</div>
                  <div className="table-cell">{formatDate(appointment.fecha_cita)}</div>
                  <div className="table-cell">
                    <span className={`status-badge ${getStatusClass(appointment.estado)}`}>
                      {appointment.estado}
                    </span>
                  </div>
                  <div className="table-cell">
                    {appointment.prioridad === 'N' ? 'Normal' : 'Alta'}
                  </div>
                  <div className="table-cell actions-cell">
                    {appointment.estado !== 'Cancelado' && isFutureTurno(appointment.fecha_cita) && (
                      <button
                        onClick={() => handleCancel(appointment.id)}
                        className="cancel-button"
                        aria-label="Cancelar cita"
                      >
                        Cancelar
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile view - Cards */}
          <div className="appointment-cards mobile-view">
            {filteredAppointments.map((appointment) => (
              <div key={appointment.id} className="appointment-card">
                <div className="card-header">
                  <div className="card-title">
                    <h4>Turno #{appointment.numero}</h4>
                    <span className={`status-badge ${getStatusClass(appointment.estado)}`}>
                      {appointment.estado}
                    </span>
                  </div>
                </div>
                
                <div className="card-body">
                  <div className="card-detail">
                    <span className="detail-label">Punto:</span>
                    <span className="detail-value">{appointment.punto_atencion.nombre}</span>
                  </div>
                  
                  <div className="card-detail">
                    <span className="detail-label">Tipo:</span>
                    <span className="detail-value">{appointment.tipo_cita}</span>
                  </div>
                  
                  <div className="card-detail">
                    <span className="detail-label">Fecha:</span>
                    <span className="detail-value">{formatDate(appointment.fecha_cita)}</span>
                  </div>
                  
                  <div className="card-detail">
                    <span className="detail-label">Prioridad:</span>
                    <span className="detail-value">{appointment.prioridad === 'N' ? 'Normal' : 'Alta'}</span>
                  </div>
                </div>
                
                {appointment.estado !== 'Cancelado' && isFutureTurno(appointment.fecha_cita) && (
                  <div className="card-footer">
                    <button
                      onClick={() => handleCancel(appointment.id)}
                      className="cancel-button"
                    >
                      Cancelar cita
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentHistory;