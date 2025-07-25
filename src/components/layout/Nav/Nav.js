import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../../../services/api'; // Importar logoutUser
import './Nav.css';

const Nav = ({ user, setUser }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Nav renderizado con user:', user);
  }, [user]);

  const handleLogout = async () => {
    try {
      await logoutUser(); // Usar logoutUser de api.js
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      setUser(null);
      console.log('Sesión cerrada exitosamente');
      setIsOpen(false);
      setIsProfileOpen(false);
      navigate('/login');
    } catch (err) {
      console.error('Error al cerrar sesión:', err.response?.data || err.message);
      alert(`No se pudo cerrar sesión. Error: ${err.response?.data?.detail || err.message || 'Desconocido'}`);
    }
  };

  const safeUserName = user && typeof user === 'object' ? user.nombre || 'Usuario' : 'Usuario';

  const toggleProfileMenu = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  return (
    <nav className="nav">
      <div className="nav-container">
        <h1 className="nav-logo" onClick={() => navigate('/')}>
          EyeNova
        </h1>
        <button className="nav-menu-button" onClick={() => setIsOpen(!isOpen)}>
          ☰
        </button>
        <div className={`nav-menu ${isOpen ? 'open' : ''}`}>
          {user ? (
            <>
              <button
                className="nav-menu-item"
                onClick={() => {
                  navigate('/');
                  setIsOpen(false);
                }}
              >
                Inicio
              </button>
              {user.is_admin || user.rol === 'admin' ? (
                <>
                  <button
                    className="nav-menu-item"
                    onClick={() => {
                      navigate('/dashboard/admin');
                      setIsOpen(false);
                    }}
                  >
                    Panel de Administrador
                  </button>
                  <button
                    className="nav-menu-item"
                    onClick={() => {
                      navigate('/admin/usuarios');
                      setIsOpen(false);
                    }}
                  >
                    Gestión de Puntos de Atención
                  </button>
                </>
              ) : user.es_profesional ? (
                <button
                  className="nav-menu-item"
                  onClick={() => {
                    navigate('/dashboard/profesional');
                    setIsOpen(false);
                  }}
                >
                  Dashboard Profesional
                </button>
              ) : (!user.is_admin && user.rol !== 'admin' && !user.es_profesional) ? (
                <button
                  className="nav-menu-item"
                  onClick={() => {
                    navigate('/pedir-turno');
                    setIsOpen(false);
                  }}
                >
                  Pedir Turno
                </button>
              ) : null}
              <div className="nav-user-container">
                <span
                  className="nav-menu-item nav-user"
                  onClick={toggleProfileMenu}
                >
                  Hola, {safeUserName} ▼
                </span>
                {isProfileOpen && (
                  <div className="nav-profile-menu">
                    <button
                      className="nav-profile-item"
                      onClick={() => {
                        navigate('/profile');
                        setIsOpen(false);
                        setIsProfileOpen(false);
                      }}
                    >
                      Perfil
                    </button>
                    <button
                      className="nav-profile-item"
                      onClick={() => {
                        navigate('/appointment-history');
                        setIsOpen(false);
                        setIsProfileOpen(false);
                      }}
                    >
                      Mis Citas
                    </button>
                  </div>
                )}
              </div>
              <button className="nav-menu-item nav-logout" onClick={handleLogout}>
                Cerrar Sesión
              </button>
            </>
          ) : (
            <button
              className="nav-menu-item nav-login"
              onClick={() => {
                navigate('/login');
                setIsOpen(false);
              }}
            >
              Iniciar Sesión
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Nav;