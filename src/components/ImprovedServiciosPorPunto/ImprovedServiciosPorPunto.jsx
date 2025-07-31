import React, { useState, useEffect } from 'react';
import './ImprovedServiciosPorPunto.css'; // Asegúrate de tener estilos adecuados

const ImprovedServiciosPorPunto = ({ puntos, onAsignarServicios }) => {
  const [serviciosDisponibles] = useState([
    'Cirugía Refractiva',
    'Consulta General',
    'Odontología',
    'Radiología',
    'Laboratorio Clínico',
  ]); // Lista estática de servicios, puedes hacerla dinámica con una API si necesitas
  const [editPuntoId, setEditPuntoId] = useState(null);
  const [selectedServicios, setSelectedServicios] = useState([]);

  const handleEdit = (puntoId, currentServicios) => {
    setEditPuntoId(puntoId);
    setSelectedServicios(currentServicios || []);
  };

  const handleSave = async () => {
    if (editPuntoId && onAsignarServicios) {
      await onAsignarServicios(editPuntoId, selectedServicios);
      setEditPuntoId(null);
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
    <div className="servicios-por-punto">
      <h3>Gestión de Servicios por Punto de Atención</h3>
      {puntos.map(punto => (
        <div key={punto.id} className="punto-servicios-card">
          <h4>{punto.nombre} ({punto.ubicacion})</h4>
          <div className="servicios-list">
            {punto.servicios && punto.servicios.length > 0 ? (
              punto.servicios.map((servicio, idx) => (
                <span key={idx} className="servicio-tag">
                  {servicio}
                </span>
              ))
            ) : (
              <span className="no-servicios">No hay servicios asignados</span>
            )}
          </div>
          <button
            onClick={() => handleEdit(punto.id, punto.servicios)}
            className="btn-edit-servicios"
          >
            Editar Servicios
          </button>

          {editPuntoId === punto.id && (
            <div className="edit-servicios-form">
              <h5>Seleccionar Servicios</h5>
              <div className="servicios-checkboxes">
                {serviciosDisponibles.map(servicio => (
                  <label key={servicio} className="servicio-checkbox">
                    <input
                      type="checkbox"
                      checked={selectedServicios.includes(servicio)}
                      onChange={() => handleServicioChange(servicio)}
                    />
                    {servicio}
                  </label>
                ))}
              </div>
              <div className="edit-actions">
                <button onClick={handleSave} className="btn-save">Guardar</button>
                <button onClick={handleCancel} className="btn-cancel">Cancelar</button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ImprovedServiciosPorPunto;