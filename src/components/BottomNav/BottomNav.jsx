import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './BottomNav.module.css';

export const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { label: 'Home', icon: '🏠', path: '/home' },
    { label: 'Meal Plan', icon: '🍽️', path: '/meal-plan' },
    { label: 'Tambah', icon: '➕', path: '/add' },
    { label: 'Profile', icon: '👤', path: '/profile' },
    { label: 'Evaluation', icon: '📊', path: '/evaluation' },
  ];

  return (
    <nav className={styles.navbar}>
      {navItems.map((item) => (
        <div
          key={item.path}
          className={`${styles.navItem} ${location.pathname === item.path ? styles.active : ''}`}
          onClick={() => navigate(item.path)}
        >
          <span className={styles.icon}>{item.icon}</span>
          <span className={styles.label}>{item.label}</span>
        </div>
      ))}
    </nav>
  );
};
