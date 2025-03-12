// frontend/src/components/Nav.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../services/api';
import './Nav.css'; // Importamos el CSS

const Nav = ({ user, setUser }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Token al intentar cerrar sesión:', token);
      console.log('Usuario actual:', user);
      if (!token) throw new Error('No hay token disponible');
      await logoutUser(token);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      console.log('Sesión cerrada exitosamente');
      setIsOpen(false);
      navigate('/login');
    } catch (err) {
      console.error('Error al cerrar sesión:', err.message || err);
      alert(`No se pudo cerrar sesión. Error: ${err.message || 'Desconocido'}`);
    }
  };

  return (
    <nav className="nav">
      <div className="nav-container">
        <h1 className="logo" onClick={() => navigate('/')}>Sistema de Turnos</h1>
        <button className="menu-button" onClick={() => setIsOpen(!isOpen)}>
          ☰
        </button>
        <div className={`menu ${isOpen ? 'open' : ''}`}>
          {user ? (
            <>
              <span className="menu-item">Hola, {user.nombre}</span>
              {user.es_profesional ? (
                <button className="menu-item" onClick={() => { navigate('/profesional'); setIsOpen(false); }}>
                  Dashboard
                </button>
              ) : (
                <button className="menu-item" onClick={() => { navigate('/pedir-turno'); setIsOpen(false); }}>
                  Pedir Turno
                </button>
              )}
              <button className="menu-item" onClick={() => { navigate('/'); setIsOpen(false); }}>
                Inicio
              </button>
              <button className="menu-item" onClick={handleLogout}>
                Cerrar Sesión
              </button>
            </>
          ) : (
            <button className="menu-item" onClick={() => { navigate('/login'); setIsOpen(false); }}>
              Iniciar Sesión
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Nav;