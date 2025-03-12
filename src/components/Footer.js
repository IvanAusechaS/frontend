// frontend/src/components/Footer.js
import React from 'react';

const Footer = () => {
  return (
    <footer style={styles.footer}>
      <p style={styles.text}>
        © {new Date().getFullYear()} Sistema de Turnos - Todos los derechos reservados
      </p>
    </footer>
  );
};

const styles = {
  footer: {
    backgroundColor: '#444', // Gris oscuro en lugar de negro puro para mejor contraste
    color: '#FFFFFF',
    padding: '20px',
    textAlign: 'center',
    width: '100%',
    boxSizing: 'border-box',
  },
  text: {
    margin: 0,
    fontSize: 'clamp(0.8rem, 2.5vw, 1rem)',
  },
};

export default Footer;