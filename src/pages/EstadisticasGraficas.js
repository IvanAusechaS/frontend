import React from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';

// Registrar los componentes necesarios de Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const EstadisticasGraficas = ({ turnos }) => {
  console.log('Turnos recibidos en EstadisticasGraficas:', turnos);

  // Turnos por Franja Horaria (franjas de 30 minutos) - Solo para el día actual
  const getTurnosPorFranja = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Establecer la hora a 00:00:00 para comparar solo la fecha

    // Filtrar turnos del día actual y dentro del horario laboral
    const atendidos = turnos.filter(turno => {
      const fechaUTC = new Date(turno.fecha_cita);
      const offsetColombia = -5 * 60; // UTC-5 en minutos
      const fechaColombia = new Date(fechaUTC.getTime() + offsetColombia * 60 * 1000);
      const fechaTurno = new Date(fechaColombia);
      fechaTurno.setHours(0, 0, 0, 0);

      const esHoy = fechaTurno.getTime() === today.getTime();
      const hora = fechaColombia.getHours();
      const minutos = fechaColombia.getMinutes();
      const horaDecimal = hora + minutos / 60;
      const dentroHorario = (horaDecimal >= 8 && horaDecimal < 12) || (horaDecimal >= 13.5 && horaDecimal < 16);

      console.log(`Turno ${turno.id} en getTurnosPorFranja: Fecha: ${fechaColombia.toISOString()}, Es hoy: ${esHoy}, Dentro horario: ${dentroHorario}`);
      return esHoy && dentroHorario;
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

  // Pacientes Atendidos por Día (por semana: lunes a domingo)
  const getPacientesPorDia = () => {
    // Obtener el inicio y fin de la semana actual (lunes a domingo)
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 (domingo) a 6 (sábado)
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1)); // Lunes
    startOfWeek.setHours(0, 0, 0, 0);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // Domingo
    endOfWeek.setHours(23, 59, 59, 999);

    // Filtrar turnos atendidos dentro del horario laboral y de la semana actual
    const atendidos = turnos.filter(turno => {
      if (turno.estado !== 'Atendido') return false;
      const fechaUTC = new Date(turno.fecha_cita);
      const offsetColombia = -5 * 60; // UTC-5 en minutos
      const fechaColombia = new Date(fechaUTC.getTime() + offsetColombia * 60 * 1000);
      const hora = fechaColombia.getHours();
      const minutos = fechaColombia.getMinutes();
      const horaDecimal = hora + minutos / 60;
      const dentroHorario = (horaDecimal >= 8 && horaDecimal < 12) || (horaDecimal >= 13.5 && horaDecimal < 16);
      const dentroSemana = fechaColombia >= startOfWeek && fechaColombia <= endOfWeek;
      console.log(`Turno ${turno.id} en getPacientesPorDia: Fecha: ${fechaColombia.toISOString()}, Dentro horario: ${dentroHorario}, Dentro semana: ${dentroSemana}`);
      return dentroHorario && dentroSemana;
    });

    // Generar etiquetas para los días de la semana (lunes a domingo)
    const diasSemana = [];
    const diaLabels = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
    for (let i = 0; i < 7; i++) {
      const dia = new Date(startOfWeek);
      dia.setDate(startOfWeek.getDate() + i);
      diasSemana.push({
        fecha: dia,
        label: `${diaLabels[i]} ${dia.getDate()}`,
      });
    }

    // Agrupar turnos por día
    const porDia = atendidos.reduce((acc, turno) => {
      const fechaUTC = new Date(turno.fecha_cita);
      const offsetColombia = -5 * 60; // UTC-5 en minutos
      const fechaColombia = new Date(fechaUTC.getTime() + offsetColombia * 60 * 1000);
      const fechaStr = fechaColombia.toLocaleDateString('es-CO');
      acc[fechaStr] = (acc[fechaStr] || 0) + 1;
      return acc;
    }, {});

    const labels = diasSemana.map(dia => dia.label);
    const data = diasSemana.map(dia => {
      const fechaStr = dia.fecha.toLocaleDateString('es-CO');
      return porDia[fechaStr] || 0;
    });
    console.log('Pacientes por día (semana):', { labels, data });

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

  // Pacientes Atendidos por Tipo de Cita
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

  // Prioridades de Turnos
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
        <h3>Pacientes Atendidos por Día (Semana Actual, Horario Laboral)</h3>
        <div className="chart-container">
          {getPacientesPorDia().labels.length > 0 && getPacientesPorDia().datasets[0].data.some(val => val > 0) ? (
            <Bar
              data={getPacientesPorDia()}
              options={{ ...barOptions, plugins: { ...barOptions.plugins, title: { ...barOptions.plugins.title, text: 'Pacientes Atendidos por Día (Semana Actual, 8am-12pm, 1:30pm-4pm)' } } }}
            />
          ) : (
            <p>No hay datos disponibles para mostrar.</p>
          )}
        </div>
      </div>

      <div className="dashboard-card">
        <h3>Pacientes Atendidos por Tipo de Cita</h3>
        <div className="chart-container">
          {getPacientesPorTipoCita().labels.length > 0 && getPacientesPorTipoCita().datasets[0].data.some(val => val > 0) ? (
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