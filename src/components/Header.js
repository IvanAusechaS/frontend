import React from 'react';
import Nav from './Nav';

const Header = ({ user, setUser }) => {
  return (
    <header style={styles.header}>
      <Nav user={user} setUser={setUser} />
    </header>
  );
};

const styles = {
  header: { backgroundColor: '#FFFFFF', padding: '20px', color: '#FFFFFF', textAlign: 'center' },
  title: { margin: 0, fontSize: '2em' },
};

export default Header;