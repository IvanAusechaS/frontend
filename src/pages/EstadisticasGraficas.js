import React, { useState, useEffect } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { getTurnos } from '../services/api';

// Registrar los componentes necesarios de Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const EstadisticasGraficas = () => {
  const [turnos, setTurnos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getTurnos();
        console.log('Turnos para gráficas:', data);
        setTurnos(data);
        setLoading(false);
      } catch (err) {
        setError('Error al cargar las estadísticas');
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Turnos por Franja Horaria (franjas de 30 minutos)
  const getTurnosPorFranja = () => {
    // Filtrar turnos dentro del horario laboral
    const atendidos = turnos.filter(turno => {
      const fechaUTC = new Date(turno.fecha_cita);
      const offsetColombia = -5 * 60; // UTC-5 en minutos
      const fechaColombia = new Date(fechaUTC.getTime() + offsetColombia * 60 * 1000);
      const hora = fechaColombia.getHours();
      const minutos = fechaColombia.getMinutes();
      const horaDecimal = hora + minutos / 60;
      return (horaDecimal >= 8 && horaDecimal < 12) || (horaDecimal >= 13.5 && horaDecimal < 16); // Incluimos 13:30-14:00
    });

    // Definir las franjas horarias
    const franjas = [];
    // Franjas de 8:00 am a 12:00 pm
    for (let hora = 8; hora < 12; hora++) {
      franjas.push(`${hora}:00-${hora}:30`);
      franjas.push(`${hora}:30-${hora + 1}:00`);
    }
    // Franjas de 1:30 pm a 4:00 pm (para incluir 13:30-14:00)
    for (let hora = 13; hora < 16; hora++) {
      if (hora === 13) {
        franjas.push(`${hora}:30-${hora + 1}:00`); // 13:30-14:00
      } else {
        franjas.push(`${hora}:00-${hora}:30`);
        franjas.push(`${hora}:30-${hora + 1}:00`);
      }
    }

    // Agrupar turnos por franja
    const porFranja = atendidos.reduce((acc, turno) => {
      const fechaUTC = new Date(turno.fecha_cita);
      const offsetColombia = -5 * 60; // UTC-5 en minutos
      const fechaColombia = new Date(fechaUTC.getTime() + offsetColombia * 60 * 1000);
      const hora = fechaColombia.getHours();
      const minutos = fechaColombia.getMinutes();

      let franja;
      if ((hora >= 8 && hora < 12) || (hora >= 13 && hora < 16)) {
        if (hora === 13 && minutos < 30) {
          return acc; // No incluimos turnos entre 13:00-13:30
        }
        const minutosBase = minutos < 30 ? 0 : 30;
        const horaBase = minutos < 30 ? hora : hora;
        const horaSiguiente = minutos < 30 ? hora : hora + 1;
        const minutosSiguiente = minutos < 30 ? 30 : 0;
        franja = `${horaBase}:${minutosBase === 0 ? '00' : '30'}-${horaSiguiente}:${minutosSiguiente === 0 ? '00' : '30'}`;
      }

      if (franja) {
        acc[franja] = (acc[franja] || 0) + 1;
      }
      return acc;
    }, {});

    const labels = franjas;
    const data = labels.map(label => porFranja[label] || 0);
    console.log('Turnos por franja:', { labels, data });

    return {
      labels,
      datasets: [
        {
          label: 'Turnos por Franja Horaria',
          data,
          backgroundColor: '#3498db',
          borderColor: '#2980b9',
          borderWidth: 1,
        },
      ],
    };
  };

  const getPacientesPorDia = () => {
    const atendidos = turnos.filter(turno => {
      if (turno.estado !== 'Atendido') return false;
      const fechaUTC = new Date(turno.fecha_cita);
      const offsetColombia = -5 * 60; // UTC-5 en minutos
      const fechaColombia = new Date(fechaUTC.getTime() + offsetColombia * 60 * 1000);
      const hora = fechaColombia.getHours();
      const minutos = fechaColombia.getMinutes();
      const horaDecimal = hora + minutos / 60;
      return (horaDecimal >= 8 && horaDecimal < 12) || (horaDecimal >= 13.5 && horaDecimal < 16); // Incluimos 13:30-14:00
    });

    const porDia = atendidos.reduce((acc, turno) => {
      const fechaUTC = new Date(turno.fecha_cita);
      const offsetColombia = -5 * 60; // UTC-5 en minutos
      const fechaColombia = new Date(fechaUTC.getTime() + offsetColombia * 60 * 1000);
      const fecha = fechaColombia.toLocaleDateString('es-CO');
      acc[fecha] = (acc[fecha] || 0) + 1;
      return acc;
    }, {});

    const labels = Object.keys(porDia).sort((a, b) => new Date(a) - new Date(b));
    const data = labels.map(label => porDia[label]);
    console.log('Pacientes por día:', { labels, data });

    return {
      labels,
      datasets: [
        {
          label: 'Pacientes Atendidos por Día (Horario Laboral)',
          data,
          backgroundColor: '#2ecc71',
          borderColor: '#27ae60',
          borderWidth: 1,
        },
      ],
    };
  };

  const getPacientesPorTipoCita = () => {
    const atendidos = turnos.filter(turno => turno.estado === 'Atendido');
    const porTipo = atendidos.reduce((acc, turno) => {
      acc[turno.tipo_cita] = (acc[turno.tipo_cita] || 0) + 1;
      return acc;
    }, {});

    const labels = Object.keys(porTipo);
    const data = labels.map(label => porTipo[label]);
    console.log('Pacientes por tipo de cita:', { labels, data });

    return {
      labels,
      datasets: [
        {
          label: 'Pacientes Atendidos por Tipo de Cita',
          data,
          backgroundColor: '#e74c3c',
          borderColor: '#c0392b',
          borderWidth: 1,
        },
      ],
    };
  };

  const getPrioridades = () => {
    const prioridades = turnos.reduce((acc, turno) => {
      const prioridad = turno.prioridad === 'P' ? 'Prioritario' : 'Normal';
      acc[prioridad] = (acc[prioridad] || 0) + 1;
      return acc;
    }, { Prioritario: 0, Normal: 0 });

    console.log('Prioridades:', prioridades);

    return {
      labels: ['Prioritario', 'Normal'],
      datasets: [
        {
          label: 'Prioridades de Turnos',
          data: [prioridades.Prioritario, prioridades.Normal],
          backgroundColor: ['#f1c40f', '#95a5a6'],
          borderColor: ['#f39c12', '#7f8c8d'],
          borderWidth: 1,
        },
      ],
    };
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, color: '#2c3e50' },
    },
    scales: {
      y: { beginAtZero: true, ticks: { stepSize: 1, color: '#2c3e50' } },
      x: { ticks: { color: '#2c3e50', maxRotation: 0, minRotation: 0 } },
    },
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Prioridades en el Momento', color: '#2c3e50' },
    },
  };

  if (loading) return <p className="dashboard-loading">Cargando estadísticas...</p>;
  if (error) return <p className="dashboard-error">{error}</p>;

  return (
    <div className="estadisticas-graficas">
      <div className="dashboard-card">
        <h3>Turnos por Franja Horaria (Horario Laboral)</h3>
        <div className="chart-container">
          {getTurnosPorFranja().labels.length > 0 && getTurnosPorFranja().datasets[0].data.some(val => val > 0) ? (
            <Bar
              data={getTurnosPorFranja()}
              options={{ ...barOptions, plugins: { ...barOptions.plugins, title: { ...barOptions.plugins.title, text: 'Turnos por Franja Horaria (8am-12pm, 1:30pm-4pm)' } } }}
            />
          ) : (
            <p>No hay datos disponibles para mostrar.</p>
          )}
        </div>
      </div>

      <div className="dashboard-card">
        <h3>Pacientes Atendidos por Día (Horario Laboral)</h3>
        <div className="chart-container">
          {getPacientesPorDia().labels.length > 0 ? (
            <Bar
              data={getPacientesPorDia()}
              options={{ ...barOptions, plugins: { ...barOptions.plugins, title: { ...barOptions.plugins.title, text: 'Pacientes Atendidos por Día (8am-12pm, 1:30pm-4pm)' } } }}
            />
          ) : (
            <p>No hay datos disponibles para mostrar.</p>
          )}
        </div>
      </div>

      <div className="dashboard-card">
        <h3>Pacientes Atendidos por Tipo de Cita</h3>
        <div className="chart-container">
          {getPacientesPorTipoCita().labels.length > 0 ? (
            <Bar
              data={getPacientesPorTipoCita()}
              options={{ ...barOptions, plugins: { ...barOptions.plugins, title: { ...barOptions.plugins.title, text: 'Pacientes Atendidos por Tipo de Cita' } } }}
            />
          ) : (
            <p>No hay datos disponibles para mostrar.</p>
          )}
        </div>
      </div>

      <div className="dashboard-card">
        <h3>Prioridades en el Momento</h3>
        <div className="chart-container">
          {getPrioridades().datasets[0].data.some(value => value > 0) ? (
            <Pie data={getPrioridades()} options={pieOptions} />
          ) : (
            <p>No hay datos disponibles para mostrar.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default EstadisticasGraficas;