import React from 'react';

const Footer = () => {
  return (
    <footer style={styles.footer}>
      <p style={styles.text}>© 2025 Sistema de Atención a Usuarios. Todos los derechos reservados.</p>
    </footer>
  );
};

const styles = {
  footer: { backgroundColor: '#4A90E2', color: '#FFFFFF', padding: '10px', textAlign: 'center', position: 'fixed', bottom: 0, width: '100%' },
  text: { margin: 0 },
};

export default Footer; // Asegúrate de que esté aquí