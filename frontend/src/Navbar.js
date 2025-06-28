import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './index.css';

function Navbar() {
  const [isHovering, setIsHovering] = useState(null);
  const location = useLocation();

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <nav style={styles.navbar}>
      {/* Logo Section */}
      <div style={styles.logoContainer}>
        <div style={styles.logoIcon}>💎</div>
        <div style={styles.logoText}>
          <span style={styles.logoMain}>TradePro</span>
          <span style={styles.logoSub}>Simulator</span>
        </div>
      </div>

      {/* Navigation Links */}
      <ul style={styles.navList}>
        {[
          { path: '/', label: 'Dashboard', icon: '📊' },
          { path: '/buy', label: 'Trade', icon: '💰' }
        ].map((item, index) => (
          <li key={item.path}>
            <Link 
              to={item.path}
              style={{
                ...styles.link,
                ...(isActive(item.path) ? styles.activeLink : {}),
                ...(isHovering === index ? styles.hoveredLink : {})
              }}
              onMouseEnter={() => setIsHovering(index)}
              onMouseLeave={() => setIsHovering(null)}
            >
              <span style={styles.linkIcon}>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

const styles = {
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 32px',
    background: 'linear-gradient(135deg, #1e293b 0%, #334155 50%, #475569 100%)',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    backdropFilter: 'blur(10px)',
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  logoIcon: {
    fontSize: '28px',
    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
    animation: 'pulse 2s infinite',
  },
  logoText: {
    display: 'flex',
    flexDirection: 'column',
    lineHeight: '1.2',
  },
  logoMain: {
    fontSize: '24px',
    fontWeight: '800',
    background: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 50%, #2563eb 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    letterSpacing: '-0.5px',
  },
  logoSub: {
    fontSize: '12px',
    fontWeight: '500',
    color: '#cbd5e1',
    letterSpacing: '1px',
    textTransform: 'uppercase',
  },
  navList: {
    display: 'flex',
    listStyle: 'none',
    gap: '8px',
    margin: 0,
    padding: 0,
  },
  link: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    textDecoration: 'none',
    color: '#e2e8f0',
    fontWeight: '500',
    fontSize: '14px',
    padding: '12px 20px',
    borderRadius: '12px',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    overflow: 'hidden',
  },
  activeLink: {
    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
    color: 'white',
    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)',
    transform: 'translateY(-1px)',
  },
  hoveredLink: {
    background: 'rgba(59, 130, 246, 0.1)',
    color: '#60a5fa',
    transform: 'translateY(-1px)',
    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.2)',
  },
  linkIcon: {
    fontSize: '16px',
    filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))',
  },
  balanceChip: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    padding: '8px 16px',
    background: 'rgba(34, 197, 94, 0.1)',
    border: '1px solid rgba(34, 197, 94, 0.2)',
    borderRadius: '12px',
    backdropFilter: 'blur(10px)',
  },
  balanceLabel: {
    fontSize: '10px',
    color: '#94a3b8',
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  balanceAmount: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#22c55e',
    lineHeight: '1.2',
  },
};

export default Navbar;