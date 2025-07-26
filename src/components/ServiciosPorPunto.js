import React, { useState } from 'react';

const SERVICIOS = [
  'Atención de Urgencias Oftalmológicas',
  'Obtención de Gafas Formuladas',
  'Cirugía Refractiva',
  'Consulta Oftalmológica'
];

export default function ServiciosPorPunto({ puntos, onAsignarServicios }) {
  // Estado local para los servicios seleccionados por punto
  const [serviciosPorPunto, setServiciosPorPunto] = useState(() => {
    const init = {};
    puntos.forEach(p => {
      init[p.id] = p.servicios || [];
    });
    return init;
  });

  const handleChange = (puntoId, servicio) => {
    setServiciosPorPunto(prev => {
      const yaTiene = prev[puntoId]?.includes(servicio);
      const nuevos = yaTiene
        ? prev[puntoId].filter(s => s !== servicio)
        : [...(prev[puntoId] || []), servicio];
      // Notificar al padre
      onAsignarServicios(puntoId, nuevos);
      return { ...prev, [puntoId]: nuevos };
    });
  };

  return (
    <div style={{marginTop:32}}>
      <h3>Asignar Servicios a cada Punto de Atención</h3>
      {puntos.length === 0 && <div style={{color:'#888'}}>No hay puntos de atención registrados.</div>}
      {puntos.map(p => (
        <div key={p.id} style={{border:'1px solid #e0e0e0', borderRadius:8, padding:16, marginBottom:18, background:'#fafcff'}}>
          <div style={{fontWeight:600, marginBottom:8}}>{p.nombre} <span style={{color:'#888', fontSize:13}}>({p.ubicacion})</span></div>
          <div style={{display:'flex', flexWrap:'wrap', gap:16}}>
            {SERVICIOS.map(servicio => (
              <label key={servicio} style={{display:'flex', alignItems:'center', gap:6, fontWeight:400}}>
                <input
                  type="checkbox"
                  checked={serviciosPorPunto[p.id]?.includes(servicio) || false}
                  onChange={() => handleChange(p.id, servicio)}
                />
                {servicio}
              </label>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
