import React, { useEffect, useState } from 'react';
import './AdminPanel.css';
import { getUsuarios, createUsuario, getProfesionalStats, cambiarRolUsuario } from '../../services/api';
import { UserForm } from './AdminPanel.forms';

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [stats, setStats] = useState({ total: 0, profesionales: 0, admins: 0, atendidos: 0 });

  // Carga usuarios y estadísticas reales
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const usuarios = await getUsuarios();
        setUsers(usuarios);
        const estadisticas = await getProfesionalStats();
        setStats({
          total: estadisticas.total_usuarios || usuarios.length,
          profesionales: estadisticas.total_profesionales || usuarios.filter(u => u.rol === 'profesional').length,
          admins: estadisticas.total_admins || usuarios.filter(u => u.rol === 'admin').length,
          atendidos: estadisticas.total_atendidos || usuarios.filter(u => u.atendido).length,
        });
        setError(null);
      } catch (err) {
        setError('Error al cargar usuarios o estadísticas');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filtro de búsqueda
  const filteredUsers = users.filter(user =>
    user.nombre.toLowerCase().includes(search.toLowerCase()) ||
    user.cedula.toLowerCase().includes(search.toLowerCase())
  );

  // Estado para formularios de creación
  const [creatingUser, setCreatingUser] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  // Función para cambiar el rol de un usuario
  const handleCambiarRol = async (userId, nuevoRol) => {
    try {
      await cambiarRolUsuario(userId, nuevoRol);
      // Actualizar la lista de usuarios
      const usuariosActualizados = await getUsuarios();
      setUsers(usuariosActualizados);
      setFormSuccess(`Rol actualizado a ${nuevoRol} correctamente`);
    } catch (error) {
      setFormError(error.response?.data?.error || 'Error al cambiar el rol');
    }
  };

  // Crear usuario/profesional
  const handleCreate = async (formData) => {
    setFormError('');
    setFormSuccess('');
    setCreatingUser(true);
    try {
      await createUsuario(formData);
      setFormSuccess('Usuario creado exitosamente');
      // Recarga usuarios
      const usuarios = await getUsuarios();
      setUsers(usuarios);
    } catch (err) {
      setFormError('Error al crear usuario');
    } finally {
      setCreatingUser(false);
    }
  };

  return (
    <div className="admin-panel-container">
      <h1 className="admin-panel-title">Panel Administrativo</h1>
      {/* Estadísticas */}
      <section className="admin-stats-section">
        <div className="admin-stats-card">Usuarios registrados: <b>{stats.total}</b></div>
        <div className="admin-stats-card">Profesionales: <b>{stats.profesionales}</b></div>
        <div className="admin-stats-card">Admins: <b>{stats.admins}</b></div>
        <div className="admin-stats-card">Clientes atendidos: <b>{stats.atendidos}</b></div>
      </section>
      {/* Formulario de creación de usuario/profesional */}
      <section className="admin-create-section">
        <h3>Crear Usuario o Profesional</h3>
        <UserForm
          onSubmit={handleCreate}
          loading={creatingUser}
          error={formError}
        />
        {formSuccess && <div className="admin-form-success">{formSuccess}</div>}
      </section>
      {/* Acciones de búsqueda */}
      <section className="admin-actions-section">
        <input
          className="admin-search-input"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar por nombre o cédula..."
        />
      </section>
      {/* Tabla de usuarios */}
      <section className="admin-users-section">
        <h2>Usuarios Registrados</h2>
        {loading ? (
          <p>Cargando usuarios...</p>
        ) : error ? (
          <p className="admin-error">Error: {error}</p>
        ) : (
          <table className="admin-users-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Cédula</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.nombre}</td>
                  <td>{user.cedula}</td>
                  <td>{user.email}</td>
                  <td>{user.rol}</td>
                  <td className="admin-actions">
                    {user.rol !== 'profesional' && (
                      <button 
                        onClick={() => handleCambiarRol(user.id, 'profesional')}
                        className="btn-role btn-role-profesional"
                      >
                        Hacer Profesional
                      </button>
                    )}
                    {user.rol !== 'admin' && (
                      <button 
                        onClick={() => handleCambiarRol(user.id, 'admin')}
                        className="btn-role btn-role-admin"
                      >
                        Hacer Admin
                      </button>
                    )}
                    {user.rol !== 'usuario' && (
                      <button 
                        onClick={() => handleCambiarRol(user.id, 'usuario')}
                        className="btn-role btn-role-user"
                      >
                        Hacer Usuario
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
};

export default AdminPanel;
