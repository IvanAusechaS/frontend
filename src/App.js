// frontend/src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import PedirTurno from './pages/PedirTurno';
import ProfesionalDashboard from './pages/ProfesionalDashboard';
import Home from './pages/Home';
import Register from './pages/Register';
import Header from './components/Header'; // Reemplaza Nav con Header
import Footer from './components/Footer';
import CompleteProfile from './pages/CompleteProfile';
import ChangePassword from './pages/ChangePassword';
import ResetPassword from './pages/ResetPassword';
import ResetPasswordConfirm from './pages/ResetPasswordConfirm';
import Contact from './pages/Contact';
import AppointmentHistory from './pages/AppointmentHistory';
import Profile from './pages/Profile';
import './App.css';

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    console.log('Cargando usuario desde localStorage en App:', storedUser);
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        const normalizedUser = {
          id: parsedUser.id,
          cedula: parsedUser.cedula || '',
          email: parsedUser.email || '',
          nombre: parsedUser.nombre || 'Usuario',
          es_profesional: parsedUser.es_profesional || false
        };
        setUser(normalizedUser);
      } catch (error) {
        console.error('Error al parsear usuario desde localStorage:', error);
        localStorage.removeItem('user');
      }
    }
  }, []);

  const setNormalizedUser = (newUser) => {
    if (!newUser) {
      setUser(null);
      localStorage.removeItem('user');
      return;
    }
    const normalizedUser = {
      id: newUser.id,
      cedula: newUser.cedula || '',
      email: newUser.email || '',
      nombre: newUser.nombre || 'Usuario',
      es_profesional: newUser.es_profesional || false
    };
    setUser(normalizedUser);
    localStorage.setItem('user', JSON.stringify(normalizedUser));
  };

  console.log('Usuario actual en App antes de render:', user);

  const SafeRoute = ({ user, setUser, element }) => {
    try {
      return element;
    } catch (e) {
      console.error('Error al renderizar ruta:', e);
      return <div>Error al cargar la página</div>;
    }
  };

  return (
    <Router>
      <div className="app-container">
        <Header user={user} setUser={setNormalizedUser} /> {/* Reemplaza Nav con Header */}
        <main className="main-content">
        {console.log('Renderizando Routes con user:', user)}
          <Routes>
            <Route path="/" element={<SafeRoute user={user} setUser={setNormalizedUser} element={<Home user={user} setUser={setNormalizedUser} />} />} />
            <Route path="/pedir-turno" element={<SafeRoute user={user} setUser={setNormalizedUser} element={<PedirTurno user={user} setUser={setNormalizedUser} />} />} />
            <Route path="/login" element={<Login setUser={setNormalizedUser} />} />
            <Route path="/profesional" element={<ProfesionalDashboard user={user} setUser={setNormalizedUser} />} />
            <Route path="/register" element={<Register setUser={setNormalizedUser} />} />
            <Route path="/complete-profile" element={<CompleteProfile setUser={setNormalizedUser} />} />
            <Route path="/change-password" element={<ChangePassword user={user} setUser={setNormalizedUser} />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/reset-password-confirm" element={<ResetPasswordConfirm />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/appointment-history" element={<AppointmentHistory user={user} setUser={setNormalizedUser} />} />
            <Route path="/profile" element={<Profile user={user} setUser={setNormalizedUser} />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;