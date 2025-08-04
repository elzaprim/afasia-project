// Evaluation.jsx
import React, { useState } from 'react';
import styles from './Evaluation.module.css';
import { BottomNav } from '../BottomNav/BottomNav';

export const Evaluation = () => {
  const [menu, setMenu] = useState('');
  const [ratingData, setRatingData] = useState([]);
  const [nutrisiData, setNutrisiData] = useState({
    kalori: 2000,
    targetKalori: 2200,
    karbohidrat: 300,
    targetKarbo: 280,
    protein: 100,
    targetProtein: 100,
    lemak: 80,
    targetLemak: 70,
  });

  const handleRatingChange = (index, value) => {
    const updated = [...ratingData];
    updated[index].rating = value;
    setRatingData(updated);
  };

  const handleCommentChange = (index, value) => {
    const updated = [...ratingData];
    updated[index].comment = value;
    setRatingData(updated);
  };

  const handleAddRating = () => {
    setRatingData([...ratingData, { name: `Resep #${ratingData.length + 1}`, rating: 0, comment: '' }]);
  };

  const getStatus = (value, target) => {
    if (value < 0.95 * target) return 'kurang';
    if (value > 1.05 * target) return 'lebih';
    return 'pas';
  };

  const getStatusColor = (status) => {
    if (status === 'kurang') return '#ff4d4d'; // merah
    if (status === 'lebih') return '#00cc66';  // hijau
    return '#3399ff'; // biru
  };

  const getComment = (status) => {
    if (status === 'kurang') return 'Ayo tingkatkan asupan Anda agar lebih optimal!';
    if (status === 'lebih') return 'Wah, melebihi target. Jaga keseimbangan ya!';
    return 'Hebat! Anda tepat dalam memenuhi kebutuhan.';
  };

  return (
    <div className={styles.evaluationContainer}>
      {menu === '' && (
        <div className={styles.menuSelection}>
          <div className={styles.menuCard}>
            <h2>Evaluasi Harian Anda</h2>
            <p>Pilih jenis evaluasi yang ingin Anda lakukan hari ini:</p>
            <div className={styles.menuButtons}>
              <button onClick={() => setMenu('nutrisi')}>Evaluasi Nutrisi Harian</button>
              <button onClick={() => setMenu('rating')}>Rating Menu Makanan</button>
            </div>
          </div>
        </div>
      )}

      {menu === 'nutrisi' && (
        <div className={styles.resultBox}>
          <h3>Evaluasi Nutrisi Harian</h3>
          <button className={styles.backButton} onClick={() => setMenu('')}>← Kembali</button>
          {['kalori', 'karbohidrat', 'protein', 'lemak'].map((key) => {
            const value = nutrisiData[key];
            const target = nutrisiData[`target${key.charAt(0).toUpperCase() + key.slice(1)}`];
            const status = getStatus(value, target);
            const color = getStatusColor(status);
            const label = key === 'kalori' ? 'Kalori' : key.charAt(0).toUpperCase() + key.slice(1);

            const percentage = Math.min((value / target) * 100, 100);

            return (
              <div key={key} className={styles.pieContainer}>
                <div className={styles.pieWrapper}>
                  <svg width="120" height="120" viewBox="0 0 36 36" className={styles.pie}>
                    <path
                      className={styles.pieBg}
                      d="M18 2.0845
                         a 15.9155 15.9155 0 0 1 0 31.831
                         a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#eee"
                      strokeWidth="2"
                    />
                    <path
                      className={styles.pieMeter}
                      stroke={color}
                      d="M18 2.0845
                         a 15.9155 15.9155 0 0 1 0 31.831
                         a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      strokeWidth="2"
                      strokeDasharray={`${percentage}, 100`}
                    />
                    <text x="18" y="20.35" className={styles.pieText} fill={color}>
                      {value} / {target}
                    </text>
                  </svg>
                </div>
                <div className={styles.pieLabel}>
                  <strong>{label}</strong>
                  <p className={styles.comment}>{getComment(status)}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {menu === 'rating' && (
        <div className={styles.resultBox}>
          <h3>Rating Menu Makanan</h3>
          <button className={styles.backButton} onClick={() => setMenu('')}>← Kembali</button>
          {ratingData.map((item, index) => (
            <div key={index} className={styles.ratingItem}>
              <h4>{item.name}</h4>
              <select value={item.rating} onChange={(e) => handleRatingChange(index, parseInt(e.target.value))}>
                <option value={0}>Pilih Rating</option>
                {[1, 2, 3, 4, 5].map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
              <textarea
                placeholder="Tulis komentar Anda..."
                value={item.comment}
                onChange={(e) => handleCommentChange(index, e.target.value)}
              />
            </div>
          ))}
          <button onClick={handleAddRating}>+ Tambah Resep untuk Dinilai</button>
        </div>
      )}
      <BottomNav />
    </div>
  );
};
