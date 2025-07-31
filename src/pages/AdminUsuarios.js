import React, { useEffect, useState } from 'react';
import ServiciosPorPunto from '../components/ServiciosPorPunto';
import { getAllUsers, createPuntoAtencion, getPuntosAtencion, assignPuntoToProfesional, deletePuntoAtencion } from '../services/api';
import './AdminUsuarios.css';

const AdminUsuarios = () => {
  // Estado para puntos inactivos persistente en localStorage
  const [puntosInactivos, setPuntosInactivos] = useState(() => {
    try {
      const guardados = localStorage.getItem('puntosInactivos');
      return guardados ? JSON.parse(guardados) : [];
    } catch {
      return [];
    }
  });
  const [nombrePunto, setNombrePunto] = useState('');
  const [ubicacionPunto, setUbicacionPunto] = useState('');
  const [puntos, setPuntos] = useState([]);
  const [profesionales, setProfesionales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPuntos();
    fetchProfesionales();
  }, []);

  const fetchPuntos = async () => {
    // Sincronizar puntos inactivos con localStorage
    try {
      const guardados = localStorage.getItem('puntosInactivos');
      if (guardados) setPuntosInactivos(JSON.parse(guardados));
    } catch {}

    try {
      const data = await getPuntosAtencion();
      setPuntos(data);
    } catch {
      setError('Error al cargar puntos de atención');
    }
  };

  const fetchProfesionales = async () => {
    setLoading(true);
    try {
      const data = await getAllUsers();
      setProfesionales(data.filter(u => u.rol === 'profesional' && u.es_profesional === true));
      setError('');
    } catch {
      setError('Error al cargar profesionales');
    }
    setLoading(false);
  };

  const handleCrearPunto = async (e) => {
    e.preventDefault();
    try {
      await createPuntoAtencion({ nombre: nombrePunto, ubicacion: ubicacionPunto, servicios_texto: "" });
      setSuccess('Punto de atención creado');
      setNombrePunto('');
      setUbicacionPunto('');
      fetchPuntos();
    } catch {
      setError('No se pudo crear el punto de atención');
    }
  };

  const handleAsignar = async (profId, puntoId) => {
    try {
      await assignPuntoToProfesional(Number(profId), Number(puntoId));
      setSuccess('Profesional asignado correctamente');
      fetchProfesionales();
    } catch {
      setError('No se pudo asignar el punto');
    }
  };

  return (
    <div className="admin-usuarios-container">
      <h2>Gestión de Puntos de Atención</h2>
      
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      
      <form onSubmit={handleCrearPunto} className="form-crear-punto">
        <input 
          type="text" 
          placeholder="Nombre del punto de atención" 
          value={nombrePunto} 
          onChange={e => setNombrePunto(e.target.value)} 
          required 
        />
        <input 
          type="text" 
          placeholder="Ubicación" 
          value={ubicacionPunto} 
          onChange={e => setUbicacionPunto(e.target.value)} 
          required 
        />
        <button type="submit" className="btn-crear">Crear</button>
      </form>
      
      <div className="puntos-list">
        <h3>Puntos de Atención Existentes</h3>
        <ul>
          {puntos.map(p => (
            <li key={p.id} className="punto-item">
              <div className="punto-info">
                <span className="punto-nombre">{p.nombre}</span>
                <span className="punto-ubicacion">({p.ubicacion})</span>
              </div>
              <div className="punto-actions">
                <button
                  onClick={async () => {
                    if (window.confirm('¿Inactivar este punto de atención?')) {
                      // Guardar en inactivos antes de eliminar
                      const punto = puntos.find(pt => pt.id === p.id);
                      const nuevosInactivos = [...puntosInactivos, punto];
                      setPuntosInactivos(nuevosInactivos);
                      localStorage.setItem('puntosInactivos', JSON.stringify(nuevosInactivos));
                      try {
                        await deletePuntoAtencion(p.id);
                        fetchPuntos();
                        setSuccess('Punto inactivado (puedes reactivarlo abajo)');
                      } catch {
                        setError('No se pudo inactivar el punto');
                      }
                    }
                  }}
                  className="btn-inactivar"
                >
                  Inactivar
                </button>
                <button
                  onClick={async () => {
                    if (window.confirm('¿Eliminar permanentemente este punto de atención?')) {
                      try {
                        await deletePuntoAtencion(p.id);
                        fetchPuntos();
                        setSuccess('Punto eliminado permanentemente');
                      } catch {
                        setError('No se pudo eliminar el punto');
                      }
                    }
                  }}
                  className="btn-eliminar"
                >
                  Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Sección de puntos inactivos */}
      <div className="puntos-list">
        <h3>Puntos de Atención Inactivos</h3>
        <ul>
          {puntosInactivos.length === 0 && (
            <li className="empty-state">No hay puntos inactivos.</li>
          )}
          {puntosInactivos.map((p, idx) => (
            <li key={p.id || p.nombre + idx} className="punto-item">
              <div className="punto-info">
                <span className="punto-nombre">{p.nombre}</span>
                <span className="punto-ubicacion">({p.ubicacion})</span>
              </div>
              <div className="punto-actions">
                <button
                  onClick={async () => {
                    try {
                      // Volver a crear el punto en el backend
                      await createPuntoAtencion({ 
                        nombre: p.nombre, 
                        ubicacion: p.ubicacion, 
                        servicios_texto: p.servicios ? p.servicios.join('\n') : '' 
                      });
                      // Quitar de inactivos y actualizar localStorage
                      const nuevos = puntosInactivos.filter((pt, i) => i !== idx);
                      setPuntosInactivos(nuevos);
                      localStorage.setItem('puntosInactivos', JSON.stringify(nuevos));
                      fetchPuntos();
                      setSuccess('Punto reactivado correctamente');
                    } catch {
                      setError('No se pudo reactivar el punto');
                    }
                  }}
                  className="btn-activar"
                >
                  Activar
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
      
      <h3>Profesionales</h3>
      {loading ? (
        <div className="loading-message">Cargando profesionales...</div>
      ) : (
        <table className="profesionales-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Punto de Atención Asignado</th>
              <th>Cambiar Asignación</th>
            </tr>
          </thead>
          <tbody>
            {profesionales.map(prof => {
              let punto = null;
              if (prof.punto_atencion_id) {
                punto = puntos.find(p => p.id === prof.punto_atencion_id);
              } else if (prof.punto_atencion && prof.punto_atencion.id) {
                punto = puntos.find(p => p.id === prof.punto_atencion.id);
              }
              return (
                <tr key={prof.id}>
                  <td data-label="Nombre">{prof.nombre}</td>
                  <td data-label="Email">{prof.email}</td>
                  <td data-label="Punto Asignado">
                    {punto ? (
                      <span className="punto-asignado">{punto.nombre}</span>
                    ) : (
                      <span className="sin-asignar">Sin asignar</span>
                    )}
                  </td>
                  <td data-label="Cambiar Asignación">
                    <select 
                      value={prof.punto_atencion_id || ''} 
                      onChange={e => handleAsignar(prof.id, e.target.value)} 
                      className="select-punto"
                    >
                      <option value="">Sin asignar</option>
                      {puntos.map(p => (
                        <option key={p.id} value={p.id}>{p.nombre}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
      
      {/* Sección para asignar servicios a puntos de atención */}
      <ServiciosPorPunto
        puntos={puntos.map(p => ({...p, servicios: p.servicios || []}))}
        onAsignarServicios={async (puntoId, nuevosServicios) => {
          setError(''); 
          setSuccess('');
          try {
            // Convertir array a texto separado por saltos de línea
            const serviciosTexto = nuevosServicios.join('\n');
            await import('../services/api').then(mod => mod.updateServiciosPuntoAtencion(puntoId, serviciosTexto));
            setPuntos(prev => prev.map(p => p.id === puntoId ? { ...p, servicios: nuevosServicios } : p));
            setSuccess('Servicios actualizados correctamente');
          } catch (err) {
            setError('No se pudo actualizar los servicios');
          }
        }}
      />
    </div>
  );
};

export default AdminUsuarios;