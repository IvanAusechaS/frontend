import React, { useState, useEffect } from 'react';
import './ImageCarousel.css';



const images = [
  {
    src: process.env.PUBLIC_URL + '/images/slide1.jpg',
    title: 'Cobertura Internacional',
    subtitle: 'Estamos donde nos necesites',
  },
  {
    src: process.env.PUBLIC_URL + '/images/slide2.jpg',
    title: 'Atención Personalizada',
    subtitle: 'Tu bienestar es nuestra prioridad',
  },
  {
    src: process.env.PUBLIC_URL + '/images/slide3.jpg',
    title: 'Tecnología de Punta',
    subtitle: 'Innovación al servicio de tu salud',
  },
];

const ImageCarousel = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 10000); // 10 segundos
    return () => clearInterval(interval);
  }, []);

  const goTo = (idx) => setCurrent(idx);

  return (
    <div className="carousel-container">
      <img src={images[current].src} alt="carousel" className="carousel-image" />
      <div className="carousel-overlay">
        <h2>{images[current].title}</h2>
        <p>{images[current].subtitle}</p>
      </div>
      <div className="carousel-dots">
        {images.map((_, idx) => (
          <button
            key={idx}
            className={`dot${idx === current ? ' active' : ''}`}
            onClick={() => goTo(idx)}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageCarousel;
