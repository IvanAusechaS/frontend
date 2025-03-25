// frontend/src/pages/Profile.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
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

  return (
    <div className="profile-container">
      <h2 className="profile-title">Mi Perfil</h2>
      {message && <p className="profile-success">{message}</p>}
      {error && <p className="profile-error">{error}</p>}

      <section className="profile-section">
        <h3 className="profile-subtitle">Información Personal</h3>
        <form onSubmit={handleUpdateProfile} className="profile-form">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nombre"
            className="profile-input"
            required
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Correo electrónico"
            className="profile-input"
          />
          <button type="submit" className="profile-button">Actualizar Perfil</button>
        </form>
      </section>

      <section className="profile-section">
        <h3 className="profile-subtitle">Cambiar Contraseña</h3>
        <form onSubmit={handleChangePassword} className="profile-form">
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Contraseña actual"
            className="profile-input"
            required
          />
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Nueva contraseña"
            className="profile-input"
            required
          />
          <button type="submit" className="profile-button">Cambiar Contraseña</button>
        </form>
      </section>

      <section className="profile-section">
        <h3 className="profile-subtitle">Mis Citas</h3>
        {appointments.length === 0 ? (
          <p className="profile-empty">No tienes citas registradas.</p>
        ) : (
          <ul className="profile-appointments-list">
            {appointments.map((appointment) => (
              <li key={appointment.id} className="profile-appointment-item">
                <span className="profile-appointment-number">Turno: {appointment.numero}</span>
                <span>Punto: {appointment.punto_atencion}</span>
                <span>Fecha: {formatDate(appointment.fecha_cita)}</span>
                <span>Estado: {appointment.estado}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default Profile;