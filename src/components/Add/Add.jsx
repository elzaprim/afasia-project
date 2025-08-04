import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Add.module.css';
import { BottomNav } from '../BottomNav/BottomNav';

export const Add = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.addOuterContainer}>
      <div className={styles.addInnerContainer}>
        <h2 className={styles.title}>Tambah Data</h2>
        <div className={styles.optionGrid}>
          <div className={styles.optionCard} onClick={() => navigate('/aktivitas')}>
            🏃‍♂️ Aktivitas
          </div>
          <div className={styles.optionCard} onClick={() => navigate('/add/food')}>
            🍽️ Makanan
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  );
};
