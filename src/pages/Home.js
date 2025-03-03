import React from 'react';

const Home = () => {
  return (
    <div style={styles.container}>
      <h2>Bienvenido</h2>
      <p>Este es el sistema para gestionar turnos y atención a usuarios. Usa el menú para pedir un turno o registrarte.</p>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    textAlign: 'center',
  },
};

export default Home;