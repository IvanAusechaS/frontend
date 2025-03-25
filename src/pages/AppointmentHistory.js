// frontend/src/pages/AppointmentHistory.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTurnos, cancelTurno } from '../services/api';
import './AppointmentHistory.css';

const AppointmentHistory = ({ user, setUser }) => {
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [filterEstado, setFilterEstado] = useState('');
  const [filterTipo, setFilterTipo] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token || !user) {
          setError('Debes iniciar sesión para ver tu historial.');
          navigate('/login');
          return;
        }
        const data = await getTurnos();
        setAppointments(data || []);
      } catch (err) {
        if (err.response?.status === 401) {
          setError('Sesión expirada. Por favor, inicia sesión nuevamente.');
          localStorage.clear();
          setUser(null);
          navigate('/login');
        } else {
          setError('Error al cargar el historial de citas: ' + (err.response?.data?.detail || err.message));
        }
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
      {error && <p className="appointment-history-error">{error}</p>}
      {success && <p className="appointment-history-success">{success}</p>}

      {/* Filtros */}
      <div className="filters-container">
        <div className="filter-group">
          <label>Estado:</label>
          <select value={filterEstado} onChange={(e) => setFilterEstado(e.target.value)}>
            <option value="">Todos</option>
            <option value="En espera">En espera</option>
            <option value="Atendido">Atendido</option>
            <option value="Cancelado">Cancelado</option>
          </select>
        </div>
        <div className="filter-group">
          <label>Tipo:</label>
          <select value={filterTipo} onChange={(e) => setFilterTipo(e.target.value)}>
            <option value="">Todos</option>
            <option value="medica">Médica</option>
            <option value="administrativa">Administrativa</option>
            {/* Añade más tipos según tu modelo */}
          </select>
        </div>
      </div>

      {filteredAppointments.length === 0 ? (
        <p className="appointment-history-empty">No tienes citas registradas con estos filtros.</p>
      ) : (
        <div className="appointment-history-table">
          <div className="table-header">
            <span>Turno</span>
            <span>Punto</span>
            <span>Tipo</span>
            <span>Fecha</span>
            <span>Estado</span>
            <span>Prioridad</span>
            <span>Acciones</span>
          </div>
          {filteredAppointments.map((appointment) => (
            <div key={appointment.id} className="table-row">
              <span>{appointment.numero}</span>
              <span>{appointment.punto_atencion}</span>
              <span>{appointment.tipo_cita}</span>
              <span>{formatDate(appointment.fecha_cita)}</span>
              <span>{appointment.estado}</span>
              <span>{appointment.prioridad === 'N' ? 'Normal' : 'Alta'}</span>
              <span>
                {appointment.estado !== 'Cancelado' && isFutureTurno(appointment.fecha_cita) && (
                  <button
                    onClick={() => handleCancel(appointment.id)}
                    className="cancel-button"
                  >
                    Cancelar
                  </button>
                )}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AppointmentHistory;