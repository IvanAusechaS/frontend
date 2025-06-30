import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Equipo.css';

// Datos de ejemplo para los doctores
const doctors = [
  {
    id: 1,
    name: 'Dra. Ana María Rodríguez',
    specialty: 'Oftalmología General',
    service: 'Consultas Generales',
    image: '/images/doctors/doctor1.jpg',
    description: 'Especialista en diagnóstico y tratamiento de enfermedades oculares comunes. Con más de 15 años de experiencia en el campo de la oftalmología general.',
    education: 'Universidad Nacional de Colombia, Universidad de Harvard',
    certifications: 'Certificada por la Sociedad Colombiana de Oftalmología',
  },
  {
    id: 2,
    name: 'Dr. Carlos Eduardo Martínez',
    specialty: 'Cirugía Refractiva',
    service: 'Cirugías Oftalmológicas',
    image: '/images/doctors/doctor2.jpg',
    description: 'Experto en técnicas avanzadas de cirugía láser para corrección de la visión. Ha realizado más de 5,000 procedimientos exitosos.',
    education: 'Universidad de Antioquia, Johns Hopkins University',
    certifications: 'Miembro de la Sociedad Internacional de Cirugía Refractiva',
  },
  {
    id: 3,
    name: 'Dra. Laura Patricia Sánchez',
    specialty: 'Contactología',
    service: 'Lentes de Contacto',
    image: '/images/doctors/doctor3.jpg',
    description: 'Especialista en adaptación de lentes de contacto para diferentes condiciones oculares. Experta en lentes especiales para córneas irregulares.',
    education: 'Universidad del Valle, New England College of Optometry',
    certifications: 'Certificada en Contactología Avanzada',
  },
  {
    id: 4,
    name: 'Dr. Juan David Pérez',
    specialty: 'Optometría',
    service: 'Exámenes Visuales',
    image: '/images/doctors/doctor4.jpg',
    description: 'Experto en evaluación visual completa y prescripción de anteojos. Especialista en terapia visual y rehabilitación ocular.',
    education: 'Universidad de La Salle, University of California Berkeley',
    certifications: 'Certificado en Terapia Visual por COVD',
  },
  {
    id: 5,
    name: 'Dra. María Fernanda López',
    specialty: 'Retina y Vítreo',
    service: 'Cirugías Oftalmológicas',
    image: '/images/doctors/doctor5.jpg',
    description: 'Especialista en enfermedades de la retina y el vítreo. Experta en tratamientos con láser y procedimientos quirúrgicos avanzados.',
    education: 'Universidad Javeriana, Bascom Palmer Eye Institute',
    certifications: 'Miembro de la Sociedad Americana de Retina',
  },
  {
    id: 6,
    name: 'Dr. Andrés Felipe Gómez',
    specialty: 'Glaucoma',
    service: 'Consultas Generales',
    image: '/images/doctors/doctor6.jpg',
    description: 'Especialista en diagnóstico y tratamiento del glaucoma. Experto en técnicas de monitoreo y control de la presión intraocular.',
    education: 'Universidad de Cartagena, University of Toronto',
    certifications: 'Certificado en Glaucoma Avanzado',
  },
  {
    id: 7,
    name: 'Dra. Carolina Ruiz',
    specialty: 'Oftalmología Pediátrica',
    service: 'Consultas Generales',
    image: '/images/doctors/doctor7.jpg',
    description: 'Especialista en atención oftalmológica para niños. Experta en detección temprana de problemas visuales en la infancia.',
    education: 'Universidad del Rosario, Boston Children\'s Hospital',
    certifications: 'Certificada en Oftalmología Pediátrica',
  },
  {
    id: 8,
    name: 'Dr. Ricardo Sánchez',
    specialty: 'Córnea y Enfermedades Externas',
    service: 'Cirugías Oftalmológicas',
    image: '/images/doctors/doctor8.jpg',
    description: 'Especialista en enfermedades de la córnea y superficie ocular. Experto en trasplantes de córnea y tratamientos para ojo seco.',
    education: 'Universidad de Caldas, Mayo Clinic',
    certifications: 'Miembro de la Sociedad de Córnea y Enfermedades Externas',
  },
  // Nuevos doctores Lentes de Contacto
  {
    id: 9,
    name: 'Dra. Sofía Herrera',
    specialty: 'Contactología',
    service: 'Lentes de Contacto',
    image: '/images/doctors/doctor9.jpg',
    description: 'Especialista en adaptación de lentes de contacto blandos y rígidos. Amplia experiencia en lentes para queratocono.',
    education: 'Universidad El Bosque, Universidad Complutense de Madrid',
    certifications: 'Certificada en Adaptación de Lentes Especiales',
  },
  {
    id: 10,
    name: 'Dr. Pablo Ramírez',
    specialty: 'Contactología',
    service: 'Lentes de Contacto',
    image: '/images/doctors/doctor10.jpg',
    description: 'Experto en lentes de contacto pediátricos y para astigmatismo. Investigador en nuevas tecnologías de lentes.',
    education: 'Universidad de Antioquia, University of Houston',
    certifications: 'Miembro de la Sociedad Internacional de Contactología',
  },
  // Nuevos doctores Exámenes Visuales
  {
    id: 11,
    name: 'Dra. Valentina Torres',
    specialty: 'Optometría',
    service: 'Exámenes Visuales',
    image: '/images/doctors/doctor11.jpg',
    description: 'Especialista en exámenes visuales para niños y adultos mayores. Experiencia en diagnóstico temprano de problemas visuales.',
    education: 'Universidad de La Salle, Universidad de Buenos Aires',
    certifications: 'Certificada en Optometría Pediátrica',
  },
  {
    id: 12,
    name: 'Dr. Esteban Morales',
    specialty: 'Optometría',
    service: 'Exámenes Visuales',
    image: '/images/doctors/doctor12.jpg',
    description: 'Experto en exámenes visuales ocupacionales y deportivos. Consultor en ergonomía visual.',
    education: 'Universidad del Valle, Universidad Nacional Autónoma de México',
    certifications: 'Miembro de la Asociación Latinoamericana de Optometría',
  },
];

const services = [
  'Todos',
  'Consultas Generales',
  'Cirugías Oftalmológicas',
  'Lentes de Contacto',
  'Exámenes Visuales',
];

function Equipo() {
  const navigate = useNavigate();
  const [selectedService, setSelectedService] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleServiceChange = (index) => {
    setSelectedService(index);
  };

  const filteredDoctors = selectedService === 0
    ? doctors
    : doctors.filter(doctor => doctor.service === services[selectedService]);

  return (
    <div className="equipo-root">
      <div className="equipo-container">
        <button className="equipo-back-btn" onClick={() => navigate('/')}>⟵ Volver al Inicio</button>
        <h1 className="equipo-title">Nuestro Equipo Médico</h1>
        <p className="equipo-subtitle">
          Conoce a los profesionales altamente calificados que forman parte de nuestro equipo.
          Cada uno especializado en diferentes áreas de la oftalmología para brindarte la mejor atención.
        </p>
        <div className="equipo-tabs">
          {services.map((service, index) => (
            <button
              key={service}
              className={`equipo-tab${selectedService === index ? ' active' : ''}`}
              onClick={() => handleServiceChange(index)}
            >
              {service}
            </button>
          ))}
        </div>
        <div className="equipo-grid">
          {filteredDoctors.map((doctor) => (
            <div className="equipo-card" key={doctor.id}>
              <div className="equipo-card-img-container">
                <img
                  src={doctor.image}
                  alt={doctor.name}
                  className="equipo-card-img"
                />
                <span className="equipo-chip">{doctor.service}</span>
              </div>
              <div className="equipo-card-content">
                <h3 className="equipo-card-name">{doctor.name}</h3>
                <div className="equipo-card-specialty">{doctor.specialty}</div>
                <p className="equipo-card-desc">{doctor.description}</p>
                <hr className="equipo-divider" />
                <div className="equipo-card-edu"><strong>Educación:</strong> {doctor.education}</div>
                <div className="equipo-card-cert"><strong>Certificaciones:</strong> {doctor.certifications}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Equipo;
