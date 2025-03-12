import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
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

  // Cargar usuario desde localStorage al iniciar la app
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Componente para proteger rutas que requieren autenticación
  const ProtectedRoute = ({ element }) => {
    return user && localStorage.getItem('token') ? element : <Navigate to="/login" />;
  };

  return (
    <Router>
      <div style={styles.app}>
        <Header user={user} setUser={setUser} />
        <main style={styles.main}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/pedir-turno" element={<ProtectedRoute element={<PedirTurno user={user} />} />} />
            <Route path="/registrarse" element={<Registrarse />} />
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route path="/profesional" element={<ProtectedRoute element={<ProfesionalDashboard />} />} />
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