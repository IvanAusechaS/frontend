import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../services/api';
import './Profile.css';

const Profile = ({ user, setUser }) => {
  const [name, setName] = useState(user?.nombre || '');
  const [email, setEmail] = useState(user?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token || !user) {
          navigate('/login');
          return;
        }
        const response = await api.get('turnos/');
        setAppointments(response.data);
      } catch (err) {
        setError('Error al cargar las citas');
      }
    };
    fetchAppointments();
  }, [user, navigate]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      await api.put('update-profile/', { name, email });
      setMessage('Perfil actualizado exitosamente');
      setError('');
      setUser({ ...user, nombre: name, email });
      localStorage.setItem('user', JSON.stringify({ ...user, nombre: name, email }));
    } catch (err) {
      setError(err.response?.data?.error || 'Error al actualizar el perfil');
      setMessage('');
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      await api.post('change-password/', {
        current_password: currentPassword,
        new_password: newPassword,
      });
      setMessage('Contraseña cambiada exitosamente');
      setError('');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      setError(err.response?.data?.error || 'Error al cambiar la contraseña');
      setMessage('');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('es-CO', { dateStyle: 'medium', timeStyle: 'short' });
  };

  const getStatusClass = (status) => {
    switch(status.toLowerCase()) {
      case 'confirmada':
        return 'status-confirmed';
      case 'pendiente':
        return 'status-pending';
      case 'cancelada':
        return 'status-cancelled';
      default:
        return '';
    }
  };

  return (
    <div className="profile-container">
      <h2 className="profile-title">Mi Perfil</h2>
      
      {message && <div className="profile-message success">{message}</div>}
      {error && <div className="profile-message error">{error}</div>}

      <div className="profile-grid">
        <section className="profile-section personal-info">
          <h3 className="profile-subtitle">Información Personal</h3>
          <form onSubmit={handleUpdateProfile} className="profile-form">
            <div className="form-group">
              <label htmlFor="name">Nombre</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nombre completo"
                className="profile-input"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Correo electrónico</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Correo electrónico"
                className="profile-input"
                required
              />
            </div>
            
            <button type="submit" className="profile-button">
              Actualizar Perfil
            </button>
          </form>
        </section>

        <section className="profile-section password-section">
          <h3 className="profile-subtitle">Cambiar Contraseña</h3>
          <form onSubmit={handleChangePassword} className="profile-form">
            <div className="form-group">
              <label htmlFor="current-password">Contraseña actual</label>
              <input
                id="current-password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Ingrese su contraseña actual"
                className="profile-input"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="new-password">Nueva contraseña</label>
              <input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Ingrese su nueva contraseña"
                className="profile-input"
                required
              />
            </div>
            
            <button type="submit" className="profile-button">
              Cambiar Contraseña
            </button>
          </form>
        </section>
      </div>

      <section className="profile-section appointments-section">
        <h3 className="profile-subtitle">Mis Citas</h3>
        {appointments.length === 0 ? (
          <div className="no-appointments">
            <p>No tienes citas programadas actualmente.</p>
            <button 
              onClick={() => navigate('/pedir-turno')} // Updated path
              className="profile-button schedule-button"
            >
              Programar una cita
            </button>
          </div>
        ) : (
          <div className="appointments-container">
            {appointments.map((appointment) => (
              <div key={appointment.id} className="appointment-card">
                <div className="appointment-header">
                  <h4>Turno #{appointment.numero}</h4>
                  <span className={`appointment-status ${getStatusClass(appointment.estado)}`}>
                    {appointment.estado}
                  </span>
                </div>
                
                <div className="appointment-details">
                  <div className="appointment-info">
                    <i className="icon location-icon"></i>
                    <span>{appointment.punto_atencion.nombre}</span>
                  </div>
                  
                  <div className="appointment-info">
                    <i className="icon calendar-icon"></i>
                    <span>{formatDate(appointment.fecha_cita)}</span>
                  </div>
                </div>
                
                <div className="appointment-actions">
                  {appointment.estado !== 'cancelada' && (
                    <>
                      <button 
                        className="action-button reschedule"
                        onClick={() => navigate(`/reprogramar/${appointment.id}`)}
                      >
                        Reprogramar
                      </button>
                      <button 
                        className="action-button cancel"
                        onClick={() => navigate(`/cancelar/${appointment.id}`)}
                      >
                        Cancelar
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Profile;