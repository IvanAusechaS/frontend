import React from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';

// Registrar los componentes necesarios de Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const EstadisticasGraficas = ({ turnos }) => {
  // Log para depurar los turnos recibidos
  console.log('Turnos recibidos en EstadisticasGraficas:', turnos);

  // Gráfica 1: Pacientes Atendidos por Tipo de Cita
  const getPacientesPorTipoCita = () => {
    // Filtrar turnos con estado "Atendido"
    const atendidos = turnos.filter(turno => turno.estado === 'Atendido');

    // Agrupar por tipo de cita
    const porTipo = atendidos.reduce((acc, turno) => {
      const tipoCita = turno.tipo_cita || 'Desconocido'; // Fallback si tipo_cita es undefined
      acc[tipoCita] = (acc[tipoCita] || 0) + 1;
      return acc;
    }, {});

    const labels = Object.keys(porTipo);
    const data = labels.map(label => porTipo[label]);

    console.log('Datos para Pacientes Atendidos por Tipo de Cita:', { labels, data });

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

  // Gráfica 2: Prioridades de Turnos Activos (En espera y En progreso)
  const getPrioridades = () => {
    // Filtrar turnos activos (En espera o En progreso)
    const turnosActivos = turnos.filter(turno => turno.estado === 'En espera' || turno.estado === 'En progreso');

    // Agrupar por prioridad
    const prioridades = turnosActivos.reduce((acc, turno) => {
      const prioridad = turno.prioridad === 'P' ? 'Prioritario' : 'Normal';
      acc[prioridad] = (acc[prioridad] || 0) + 1;
      return acc;
    }, { Prioritario: 0, Normal: 0 });

    console.log('Datos para Prioridades de Turnos Activos:', prioridades);

    return {
      labels: ['Prioritario', 'Normal'],
      datasets: [
        {
          label: 'Prioridades de Turnos Activos',
          data: [prioridades.Prioritario, prioridades.Normal],
          backgroundColor: ['#f1c40f', '#95a5a6'],
          borderColor: ['#f39c12', '#7f8c8d'],
          borderWidth: 1,
        },
      ],
    };
  };

  // Opciones para la gráfica de barras
  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      title: {
        display: true,
        text: 'Pacientes Atendidos por Tipo de Cita',
        color: '#2c3e50',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1, color: '#2c3e50' },
      },
      x: {
        ticks: { color: '#2c3e50' },
      },
    },
  };

  // Opciones para la gráfica de pastel
  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      title: {
        display: true,
        text: 'Prioridades de Turnos Activos',
        color: '#2c3e50',
      },
    },
  };

  return (
    <div className="estadisticas-graficas">
      <div className="dashboard-card">
        <h3>Pacientes Atendidos por Tipo de Cita</h3>
        <div className="chart-container" style={{ height: '300px' }}>
          {getPacientesPorTipoCita().labels.length > 0 ? (
            <Bar data={getPacientesPorTipoCita()} options={barOptions} />
          ) : (
            <p>No hay pacientes atendidos para mostrar.</p>
          )}
        </div>
      </div>

      <div className="dashboard-card">
        <h3>Prioridades de Turnos Activos</h3>
        <div className="chart-container" style={{ height: '300px' }}>
          {getPrioridades().datasets[0].data.some(value => value > 0) ? (
            <Pie data={getPrioridades()} options={pieOptions} />
          ) : (
            <p>No hay turnos activos (en espera o en progreso) para mostrar.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default EstadisticasGraficas;