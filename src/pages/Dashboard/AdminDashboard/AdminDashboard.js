import React, { useEffect, useState } from 'react';
import { getAllUsers, updateUserRole, createUser, deleteUsuario } from '../../../services/api';
import './AdminDashboard.css';

const AdminDashboard = ({ user }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newUser, setNewUser] = useState({ nombre: '', email: '', password: '', cedula: '', rol: 'usuario' });
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await getAllUsers();
      setUsers(data);
      setError('');
    } catch (err) {
      setError('Error al cargar usuarios');
    }
    setLoading(false);
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await updateUserRole(userId, newRole);
      setSuccess('Rol actualizado correctamente');
      fetchUsers();
    } catch (err) {
      setError('No se pudo actualizar el rol');
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      await createUser(newUser);
      setSuccess('Usuario creado correctamente');
      setNewUser({ nombre: '', email: '', password: '', cedula: '', rol: '' });
      fetchUsers();
    } catch (err) {
      setError('No se pudo crear el usuario');
    }
  };

  return (
    <div className="admin-dashboard">
      <h2>Panel de Administrador</h2>
      {error && <div className="admin-error">{error}</div>}
      {success && <div className="admin-success">{success}</div>}
      <section className="admin-create-user">
        <h3>Crear Nuevo Usuario</h3>
        <form onSubmit={handleCreateUser} className="admin-create-form">
          <input
            type="text"
            placeholder="Nombre"
            value={newUser.nombre}
            onChange={e => setNewUser({ ...newUser, nombre: e.target.value })}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={newUser.email}
            onChange={e => setNewUser({ ...newUser, email: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={newUser.password}
            onChange={e => setNewUser({ ...newUser, password: e.target.value })}
            required
          />
           <input
            type="text"
            placeholder="Cédula"
            value={newUser.cedula}
            onChange={e => setNewUser({ ...newUser, cedula: e.target.value })}
            required
          />
          <select
            value={newUser.rol}
            onChange={e => setNewUser({ ...newUser, rol: e.target.value })}
          >
            <option value="usuario">Usuario</option>
            <option value="profesional">Profesional</option>
            <option value="admin">Administrador</option>
          </select>
          <button type="submit">Crear Usuario</button>
        </form>
      </section>
      <section className="admin-users-list">
        <h3>Usuarios Existentes</h3>
        {loading ? (
          <div>Cargando usuarios...</div>
        ) : (
          <table className="admin-users-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Cédula</th>
                <th>Rol</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td>{u.nombre}</td>
                  <td>{u.email}</td>
                  <td>{u.cedula}</td>
                  <td>
                    <select
                      value={u.rol}
                      onChange={e => handleRoleChange(u.id, e.target.value)}
                      disabled={u.id === user.id}
                    >
                      <option value="usuario">Usuario</option>
                      <option value="profesional">Profesional</option>
                      <option value="admin">Administrador</option>
                    </select>
                  </td>
                  <td>
                    {u.id === user.id ? (
                      <span>(Tú)</span>
                    ) : (
                      <button
                        className="btn-role btn-role-delete"
                        onClick={async () => {
                          if (window.confirm(`¿Estás seguro de que deseas eliminar al usuario ${u.nombre}? Esta acción no se puede deshacer.`)) {
                            try {
                              await deleteUsuario(u.id);
                              setSuccess('Usuario eliminado correctamente');
                              fetchUsers();
                            } catch (err) {
                              setError('Error al eliminar usuario');
                            }
                          }
                        }}
                      >
                        Eliminar
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

export default AdminDashboard;
