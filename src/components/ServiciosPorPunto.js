import React, { useState, useEffect } from 'react';

const SERVICIOS = [
  'Atención de Urgencias Oftalmológicas',
  'Obtención de Gafas Formuladas',
  'Cirugía Refractiva',
  'Consulta Oftalmológica',
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
  const [editPuntoId, setEditPuntoId] = useState(null);
  const [selectedServicios, setSelectedServicios] = useState([]);

  // Sincronizar con props iniciales
  useEffect(() => {
    const newState = {};
    puntos.forEach(p => {
      newState[p.id] = p.servicios || [];
    });
    setServiciosPorPunto(newState);
  }, [puntos]);

  const handleEdit = (puntoId) => {
    setEditPuntoId(puntoId);
    setSelectedServicios(serviciosPorPunto[puntoId] || []);
  };

  const handleSave = async (puntoId) => {
    if (onAsignarServicios) {
      try {
        await onAsignarServicios(puntoId, selectedServicios);
        setServiciosPorPunto(prev => ({ ...prev, [puntoId]: selectedServicios }));
        setEditPuntoId(null);
      } catch (error) {
        console.error('Error al guardar servicios:', error);
      }
    }
  };

  const handleCancel = () => {
    setEditPuntoId(null);
    setSelectedServicios([]);
  };

  const handleServicioChange = (servicio) => {
    setSelectedServicios(prev =>
      prev.includes(servicio)
        ? prev.filter(s => s !== servicio)
        : [...prev, servicio]
    );
  };

  return (
    <div style={{ marginTop: 32 }}>
      <h3>Asignar Servicios a cada Punto de Atención</h3>
      {puntos.length === 0 && <div style={{ color: '#888' }}>No hay puntos de atención registrados.</div>}
      {puntos.map(p => (
        <div
          key={p.id}
          style={{
            border: '1px solid #e0e0e0',
            borderRadius: 8,
            padding: 16,
            marginBottom: 18,
            background: '#fafcff',
          }}
        >
          <div style={{ fontWeight: 600, marginBottom: 8 }}>
            {p.nombre} <span style={{ color: '#888', fontSize: 13 }}>({p.ubicacion})</span>
          </div>
          {!editPuntoId && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
              {serviciosPorPunto[p.id] && serviciosPorPunto[p.id].length > 0 ? (
                serviciosPorPunto[p.id].map((servicio, idx) => (
                  <span
                    key={idx}
                    style={{
                      backgroundColor: '#e0e0e0',
                      padding: '4px 8px',
                      marginRight: 5,
                      marginBottom: 5,
                      borderRadius: 3,
                    }}
                  >
                    {servicio}
                  </span>
                ))
              ) : (
                <span style={{ color: '#888' }}>No hay servicios asignados</span>
              )}
            </div>
          )}
          {!editPuntoId && (
            <button
              onClick={() => handleEdit(p.id)}
              style={{
                backgroundColor: '#4CAF50',
                color: 'white',
                padding: '5px 10px',
                border: 'none',
                borderRadius: 3,
                cursor: 'pointer',
              }}
            >
              Editar Servicios
            </button>
          )}
          {editPuntoId === p.id && (
            <div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginBottom: 8 }}>
                {SERVICIOS.map(servicio => (
                  <label
                    key={servicio}
                    style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 400 }}
                  >
                    <input
                      type="checkbox"
                      checked={selectedServicios.includes(servicio)}
                      onChange={() => handleServicioChange(servicio)}
                    />
                    {servicio}
                  </label>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={() => handleSave(p.id)}
                  style={{
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    padding: '5px 10px',
                    border: 'none',
                    borderRadius: 3,
                    cursor: 'pointer',
                  }}
                >
                  Guardar
                </button>
                <button
                  onClick={handleCancel}
                  style={{
                    backgroundColor: '#f44336',
                    color: 'white',
                    padding: '5px 10px',
                    border: 'none',
                    borderRadius: 3,
                    cursor: 'pointer',
                  }}
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}