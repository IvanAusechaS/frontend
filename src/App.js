import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';    // Importación default
import Footer from './components/Footer';    // Importación default
import Home from './pages/Home';             // Importación default
import PedirTurno from './pages/PedirTurno'; // Importación default
import Registrarse from './pages/Registrarse'; // Importación default
import './App.css';

function App() {
  return (
    <Router>
      <div style={styles.app}>
        <Header />
        <main style={styles.main}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/pedir-turno" element={<PedirTurno />} />
            <Route path="/registrarse" element={<Registrarse />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

const styles = {
  app: { minHeight: '100vh', backgroundColor: '#F5F6F5', display: 'flex', flexDirection: 'column' },
  main: { flex: 1, paddingBottom: '60px' },
};

export default App;  // Asegúrate de que esté aquí