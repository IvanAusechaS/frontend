import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './Servicios.css';

const servicios = [
  {
    titulo: 'Atención de Urgencias Oftalmológicas',
    intro: 'Atención inmediata, precisa y especializada ante cualquier emergencia ocular, disponible 24/7.',
    imagen: process.env.PUBLIC_URL + '/images/urgencias.jpg',
    alt: 'Urgencias Oftalmológicas',
    detalles: [
      {
        subtitulo: '¿Qué incluye nuestro servicio?',
        contenido: [
          'Equipo médico altamente capacitado en manejo de emergencias oftalmológicas.',
          'Tecnología de última generación para diagnósticos certeros.',
          'Atención a traumatismos oculares, exposición a químicos, infecciones severas, pérdida de visión, dolor intenso, visión doble, destellos, manchas flotantes, inflamación/enrojecimiento.'
        ]
      },
      {
        subtitulo: '¿Cómo actuamos?',
        contenido: [
          'Evaluación inmediata para determinar el tratamiento más adecuado (médico o quirúrgico).',
          'Seguimiento personalizado para garantizar recuperación y evitar complicaciones.'
        ]
      },
      {
        subtitulo: 'Nuestra prioridad',
        contenido: [
          'Proteger tu visión cuando más lo necesitas, con profesionalismo, humanidad y compromiso total.'
        ]
      }
    ]
  },
  {
    titulo: 'Obtención de Gafas Formuladas',
    intro: 'Gafas formuladas a tu medida, con tecnología avanzada y asesoría personalizada para tu bienestar visual.',
    imagen: process.env.PUBLIC_URL + '/images/lentes.jpg',
    alt: 'Obtención de Gafas Formuladas',
    detalles: [
      {
        subtitulo: '¿Por qué elegirnos?',
        contenido: [
          'Tecnología de vanguardia para toma de medidas y elaboración de fórmulas ópticas.',
          'Lentes de alta calidad para miopía, hipermetropía, astigmatismo o presbicia.'
        ]
      },
      {
        subtitulo: 'Opciones para ti',
        contenido: [
          'Lentes antirreflejo, fotocromáticos, filtro de luz azul.',
          'Lentes delgados de alta refracción.',
          'Monturas modernas, clásicas y ergonómicas.'
        ]
      },
      {
        subtitulo: 'Nuestro objetivo',
        contenido: [
          'Que tus gafas reflejen tu personalidad y se ajusten a tu rutina, con acompañamiento cálido y profesional.'
        ]
      }
    ]
  },
  {
    titulo: 'Cirugía Refractiva',
    intro: 'Cirugía avanzada para que disfrutes de una visión clara y natural, sin depender de gafas ni lentes de contacto.',
    imagen: process.env.PUBLIC_URL + '/images/cirugia.jpg',
    alt: 'Cirugía Refractiva',
    detalles: [
      {
        subtitulo: '¿Qué es la cirugía refractiva?',
        contenido: [
          'Procedimientos como LASIK, PRK o SMILE para corregir miopía, hipermetropía y astigmatismo.',
          'Tecnología de última generación y técnicas mínimamente invasivas.'
        ]
      },
      {
        subtitulo: 'Beneficios',
        contenido: [
          'Mejora significativa de la agudeza visual.',
          'Procedimientos ambulatorios y recuperación rápida.',
          'Resultados duraderos y alta satisfacción.'
        ]
      },
      {
        subtitulo: 'Acompañamiento total',
        contenido: [
          'Evaluación oftalmológica integral y acompañamiento de cirujanos expertos durante todo el proceso.'
        ]
      }
    ]
  },
  {
    titulo: 'Consulta Oftalmológica',
    intro: 'Consultas integrales para todas las edades, enfocadas en diagnóstico, tratamiento y prevención de enfermedades oculares.',
    imagen: process.env.PUBLIC_URL + '/images/atencion.jpg',
    alt: 'Consulta Oftalmológica',
    detalles: [
      {
        subtitulo: '¿Qué incluye la consulta?',
        contenido: [
          'Examen de agudeza visual.',
          'Evaluación de presión intraocular (tonometría).',
          'Biomicroscopía (lámpara de hendidura).',
          'Revisión de fondo de ojo y refracción computarizada/manual.',
          'Evaluación de estructuras externas e internas del ojo.'
        ]
      },
      {
        subtitulo: 'Nuestro enfoque',
        contenido: [
          'Diagnóstico temprano y plan de tratamiento personalizado.',
          'Acompañamiento constante para preservar tu visión a largo plazo.'
        ]
      },
      {
        subtitulo: 'Prevención',
        contenido: [
          'Recomendamos controles periódicos, incluso sin síntomas, para proteger tu salud visual.'
        ]
      }
    ]
  },
];


const sectionIds = ['urgencias', 'lentes', 'cirugia', 'atencion'];

const Servicios = () => {
  const location = useLocation();

  useEffect(() => {
    if (location && location.state && location.state.scrollTo) {
      const sectionId = location.state.scrollTo;
      setTimeout(() => {
        const section = document.getElementById(sectionId);
        if (section) {
          const yOffset = -76; // altura del header
          const y = section.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, 250);
    }
  }, [location]);

  return (
    <div className="servicios-page">
      <h1 className="servicios-title">Nuestros Servicios</h1>
      {servicios.map((servicio, idx) => {
        // Asignar id único para scroll
        const ids = ['urgencias', 'lentes', 'cirugia', 'atencion'];
        const cardId = ids[idx] || '';
        return (
          <div
            className={`servicio-card${idx % 2 === 1 ? ' reverse' : ''}`}
            key={servicio.titulo}
            id={cardId}
          >
            <div className="servicio-card-img">
              <img src={servicio.imagen} alt={servicio.alt} />
            </div>
            <div className="servicio-card-content">
              <h2 className="servicio-card-title">{servicio.titulo}</h2>
              <p className="servicio-card-intro">{servicio.intro}</p>
              <div className="servicio-detalles-list">
                {servicio.detalles.map((detalle, i) => (
                  <div className="servicio-detalle-card" key={detalle.subtitulo + i}>
                    <h3 className="servicio-detalle-titulo">{detalle.subtitulo}</h3>
                    <ul>
                      {detalle.contenido.map((linea, j) => (
                        <li key={j}>{linea}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Servicios;
