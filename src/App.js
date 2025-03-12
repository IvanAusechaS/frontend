// frontend/src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import PedirTurno from './pages/PedirTurno';
import ProfesionalDashboard from './pages/ProfesionalDashboard';
import Home from './pages/Home'; // Asumo que existe, si no, lo crearemos
import Nav from './components/Nav';
import Footer from './components/Footer';

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Cargar el usuario desde localStorage al iniciar la app
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');
    if (storedUser && token) {
      setUser(storedUser);
    }
  }, []);

  return (
    <Router>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Nav user={user} setUser={setUser} />
        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route path="/pedir-turno" element={<PedirTurno user={user} setUser={setUser} />} />
            <Route path="/profesional" element={<ProfesionalDashboard user={user} setUser={setUser} />} />
            <Route path="/" element={<Home user={user} setUser={setUser} />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;