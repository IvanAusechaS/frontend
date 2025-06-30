import React, { useState } from 'react';

export function UserForm({ onSubmit, loading, error, initialValues = {}, isProfesional = false }) {
  const [nombre, setNombre] = useState(initialValues.nombre || '');
  const [cedula, setCedula] = useState(initialValues.cedula || '');
  const [email, setEmail] = useState(initialValues.email || '');
  const [password, setPassword] = useState('');
  const [rol, setRol] = useState(isProfesional ? 'profesional' : 'usuario');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ nombre, cedula, email, password, rol });
  };

  return (
    <form className="admin-user-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Nombre"
        value={nombre}
        onChange={e => setNombre(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Cédula"
        value={cedula}
        onChange={e => setCedula(e.target.value)}
        required
      />
      <input
        type="email"
        placeholder="Correo electrónico"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
      />
      <select value={rol} onChange={e => setRol(e.target.value)}>
        <option value="usuario">Usuario</option>
        <option value="profesional">Profesional</option>
        <option value="admin">Administrador</option>
      </select>
      <button type="submit" disabled={loading}>
        {loading ? 'Creando...' : (isProfesional ? 'Crear Profesional' : 'Crear Usuario')}
      </button>
      {error && <div className="admin-form-error">{error}</div>}
    </form>
  );
}
