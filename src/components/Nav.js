import React from 'react';
import { Link } from 'react-router-dom';

const Nav = () => {
  return (
    <nav style={styles.nav}>
      <ul style={styles.navList}>
        <li style={styles.navItem}><Link to="/" style={styles.link}>Inicio</Link></li>
        <li style={styles.navItem}><Link to="/pedir-turno" style={styles.link}>Pedir Turno</Link></li>
        <li style={styles.navItem}><Link to="/registrarse" style={styles.link}>Registrarse</Link></li>
      </ul>
    </nav>
  );
};

const styles = {
  nav: { marginTop: '10px' },
  navList: { listStyle: 'none', padding: 0, display: 'flex', justifyContent: 'center', gap: '20px' },
  navItem: { display: 'inline' },
  link: { color: '#FFFFFF', textDecoration: 'none', fontSize: '1.2em', padding: '10px 15px', borderRadius: '5px', transition: 'background-color 0.3s' },
};

export default Nav; // Asegúrate de que esté aquí