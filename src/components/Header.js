import React from 'react';
import Nav from './Nav';

const Header = () => {
  return (
    <header style={styles.header}>
      <h1 style={styles.title}>Sistema de Atención a Usuarios</h1>
      <Nav />
    </header>
  );
};

const styles = {
  header: { backgroundColor: '#4A90E2', padding: '20px', color: '#FFFFFF', textAlign: 'center' },
  title: { margin: 0, fontSize: '2em' },
};

export default Header; // Asegúrate de que esté aquí