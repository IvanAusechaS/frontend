import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import PedirTurno from './pages/PedirTurno';
import Registrarse from './pages/Registrarse';
import Login from './pages/Login';
import ProfesionalDashboard from './pages/ProfesionalDashboard';
import './App.css';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (storedUser && token) {
      setUser(JSON.parse(storedUser)); // Cargar usuario solo si hay token
    } else {
      localStorage.removeItem('user'); // Limpiar si no hay token
      localStorage.removeItem('token');
    }
  }, []);

  return (
    <Router>
      <div style={styles.app}>
        <Header user={user} setUser={setUser} />
        <main style={styles.main}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/pedir-turno" element={<PedirTurno />} />
            <Route path="/registrarse" element={<Registrarse />} />
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route path="/profesional" element={<ProfesionalDashboard />} />
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

export default App;