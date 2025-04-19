// frontend/src/components/Header.js
import React, { useEffect } from 'react';
import Nav from '../Nav';
import './Header.css';

const Header = ({ user, setUser }) => {
  useEffect(() => {
    console.log('Usuario en Header:', user);
  }, [user]);

  return (
    <header className="header">
      <Nav user={user} setUser={setUser} />
    </header>
  );
};

export default Header;