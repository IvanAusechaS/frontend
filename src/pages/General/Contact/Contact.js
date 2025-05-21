import React from 'react';
import ContactSection from '../Home/ContactSection';
import '../Home/ContactSection.css';

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const Contact = () => {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
    setTimeout(() => {
      const yOffset = -76; // altura del header
      window.scrollTo({ top: 0 + yOffset, behavior: 'smooth' });
    }, 250);
  }, []);

  return (
    <div style={{ background: '#f8faff', minHeight: '100vh', paddingTop: '2.5rem' }}>
      <ContactSection />
    </div>
  );
};

export default Contact;