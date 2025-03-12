// frontend/src/pages/Home.js
import React from 'react';

const Home = ({ user }) => {
  return (
    <div style={styles.pageContainer}>
      <div style={styles.container}>
        <h2 style={styles.title}>Bienvenido{}{user ? `, ${user.nombre}` : ''}</h2>
        <p style={styles.text}>
          {user ? 'Usa el menú para pedir un turno o gestionar tus citas.' : 'Por favor, inicia sesión para continuar.'}
        </p>
      </div>
    </div>
  );
};

const styles = {
  pageContainer: {
    minHeight: '100vh',
    paddingTop: '80px',
    paddingBottom: '60px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    boxSizing: 'border-box',
  },
  container: {
    padding: '20px',
    maxWidth: '600px',
    width: '100%',
    margin: '0 auto',
    boxSizing: 'border-box',
  },
  title: {
    fontSize: 'clamp(1.5rem, 5vw, 2rem)',
    textAlign: 'center',
    marginBottom: '20px',
    color: '#333',
  },
  text: {
    fontSize: 'clamp(0.9rem, 3vw, 1rem)',
    textAlign: 'center',
    color: '#666',
  },
};

export default Home;