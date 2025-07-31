import React from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import './EstadisticasGraficas.css'; // Importar el CSS que acabamos de crear

// Registrar los componentes necesarios de Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const EstadisticasGraficas = ({ turnos }) => {
  // Log para depurar los turnos recibidos
  console.log('Turnos recibidos en EstadisticasGraficas:', turnos);

  // Verificar si hay turnos
  if (!turnos || turnos.length === 0) {
    return (
      <div className="estadisticas-graficas">
        <div className="dashboard-card">
          <h3>Estadísticas</h3>
          <div className="chart-container">
            <p>No hay datos disponibles para mostrar estadísticas.</p>
          </div>
        </div>
      </div>
    );
  }

  // Gráfica 1: Pacientes Atendidos por Tipo de Cita
  const getPacientesPorTipoCita = () => {
    // Filtrar turnos con estado "Atendido"
    const atendidos = turnos.filter(turno => turno.estado === 'Atendido');

    if (atendidos.length === 0) {
      return { labels: [], datasets: [] };
    }

    // Agrupar por tipo de cita
    const porTipo = atendidos.reduce((acc, turno) => {
      const tipoCita = turno.tipo_cita || 'Desconocido';
      acc[tipoCita] = (acc[tipoCita] || 0) + 1;
      return acc;
    }, {});

    const labels = Object.keys(porTipo);
    const data = labels.map(label => porTipo[label]);

    console.log('Datos para Pacientes Atendidos por Tipo de Cita:', { labels, data });

    // Colores responsivos para la gráfica
    const backgroundColors = [
      '#2c6ecb', '#28a745', '#ffc107', '#dc3545', 
      '#6f42c1', '#fd7e14', '#20c997', '#6c757d'
    ];
    
    const borderColors = [
      '#1d4b8f', '#1e7e34', '#e0a800', '#c82333',
      '#59359a', '#e8590c', '#1aa179', '#545b62'
    ];

    return {
      labels,
      datasets: [
        {
          label: 'Pacientes Atendidos',
          data,
          backgroundColor: backgroundColors.slice(0, labels.length),
          borderColor: borderColors.slice(0, labels.length),
          borderWidth: 2,
          borderRadius: 4,
          borderSkipped: false,
        },
      ],
    };
  };

  // Gráfica 2: Prioridades de Turnos Activos (En espera y En progreso)
  const getPrioridades = () => {
    // Filtrar turnos activos (En espera o En progreso)
    const turnosActivos = turnos.filter(turno => 
      turno.estado === 'En espera' || turno.estado === 'En progreso'
    );

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
          label: 'Turnos por Prioridad',
          data: [prioridades.Prioritario, prioridades.Normal],
          backgroundColor: ['#ffc107', '#28a745'],
          borderColor: ['#e0a800', '#1e7e34'],
          borderWidth: 2,
          hoverOffset: 4,
        },
      ],
    };
  };

  // Opciones responsivas para la gráfica de barras
  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { 
        position: 'top',
        labels: {
          padding: 20,
          usePointStyle: true,
          font: {
            size: window.innerWidth < 480 ? 10 : 12
          }
        }
      },
      title: {
        display: false, // Se maneja con h3
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#2c6ecb',
        borderWidth: 1,
        cornerRadius: 6,
        displayColors: true,
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { 
          stepSize: 1, 
          color: '#2c3e50',
          font: {
            size: window.innerWidth < 480 ? 10 : 11
          }
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
          drawBorder: false,
        }
      },
      x: {
        ticks: { 
          color: '#2c3e50',
          maxRotation: window.innerWidth < 480 ? 45 : 0,
          font: {
            size: window.innerWidth < 480 ? 9 : 11
          }
        },
        grid: {
          display: false,
        }
      },
    },
    elements: {
      bar: {
        borderRadius: 4,
      }
    }
  };

  // Opciones responsivas para la gráfica de pastel
  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { 
        position: window.innerWidth < 768 ? 'bottom' : 'top',
        labels: {
          padding: 20,
          usePointStyle: true,
          font: {
            size: window.innerWidth < 480 ? 10 : 12
          }
        }
      },
      title: {
        display: false, // Se maneja con h3
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#28a745',
        borderWidth: 1,
        cornerRadius: 6,
        displayColors: true,
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    },
    elements: {
      arc: {
        borderWidth: 2,
      }
    }
  };

  const pacientesPorTipoCita = getPacientesPorTipoCita();
  const prioridadesTurnos = getPrioridades();

  return (
    <div className="estadisticas-graficas">
      <div className="dashboard-card">
        <h3>Pacientes Atendidos por Tipo de Cita</h3>
        <div className="chart-container">
          {pacientesPorTipoCita.labels.length > 0 ? (
            <Bar data={pacientesPorTipoCita} options={barOptions} />
          ) : (
            <p>No hay pacientes atendidos para mostrar en el gráfico.</p>
          )}
        </div>
      </div>

      <div className="dashboard-card">
        <h3>Prioridades de Turnos Activos</h3>
        <div className="chart-container">
          {prioridadesTurnos.datasets[0].data.some(value => value > 0) ? (
            <Pie data={prioridadesTurnos} options={pieOptions} />
          ) : (
            <p>No hay turnos activos (en espera o en progreso) para mostrar.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default EstadisticasGraficas;