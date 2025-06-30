import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify'; // Import ToastContainer
import 'react-toastify/dist/ReactToastify.css'; // Import styles
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/General/Home';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import ForgotPassword from './pages/Auth/ForgotPassword';
import ResetPassword from './pages/Auth/ResetPassword';
import ResetPasswordConfirm from './pages/Auth/ResetPasswordConfirm'; 
import ChangePassword from './pages/Auth/ChangePassword';
import Profile from './pages/User/Profile';
import CompleteProfile from './pages/User/CompleteProfile';
import PedirTurno from './pages/Appointments/PedirTurno';
import AppointmentHistory from './pages/Appointments/AppointmentHistory';
import ProfesionalDashboard from './pages/Dashboard/ProfesionalDashboard';
import EstadisticasGraficas from './pages/Dashboard/EstadisticasGraficas';
import AdminPanel from './pages/Admin/AdminPanel';
import Contact from './pages/General/Contact';
import Servicios from './pages/General/Servicios/Servicios';
import Equipo from './pages/General/Equipo/Equipo';
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
    { path: '/', component: Home, exact: true },
    { path: '/login', component: Login },
    { path: '/register', component: Register },
    { path: '/forgot-password', component: ForgotPassword },
    { path: '/reset-password', component: ResetPassword },
    { path: '/reset-password-confirm', component: ResetPasswordConfirm }, 
    { path: '/change-password', component: ChangePassword },
    { path: '/profile', component: Profile },
    { path: '/complete-profile', component: CompleteProfile },
    { path: '/pedir-turno', component: PedirTurno },
    { path: '/appointment-history', component: AppointmentHistory },
    { path: '/profesional', component: ProfesionalDashboard }, 
    { path: '/admin', component: AdminPanel },
    { path: '/estadisticas-graficas', component: EstadisticasGraficas },
    { path: '/contact', component: Contact },
  ];

  return (
    <Router>
      <div className="app-container">
        <Header user={user} setUser={setNormalizedUser} />
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
          </Routes>
        </main>
        <Footer />
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} /> {/* Add ToastContainer */}
      </div>
    </Router>
  );
};

export default App;