import React from 'react';
import { Link } from 'react-router-dom';
import './index.css';

function Navbar() {
  return (
    <nav style={styles.navbar}>
      <div style={styles.logo}>📈 StockApp</div>
      <ul style={styles.navList}>
        <li><Link to="/" style={styles.link}>Home</Link></li>
        <li><Link to="/" style={styles.link}>Dashboard</Link></li>
        <li><Link to="/buy" style={styles.link}>Buy</Link></li>
      </ul>
    </nav>
  );
}

const styles = {
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 2rem',
    backgroundColor: '#282c34',
    color: 'white',
  },
  logo: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
  },
  navList: {
    display: 'flex',
    listStyle: 'none',
    gap: '1.5rem',
  },
  link: {
    textDecoration: 'none',
    color: 'white',
    fontWeight: '500',
  },
};

export default Navbar;
