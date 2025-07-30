import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../../../services/api';
import './Nav.css';

const Nav = ({ user, setUser }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();
  const navRef = useRef(null);

  useEffect(() => {
    console.log('Nav renderizado con user:', user);
  }, [user]);

  // Cerrar menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setIsOpen(false);
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser();
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

  const toggleMainMenu = () => {
    setIsOpen(!isOpen);
    // Cerrar el menú de perfil si está abierto
    if (isProfileOpen) {
      setIsProfileOpen(false);
    }
  };

  const closeMenus = () => {
    setIsOpen(false);
    setIsProfileOpen(false);
  };

  return (
    <nav className="nav" ref={navRef}>
      <div className="nav-container">
        <h1 className="nav-logo" onClick={() => navigate('/')}>
          EyeNova
        </h1>
        <button className="nav-menu-button" onClick={toggleMainMenu}>
          ☰
        </button>
        <div className={`nav-menu ${isOpen ? 'open' : ''}`}>
          {user ? (
            <>
              <button
                className="nav-menu-item"
                onClick={() => {
                  navigate('/');
                  closeMenus();
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
                      closeMenus();
                    }}
                  >
                    Panel de Administrador
                  </button>
                  <button
                    className="nav-menu-item"
                    onClick={() => {
                      navigate('/admin/usuarios');
                      closeMenus();
                    }}
                  >
                    Gestión de Puntos de Atención
                  </button>
                </>
              ) : user.es_profesional ? (
                <button
                  className="nav-menu-item"
                  onClick={() => {
                    navigate('/profesional');
                    closeMenus();
                  }}
                >
                  Dashboard Profesional
                </button>
              ) : (!user.is_admin && user.rol !== 'admin' && !user.es_profesional) ? (
                <button
                  className="nav-menu-item"
                  onClick={() => {
                    navigate('/pedir-turno');
                    closeMenus();
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
                        closeMenus();
                      }}
                    >
                      Perfil
                    </button>
                    <button
                      className="nav-profile-item"
                      onClick={() => {
                        navigate('/appointment-history');
                        closeMenus();
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
                closeMenus();
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