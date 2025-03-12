// frontend/src/components/Nav.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../services/api';

const Nav = ({ user, setUser }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Token al intentar cerrar sesión:', token);
      console.log('Usuario actual:', user);
      if (!token) throw new Error('No hay token disponible');
      await logoutUser(token); // Llamada a la API (si existe)
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null); // Actualiza el estado global
      console.log('Sesión cerrada exitosamente');
      setIsOpen(false);
      navigate('/login');
    } catch (err) {
      console.error('Error al cerrar sesión:', err.message || err);
      alert(`No se pudo cerrar sesión. Error: ${err.message || 'Desconocido'}`);
    }
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.navContainer}>
        <h1 style={styles.logo} onClick={() => navigate('/')}>Sistema de Turnos</h1>
        <button style={styles.menuButton} onClick={() => setIsOpen(!isOpen)}>
          ☰
        </button>
        <div style={isOpen ? styles.menuOpen : styles.menuClosed}>
          {user ? (
            <>
              <span style={styles.menuItem}>Hola, {user.nombre}</span>
              {user.es_profesional ? (
                <button style={styles.menuItem} onClick={() => { navigate('/profesional'); setIsOpen(false); }}>
                  Dashboard
                </button>
              ) : (
                <button style={styles.menuItem} onClick={() => { navigate('/pedir-turno'); setIsOpen(false); }}>
                  Pedir Turno
                </button>
              )}
              <button style={styles.menuItem} onClick={() => { navigate('/'); setIsOpen(false); }}>
                Inicio
              </button>
              <button style={styles.menuItem} onClick={handleLogout}>
                Cerrar Sesión
              </button>
            </>
          ) : (
            <button style={styles.menuItem} onClick={() => { navigate('/login'); setIsOpen(false); }}>
              Iniciar Sesión
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    backgroundColor: '#50C878',
    padding: '15px 20px',
    width: '100%',
    position: 'fixed',
    top: 0,
    left: 0,
    zIndex: 1000,
    boxSizing: 'border-box',
    height: '60px',
  },
  navContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: '1200px',
    width: '100%',
    margin: '0 auto',
    height: '100%',
  },
  logo: {
    color: '#FFFFFF',
    fontSize: 'clamp(1.2rem, 4vw, 1.5rem)',
    margin: 0,
    cursor: 'pointer',
  },
  menuButton: {
    background: 'none',
    border: 'none',
    color: '#FFFFFF',
    fontSize: 'clamp(1.5rem, 5vw, 2rem)',
    cursor: 'pointer',
    display: 'block', // Visible para probar, ajustar con CSS externo para responsividad
  },
  menuClosed: {
    display: 'none',
  },
  menuOpen: {
    display: 'flex',
    flexDirection: 'column',
    position: 'absolute',
    top: '60px',
    right: '20px',
    backgroundColor: '#50C878',
    padding: '10px',
    borderRadius: '5px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
    width: '200px',
    zIndex: 999,
  },
  menuItem: {
    background: 'none',
    border: 'none',
    color: '#FFFFFF',
    fontSize: 'clamp(0.9rem, 3vw, 1rem)',
    padding: '10px',
    textAlign: 'left',
    cursor: 'pointer',
    width: '100%',
    boxSizing: 'border-box',
  },
};

export default Nav;