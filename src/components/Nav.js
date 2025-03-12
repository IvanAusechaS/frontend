import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logoutUser } from '../services/api';

const Nav = ({ user, setUser }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await logoutUser(token);
      }
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      navigate('/login');
    } catch (err) {
      console.error('Error al cerrar sesión:', err);
      // Forzar logout incluso si falla la API
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      navigate('/login');
    }
  };

  return (
    <nav style={styles.nav}>
      <ul style={styles.navList}>
        <li style={styles.navItem}><Link to="/" style={styles.link}>Inicio</Link></li>
        <li style={styles.navItem}><Link to="/pedir-turno" style={styles.link}>Pedir Turno</Link></li>
        <li style={styles.navItem}><Link to="/registrarse" style={styles.link}>Registrarse</Link></li>
        {user ? (
          <>
            <li style={styles.navItem}>Hola, {user.nombre}</li>
            {user.es_profesional && (
              <li style={styles.navItem}><Link to="/profesional" style={styles.link}>Dashboard Profesional</Link></li>
            )}
            <li style={styles.navItem}><button onClick={handleLogout} style={styles.button}>Cerrar Sesión</button></li>
          </>
        ) : (
          <li style={styles.navItem}><Link to="/login" style={styles.link}>Iniciar Sesión</Link></li>
        )}
      </ul>
    </nav>
  );
};

const styles = {
  nav: { marginTop: '10px' },
  navList: { listStyle: 'none', padding: 0, display: 'flex', justifyContent: 'center', gap: '20px' },
  navItem: { display: 'inline' },
  link: { color: '#FFFFFF', textDecoration: 'none', fontSize: '1.2em', padding: '10px 15px', borderRadius: '5px', transition: 'background-color 0.3s' },
  button: { backgroundColor: '#ca3bcd', color: '#FFFFFF', border: 'none', padding: '10px 15px', borderRadius: '5px', cursor: 'pointer' },
};

export default Nav;