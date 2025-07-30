// App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// Imports organizados por categorías
import Nav from './components/layout/Nav';
import Footer from './components/layout/Footer';

// Páginas Generales
import Home from './pages/General/Home';
import Contact from './pages/General/Contact';
import Servicios from './pages/General/Servicios/Servicios';
import Equipo from './pages/General/Equipo/Equipo';

// Páginas de Autenticación
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import ForgotPassword from './pages/Auth/ForgotPassword';
import ResetPassword from './pages/Auth/ResetPassword';
import ResetPasswordVerify from './pages/Auth/ResetPasswordVerify/ResetPasswordVerify';
import ChangePassword from './pages/Auth/ChangePassword';

// Páginas de Usuario
import Profile from './pages/User/Profile';
import CompleteProfile from './pages/User/CompleteProfile';

// Páginas de Citas/Turnos
import PedirTurno from './pages/Appointments/PedirTurno';
import TurnoTablero from './pages/Appointments/TurnoTablero';
import AppointmentHistory from './pages/Appointments/AppointmentHistory';

// Páginas de Dashboard
import ProfesionalDashboard from './pages/Dashboard/ProfesionalDashboard';
import AdminDashboard from './pages/Dashboard/AdminDashboard/AdminDashboard';
import EstadisticasGraficas from './pages/Dashboard/EstadisticasGraficas';

// Páginas de Administración
import AdminPanel from './pages/Admin/AdminPanel';
import AdminUsuarios from './pages/AdminUsuarios';

import './styles/global.css';

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
          es_profesional: parsedUser.es_profesional || false,
          is_admin: parsedUser.is_admin || parsedUser.rol === 'admin' || false,
          rol: parsedUser.rol || (parsedUser.is_admin ? 'admin' : (parsedUser.es_profesional ? 'profesional' : 'usuario')),
          punto_atencion_id_read: parsedUser.punto_atencion_id_read || null // Asegurado
        };
        setUser(normalizedUser);
        console.log('Usuario normalizado en App:', normalizedUser);
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
      es_profesional: newUser.es_profesional || false,
      is_admin: newUser.is_admin || newUser.rol === 'admin' || false,
      rol: newUser.rol || (newUser.is_admin ? 'admin' : (newUser.es_profesional ? 'profesional' : 'usuario')),
      punto_atencion_id_read: newUser.punto_atencion_id_read || null // Asegurado
    };
    setUser(normalizedUser);
    localStorage.setItem('user', JSON.stringify(normalizedUser));
    console.log('Usuario actualizado en App:', normalizedUser);
  };

  console.log('Usuario actual en App antes de render:', user);

  const SafeRoute = ({ component: Component, ...rest }) => {
    try {
      return <Component user={user} setUser={setNormalizedUser} {...rest} />;
    } catch (e) {
      console.error('Error al renderizar ruta:', e);
      return (
        <div className="error-container">
          <h2>Error al cargar la página</h2>
          <p>{e.message}</p>
        </div>
      );
    }
  };

  const routes = [
    // Rutas Públicas/Generales
    { path: '/', component: Home, exact: true },
    { path: '/contact', component: Contact },
    { path: '/servicios', component: Servicios },
    { path: '/equipo', component: Equipo },

    // Rutas de Autenticación
    { path: '/login', component: Login },
    { path: '/register', component: Register },
    { path: '/forgot-password', component: ForgotPassword },
    { path: '/reset-password', component: ResetPassword },
    { path: '/reset-password-verify', component: ResetPasswordVerify },
    { path: '/change-password', component: ChangePassword },

    // Rutas de Usuario (requieren autenticación)
    { path: '/profile', component: Profile },
    { path: '/complete-profile', component: CompleteProfile },

    // Rutas de Citas/Turnos (requieren autenticación)
    { path: '/pedir-turno', component: PedirTurno },
    { path: '/turno-tablero', component: TurnoTablero },
    { path: '/appointment-history', component: AppointmentHistory },

    // Rutas de Dashboard (requieren roles específicos)
    { path: '/profesional', component: ProfesionalDashboard },
    { path: '/dashboard/admin', component: AdminDashboard },
    { path: '/estadisticas-graficas', component: EstadisticasGraficas },

    // Rutas de Administración (requieren rol admin)
    { path: '/admin-panel', component: AdminPanel },
    { path: '/admin-usuarios', component: AdminUsuarios },
  ];

  return (
    <Router>
      <div className="app-container">
        <Nav user={user} setUser={setNormalizedUser} />
        <main className="main-content">
          {console.log('Renderizando Routes con user:', user)}
          <Routes>
            <Route path="/equipo" element={<Equipo />} />
            {routes.map(({ path, component, exact }) => (
              <Route
                key={path}
                path={path}
                exact={exact}
                element={<SafeRoute component={component} />}
              />
            ))}
            <Route path="/servicios" element={<Servicios />} />
            <Route path="/admin/usuarios" element={<AdminUsuarios />} />
          </Routes>
        </main>
        <Footer />
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      </div>
    </Router>
  );
};

export default App;