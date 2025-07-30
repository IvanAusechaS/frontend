import React, { useEffect, useState } from 'react';
import ServiciosPorPunto from '../components/ServiciosPorPunto';
import { getAllUsers, createPuntoAtencion, getPuntosAtencion, assignPuntoToProfesional, deletePuntoAtencion } from '../services/api';

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
    <div style={{maxWidth: 700, margin: '40px auto', background: '#fff', borderRadius: 12, boxShadow: '0 2px 16px rgba(32,131,227,0.08)', padding: 32}}>
      <h2>Gestión de Puntos de Atención</h2>
      {error && <div style={{color:'#c00', background:'#fdecea', padding:10, borderRadius:6, marginBottom:10}}>{error}</div>}
      {success && <div style={{color:'#388e3c', background:'#e8f5e9', padding:10, borderRadius:6, marginBottom:10}}>{success}</div>}
      <form onSubmit={handleCrearPunto} style={{display:'flex', gap:12, marginBottom:24}}>
        <input type="text" placeholder="Nombre del punto de atención" value={nombrePunto} onChange={e=>setNombrePunto(e.target.value)} required style={{flex:1, padding:8, borderRadius:6, border:'1px solid #ccd'}} />
        <input type="text" placeholder="Ubicación" value={ubicacionPunto} onChange={e=>setUbicacionPunto(e.target.value)} required style={{flex:1, padding:8, borderRadius:6, border:'1px solid #ccd'}} />
        <button type="submit" style={{padding:'8px 18px', fontWeight:700, borderRadius:6, background:'#2083e3', color:'#fff', border:'none'}}>Crear</button>
      </form>
      <h3>Puntos de Atención Existentes</h3>
      <ul style={{marginBottom:24}}>
        {puntos.map(p => (
          <li key={p.id} style={{display:'flex', alignItems:'center', gap:8}}>
            <span style={{flex:1}}>{p.nombre} <span style={{color:'#888', fontSize:13}}>({p.ubicacion})</span></span>
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
              style={{background:'#c00',color:'#fff',border:'none',borderRadius:6,padding:'4px 10px',fontWeight:700,cursor:'pointer',marginRight:8}}
            >Inactivar</button>
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
              style={{background:'#444',color:'#fff',border:'none',borderRadius:6,padding:'4px 10px',fontWeight:700,cursor:'pointer'}}
            >Eliminar</button>
          </li>
        ))}
      </ul>

      {/* Sección de puntos inactivos */}
      <h3>Puntos de Atención Inactivos</h3>
      <ul style={{marginBottom:24}}>
        {puntosInactivos.length === 0 && <li style={{color:'#888'}}>No hay puntos inactivos.</li>}
        {puntosInactivos.map((p, idx) => (
          <li key={p.id || p.nombre + idx} style={{display:'flex', alignItems:'center', gap:8}}>
            <span style={{flex:1}}>{p.nombre} <span style={{color:'#888', fontSize:13}}>({p.ubicacion})</span></span>
            <button
              onClick={async () => {
                try {
                  // Volver a crear el punto en el backend
                  await createPuntoAtencion({ nombre: p.nombre, ubicacion: p.ubicacion, servicios_texto: p.servicios ? p.servicios.join('\n') : '' });
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
              style={{background:'#388e3c',color:'#fff',border:'none',borderRadius:6,padding:'4px 10px',fontWeight:700,cursor:'pointer'}}
            >Activar</button>
          </li>
        ))}
      </ul>
      <h3>Profesionales</h3>
      {loading ? <div>Cargando profesionales...</div> : (
        <table style={{width:'100%', borderCollapse:'collapse', background:'#f9f9f9', borderRadius:8, overflow:'hidden', boxShadow:'0 1px 8px #e0e7ef'}}>
          <thead style={{background:'#2083e3', color:'#fff'}}>
            <tr>
              <th style={{padding:10}}>Nombre</th>
              <th style={{padding:10}}>Email</th>
              <th style={{padding:10}}>Punto de Atención Asignado</th>
              <th style={{padding:10}}>Cambiar Asignación</th>
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
                <tr key={prof.id} style={{background:'#fff'}}>
                  <td style={{padding:10, borderBottom:'1px solid #eee'}}>{prof.nombre}</td>
                  <td style={{padding:10, borderBottom:'1px solid #eee'}}>{prof.email}</td>
                  <td style={{padding:10, borderBottom:'1px solid #eee'}}>
                    {punto ? (
                      <span style={{fontWeight:600}}>{punto.nombre}</span>
                    ) : (
                      <span style={{color:'#888'}}>Sin asignar</span>
                    )}
                  </td>
                  <td style={{padding:10, borderBottom:'1px solid #eee'}}>
                    <select value={prof.punto_atencion_id || ''} onChange={e => handleAsignar(prof.id, e.target.value)} style={{padding:6, borderRadius:6, border:'1px solid #ccd', marginRight:8}}>
                      <option value="">Sin asignar</option>
                      {puntos.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
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
           setError(''); setSuccess('');
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